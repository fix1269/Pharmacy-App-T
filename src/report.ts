import type { Lang } from './i18n';
import type { BaseRecord } from './types';
import { translations } from './i18n';
import { PharmacyTemplateConfig } from './config';
import { formatDate, monthName } from './utils';

// Build a bilingual report string for a single record
export function buildReport(record: BaseRecord, lang: Lang): string {
  const t = translations[lang];
  const pharmacy = lang === 'ar' ? PharmacyTemplateConfig.pharmacyNameAR : PharmacyTemplateConfig.pharmacyNameEN;
  const lines: string[] = [];
  lines.push(`*${pharmacy}*`);
  lines.push(lang === 'ar' ? `القسم: ${sectionLabel(record.section, lang)}` : `Section: ${sectionLabel(record.section, lang)}`);
  lines.push(lang === 'ar' ? `التاريخ: ${formatDate(record.timestamp, lang)}` : `Date: ${formatDate(record.timestamp, lang)}`);
  lines.push(lang === 'ar' ? `الشهر: ${monthName(record.month, lang)} ${record.year}` : `Month: ${monthName(record.month, lang)} ${record.year}`);
  lines.push('─────────────');
  for (const [k, v] of Object.entries(record.data)) {
    lines.push(`• ${fieldLabel(k, lang)}: ${formatValue(v, lang)}`);
  }
  // Append clinical warning for pediatric
  if (record.section === 'pediatric' && record.data.syrupName) {
    lines.push('─────────────');
    lines.push(translations[lang].clinicalWarning);
  }
  return lines.join('\n');
}

export function buildEmailSubject(record: BaseRecord, lang: Lang): string {
  const pharmacy = lang === 'ar' ? PharmacyTemplateConfig.pharmacyNameAR : PharmacyTemplateConfig.pharmacyNameEN;
  return `${pharmacy} - ${sectionLabel(record.section, lang)} - ${formatDate(record.timestamp, lang)}`;
}

function sectionLabel(section: string, lang: Lang): string {
  const tab = translations[lang].tabs.find((x) => x.id === section);
  return tab ? tab.label : section;
}

function fieldLabel(key: string, lang: Lang): string {
  const map: Record<string, Record<Lang, string>> = {
    drawerCash: { ar: 'نقدية الدرج', en: 'Drawer Cash' },
    pettyExpenses: { ar: 'مصروفات نثرية', en: 'Petty Expenses' },
    pendingOrders: { ar: 'طلبات معلقة', en: 'Pending Orders' },
    urgentShortages: { ar: 'نواقص عاجلة', en: 'Urgent Shortages' },
    notes: { ar: 'ملاحظات', en: 'Notes' },
    repName: { ar: 'اسم المندوب', en: 'Rep Name' },
    companyName: { ar: 'الشركة', en: 'Company' },
    distributionTarget: { ar: 'جهة التوزيع', en: 'Distribution Target' },
    freeSamples: { ar: 'عينات مجانية', en: 'Free Samples' },
    bonus: { ar: 'مكافأة', en: 'Bonus' },
    childWeight: { ar: 'وزن الطفل', en: "Child's Weight" },
    syrupName: { ar: 'اسم الشراب', en: 'Syrup Name' },
    safeDoseMl: { ar: 'الجرعة الآمنة (مل)', en: 'Safe Dose (ml)' },
    ingredient: { ar: 'المادة الفعالة', en: 'Active Ingredient' },
    fridgeTemp: { ar: 'حرارة الثلاجة', en: 'Fridge Temp' },
    acStatus: { ar: 'حالة التكييف', en: 'AC Status' },
    missingProducts: { ar: 'منتجات ناقصة', en: 'Missing Products' },
    requestedQty: { ar: 'الكمية المطلوبة', en: 'Requested Qty' },
    distributor: { ar: 'شركة التوزيع', en: 'Distributor' },
    amountPaid: { ar: 'المبلغ المدفوع', en: 'Amount Paid' },
    staffResponsible: { ar: 'الموظف المسؤول', en: 'Staff Responsible' },
    expenseCategory: { ar: 'فئة المصروف', en: 'Expense Category' },
    details: { ar: 'التفاصيل', en: 'Details' },
    receiptNo: { ar: 'رقم الإيصال', en: 'Receipt No' },
    customerName: { ar: 'اسم العميل', en: 'Customer' },
    mobile: { ar: 'الموبايل', en: 'Mobile' },
    address: { ar: 'العنوان', en: 'Address' },
    dispatchTime: { ar: 'وقت الإرسال', en: 'Dispatch Time' },
    deliveredAt: { ar: 'وقت التوصيل', en: 'Delivered At' },
    durationMinutes: { ar: 'المدة (دقيقة)', en: 'Duration (min)' },
    status: { ar: 'الحالة', en: 'Status' },
  };
  return (map[key]?.[lang]) || key;
}

function formatValue(v: unknown, lang: Lang): string {
  if (v == null || v === '') return '-';
  if (typeof v === 'number') return String(v);
  if (typeof v === 'boolean') return v ? (lang === 'ar' ? 'نعم' : 'Yes') : (lang === 'ar' ? 'لا' : 'No');
  return String(v);
}
