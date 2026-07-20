import { useState, useEffect } from 'react';
import { CheckCircle2, Clock } from 'lucide-react';
import type { Lang } from '../i18n';
import { translations } from '../i18n';
import type { BaseRecord } from '../types';
import { saveRecord, deleteRecord, subscribeRecords } from '../db';
import { uid, nowInEgypt, currentYear, currentMonth, formatDate, minutesBetween } from '../utils';
import { ArchiveView } from '../components/ArchiveView';
import { Field, SaveButton, inputCls, textareaCls } from './ShiftSection';

type CaptainData = {
  receiptNo: string; customerName: string; mobile: string; address: string;
  dispatchTime: string; deliveredAt?: string; durationMinutes?: number;
};

export function CaptainSection({ lang }: { lang: Lang }) {
  const t = translations[lang];
  const [receiptNo, setReceiptNo] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [records, setRecords] = useState<BaseRecord[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => subscribeRecords('captain', setRecords), []);

  async function handleSave() {
    if (!receiptNo.trim()) return;
    setSaving(true);
    try {
      const dispatchTime = nowInEgypt().toISOString();
      const data: CaptainData = { receiptNo, customerName, mobile, address, dispatchTime };
      const rec: BaseRecord = {
        id: uid(), section: 'captain', year: currentYear(), month: currentMonth(), timestamp: dispatchTime, data,
      };
      await saveRecord('captain', rec);
      setReceiptNo(''); setCustomerName(''); setMobile(''); setAddress('');
    } catch (e) {
      console.error('[captain] save failed', e);
    } finally {
      setSaving(false);
    }
  }

  async function markDelivered(r: BaseRecord) {
    try {
      const now = nowInEgypt().toISOString();
      const data = r.data as CaptainData;
      const duration = minutesBetween(data.dispatchTime, now);
      await saveRecord('captain', { ...r, data: { ...data, deliveredAt: now, durationMinutes: duration } });
    } catch (e) {
      console.error('[captain] markDelivered failed', e);
    }
  }

  const live = records.filter((r) => !(r.data as CaptainData).deliveredAt);
  const sortedLive = [...live].sort((a, b) => new Date((b.data as CaptainData).dispatchTime).getTime() - new Date((a.data as CaptainData).dispatchTime).getTime());

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-[#006064]">{t.captain}</h2>

      <div className="grid md:grid-cols-3 gap-4">
        <Field label={t.receiptNo}><input value={receiptNo} onChange={(e) => setReceiptNo(e.target.value)} className={inputCls} /></Field>
        <Field label={t.customerName}><input value={customerName} onChange={(e) => setCustomerName(e.target.value)} className={inputCls} /></Field>
        <Field label={t.mobile}><input value={mobile} onChange={(e) => setMobile(e.target.value)} className={inputCls} /></Field>
      </div>
      <Field label={t.deliveryAddress}><textarea rows={3} value={address} onChange={(e) => setAddress(e.target.value)} className={textareaCls} /></Field>
      <SaveButton onClick={handleSave} loading={saving} label={t.add} />

      {sortedLive.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-slate-700">{t.liveDeliveries}</h3>
          {sortedLive.map((r) => {
            const d = r.data as CaptainData;
            return (
              <div key={r.id} className="rounded-xl border border-amber-200 bg-amber-50 p-3 flex items-center justify-between gap-2">
                <div className="text-sm">
                  <div className="font-semibold text-slate-800">#{d.receiptNo} — {d.customerName}</div>
                  <div className="text-xs text-slate-600 flex items-center gap-1"><Clock size={12} /> {formatDate(d.dispatchTime, lang)}</div>
                  <div className="text-xs text-slate-500">📞 {d.mobile} · 📍 {d.address}</div>
                </div>
                <button onClick={() => markDelivered(r)} className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700">
                  <CheckCircle2 size={14} /> {t.markDelivered}
                </button>
              </div>
            );
          })}
        </div>
      )}

      <ArchiveView
        records={records}
        lang={lang}
        onDelete={(r) => deleteRecord('captain', r)}
        defaultOpenMonth={currentMonth()}
        renderEntry={(r, l) => {
          const d = r.data as CaptainData;
          return (
            <div className="space-y-0.5">
              <div className="font-semibold">#{d.receiptNo} — {d.customerName}</div>
              <div className="text-xs text-slate-600">📞 {d.mobile} · 📍 {d.address}</div>
              <div className="text-xs text-slate-500">{translations[l].dispatchTime}: {formatDate(d.dispatchTime, l)}</div>
              {d.deliveredAt && (
                <div className="text-xs font-semibold text-green-700">
                  {translations[l].delivered}: {formatDate(d.deliveredAt, l)} · {translations[l].duration}: {d.durationMinutes} {l === 'ar' ? 'دقيقة' : 'min'}
                </div>
              )}
            </div>
          );
        }}
      />
    </div>
  );
}
