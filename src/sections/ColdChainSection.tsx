import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import type { Lang } from '../i18n';
import { translations } from '../i18n';
import type { BaseRecord } from '../types';
import { saveRecord, deleteRecord, subscribeRecords } from '../db';
import { uid, nowInEgypt, currentYear, currentMonth } from '../utils';
import { ArchiveView } from '../components/ArchiveView';
import { Field, SaveButton, inputCls } from './ShiftSection';

const SAFE_MIN = 2;
const SAFE_MAX = 8;

export function ColdChainSection({ lang }: { lang: Lang }) {
  const t = translations[lang];
  const [temp, setTemp] = useState('');
  const [ac, setAc] = useState('working');
  const [records, setRecords] = useState<BaseRecord[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => subscribeRecords('cold', setRecords), []);

  const tempNum = temp ? Number(temp) : null;
  const unsafe = tempNum != null && (tempNum < SAFE_MIN || tempNum > SAFE_MAX);

  async function handleSave() {
    setSaving(true);
    try {
      const rec: BaseRecord = {
        id: uid(),
        section: 'cold',
        year: currentYear(),
        month: currentMonth(),
        timestamp: nowInEgypt().toISOString(),
        data: { fridgeTemp: tempNum ?? '', acStatus: ac },
      };
      await saveRecord('cold', rec);
      setTemp(''); setAc('working');
    } catch (e) {
      console.error('[cold] save failed', e);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-[#006064]">{t.coldChain}</h2>

      {unsafe && (
        <div className="rounded-xl border-2 border-red-500 bg-red-50 p-4 animate-pulse">
          <div className="flex gap-2 items-start">
            <AlertTriangle className="text-red-600 shrink-0" size={20} />
            <p className="text-sm font-bold text-red-700">{t.tempAlert}</p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <Field label={t.fridgeTemp}>
          <input type="number" step={0.1} value={temp} onChange={(e) => setTemp(e.target.value)} className={`${inputCls} ${unsafe ? 'border-red-500 ring-2 ring-red-300' : ''}`} />
        </Field>
        <Field label={t.acStatus}>
          <select value={ac} onChange={(e) => setAc(e.target.value)} className={inputCls}>
            <option value="working">{t.working}</option>
            <option value="notWorking">{t.notWorking}</option>
          </select>
        </Field>
      </div>
      <SaveButton onClick={handleSave} loading={saving} label={t.save} />
      <ArchiveView records={records} lang={lang} onDelete={(r) => deleteRecord('cold', r)} defaultOpenMonth={currentMonth()} />
    </div>
  );
}
