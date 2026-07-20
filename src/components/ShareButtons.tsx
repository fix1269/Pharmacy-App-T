import { MessageCircle, Mail } from 'lucide-react';
import type { Lang } from '../i18n';
import type { BaseRecord } from '../types';
import { buildReport, buildEmailSubject } from '../report';
import { shareWhatsApp, shareEmail } from '../utils';

export function ShareButtons({ record, lang }: { record: BaseRecord; lang: Lang }) {
  return (
    <div className="flex gap-1">
      <button
        type="button"
        title="WhatsApp"
        onClick={() => shareWhatsApp(buildReport(record, lang))}
        className="p-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition"
      >
        <MessageCircle size={16} />
      </button>
      <button
        type="button"
        title="Email"
        onClick={() => shareEmail(buildEmailSubject(record, lang), buildReport(record, lang))}
        className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
      >
        <Mail size={16} />
      </button>
    </div>
  );
}
