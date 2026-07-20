import { useState, useEffect, useRef } from 'react';
import { Edit2, Trash2, Printer, MessageCircle, Search, Plus, X } from 'lucide-react';
import type { Lang } from '../i18n';
import { translations } from '../i18n';
import type { BaseRecord, StaffRecord, SubstituteRecord } from '../types';
import {
  saveStaff, deleteStaff, loadStaff,
  saveSubstitute, deleteSubstitute, loadSubstitutes,
  subscribeRecords, deleteRecord,
} from '../db';
import { uid, shareWhatsApp, currentYear, currentMonth, monthName } from '../utils';
import { Field, SaveButton, inputCls, textareaCls } from '../sections/ShiftSection';
import { ArchiveView } from './ArchiveView';

const JOBS_AR = ['صيدلي', 'مساعد صيدلي', 'كاشير', 'مدير مخزن', 'فراش', 'أمن'];
const JOBS_EN = ['Pharmacist', 'Pharmacy Assistant', 'Cashier', 'Store Manager', 'Cleaner', 'Security'];

const emptyStaff: StaffRecord = {
  id: '', photo: '', fullName: '', mobile: '', jobTitle: '', nationalId: '', address: '',
  salary: '', attachments: [], attendance: [], violations: '', bonuses: '', evaluation: '',
  createdAt: '',
};

