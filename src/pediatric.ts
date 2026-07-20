// Egyptian pediatric syrup database (commercial name -> active ingredient + mg/ml concentration)
// Doses follow standard Egyptian pediatric references (weight-based).
export type PediatricDrug = {
  name: string;
  nameAr: string;
  ingredient: string;
  ingredientAr: string;
  mgPerMl: number; // concentration
  mgPerKgPerDose: number; // single dose
  dosesPerDay: number;
  maxDailyMl: number; // safety cap
};

export const PEDIATRIC_DRUGS: PediatricDrug[] = [
  { name: 'Augmentin', nameAr: 'أوجمنتين', ingredient: 'Amoxicillin + Clavulanic acid', ingredientAr: 'أموكسيسيلين + حمض كلافولانيك', mgPerMl: 31.25, mgPerKgPerDose: 12.5, dosesPerDay: 2, maxDailyMl: 30 },
  { name: 'Amoxiclav', nameAr: 'أموكسيسلاف', ingredient: 'Amoxicillin + Clavulanic acid', ingredientAr: 'أموكسيسيلين + حمض كلافولانيك', mgPerMl: 31.25, mgPerKgPerDose: 12.5, dosesPerDay: 2, maxDailyMl: 30 },
  { name: 'Cefixime', nameAr: 'سيفيكسيم', ingredient: 'Cefixime trihydrate', ingredientAr: 'سيفيكسيم ثلاثي الهيدرات', mgPerMl: 20, mgPerKgPerDose: 4, dosesPerDay: 2, maxDailyMl: 20 },
  { name: 'Ceftriaxone', nameAr: 'سيفترياكسون', ingredient: 'Ceftriaxone', ingredientAr: 'سيفترياكسون', mgPerMl: 100, mgPerKgPerDose: 25, dosesPerDay: 1, maxDailyMl: 10 },
  { name: 'Azithromycin', nameAr: 'أزيثرومايسين', ingredient: 'Azithromycin', ingredientAr: 'أزيثرومايسين', mgPerMl: 20, mgPerKgPerDose: 5, dosesPerDay: 1, maxDailyMl: 15 },
  { name: 'Zithromax', nameAr: 'زيثروماكس', ingredient: 'Azithromycin', ingredientAr: 'أزيثرومايسين', mgPerMl: 20, mgPerKgPerDose: 5, dosesPerDay: 1, maxDailyMl: 15 },
  { name: 'Clarimycin', nameAr: 'كلاريميسين', ingredient: 'Clarithromycin', ingredientAr: 'كلاريثرومايسين', mgPerMl: 25, mgPerKgPerDose: 7.5, dosesPerDay: 2, maxDailyMl: 20 },
  { name: 'Klacid', nameAr: 'كلاسيد', ingredient: 'Clarithromycin', ingredientAr: 'كلاريثرومايسين', mgPerMl: 25, mgPerKgPerDose: 7.5, dosesPerDay: 2, maxDailyMl: 20 },
  { name: 'Ibuprofen', nameAr: 'ايبوبروفين', ingredient: 'Ibuprofen', ingredientAr: 'ايبوبروفين', mgPerMl: 20, mgPerKgPerDose: 5, dosesPerDay: 3, maxDailyMl: 30 },
  { name: 'Brufen', nameAr: 'بروفين', ingredient: 'Ibuprofen', ingredientAr: 'ايبوبروفين', mgPerMl: 20, mgPerKgPerDose: 5, dosesPerDay: 3, maxDailyMl: 30 },
  { name: 'Paracetamol', nameAr: 'باراسيتامول', ingredient: 'Paracetamol', ingredientAr: 'باراسيتامول', mgPerMl: 32, mgPerKgPerDose: 10, dosesPerDay: 4, maxDailyMl: 30 },
  { name: 'Panadol', nameAr: 'بنادول', ingredient: 'Paracetamol', ingredientAr: 'باراسيتامول', mgPerMl: 32, mgPerKgPerDose: 10, dosesPerDay: 4, maxDailyMl: 30 },
  { name: 'Cetal', nameAr: 'سيتال', ingredient: 'Paracetamol', ingredientAr: 'باراسيتامول', mgPerMl: 32, mgPerKgPerDose: 10, dosesPerDay: 4, maxDailyMl: 30 },
  { name: 'Adol', nameAr: 'أدول', ingredient: 'Paracetamol', ingredientAr: 'باراسيتامول', mgPerMl: 32, mgPerKgPerDose: 10, dosesPerDay: 4, maxDailyMl: 30 },
  { name: 'Cetamol', nameAr: 'سيتامول', ingredient: 'Paracetamol', ingredientAr: 'باراسيتامول', mgPerMl: 32, mgPerKgPerDose: 10, dosesPerDay: 4, maxDailyMl: 30 },
  { name: 'Antinal', nameAr: 'أنتينال', ingredient: 'Nifuroxazide', ingredientAr: 'نيفوروكسازيد', mgPerMl: 20, mgPerKgPerDose: 5, dosesPerDay: 3, maxDailyMl: 15 },
  { name: 'Strepsils', nameAr: 'ستريبسيلس', ingredient: 'Amylmetacresol + Dichlorobenzyl alcohol', ingredientAr: 'أميل ميتا كريزول + ثنائي كلورو بنزيل كحول', mgPerMl: 2.4, mgPerKgPerDose: 0.6, dosesPerDay: 3, maxDailyMl: 6 },
  { name: 'Ventolin', nameAr: 'فينتولين', ingredient: 'Salbutamol', ingredientAr: 'سالبوتامول', mgPerMl: 0.4, mgPerKgPerDose: 0.15, dosesPerDay: 3, maxDailyMl: 10 },
  { name: 'Salbutamol', nameAr: 'سالبوتامول', ingredient: 'Salbutamol', ingredientAr: 'سالبوتامول', mgPerMl: 0.4, mgPerKgPerDose: 0.15, dosesPerDay: 3, maxDailyMl: 10 },
  { name: 'Cetirizine', nameAr: 'سيتيريزين', ingredient: 'Cetirizine', ingredientAr: 'سيتيريزين', mgPerMl: 1, mgPerKgPerDose: 0.2, dosesPerDay: 1, maxDailyMl: 10 },
  { name: 'Zyrtec', nameAr: 'زيرتك', ingredient: 'Cetirizine', ingredientAr: 'سيتيريزين', mgPerMl: 1, mgPerKgPerDose: 0.2, dosesPerDay: 1, maxDailyMl: 10 },
  { name: 'Allercet', nameAr: 'أليرسيت', ingredient: 'Cetirizine', ingredientAr: 'سيتيريزين', mgPerMl: 1, mgPerKgPerDose: 0.2, dosesPerDay: 1, maxDailyMl: 10 },
  { name: 'Ondansetron', nameAr: 'أوندانسيترون', ingredient: 'Ondansetron', ingredientAr: 'أوندانسيترون', mgPerMl: 0.8, mgPerKgPerDose: 0.15, dosesPerDay: 3, maxDailyMl: 8 },
  { name: 'Emetron', nameAr: 'إيميترون', ingredient: 'Ondansetron', ingredientAr: 'أوندانسيترون', mgPerMl: 0.8, mgPerKgPerDose: 0.15, dosesPerDay: 3, maxDailyMl: 8 },
  { name: 'Flagyl', nameAr: 'فلاجيل', ingredient: 'Metronidazole', ingredientAr: 'ميترونيدازول', mgPerMl: 7.5, mgPerKgPerDose: 7.5, dosesPerDay: 3, maxDailyMl: 15 },
  { name: 'Metronidazole', nameAr: 'ميترونيدازول', ingredient: 'Metronidazole', ingredientAr: 'ميترونيدازول', mgPerMl: 7.5, mgPerKgPerDose: 7.5, dosesPerDay: 3, maxDailyMl: 15 },
  { name: 'Amoxil', nameAr: 'أموكسيل', ingredient: 'Amoxicillin', ingredientAr: 'أموكسيسيلين', mgPerMl: 50, mgPerKgPerDose: 12.5, dosesPerDay: 3, maxDailyMl: 30 },
  { name: 'Amoxicillin', nameAr: 'أموكسيسيلين', ingredient: 'Amoxicillin', ingredientAr: 'أموكسيسيلين', mgPerMl: 50, mgPerKgPerDose: 12.5, dosesPerDay: 3, maxDailyMl: 30 },
  { name: 'Fucidic Acid', nameAr: 'حمض الفوسيديك', ingredient: 'Fusidic acid', ingredientAr: 'حمض الفوسيديك', mgPerMl: 10, mgPerKgPerDose: 6, dosesPerDay: 2, maxDailyMl: 5 },
  { name: 'Fucidin', nameAr: 'فوسيدين', ingredient: 'Fusidic acid', ingredientAr: 'حمض الفوسيديك', mgPerMl: 10, mgPerKgPerDose: 6, dosesPerDay: 2, maxDailyMl: 5 },
  { name: 'Cough syrup', nameAr: 'شراب كحة', ingredient: 'Dextromethorphan', ingredientAr: 'ديكستروميثورفان', mgPerMl: 1, mgPerKgPerDose: 0.3, dosesPerDay: 3, maxDailyMl: 15 },
  { name: 'Tussistar', nameAr: 'توسيستار', ingredient: 'Dextromethorphan', ingredientAr: 'ديكستروميثورفان', mgPerMl: 1, mgPerKgPerDose: 0.3, dosesPerDay: 3, maxDailyMl: 15 },
];

export function findPediatricDrugs(query: string): PediatricDrug[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return PEDIATRIC_DRUGS.filter(
    (d) => d.name.toLowerCase().includes(q) || d.nameAr.includes(q) || d.ingredient.toLowerCase().includes(q),
  );
}

export function findAlternatives(drug: PediatricDrug): PediatricDrug[] {
  return PEDIATRIC_DRUGS.filter((d) => d.ingredient === drug.ingredient && d.name !== drug.name);
}

export function calculateDose(drug: PediatricDrug, weightKg: number) {
  const doseMg = drug.mgPerKgPerDose * weightKg;
  const doseMl = doseMg / drug.mgPerMl;
  const dailyMl = doseMl * drug.dosesPerDay;
  const capped = Math.min(dailyMl, drug.maxDailyMl);
  return {
    singleDoseMl: Math.round(doseMl * 100) / 100,
    dailyDoseMl: Math.round(capped * 100) / 100,
    dosesPerDay: drug.dosesPerDay,
  capped: dailyMl > drug.maxDailyMl,
  doseMg: Math.round(doseMg * 100) / 100,
  };
}
