import { useState, useEffect } from 'react';
import type { Lang } from '../i18n';
import { translations } from '../i18n';
import type { BaseRecord } from '../types';
import { saveRecord, deleteRecord, subscribeRecords } from '../db';
import { uid, nowInEgypt, currentYear, currentMonth } from '../utils';
import { ArchiveView } from '../components/ArchiveView';
import { Field, SaveButton, inputCls, textareaCls } from './ShiftSection';

const TARGETS_AR = ['الصيدلية', 'الأطباء', 'المستشفيات', 'العيادات', 'مراكز الأشعة'];
const TARGETS_EN = ['Pharmacy', 'Doctors', 'Hospitals', 'Clinics', 'Radiology centers'];

export function MedRepSection({ lang }: { lang: Lang }) {
  const t = translations[lang];
  const [repName, setRepName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [target, setTarget] = useState('');
  const [samples, setSamples] = useState('');
  const [bonus, setBonus] = useState('');
  const [records, setRecords] = useState<BaseRecord[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => subscribeRecords('rep', setRecords), []);

  const targets = lang === 'ar' ? TARGETS_AR : TARGETS_EN;

  async function handleSave() {
    setSaving(true);
    try {
      const rec: BaseRecord = {
        id: uid(),
        section: 'rep',
        year: currentYear(),
        month: currentMonth(),
        timestamp: nowInEgypt().toISOString(),
        data: { repName, companyName, distributionTarget: target, freeSamples: samples, bonus },
      };
      await saveRecord('rep', rec);
      setRepName(''); setCompanyName(''); setTarget(''); setSamples(''); setBonus('');
    } catch (e) {
      console.error('[rep] save failed', e);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-[#006064]">{t.medRep}</h2>
      <div className="grid md:grid-cols-3 gap-4">
        <Field label={t.repName}>
          <input value={repName} onChange={(e) => setRepName(e.target.value)} className={inputCls} />
        </Field>
        <Field label={t.companyName}>
          <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} className={inputCls} />
        </Field>
        <Field label={t.distributionTarget}>
          <select value={target} onChange={(e) => setTarget(e.target.value)} className={inputCls}>
            <option value="">—</option>
            {targets.map((x) => <option key={x} value={x}>{x}</option>)}
          </select>
        </Field>
      </div>
      <Field label={t.freeSamples}>
        <textarea rows={3} value={samples} onChange={(e) => setSamples(e.target.value)} className={textareaCls} placeholder={lang === 'ar' ? 'سطر لكل عينة' : 'One per line'} />
      </Field>
      <Field label={t.bonus}>
        <textarea rows={3} value={bonus} onChange={(e) => setBonus(e.target.value)} className={textareaCls} />
      </Field>
      <SaveButton onClick={handleSave} loading={saving} label={t.save} />
      <ArchiveView records={records} lang={lang} onDelete={(r) => deleteRecord('rep', r)} defaultOpenMonth={currentMonth()} />
    </div>
  );
}
