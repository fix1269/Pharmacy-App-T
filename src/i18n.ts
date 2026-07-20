export type Lang = 'ar' | 'en';

export type Dict = {
  dir: 'rtl' | 'ltr';
  appTitle: string;
  tagline: string;
  staffLogin: string;
  staffPassword: string;
  enter: string;
  wrongPassword: string;
  adminLogin: string;
  ownerPassword: string;
  adminPanel: string;
  logout: string;
  installApp: string;
  language: string;
  save: string;
  add: string;
  cancel: string;
  edit: string;
  delete: string;
  print: string;
  shareWhatsapp: string;
  shareEmail: string;
  search: string;
  delivered: string;
  pending: string;
  totalMonthly: string;
  noRecords: string;
  confirmDelete: string;
  year: string;
  month: string;
  close: string;
  saved: string;
  error: string;
  required: string;
  // Sections
  tabs: { id: string; label: string; icon: string }[];
  // Section 1
  shiftHandover: string;
  drawerCash: string;
  pettyExpenses: string;
  pendingOrders: string;
  urgentShortages: string;
  notes: string;
  // Section 2
  medRep: string;
  repName: string;
  companyName: string;
  distributionTarget: string;
  freeSamples: string;
  bonus: string;
  // Section 3
  pediatric: string;
  childWeight: string;
  syrupSearch: string;
  safeDose: string;
  alternatives: string;
  clinicalWarning: string;
  // Section 4
  coldChain: string;
  fridgeTemp: string;
  acStatus: string;
  working: string;
  notWorking: string;
  tempAlert: string;
  // Section 5
  substitutes: string;
  drugSearch: string;
  price: string;
  variance: string;
  substituteWarning: string;
  noSubstitutes: string;
  // Section 6
  shortage: string;
  missingProducts: string;
  requestedQty: string;
  distributor: string;
  // Section 7
  expenses: string;
  amountPaid: string;
  staffResponsible: string;
  expenseCategory: string;
  details: string;
  // Section 8
  maps: string;
  nearestPharmacy: string;
  nearestHospital: string;
  nearestLab: string;
  nearestRadiology: string;
  nearestInsurance: string;
  // Section 9
  network: string;
  doctorName: string;
  specialty: string;
  phone: string;
  address: string;
  addDoctor: string;
  sendToPatient: string;
  // Section 10
  captain: string;
  receiptNo: string;
  customerName: string;
  mobile: string;
  deliveryAddress: string;
  dispatchTime: string;
  duration: string;
  liveDeliveries: string;
  markDelivered: string;
  // Admin
  staffLedger: string;
  staffPhoto: string;
  fullName: string;
  jobTitle: string;
  nationalId: string;
  residentialAddress: string;
  salaryStructure: string;
  attachments: string;
  attendance: string;
  ownerEvaluation: string;
  clockIn: string;
  clockOut: string;
  violations: string;
  bonuses: string;
  substitutesEditor: string;
  activeIngredient: string;
  addSubstitute: string;
  drugName: string;
  monthlyArchive: string;
  selectYear: string;
  allYears: string;
};

