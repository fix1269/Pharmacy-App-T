import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  type Firestore,
} from 'firebase/firestore';
import { PharmacyTemplateConfig } from './config';
import type { BaseRecord, DoctorRecord, StaffRecord, SubstituteRecord } from './types';

type Listener = (records: BaseRecord[]) => void;

const LOCAL_PREFIX = 'pharmacy_suite_';
// Firestore operations are wrapped in this timeout. If the network is blocked
// (sandboxed environments, offline, firewall), the promise rejects quickly and
// we fall back to localStorage instead of hanging forever and freezing the UI.
const FIRESTORE_TIMEOUT_MS = 3000;

function localKey(section: string) {
  return `${LOCAL_PREFIX}${section}`;
}

function readLocal<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('[db] readLocal parse failed', key, e);
    return [];
  }
}

function writeLocal<T>(key: string, items: T[]) {
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch (e) {
    console.error('[db] writeLocal failed', key, e);
  }
}

// Rejects with a timeout error after `ms`. Used to race Firestore promises so
// they can never hang the UI when the network is unreachable.
function withTimeout<T>(p: Promise<T>, ms = FIRESTORE_TIMEOUT_MS): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`[db] operation timed out after ${ms}ms`)), ms);
    p.then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        clearTimeout(timer);
        reject(e);
      },
    );
  });
}

// ---- Firebase configuration check ----
// Strictly returns false if any value is missing or contains a placeholder
// (YOUR_...). This guarantees a 100% bypass to localStorage when the keys are
// not real, so the buttons never freeze waiting on a dead network call.
export function isFirebaseConfigured(): boolean {
  const c = PharmacyTemplateConfig.firebaseConfig;
  if (!c) return false;
  const required = [c.apiKey, c.authDomain, c.projectId, c.appId];
  if (required.some((v) => !v || String(v).startsWith('YOUR_'))) return false;
  return true;
}

// ---- Firebase initialization (lazy + guarded) ----
let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let initFailed = false;

function getDb(): Firestore | null {
  if (initFailed) return null;
  if (!isFirebaseConfigured()) return null;
  if (db) return db;
  try {
    app = initializeApp(PharmacyTemplateConfig.firebaseConfig);
    db = getFirestore(app);
    console.info('[db] Firestore initialized');
    return db;
  } catch (e) {
    console.error('[db] Firebase init failed, using local fallback', e);
    initFailed = true;
    return null;
  }
}

export function isOnline() {
  return !!getDb();
}

// ---- Generic record save (year -> month -> records) ----
export async function saveRecord(section: string, record: BaseRecord): Promise<void> {
  const database = getDb();
  if (database) {
    try {
      await withTimeout(
        setDoc(
          doc(database, 'archive', String(record.year), 'month', String(record.month), 'records', record.id),
          record,
        ),
      );
      console.info('[db] saved to Firestore', section, record.id);
      return;
    } catch (e) {
      console.error('[db] Firestore save failed, falling back to local', section, e);
    }
  }
  // Local fallback — ALWAYS runs when Firestore unavailable or timed out
  try {
    const items = readLocal<BaseRecord>(localKey(section));
    const idx = items.findIndex((i) => i.id === record.id);
    if (idx >= 0) items[idx] = record;
    else items.push(record);
    writeLocal(localKey(section), items);
    console.info('[db] saved to local', section, record.id);
  } catch (e) {
    console.error('[db] local save failed', section, e);
  }
}

export async function deleteRecord(section: string, record: BaseRecord): Promise<void> {
  const database = getDb();
  if (database) {
    try {
      await withTimeout(
        deleteDoc(
          doc(database, 'archive', String(record.year), 'month', String(record.month), 'records', record.id),
        ),
      );
      return;
    } catch (e) {
      console.error('[db] Firestore delete failed, falling back to local', section, e);
    }
  }
  try {
    const items = readLocal<BaseRecord>(localKey(section)).filter((i) => i.id !== record.id);
    writeLocal(localKey(section), items);
  } catch (e) {
    console.error('[db] local delete failed', section, e);
  }
}

