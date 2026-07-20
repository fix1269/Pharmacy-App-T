import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import type { Lang } from '../i18n';
import { translations } from '../i18n';
import type { BaseRecord } from '../types';
import { saveRecord, deleteRecord, subscribeRecords } from '../db';
import { uid, nowInEgypt, currentYear, currentMonth } from '../utils';
import { ArchiveView } from '../components/ArchiveView';

export function ShiftSection({ lang }: { lang: Lang }) {
  const t = translations[lang];
  const [drawerCash, setDrawerCash] = useState('');
  const [pettyExpenses, setPettyExpenses] = useState('');
  const [pendingOrders, setPendingOrders] = useState('');
  const [urgentShortages, setUrgentShortages] = useState('');
  const [notes, setNotes] = useState('');
  const [records, setRecords] = useState<BaseRecord[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => subscribeRecords('shift', setRecords), []);

  async function handleSave() {
    setSaving(true);
    try {
      const now = nowInEgypt();
      const rec: BaseRecord = {
        id: uid(),
        section: 'shift',
        year: currentYear(),
        month: currentMonth(),
        timestamp: now.toISOString(),
        data: {
          drawerCash: drawerCash ? Number(drawerCash) : '',
          pettyExpenses: pettyExpenses ? Number(pettyExpenses) : '',
          pendingOrders,
          urgentShortages,
          notes,
        },
      };
      await saveRecord('shift', rec);
      setDrawerCash(''); setPettyExpenses(''); setPendingOrders(''); setUrgentShortages(''); setNotes('');
    } catch (e) {
      console.error('[shift] save failed', e);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-[#006064]">{t.shiftHandover}</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label={t.drawerCash}>
          <input type="number" min={0} value={drawerCash} onChange={(e) => setDrawerCash(e.target.value)} className={inputCls} />
        </Field>
        <Field label={t.pettyExpenses}>
          <input type="number" min={0} value={pettyExpenses} onChange={(e) => setPettyExpenses(e.target.value)} className={inputCls} />
        </Field>
      </div>
      <Field label={t.pendingOrders}>
        <textarea rows={3} value={pendingOrders} onChange={(e) => setPendingOrders(e.target.value)} className={textareaCls} placeholder={lang === 'ar' ? 'سطر لكل طلب' : 'One per line'} />
      </Field>
      <Field label={t.urgentShortages}>
        <textarea rows={3} value={urgentShortages} onChange={(e) => setUrgentShortages(e.target.value)} className={textareaCls} placeholder={lang === 'ar' ? 'سطر لكل نقص' : 'One per line'} />
      </Field>
      <Field label={t.notes}>
        <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className={textareaCls} />
      </Field>
      <SaveButton onClick={handleSave} loading={saving} label={t.save} />
      <ArchiveView records={records} lang={lang} onDelete={(r) => deleteRecord('shift', r)} defaultOpenMonth={currentMonth()} />
    </div>
  );
}

// Shared form primitives exported for other sections
export const inputCls =
  'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4169E1] focus:border-transparent transition';
export const textareaCls =
  'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4169E1] focus:border-transparent transition resize-y';
export const labelCls = 'block text-sm font-semibold text-slate-700 mb-1.5';

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

export function SaveButton({
  onClick,
  loading,
  label,
}: {
  onClick: () => void | Promise<void>;
  loading: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await onClick();
        } catch (e) {
          console.error('[SaveButton] handler threw', e);
        }
      }}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-lg bg-[#4169E1] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#3556c9] transition disabled:opacity-60"
    >
      <Save size={16} /> {loading ? '...' : label}
    </button>
  );
}