export const translations: Record<Lang, Dict> = {
  ar: {
    dir: 'rtl',
    appTitle: PharmacyTemplateConfig.pharmacyNameAR,
    tagline: 'نظام التشغيل المتكامل للصيدلية',
    staffLogin: 'دخول الموظف',
    staffPassword: 'كلمة سر الموظف',
    enter: 'دخول',
    wrongPassword: 'كلمة السر غير صحيحة',
    adminLogin: 'دخول الإدارة',
    ownerPassword: 'كلمة سر المالك',
    adminPanel: 'الإدارة',
    logout: 'خروج',
    installApp: 'تثبيت التطبيق',
    language: 'English',
    save: 'حفظ',
    add: 'إضافة',
    cancel: 'إلغاء',
    edit: 'تعديل',
    delete: 'حذف',
    print: 'طباعة',
    shareWhatsapp: 'مشاركة واتساب',
    shareEmail: 'مشاركة بريد',
    search: 'بحث',
    delivered: 'تم التوصيل',
    pending: 'قيد التنفيذ',
    totalMonthly: 'إجمالي المصروفات الشهرية',
    noRecords: 'لا توجد سجلات',
    confirmDelete: 'هل أنت متأكد من الحذف؟',
    year: 'السنة',
    month: 'الشهر',
    close: 'إغلاق',
    saved: 'تم الحفظ بنجاح',
    error: 'حدث خطأ',
    required: 'هذا الحقل مطلوب',
    tabs: [
      { id: 'shift', label: 'تسليم الوردية', icon: '🔄' },
      { id: 'rep', label: 'مندوبون وعينات', icon: '🎁' },
      { id: 'pediatric', label: 'جرعات الأطفال', icon: '🧮' },
      { id: 'cold', label: 'سلسلة التبريد', icon: '🌡️' },
      { id: 'substitutes', label: 'البديل الذكي', icon: '💊' },
      { id: 'shortage', label: 'نواقص المخزن', icon: '📋' },
      { id: 'expenses', label: 'المصروفات', icon: '📊' },
      { id: 'maps', label: 'خرائط طبية', icon: '🌐' },
      { id: 'network', label: 'شبكة الأطباء', icon: '🏥' },
      { id: 'captain', label: 'مدير التوصيل', icon: '🏍️' },
    ],
    shiftHandover: 'تسليم الوردية',
    drawerCash: 'نقدية الدرج (ج.م)',
    pettyExpenses: 'مصروفات نثرية (ج.م)',
    pendingOrders: 'طلبات معلقة',
    urgentShortages: 'نواقص عاجلة جداً للشفت القادم',
    notes: 'ملاحظات',
    medRep: 'متابعة مندوبي الشركات والعينات',
    repName: 'اسم المندوب',
    companyName: 'اسم الشركة',
    distributionTarget: 'جهة التوزيع',
    freeSamples: 'عينات مجانية',
    bonus: 'مكافأة',
    pediatric: 'محرك جرعات الأطفال والبدائل',
    childWeight: 'وزن الطفل (كجم)',
    syrupSearch: 'اكتب اسم الشراب التجاري',
    safeDose: 'الجرعة الآمنة',
    alternatives: 'البدائل الجنيسة على الرف',
    clinicalWarning:
      '⚠️ تنبيه مهني هام للصيدلي المناوب: هذه الجرعة استرشادية ومحسوبة رياضياً بناءً على الوزن والتركيز المعتاد؛ يجب عليك دائماً مراجعة النشرة الداخلية للدواء (The Internal Medicine Leaflet) والمطابقة السريرية قبل تأكيد الجرعة أو صرفها. لا تصف أو تؤكد أي جرعة إلا إذا كنت متأكداً 100%.',
    coldChain: 'مراقبة سلسلة التبريد والتكييف',
    fridgeTemp: 'حرارة الثلاجة (°م)',
    acStatus: 'حالة التكييف',
    working: 'يعمل',
    notWorking: 'لا يعمل',
    tempAlert: 'تنبيه: الحرارة خارج النطاق الآمن!',
    substitutes: 'الباحث الذكي عن البديل',
    drugSearch: 'ابحث عن دواء ناقص',
    price: 'السعر',
    variance: 'الفرق',
    substituteWarning:
      'تنبيه: يجب مراجعة تركيز المادة الفعالة من النشرة الداخلية قبل صرف البديل. تأكد من التركيز والشكل الدوائي.',
    noSubstitutes: 'لا توجد بدائل متاحة',
    shortage: 'تسجيل نواقص الصيدلية اليومية',
    missingProducts: 'المنتجات الناقصة (سطر لكل منتج)',
    requestedQty: 'الكمية المطلوبة',
    distributor: 'شركة التوزيع المفضلة',
    expenses: 'الصندوق النثري ومصروفات التشغيل',
    amountPaid: 'المبلغ المدفوع (ج.م)',
    staffResponsible: 'الموظف المسؤول',
    expenseCategory: 'فئة المصروف',
    details: 'التفاصيل والبيان',
    maps: 'محرك البحث المباشر عن الخرائط',
    nearestPharmacy: 'أقرب صيدلية',
    nearestHospital: 'أقرب مستشفى',
    nearestLab: 'أقرب معمل',
    nearestRadiology: 'أقرب مركز أشعة',
    nearestInsurance: 'أقرب فرع تأمين صحي',
    network: 'خريطة الشبكة الطبية المحلية',
    doctorName: 'اسم الطبيب',
    specialty: 'التخصص',
    phone: 'الهاتف',
    address: 'العنوان',
    addDoctor: 'إضافة طبيب',
    sendToPatient: 'إرسال للمريض',
    captain: 'مدير التوصيل والكابتن',
    receiptNo: 'رقم الإيصال',
    customerName: 'اسم العميل',
    mobile: 'الموبايل',
    deliveryAddress: 'العنوان السكني التفصيلي',
    dispatchTime: 'وقت الإرسال',
    duration: 'الوقت المستغرق بالتوصيل',
    liveDeliveries: 'التوصيلات الحية',
    markDelivered: 'تحديد كتم التوصيل',
    staffLedger: 'سجل الموارد البشرية',
    staffPhoto: 'صورة الموظف',
    fullName: 'الاسم الرباعي',
    jobTitle: 'المسمى الوظيفي',
    nationalId: 'الرقم القومي / العمر',
    residentialAddress: 'عنوان السكن',
    salaryStructure: 'هيكل راتب الوردية',
    attachments: 'المرفقات الرسمية',
    attendance: 'الحضور والمخالفات والمكافآت',
    ownerEvaluation: 'تقييم المالك',
    clockIn: 'تسجيل حضور',
    clockOut: 'تسجيل انصراف',
    violations: 'المخالفات',
    bonuses: 'المكافآت',
    substitutesEditor: 'محرر بدائل الأدوية',
    activeIngredient: 'المادة الفعالة',
    addSubstitute: 'إضافة بديل',
    drugName: 'اسم الدواء',
    monthlyArchive: 'الأرشيف الشهري',
    selectYear: 'اختر السنة',
    allYears: 'كل السنوات',
  },
  en: {
    dir: 'ltr',
    appTitle: PharmacyTemplateConfig.pharmacyNameEN,
    tagline: 'Integrated Pharmacy Operations Suite',
    staffLogin: 'Staff Login',
    staffPassword: 'Staff Password',
    enter: 'Enter',
    wrongPassword: 'Incorrect password',
    adminLogin: 'Admin Login',
    ownerPassword: 'Owner Password',
    adminPanel: 'Admin Panel',
    logout: 'Logout',
    installApp: 'Install App',
    language: 'العربية',
    save: 'Save',
    add: 'Add',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    print: 'Print',
    shareWhatsapp: 'WhatsApp Share',
    shareEmail: 'Email Share',
    search: 'Search',
    delivered: 'Delivered',
    pending: 'Pending',
    totalMonthly: 'Total Monthly Expenditures',
    noRecords: 'No records',
    confirmDelete: 'Are you sure you want to delete?',
    year: 'Year',
    month: 'Month',
    close: 'Close',
    saved: 'Saved successfully',
    error: 'An error occurred',
    required: 'This field is required',
    tabs: [
      { id: 'shift', label: 'Shift Handover', icon: '🔄' },
      { id: 'rep', label: 'Med Reps & Samples', icon: '🎁' },
      { id: 'pediatric', label: 'Pediatric Dosage', icon: '🧮' },
      { id: 'cold', label: 'Cold Chain', icon: '🌡️' },
      { id: 'substitutes', label: 'Substitute Finder', icon: '💊' },
      { id: 'shortage', label: 'Shortage Logger', icon: '📋' },
      { id: 'expenses', label: 'Petty Cash', icon: '📊' },
      { id: 'maps', label: 'Maps Search', icon: '🌐' },
      { id: 'network', label: 'Medical Network', icon: '🏥' },
      { id: 'captain', label: 'Captain Delivery', icon: '🏍️' },
    ],
    shiftHandover: 'Shift Handover Dashboard',
    drawerCash: 'Drawer Cash (EGP)',
    pettyExpenses: 'Petty Expenses (EGP)',
    pendingOrders: 'Pending Orders',
    urgentShortages: 'Urgent Shortages for Next Shift',
    notes: 'Notes',
    medRep: 'Medical Rep Sample & Bonus Tracker',
    repName: 'Rep Name',
    companyName: 'Company Name',
    distributionTarget: 'Distribution Target',
    freeSamples: 'Free Samples',
    bonus: 'Bonus',
    pediatric: 'Pediatric Dosage & Alternate Engine',
    childWeight: "Child's Weight (kg)",
    syrupSearch: 'Type any commercial pediatric syrup name',
    safeDose: 'Safe Dose',
    alternatives: 'Matching Generic Alternatives on Shelf',
    clinicalWarning:
      '⚠️ Important Professional Notice to the on-duty pharmacist: This dose is advisory and mathematically calculated based on weight and standard concentration; you must always review the internal medicine leaflet and confirm clinical compatibility before confirming or dispensing the dose. Do not prescribe or confirm any dose unless you are 100% certain.',
    coldChain: 'Cold Chain & Tech Monitor',
    fridgeTemp: 'Fridge Temperature (°C)',
    acStatus: 'AC Status',
    working: 'Working',
    notWorking: 'Not Working',
    tempAlert: 'Alert: Temperature outside safe range!',
    substitutes: 'Smart Drug Substitute Finder',
    drugSearch: 'Search for a missing drug',
    price: 'Price',
    variance: 'Variance',
    substituteWarning:
      'Warning: Always verify the active ingredient concentration from the internal medicine leaflet before dispensing an alternative. Confirm concentration and dosage form.',
    noSubstitutes: 'No substitutes available',
    shortage: 'Daily Pharmacy Shortage Logger',
    missingProducts: 'Missing Products (one per line)',
    requestedQty: 'Requested Quantity',
    distributor: 'Preferred Distributor',
    expenses: 'Petty Cash & Ops Expenses',
    amountPaid: 'Amount Paid (EGP)',
    staffResponsible: 'Staff Responsible',
    expenseCategory: 'Expense Category',
    details: 'Details & Statement',
    maps: 'Five-Fold Direct Maps Search Engine',
    nearestPharmacy: 'Nearest Pharmacy',
    nearestHospital: 'Nearest Hospital',
    nearestLab: 'Nearest Lab',
    nearestRadiology: 'Nearest Radiology Center',
    nearestInsurance: 'Nearest Health Insurance Branch',
    network: 'Local Medical Network Map',
    doctorName: 'Doctor Name',
    specialty: 'Specialty',
    phone: 'Phone',
    address: 'Address',
    addDoctor: 'Add Doctor',
    sendToPatient: 'Send to Patient',
    captain: 'Captain Delivery Manager',
    receiptNo: 'Receipt Number',
    customerName: 'Customer Name',
    mobile: 'Mobile Phone',
    deliveryAddress: 'Detailed Residential Address',
    dispatchTime: 'Dispatch Time',
    duration: 'Duration of Delivery',
    liveDeliveries: 'Live Deliveries',
    markDelivered: 'Mark Delivered',
    staffLedger: 'Staff HR Ledger',
    staffPhoto: 'Staff Photo',
    fullName: 'Full Quadruple Name',
    jobTitle: 'Operational Job Title',
    nationalId: 'National ID / Age',
    residentialAddress: 'Residential Address',
    salaryStructure: 'Shift Salary Structure',
    attachments: 'Official Attachments',
    attendance: 'Attendance, Violations & Bonuses',
    ownerEvaluation: "Owner's Evaluation",
    clockIn: 'Clock In',
    clockOut: 'Clock Out',
    violations: 'Violations',
    bonuses: 'Bonuses',
    substitutesEditor: 'Substitutes Editor',
    activeIngredient: 'Active Ingredient',
    addSubstitute: 'Add Substitute',
    drugName: 'Drug Name',
    monthlyArchive: 'Monthly Archive',
    selectYear: 'Select Year',
    allYears: 'All Years',
  },
};

// Importing here to avoid circular imports in App
import { PharmacyTemplateConfig } from './config';
