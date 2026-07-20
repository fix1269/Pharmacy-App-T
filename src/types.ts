export type SectionId =
  | 'shift'
  | 'rep'
  | 'cold'
  | 'shortage'
  | 'expenses'
  | 'captain'
  | 'network'
  | 'pediatric';

export type BaseRecord = {
  id: string;
  section: SectionId;
  year: number;
  month: number; // 1-12
  timestamp: string; // ISO
  data: Record<string, unknown>;
};

export type DoctorRecord = {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  address: string;
  mapsUrl?: string;
  createdAt: string;
};

export type SubstituteRecord = {
  id: string;
  drugName: string;
  activeIngredient: string;
  price: number;
  createdAt: string;
};

export type StaffRecord = {
  id: string;
  photo: string; // base64
  fullName: string;
  mobile: string;
  jobTitle: string;
  nationalId: string;
  address: string;
  salary: string;
  attachments: string[]; // base64 array
  attendance: { date: string; clockIn?: string; clockOut?: string }[];
  violations: string;
  bonuses: string;
  evaluation: string;
  createdAt: string;
};

export type CaptainRecord = BaseRecord & {
  data: {
    receiptNo: string;
    customerName: string;
    mobile: string;
    address: string;
    dispatchTime: string;
    deliveredAt?: string;
    durationMinutes?: number;
  };
};