export function AdminPanel({ lang, onClose }: { lang: Lang; onClose: () => void }) {
  const t = translations[lang];
  const [tab, setTab] = useState<'staff' | 'subs' | 'archive'>('staff');
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-stretch justify-center p-0 sm:p-4">
      <div className="bg-slate-50 w-full max-w-6xl h-full sm:h-[92vh] sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="px-5 py-4 bg-gradient-to-r from-[#4169E1] to-[#006064] text-white flex items-center justify-between">
          <h2 className="text-xl font-extrabold">{t.adminPanel} / الإدارة</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10"><X size={20} /></button>
        </div>
        <div className="px-5 pt-3 flex gap-2 border-b border-slate-200 overflow-x-auto">
          <TabBtn active={tab === 'staff'} onClick={() => setTab('staff')}>{t.staffLedger}</TabBtn>
          <TabBtn active={tab === 'subs'} onClick={() => setTab('subs')}>{t.substitutesEditor}</TabBtn>
          <TabBtn active={tab === 'archive'} onClick={() => setTab('archive')}>
            {lang === 'ar' ? 'أرشيف التقارير والعمليات' : 'Operational Reports Archive'}
          </TabBtn>
        </div>
        <div className="flex-1 overflow-auto p-5">
          {tab === 'staff' ? <StaffLedger lang={lang} /> : tab === 'subs' ? <SubstitutesEditor lang={lang} /> : <ReportsArchive lang={lang} />}
        </div>
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`px-4 py-2 text-sm font-semibold border-b-2 transition ${active ? 'border-[#4169E1] text-[#4169E1]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
      {children}
    </button>
  );
}

// ---------- Staff Ledger ----------
function StaffLedger({ lang }: { lang: Lang }) {
  const t = translations[lang];
  const [list, setList] = useState<StaffRecord[]>([]);
  const [form, setForm] = useState<StaffRecord>(emptyStaff);
  const [editing, setEditing] = useState(false);
  const [search, setSearch] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const attachRef = useRef<HTMLInputElement>(null);

  useEffect(() => { loadStaff().then(setList); }, []);

  const jobs = lang === 'ar' ? JOBS_AR : JOBS_EN;

  function compressImage(file: File, cb: (b64: string) => void) {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const max = 240;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        let quality = 0.7;
        let out = canvas.toDataURL('image/jpeg', quality);
        while (out.length > 100 * 1024 && quality > 0.2) {
          quality -= 0.1;
          out = canvas.toDataURL('image/jpeg', quality);
        }
        cb(out);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) compressImage(f, (b64) => setForm((s) => ({ ...s, photo: b64 })));
  }

  function onAttach(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    for (const f of files) {
      compressImage(f, (b64) => setForm((s) => ({ ...s, attachments: [...s.attachments, b64] })));
    }
  }

  const [savingStaff, setSavingStaff] = useState(false);
  async function save() {
    if (!form.fullName.trim()) return;
    setSavingStaff(true);
    try {
      const rec: StaffRecord = { ...form, id: form.id || uid(), createdAt: form.createdAt || new Date().toISOString() };
      await saveStaff(rec);
      setForm(emptyStaff); setEditing(false);
      await loadStaff().then(setList);
    } catch (e) {
      console.error('[admin] staff save failed', e);
    } finally {
      setSavingStaff(false);
    }
  }

  function edit(s: StaffRecord) {
    setForm(s); setEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function clock(inOut: 'in' | 'out') {
    const today = new Date().toISOString().slice(0, 10);
    const time = new Date().toISOString();
    setForm((s) => {
      const att = [...s.attendance];
      const idx = att.findIndex((a) => a.date === today);
      if (idx >= 0) {
        if (inOut === 'in') att[idx] = { ...att[idx], clockIn: time };
        else att[idx] = { ...att[idx], clockOut: time };
      } else {
        att.push({ date: today, clockIn: inOut === 'in' ? time : undefined, clockOut: inOut === 'out' ? time : undefined });
      }
      return { ...s, attendance: att };
    });
  }

  function printProfile(s: StaffRecord) {
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`<html dir="${lang === 'ar' ? 'rtl' : 'ltr'}"><head><title>${s.fullName}</title><style>
      body{font-family:Arial;padding:24px;color:#1e293b}
      h1{color:#006064} .p{display:flex;gap:16px} img{width:120px;height:120px;border-radius:12px;object-fit:cover}
      table{width:100%;border-collapse:collapse;margin-top:12px} td{padding:6px;border-bottom:1px solid #e2e8f0}
      .k{font-weight:bold;width:35%}
    </style></head><body>
      <h1>${t.staffLedger}</h1>
      <div class="p">${s.photo ? `<img src="${s.photo}" />` : ''}<div>
      <table>
        <tr><td class="k">${t.fullName}</td><td>${s.fullName}</td></tr>
        <tr><td class="k">${t.mobile}</td><td>${s.mobile}</td></tr>
        <tr><td class="k">${t.jobTitle}</td><td>${s.jobTitle}</td></tr>
        <tr><td class="k">${t.nationalId}</td><td>${s.nationalId}</td></tr>
        <tr><td class="k">${t.residentialAddress}</td><td>${s.address}</td></tr>
        <tr><td class="k">${t.salaryStructure}</td><td>${s.salary}</td></tr>
        <tr><td class="k">${t.violations}</td><td>${s.violations}</td></tr>
        <tr><td class="k">${t.bonuses}</td><td>${s.bonuses}</td></tr>
        <tr><td class="k">${t.ownerEvaluation}</td><td>${s.evaluation}</td></tr>
        <tr><td class="k">${t.attendance}</td><td>${s.attendance.map(a => `${a.date}: ${a.clockIn || '-'} → ${a.clockOut || '-'}`).join('<br>')}</td></tr>
      </table></div></div></body></html>`);
    w.document.close();
    setTimeout(() => w.print(), 300);
  }

  function shareProfile(s: StaffRecord) {
    const text = lang === 'ar'
      ? `*${s.fullName}*\nالمسمى: ${s.jobTitle}\nالهاتف: ${s.mobile}\nالرقم القومي/العمر: ${s.nationalId}\nالعنوان: ${s.address}\nالراتب: ${s.salary}\nالمخالفات: ${s.violations}\nالمكافآت: ${s.bonuses}\nالتقييم: ${s.evaluation}`
      : `*${s.fullName}*\nJob: ${s.jobTitle}\nMobile: ${s.mobile}\nID/Age: ${s.nationalId}\nAddress: ${s.address}\nSalary: ${s.salary}\nViolations: ${s.violations}\nBonuses: ${s.bonuses}\nEvaluation: ${s.evaluation}`;
    shareWhatsApp(text);
  }

  const filtered = list.filter((s) => s.fullName.toLowerCase().includes(search.toLowerCase()) || s.mobile.includes(search));

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-[#006064]">{editing ? t.edit : t.add} — {t.staffLedger}</h3>
          {editing && <button onClick={() => { setForm(emptyStaff); setEditing(false); }} className="text-xs text-slate-500">{t.cancel}</button>}
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label={t.staffPhoto}>
            <input ref={fileRef} type="file" accept="image/*" onChange={onPhoto} className="text-xs" />
            {form.photo && <img src={form.photo} alt="" className="mt-2 w-20 h-20 rounded-lg object-cover" />}
          </Field>
          <Field label={t.fullName}><input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className={inputCls} /></Field>
          <Field label={t.mobile}><input value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} className={inputCls} /></Field>
          <Field label={t.jobTitle}>
            <select value={form.jobTitle} onChange={(e) => setForm({ ...form, jobTitle: e.target.value })} className={inputCls}>
              <option value="">—</option>
              {jobs.map((j) => <option key={j} value={j}>{j}</option>)}
            </select>
          </Field>
          <Field label={t.nationalId}><input value={form.nationalId} onChange={(e) => setForm({ ...form, nationalId: e.target.value })} className={inputCls} /></Field>
          <Field label={t.residentialAddress}><input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputCls} /></Field>
          <Field label={t.salaryStructure}><input value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} className={inputCls} /></Field>
          <Field label={t.attachments}>
            <input ref={attachRef} type="file" accept="image/*" multiple onChange={onAttach} className="text-xs" />
            <div className="text-xs text-slate-500 mt-1">{form.attachments.length} {lang === 'ar' ? 'مرفق' : 'files'}</div>
          </Field>
        </div>
        <Field label={t.violations}><textarea rows={2} value={form.violations} onChange={(e) => setForm({ ...form, violations: e.target.value })} className={textareaCls} /></Field>
        <Field label={t.bonuses}><textarea rows={2} value={form.bonuses} onChange={(e) => setForm({ ...form, bonuses: e.target.value })} className={textareaCls} /></Field>
        <Field label={t.ownerEvaluation}><textarea rows={2} value={form.evaluation} onChange={(e) => setForm({ ...form, evaluation: e.target.value })} className={textareaCls} /></Field>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => clock('in')} className="rounded-lg bg-green-100 text-green-700 px-3 py-1.5 text-xs font-semibold">⏰ {t.clockIn}</button>
          <button onClick={() => clock('out')} className="rounded-lg bg-rose-100 text-rose-700 px-3 py-1.5 text-xs font-semibold">⏹ {t.clockOut}</button>
          <span className="text-xs text-slate-500">{form.attendance.length} {lang === 'ar' ? 'يوم مسجل' : 'days logged'}</span>
        </div>
        <SaveButton onClick={save} loading={savingStaff} label={editing ? t.save : t.add} />
      </div>

      <div className="relative">
        <Search size={16} className="absolute top-1/2 -translate-y-1/2 text-slate-400 ltr:left-3 rtl:right-3" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.search} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm ltr:pl-9 rtl:pr-9 focus:outline-none focus:ring-2 focus:ring-[#4169E1]" />
      </div>

      <div className="space-y-2">
        {filtered.map((s) => (
          <div key={s.id} className="rounded-xl border border-slate-200 bg-white p-3 flex items-start gap-3 shadow-sm">
            {s.photo ? <img src={s.photo} className="w-14 h-14 rounded-lg object-cover" alt="" /> : <div className="w-14 h-14 rounded-lg bg-slate-100 grid place-items-center text-slate-400 text-xs">photo</div>}
            <div className="flex-1 min-w-0">
              <div className="font-bold text-slate-800">{s.fullName}</div>
              <div className="text-xs text-slate-500">{s.jobTitle} · 📞 {s.mobile}</div>
              <div className="text-xs text-slate-500">{t.salaryStructure}: {s.salary}</div>
            </div>
            <div className="flex gap-1">
              <IconBtn title={t.edit} onClick={() => edit(s)}><Edit2 size={15} /></IconBtn>
              <IconBtn title={t.print} onClick={() => printProfile(s)}><Printer size={15} /></IconBtn>
              <IconBtn title={t.shareWhatsapp} onClick={() => shareProfile(s)} className="bg-green-50 text-green-700"><MessageCircle size={15} /></IconBtn>
              <IconBtn title={t.delete} onClick={() => { if (confirm(t.confirmDelete)) { deleteStaff(s.id).then(() => loadStaff().then(setList)); } }} className="bg-red-50 text-red-600"><Trash2 size={15} /></IconBtn>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function IconBtn({ children, onClick, title, className = '' }: { children: React.ReactNode; onClick: () => void; title: string; className?: string }) {
  return <button onClick={onClick} title={title} className={`p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition ${className}`}>{children}</button>;
}

// ---------- Operational Reports Archive ----------
type ArchiveSectionConfig = {
  id: 'shift' | 'expenses' | 'rep';
  ar: string;
  en: string;
  accent: string;
  bg: string;
  totalMonthly?: boolean;
};

const ARCHIVE_SECTIONS: ArchiveSectionConfig[] = [
  { id: 'shift', ar: 'سجل الورديات وتقفيل الدرج', en: 'Shift Handover Log', accent: 'text-[#4169E1]', bg: 'bg-[#4169E1]/5' },
  { id: 'expenses', ar: 'سجل مصروفات الصيدلية النثرية', en: 'Petty Expenses Log', accent: 'text-rose-600', bg: 'bg-rose-50', totalMonthly: true },
  { id: 'rep', ar: 'سجل عينات وزيارات المندوبين', en: 'Med Rep Samples & Visits Log', accent: 'text-[#006064]', bg: 'bg-[#006064]/5' },
];

function ReportsArchive({ lang }: { lang: Lang }) {
  const t = translations[lang];
  return (
    <div className="space-y-6">
      <h3 className="font-bold text-[#006064]">
        {lang === 'ar' ? 'أرشيف التقارير والعمليات' : 'Operational Reports Archive'}
      </h3>
      {ARCHIVE_SECTIONS.map((cfg) => (
        <SingleSectionArchive key={cfg.id} cfg={cfg} lang={lang} t={t} />
      ))}
    </div>
  );
}

function SingleSectionArchive({ cfg, lang, t }: { cfg: ArchiveSectionConfig; lang: Lang; t: typeof translations[Lang] }) {
  const [records, setRecords] = useState<BaseRecord[]>([]);
  const [yearFilter, setYearFilter] = useState<number | 'all'>('all');

  useEffect(() => {
    const unsub = subscribeRecords(cfg.id, (recs) => setRecords(recs));
    return () => unsub();
  }, [cfg.id]);

  const years = Array.from(new Set(records.map((r) => r.year))).sort((a, b) => b - a);
  const visible = yearFilter === 'all' ? records : records.filter((r) => r.year === yearFilter);

  const totalForMonth = (recs: BaseRecord[]) =>
    recs.reduce((sum, r) => sum + (Number(r.data.amountPaid) || 0), 0);

  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-3`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h4 className={`font-bold ${cfg.accent}`}>
          {lang === 'ar' ? cfg.ar : cfg.en}
          <span className="ms-2 text-xs font-normal text-slate-400">({records.length})</span>
        </h4>
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-600">{t.year}:</label>
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4169E1]"
          >
            <option value="all">{t.allYears}</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="text-sm text-slate-500 italic py-4">{t.noRecords}</p>
      ) : (
        <ArchiveView
          records={visible}
          lang={lang}
          defaultOpenMonth={currentMonth()}
          onDelete={(r) => deleteRecord(r.section, r)}
          totalLabel={cfg.totalMonthly ? (recs) => {
            const total = totalForMonth(recs);
            if (total === 0) return null;
            return (
              <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 mb-2">
                <span className="text-sm font-bold text-red-700">{t.totalMonthly}: </span>
                <span className="text-sm font-extrabold text-red-700">{total} EGP</span>
              </div>
            );
          } : undefined}
          renderEntry={(r) => (
            <ul className="space-y-0.5">
              {Object.entries(r.data).map(([k, v]) => (
                <li key={k} className="text-xs text-slate-700">
                  <span className="text-slate-500">{fieldLabelLocal(k, lang)}:</span>{' '}
                  <span className="font-medium">{formatValLocal(v)}</span>
                </li>
              ))}
            </ul>
          )}
        />
      )}
    </div>
  );
}

