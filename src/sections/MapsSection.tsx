import { MapPin, Building2, FlaskConical, Scan, ShieldCheck } from 'lucide-react';
import type { Lang } from '../i18n';
import { translations } from '../i18n';

export function MapsSection({ lang }: { lang: Lang }) {
  const t = translations[lang];
  const items = [
    { label: t.nearestPharmacy, icon: MapPin, q: 'nearest pharmacy' },
    { label: t.nearestHospital, icon: Building2, q: 'nearest hospital' },
    { label: t.nearestLab, icon: FlaskConical, q: 'nearest medical lab' },
    { label: t.nearestRadiology, icon: Scan, q: 'nearest radiology center' },
    { label: t.nearestInsurance, icon: ShieldCheck, q: 'nearest health insurance branch' },
  ];
  function open(q: string) {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q + ' Egypt')}`, '_blank', 'noopener');
  }
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-[#006064]">{t.maps}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((it) => (
          <button
            key={it.label}
            onClick={() => open(it.q)}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm hover:shadow-md hover:border-[#4169E1] transition text-start"
          >
            <span className="grid place-items-center w-10 h-10 rounded-lg bg-[#4169E1]/10 text-[#4169E1]">
              <it.icon size={20} />
            </span>
            <span className="font-semibold text-sm text-slate-800">{it.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
