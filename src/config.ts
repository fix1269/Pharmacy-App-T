// Central white-label configuration. Reconfigure here for resale.
export const PharmacyTemplateConfig = {
  pharmacyNameEN: 'Dr. Mina Maurice Virtual Pharmacy',
  pharmacyNameAR: 'صيدلية د. مينا موريس الافتراضية',
  staffPassword: '123457',
  ownerPassword: '123',
  currency: 'EGP',
  timezone: 'Africa/Cairo',
  colors: {
    royal: '#4169E1',
    teal: '#006064',
  },
  firebaseConfig: {
      apiKey: "AIzaSyCtKWlsoIIryDL2p4MrQsILBi4L-zq1og4",
  authDomain: "t-pharmacy-app.firebaseapp.com",
  projectId: "t-pharmacy-app",
  storageBucket: "t-pharmacy-app.firebasestorage.app",
  messagingSenderId: "1089067162887",
  appId: "1:1089067162887:web:7a9a9aeffd0c86148bf9a2",
  measurementId: "G-EWGPWCQKVY"

  },
};

export const isFirebaseConfigured = () =>
  !!PharmacyTemplateConfig.firebaseConfig.apiKey &&
  !PharmacyTemplateConfig.firebaseConfig.apiKey.startsWith('YOUR_');