function fieldLabelLocal(key: string, lang: Lang): string {
  const map: Record<string, Record<Lang, string>> = {
    drawerCash: { ar: 'نقدية الدرج', en: 'Drawer Cash' },
    pettyExpenses: { ar: 'مصروفات نثرية', en: 'Petty Expenses' },
    pendingOrders: { ar: 'طلبات معلقة', en: 'Pending Orders' },
    urgentShortages: { ar: 'نواقص عاجلة', en: 'Urgent Shortages' },
    notes: { ar: 'ملاحظات', en: 'Notes' },
    repName: { ar: 'اسم المندوب', en: 'Rep Name' },
    companyName: { ar: 'الشركة', en: 'Company' },
    distributionTarget: { ar: 'جهة التوزيع', en: 'Distribution Target' },
    freeSamples: { ar: 'عينات مجانية', en: 'Free Samples' },
    bonus: { ar: 'مكافأة', en: 'Bonus' },
    amountPaid: { ar: 'المبلغ المدفوع', en: 'Amount Paid' },
    staffResponsible: { ar: 'الموظف المسؤول', en: 'Staff Responsible' },
    expenseCategory: { ar: 'فئة المصروف', en: 'Expense Category' },
    details: { ar: 'التفاصيل', en: 'Details' },
  };
  return map[key]?.[lang] || key;
}

