import { useState, useEffect } from 'react';
import { Search, AlertTriangle } from 'lucide-react';
import type { Lang } from '../i18n';
import { translations } from '../i18n';
import type { SubstituteRecord } from '../types';
import { loadSubstitutes } from '../db';

export function SubstitutesSection({ lang }: { lang: Lang }) {
  const t = translations[lang];
  const [subs, setSubs] = useState<SubstituteRecord[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    loadSubstitutes().then(setSubs);
    const i = setInterval(() => loadSubstitutes().then(setSubs), 2000);
    return () => clearInterval(i);
  }, []);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? subs.filter((s) => s.drugName.toLowerCase().includes(q) || s.activeIngredient.toLowerCase().includes(q))
    : subs;

  // Group by active ingredient, sort by price
  const groups: Record<string, SubstituteRecord[]> = {};
  for (const s of filtered) {
    groups[s.activeIngredient] ||= [];
    groups[s.activeIngredient].push(s);
  }
  const ingredientKeys = Object.keys(groups).sort();

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-[#006064]">{t.substitutes}</h2>

      <div className="rounded-xl border border-amber-300 bg-amber-50 p-3">
        <div className="flex gap-2 items-start">
          <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={18} />
          <p className="text-xs font-semibold text-amber-800">{t.substituteWarning}</p>
        </div>
      </div>

      <div className="relative">
        <Search size={16} className="absolute top-1/2 -translate-y-1/2 text-slate-400 ltr:left-3 rtl:right-3" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.drugSearch} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm ltr:pl-9 rtl:pr-9 focus:outline-none focus:ring-2 focus:ring-[#4169E1]" />
      </div>

      {ingredientKeys.length === 0 ? (
        <p className="text-sm text-slate-500 italic">{t.noSubstitutes}</p>
      ) : (
        <div className="space-y-4">
          {ingredientKeys.map((ing) => {
            const list = [...groups[ing]].sort((a, b) => a.price - b.price);
            const cheapest = list[0].price;
            return (
              <div key={ing} className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="px-4 py-2 bg-slate-50 text-sm font-semibold text-slate-700">{ing}</div>
                <div className="divide-y divide-slate-100">
                  {list.map((s) => {
                    const variance = s.price - cheapest;
                    return (
                      <div key={s.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                        <div className="font-medium text-slate-800">{s.drugName}</div>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-700">{s.price} EGP</span>
                          {variance > 0 && (
                            <span className="text-xs font-semibold text-green-600">+{variance} EGP</span>
                          )}
                          {variance === 0 && <span className="text-xs font-semibold text-green-700">{lang === 'ar' ? 'الأرخص' : 'Cheapest'}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