export async function loadRecords(section: string): Promise<BaseRecord[]> {
  const database = getDb();
  if (database) {
    try {
      const snap = await withTimeout(
        getDocs(query(collection(database, 'archive'), where('section', '==', section))),
      );
      const out: BaseRecord[] = [];
      snap.forEach((d) => out.push(d.data() as BaseRecord));
      if (out.length) return out;
    } catch (e) {
      console.error('[db] Firestore load failed, using local', section, e);
    }
  }
  return readLocal<BaseRecord>(localKey(section));
}

// Live subscribe. Falls back to local-storage polling when Firestore is
// unavailable or the snapshot stream errors (blocked network, permissions).
//
// CRITICAL INVARIANT: once local data has been delivered, a Firestore snapshot
// can NEVER wipe it. An empty/failed/pending snapshot is ignored if localStorage
// already holds records. This prevents the "data appears then disappears" bug.
export function subscribeRecords(section: string, cb: Listener): () => void {
  const localRef: { current: BaseRecord[] } = { current: [] };
  let destroyed = false;

  const deliverLocal = () => {
    const items = readLocal<BaseRecord>(localKey(section));
    localRef.current = items;
    cb(items);
  };

  // Always deliver local data immediately and keep it locked on screen.
  deliverLocal();

  const database = getDb();
  if (database) {
    try {
      const q = query(collection(database, 'archive'), where('section', '==', section));
      let unsub: (() => void) | null = null;
      unsub = onSnapshot(
        q,
        (snap) => {
          const out: BaseRecord[] = [];
          snap.forEach((d) => out.push(d.data() as BaseRecord));
          // STRICT FALLBACK RULE: only apply Firestore data if it is non-empty.
          // If Firestore returns nothing (blocked/retrying/offline) but local
          // already has records, keep the local data locked on screen.
          if (out.length > 0) {
            localRef.current = out;
            cb(out);
          } else if (localRef.current.length === 0) {
            cb([]);
          }
          // else: keep existing local data — do NOT clear it.
        },
        (err) => {
          console.error('[db] subscribe error, keeping local data locked', section, err);
          // Re-deliver local data to ensure it stays on screen.
          deliverLocal();
          startLocalPolling();
        },
      );
      return () => {
        destroyed = true;
        try {
          unsub?.();
        } catch (e) {
          console.error('[db] unsubscribe error', section, e);
        }
      };
    } catch (e) {
      console.error('[db] subscribe setup failed, using local polling', section, e);
    }
  }
  startLocalPolling();
  return () => {
    destroyed = true;
    stopLocalPolling();
  };

  function startLocalPolling(): () => void {
    const fire = () => {
      if (destroyed) return;
      try {
        deliverLocal();
      } catch (e) {
        console.error('[db] local poll fire failed', section, e);
      }
    };
    const interval = setInterval(fire, 1500);
    // Return a no-op stopper; the real cleanup is via `destroyed`.
    // (interval handle stored on the outer scope via closure)
    (startLocalPolling as unknown as { _interval?: ReturnType<typeof setInterval> })._interval = interval;
    return () => clearInterval(interval);
  }

  function stopLocalPolling(): void {
    const h = (startLocalPolling as unknown as { _interval?: ReturnType<typeof setInterval> })._interval;
    if (h) clearInterval(h);
  }
}

// ---- Doctors ----
export async function saveDoctor(d: DoctorRecord): Promise<void> {
  const database = getDb();
  if (database) {
    try {
      await withTimeout(setDoc(doc(database, 'doctors', d.id), d));
      return;
    } catch (e) {
      console.error('[db] doctor Firestore save failed, local fallback', e);
    }
  }
  try {
    const items = readLocal<DoctorRecord>(localKey('doctors'));
    const idx = items.findIndex((i) => i.id === d.id);
    if (idx >= 0) items[idx] = d;
    else items.push(d);
    writeLocal(localKey('doctors'), items);
  } catch (e) {
    console.error('[db] doctor local save failed', e);
  }
}

export async function deleteDoctor(id: string): Promise<void> {
  const database = getDb();
  if (database) {
    try {
      await withTimeout(deleteDoc(doc(database, 'doctors', id)));
      return;
    } catch (e) {
      console.error('[db] doctor Firestore delete failed, local fallback', e);
    }
  }
  try {
    writeLocal(localKey('doctors'), readLocal<DoctorRecord>(localKey('doctors')).filter((i) => i.id !== id));
  } catch (e) {
    console.error('[db] doctor local delete failed', e);
  }
}

