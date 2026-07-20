import { useState } from 'react';
import { AlertTriangle, Search } from 'lucide-react';
import type { Lang } from '../i18n';
import { translations } from '../i18n';
import { findPediatricDrugs, findAlternatives, calculateDose, type PediatricDrug } from '../pediatric';
import { shareWhatsApp } from '../utils';
import { Field, inputCls } from './ShiftSection';

export function PediatricSection({ lang }: { lang: Lang }) {
  const t = translations[lang];
  const [weight, setWeight] = useState('');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<PediatricDrug | null>(null);

  const matches = query.trim().length >= 2 ? findPediatricDrugs(query) : [];
  const dose = selected && weight ? calculateDose(selected, Number(weight)) : null;
  const alts = selected ? findAlternatives(selected) : [];

  function shareForParents() {
    if (!selected || !dose) return;
    const ar = `*${selected.nameAr} (${selected.name})*\nالوزن: ${weight} كجم\nالجرعة: ${dose.singleDoseMl} مل × ${dose.dosesPerDay} مرات يومياً\nالحد اليومي: ${dose.dailyDoseMl} مل\n\n${translations.ar.clinicalWarning}`;
    shareWhatsApp(ar);
  }

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-[#006064]">{t.pediatric}</h2>

      <div className="rounded-xl border-2 border-amber-400 bg-amber-50 p-4">
        <div className="flex gap-2 items-start">
          <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={20} />
          <p className="text-sm font-bold text-amber-800 leading-relaxed">{t.clinicalWarning}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Field label={t.childWeight}>
          <input type="number" min={0} step={0.1} value={weight} onChange={(e) => setWeight(e.target.value)} className={inputCls} />
        </Field>
        <Field label={t.syrupSearch}>
          <div className="relative">
            <Search size={16} className="absolute top-1/2 -translate-y-1/2 text-slate-400 ltr:left-3 rtl:right-3" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} className={`${inputCls} ltr:pl-9 rtl:pr-9`} />
          </div>
        </Field>
      </div>

      {matches.length > 0 && !selected && (
        <div className="rounded-lg border border-slate-200 bg-white divide-y divide-slate-100">
          {matches.map((d) => (
            <button key={d.name} onClick={() => setSelected(d)} className="w-full text-start px-4 py-2.5 hover:bg-slate-50 transition text-sm">
              <span className="font-semibold">{d.nameAr}</span> <span className="text-slate-500">({d.name})</span> — <span className="text-xs text-slate-500">{d.ingredientAr}</span>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-[#4169E1]">{selected.nameAr} ({selected.name})</div>
              <div className="text-xs text-slate-500">{selected.ingredientAr} — {selected.mgPerMl} mg/ml</div>
            </div>
            <button onClick={() => { setSelected(null); setQuery(''); }} className="text-xs text-slate-500 hover:text-slate-700">✕</button>
          </div>
          {dose ? (
            <div className="rounded-lg bg-[#4169E1]/10 p-3">
              <div className="text-sm text-slate-700">{t.safeDose}:</div>
              <div className="text-2xl font-extrabold text-[#006064]">
                {dose.singleDoseMl} ml × {dose.dosesPerDay} {lang === 'ar' ? 'مرات/يوم' : 'x/day'}
              </div>
              <div className="text-sm text-slate-600">≈ {dose.dailyDoseMl} ml / {lang === 'ar' ? 'يوم' : 'day'}</div>
              {dose.capped && <div className="text-xs text-amber-600 font-semibold mt-1">⚠ {lang === 'ar' ? 'تم تقليص الجرعة للحد الآمن' : 'Capped to safe max'}</div>}
            </div>
          ) : (
            <p className="text-sm text-slate-500">{lang === 'ar' ? 'أدخل وزن الطفل' : 'Enter weight'}</p>
          )}
          {alts.length > 0 && (
            <div>
              <div className="text-sm font-semibold text-slate-700 mb-1">{t.alternatives}</div>
              <ul className="text-sm space-y-1">
                {alts.map((a) => <li key={a.name} className="text-slate-600">• {a.nameAr} ({a.name}) — {a.mgPerMl} mg/ml</li>)}
              </ul>
            </div>
          )}
          {dose && (
            <button onClick={shareForParents} className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition">
              {t.shareWhatsapp}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
