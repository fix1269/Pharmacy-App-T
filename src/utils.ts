import { PharmacyTemplateConfig } from './config';

const MONTHS_AR = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];
const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function nowInEgypt(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: PharmacyTemplateConfig.timezone }));
}

export function currentYear(): number {
  return nowInEgypt().getFullYear();
}
export function currentMonth(): number {
  return nowInEgypt().getMonth() + 1;
}

export function monthName(m: number, lang: 'ar' | 'en'): string {
  return (lang === 'ar' ? MONTHS_AR : MONTHS_EN)[m - 1] || '';
}

export function formatDate(iso: string, lang: 'ar' | 'en'): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-GB', {
      timeZone: PharmacyTemplateConfig.timezone,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function shareWhatsApp(text: string, phone?: string) {
  const base = `https://wa.me/${phone ? phone.replace(/[^0-9]/g, '') : ''}`;
  const url = `${base}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank', 'noopener');
}

export function shareEmail(subject: string, body: string) {
  const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = url;
}

export function minutesBetween(startIso: string, endIso: string): number {
  const a = new Date(startIso).getTime();
  const b = new Date(endIso).getTime();
  return Math.max(0, Math.round((b - a) / 60000));
}