export async function loadDoctors(): Promise<DoctorRecord[]> {
  const database = getDb();
  if (database) {
    try {
      const snap = await withTimeout(getDocs(collection(database, 'doctors')));
      const out: DoctorRecord[] = [];
      snap.forEach((d) => out.push(d.data() as DoctorRecord));
      if (out.length) return out;
    } catch (e) {
      console.error('[db] doctor Firestore load failed, local', e);
    }
  }
  return readLocal<DoctorRecord>(localKey('doctors'));
}

// ---- Substitutes ----
export async function saveSubstitute(s: SubstituteRecord): Promise<void> {
  const database = getDb();
  if (database) {
    try {
      await withTimeout(setDoc(doc(database, 'substitutes', s.id), s));
      return;
    } catch (e) {
      console.error('[db] substitute Firestore save failed, local fallback', e);
    }
  }
  try {
    const items = readLocal<SubstituteRecord>(localKey('substitutes'));
    const idx = items.findIndex((i) => i.id === s.id);
    if (idx >= 0) items[idx] = s;
    else items.push(s);
    writeLocal(localKey('substitutes'), items);
  } catch (e) {
    console.error('[db] substitute local save failed', e);
  }
}

export async function deleteSubstitute(id: string): Promise<void> {
  const database = getDb();
  if (database) {
    try {
      await withTimeout(deleteDoc(doc(database, 'substitutes', id)));
      return;
    } catch (e) {
      console.error('[db] substitute Firestore delete failed, local fallback', e);
    }
  }
  try {
    writeLocal(
      localKey('substitutes'),
      readLocal<SubstituteRecord>(localKey('substitutes')).filter((i) => i.id !== id),
    );
  } catch (e) {
    console.error('[db] substitute local delete failed', e);
  }
}

export async function loadSubstitutes(): Promise<SubstituteRecord[]> {
  const database = getDb();
  if (database) {
    try {
      const snap = await withTimeout(getDocs(query(collection(database, 'substitutes'), orderBy('price', 'asc'))));
      const out: SubstituteRecord[] = [];
      snap.forEach((d) => out.push(d.data() as SubstituteRecord));
      if (out.length) return out;
    } catch (e) {
      console.error('[db] substitute Firestore load failed, local', e);
    }
  }
  return readLocal<SubstituteRecord>(localKey('substitutes')).sort((a, b) => a.price - b.price);
}

// ---- Staff ----
export async function saveStaff(s: StaffRecord): Promise<void> {
  const database = getDb();
  if (database) {
    try {
      await withTimeout(setDoc(doc(database, 'staff', s.id), s));
      return;
    } catch (e) {
      console.error('[db] staff Firestore save failed, local fallback', e);
    }
  }
  try {
    const items = readLocal<StaffRecord>(localKey('staff'));
    const idx = items.findIndex((i) => i.id === s.id);
    if (idx >= 0) items[idx] = s;
    else items.push(s);
    writeLocal(localKey('staff'), items);
  } catch (e) {
    console.error('[db] staff local save failed', e);
  }
}

export async function deleteStaff(id: string): Promise<void> {
  const database = getDb();
  if (database) {
    try {
      await withTimeout(deleteDoc(doc(database, 'staff', id)));
      return;
    } catch (e) {
      console.error('[db] staff Firestore delete failed, local fallback', e);
    }
  }
  try {
    writeLocal(localKey('staff'), readLocal<StaffRecord>(localKey('staff')).filter((i) => i.id !== id));
  } catch (e) {
    console.error('[db] staff local delete failed', e);
  }
}

export async function loadStaff(): Promise<StaffRecord[]> {
  const database = getDb();
  if (database) {
    try {
      const snap = await withTimeout(getDocs(collection(database, 'staff')));
      const out: StaffRecord[] = [];
      snap.forEach((d) => out.push(d.data() as StaffRecord));
      if (out.length) return out;
    } catch (e) {
      console.error('[db] staff Firestore load failed, local', e);
    }
  }
  return readLocal<StaffRecord>(localKey('staff'));
}
