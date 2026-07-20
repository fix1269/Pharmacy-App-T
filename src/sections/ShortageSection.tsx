import { useState, useEffect } from 'react';
import type { Lang } from '../i18n';
import { translations } from '../i18n';
import type { BaseRecord } from '../types';
import { saveRecord, deleteRecord, subscribeRecords } from '../db';
import { uid, nowInEgypt, currentYear, currentMonth } from '../utils';
import { ArchiveView } from '../components/ArchiveView';
import { Field, SaveButton, inputCls, textareaCls } from './ShiftSection';

const DIST_AR = ['المتحدة', 'ابن سينا', 'فارما أوفرسيز', 'إيبيكو', 'النيل'];
const DIST_EN = ['Al-Muttahida', 'Ibn Sina', 'Pharma Overseas', 'Epicoph', 'El Nile'];

export function ShortageSection({ lang }: { lang: Lang }) {
  const t = translations[lang];
  const [products, setProducts] = useState('');
  const [qty, setQty] = useState('');
  const [distributor, setDistributor] = useState('');
  const [records, setRecords] = useState<BaseRecord[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => subscribeRecords('shortage', setRecords), []);
  const dists = lang === 'ar' ? DIST_AR : DIST_EN;

  async function handleSave() {
    setSaving(true);
    try {
      const rec: BaseRecord = {
        id: uid(),
        section: 'shortage',
        year: currentYear(),
        month: currentMonth(),
        timestamp: nowInEgypt().toISOString(),
        data: { missingProducts: products, requestedQty: qty ? Number(qty) : '', distributor },
      };
      await saveRecord('shortage', rec);
      setProducts(''); setQty(''); setDistributor('');
    } catch (e) {
      console.error('[shortage] save failed', e);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-[#006064]">{t.shortage}</h2>
      <Field label={t.missingProducts}>
        <textarea rows={4} value={products} onChange={(e) => setProducts(e.target.value)} className={textareaCls} placeholder={lang === 'ar' ? 'سطر لكل منتج' : 'One per line'} />
      </Field>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label={t.requestedQty}>
          <input type="number" min={0} value={qty} onChange={(e) => setQty(e.target.value)} className={inputCls} />
        </Field>
        <Field label={t.distributor}>
          <select value={distributor} onChange={(e) => setDistributor(e.target.value)} className={inputCls}>
            <option value="">—</option>
            {dists.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </Field>
      </div>
      <SaveButton onClick={handleSave} loading={saving} label={t.save} />
      <ArchiveView records={records} lang={lang} onDelete={(r) => deleteRecord('shortage', r)} defaultOpenMonth={currentMonth()} />
    </div>
  );
}
