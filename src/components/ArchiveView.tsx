import { useState } from 'react';
import { ChevronDown, Trash2 } from 'lucide-react';
import type { Lang } from '../i18n';
import type { BaseRecord } from '../types';
import { translations } from '../i18n';
import { monthName, formatDate } from '../utils';
import { ShareButtons } from './ShareButtons';

type Props = {
  records: BaseRecord[];
  lang: Lang;
  onDelete?: (r: BaseRecord) => void;
  defaultOpenMonth?: number;
  renderEntry?: (r: BaseRecord, lang: Lang) => React.ReactNode;
  totalLabel?: (records: BaseRecord[], lang: Lang) => React.ReactNode;
};

export function ArchiveView({ records, lang, onDelete, defaultOpenMonth, renderEntry, totalLabel }: Props) {
  const t = translations[lang];
  // Group by year -> month
  const byYear: Record<number, Record<number, BaseRecord[]>> = {};
  for (const r of records) {
    byYear[r.year] ||= {};
    byYear[r.year][r.month] ||= [];
    byYear[r.year][r.month].push(r);
  }
  const years = Object.keys(byYear)
    .map(Number)
    .sort((a, b) => b - a);

  if (records.length === 0) {
    return <p className="text-sm text-slate-500 italic py-4">{t.noRecords}</p>;
  }

  return (
    <div className="space-y-4">
      {years.map((year) => (
        <YearGroup
          key={year}
          year={year}
          months={byYear[year]}
          lang={lang}
          onDelete={onDelete}
          defaultOpenMonth={defaultOpenMonth}
          renderEntry={renderEntry}
          totalLabel={totalLabel}
        />
      ))}
    </div>
  );
}

function YearGroup({
  year,
  months,
  lang,
  onDelete,
  defaultOpenMonth,
  renderEntry,
  totalLabel,
}: {
  year: number;
  months: Record<number, BaseRecord[]>;
  lang: Lang;
  onDelete?: (r: BaseRecord) => void;
  defaultOpenMonth?: number;
  renderEntry?: (r: BaseRecord, lang: Lang) => React.ReactNode;
  totalLabel?: (records: BaseRecord[], lang: Lang) => React.ReactNode;
}) {
  const t = translations[lang];
  const monthKeys = Object.keys(months)
    .map(Number)
    .sort((a, b) => b - a);
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="px-4 py-2.5 bg-gradient-to-r from-[#4169E1] to-[#006064] text-white font-bold text-sm">
        {t.year} {year}
      </div>
      <div className="divide-y divide-slate-100">
        {monthKeys.map((m) => (
          <MonthCard
            key={m}
            month={m}
            records={months[m]}
            lang={lang}
            onDelete={onDelete}
            openByDefault={m === defaultOpenMonth}
            renderEntry={renderEntry}
            totalLabel={totalLabel}
          />
        ))}
      </div>
    </div>
  );
}

function MonthCard({
  month,
  records,
  lang,
  onDelete,
  openByDefault,
  renderEntry,
  totalLabel,
}: {
  month: number;
  records: BaseRecord[];
  lang: Lang;
  onDelete?: (r: BaseRecord) => void;
  openByDefault?: boolean;
  renderEntry?: (r: BaseRecord, lang: Lang) => React.ReactNode;
  totalLabel?: (records: BaseRecord[], lang: Lang) => React.ReactNode;
}) {
  const [open, setOpen] = useState(!!openByDefault);
  const t = translations[lang];
  const sorted = [...records].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition"
      >
        <span className="font-semibold text-slate-700 text-sm">
          {monthName(month, lang)} <span className="text-slate-400">({records.length})</span>
        </span>
        <ChevronDown size={18} className={`text-slate-400 transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-2">
          {totalLabel && totalLabel(sorted, lang)}
          {sorted.map((r) => (
            <div key={r.id} className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="text-xs text-slate-500">{formatDate(r.timestamp, lang)}</div>
                <div className="flex items-center gap-1">
                  <ShareButtons record={r} lang={lang} />
                  {onDelete && (
                    <button
                      type="button"
                      title={t.delete}
                      onClick={() => {
                        if (confirm(t.confirmDelete)) onDelete(r);
                      }}
                      className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-1.5 text-sm text-slate-800">
                {renderEntry ? renderEntry(r, lang) : <DefaultEntry record={r} lang={lang} />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DefaultEntry({ record, lang }: { record: BaseRecord; lang: Lang }) {
  return (
    <ul className="space-y-0.5">
      {Object.entries(record.data).map(([k, v]) => (
        <li key={k} className="text-xs">
          <span className="text-slate-500">{k}:</span> <span className="font-medium">{String(v)}</span>
        </li>
      ))}
    </ul>
  );
}
