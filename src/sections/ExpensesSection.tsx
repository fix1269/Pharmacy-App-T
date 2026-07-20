import { useState, useEffect } from 'react';
import type { Lang } from '../i18n';
import { translations } from '../i18n';
import type { BaseRecord } from '../types';
import { saveRecord, deleteRecord, subscribeRecords } from '../db';
import { uid, nowInEgypt, currentYear, currentMonth } from '../utils';
import { ArchiveView } from '../components/ArchiveView';
import { Field, SaveButton, inputCls, textareaCls } from './ShiftSection';

const CAT_AR = ['مستلزمات تشغيل', 'إعلانات', 'ضيافة', 'صيانة', 'أخرى'];
const CAT_EN = ['Operating Supplies', 'Advertising', 'Hospitality', 'Maintenance', 'Others'];

export function ExpensesSection({ lang }: { lang: Lang }) {
  const t = translations[lang];
  const [amount, setAmount] = useState('');
  const [staff, setStaff] = useState('');
  const [category, setCategory] = useState('');
  const [details, setDetails] = useState('');
  const [records, setRecords] = useState<BaseRecord[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => subscribeRecords('expenses', setRecords), []);
  const cats = lang === 'ar' ? CAT_AR : CAT_EN;

  async function handleSave() {
    setSaving(true);
    try {
      const rec: BaseRecord = {
        id: uid(),
        section: 'expenses',
        year: currentYear(),
        month: currentMonth(),
        timestamp: nowInEgypt().toISOString(),
        data: { amountPaid: amount ? Number(amount) : '', staffResponsible: staff, expenseCategory: category, details },
      };
      await saveRecord('expenses', rec);
      setAmount(''); setStaff(''); setCategory(''); setDetails('');
    } catch (e) {
      console.error('[expenses] save failed', e);
    } finally {
      setSaving(false);
    }
  }

  const totalForMonth = (monthRecords: BaseRecord[]) =>
    monthRecords.reduce((sum, r) => sum + (Number(r.data.amountPaid) || 0), 0);

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-[#006064]">{t.expenses}</h2>
      <div className="grid md:grid-cols-3 gap-4">
        <Field label={t.amountPaid}>
          <input type="number" min={0} value={amount} onChange={(e) => setAmount(e.target.value)} className={inputCls} />
        </Field>
        <Field label={t.staffResponsible}>
          <input value={staff} onChange={(e) => setStaff(e.target.value)} className={inputCls} />
        </Field>
        <Field label={t.expenseCategory}>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
            <option value="">—</option>
            {cats.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
      </div>
      <Field label={t.details}>
        <textarea rows={3} value={details} onChange={(e) => setDetails(e.target.value)} className={textareaCls} />
      </Field>
      <SaveButton onClick={handleSave} loading={saving} label={t.save} />
      <ArchiveView
        records={records}
        lang={lang}
        onDelete={(r) => deleteRecord('expenses', r)}
        defaultOpenMonth={currentMonth()}
        totalLabel={(recs, l) => {
          const total = totalForMonth(recs);
          return (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 mb-2">
              <span className="text-sm font-bold text-red-700">{translations[l].totalMonthly}: </span>
              <span className="text-sm font-extrabold text-red-700">{total} EGP</span>
            </div>
          );
        }}
      />
    </div>
  );
}