function formatValLocal(v: unknown): string {
  if (v == null || v === '') return '-';
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  return String(v);
}

// ---------- Substitutes Editor ----------
function SubstitutesEditor({ lang }: { lang: Lang }) {
  const t = translations[lang];
  const [list, setList] = useState<SubstituteRecord[]>([]);
  const [name, setName] = useState('');
  const [ingredient, setIngredient] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => { loadSubstitutes().then(setList); }, []);

  const [savingSub, setSavingSub] = useState(false);
  async function add() {
    if (!name.trim() || !ingredient.trim()) return;
    setSavingSub(true);
    try {
      const s: SubstituteRecord = {
        id: uid(), drugName: name, activeIngredient: ingredient, price: price ? Number(price) : 0,
        createdAt: new Date().toISOString(),
      };
      await saveSubstitute(s);
      setName(''); setIngredient(''); setPrice('');
      await loadSubstitutes().then(setList);
    } catch (e) {
      console.error('[admin] substitute save failed', e);
    } finally {
      setSavingSub(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <h3 className="font-bold text-[#006064]">{t.substitutesEditor}</h3>
        <div className="grid md:grid-cols-3 gap-3">
          <Field label={t.drugName}><input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} /></Field>
          <Field label={t.activeIngredient}><input value={ingredient} onChange={(e) => setIngredient(e.target.value)} className={inputCls} /></Field>
          <Field label={t.price}><input type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} className={inputCls} /></Field>
        </div>
        <SaveButton onClick={add} loading={savingSub} label={t.addSubstitute} />
      </div>
      <div className="space-y-2">
        {list.map((s) => (
          <div key={s.id} className="rounded-lg border border-slate-200 bg-white p-3 flex items-center justify-between">
            <div className="text-sm">
              <span className="font-semibold">{s.drugName}</span> <span className="text-slate-500">— {s.activeIngredient}</span>
              <span className="text-slate-700 ms-2">· {s.price} EGP</span>
            </div>
            <button onClick={() => { if (confirm(t.confirmDelete)) { deleteSubstitute(s.id).then(() => loadSubstitutes().then(setList)); } }} className="p-1.5 rounded-lg bg-red-50 text-red-600"><Trash2 size={15} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
