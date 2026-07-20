import { useState, useEffect, useRef } from 'react';
import { Lock, Download, Globe, LogOut, ShieldCheck } from 'lucide-react';
import { PharmacyTemplateConfig } from './config';
import { translations, type Lang } from './i18n';
import { ShiftSection } from './sections/ShiftSection';
import { MedRepSection } from './sections/MedRepSection';
import { PediatricSection } from './sections/PediatricSection';
import { ColdChainSection } from './sections/ColdChainSection';
import { SubstitutesSection } from './sections/SubstitutesSection';
import { ShortageSection } from './sections/ShortageSection';
import { ExpensesSection } from './sections/ExpensesSection';
import { MapsSection } from './sections/MapsSection';
import { NetworkSection } from './sections/NetworkSection';
import { CaptainSection } from './sections/CaptainSection';
import { AdminPanel } from './components/AdminPanel';

export default function App() {
  const [lang, setLang] = useState<Lang>('ar');
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [pwErr, setPwErr] = useState(false);
  const [tab, setTab] = useState('shift');
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminPw, setAdminPw] = useState('');
  const [adminPrompt, setAdminPrompt] = useState(false);
  const [adminErr, setAdminErr] = useState(false);
  const installRef = useRef<any>(null);

  const t = translations[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = t.dir;
  }, [lang, t.dir]);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      installRef.current = e;
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  function doInstall() {
    if (!installRef.current) {
      alert(lang === 'ar' ? 'التثبيت غير متاح على هذا المتصفح' : 'Install not available on this browser');
      return;
    }
    installRef.current.prompt();
  }

  function login() {
    if (pw === PharmacyTemplateConfig.staffPassword) {
      setAuthed(true); setPwErr(false); setPw('');
    } else setPwErr(true);
  }

  function adminLogin() {
    if (adminPw === PharmacyTemplateConfig.ownerPassword) {
      setAdminOpen(true); setAdminPrompt(false); setAdminErr(false); setAdminPw('');
    } else setAdminErr(true);
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#4169E1]/10 via-white to-[#006064]/10 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-slate-200 p-8">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4169E1] to-[#006064] grid place-items-center text-white mb-3 shadow-lg">
              <Lock size={28} />
            </div>
            <h1 className="text-xl font-extrabold text-[#006064]">{lang === 'ar' ? PharmacyTemplateConfig.pharmacyNameAR : PharmacyTemplateConfig.pharmacyNameEN}</h1>
            <p className="text-sm text-slate-500 mt-1">{t.tagline}</p>
          </div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t.staffPassword}</label>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && login()}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4169E1]"
            autoFocus
          />
          {pwErr && <p className="text-xs text-red-600 mt-2">{t.wrongPassword}</p>}
          <button onClick={login} className="mt-4 w-full rounded-lg bg-[#4169E1] py-2.5 text-sm font-semibold text-white hover:bg-[#3556c9] transition">
            {t.enter}
          </button>
          <div className="mt-6 flex items-center justify-between">
            <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-[#4169E1]">
              <Globe size={14} /> {t.language}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4169E1] to-[#006064] grid place-items-center text-white shrink-0">
              <span className="text-lg">✚</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-extrabold text-[#006064] truncate">{lang === 'ar' ? PharmacyTemplateConfig.pharmacyNameAR : PharmacyTemplateConfig.pharmacyNameEN}</h1>
              <p className="text-[11px] text-slate-500 truncate">{t.tagline}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={doInstall} className="inline-flex items-center gap-1.5 rounded-lg bg-[#006064] px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-[#004f53] transition">
              <Download size={14} /> <span className="hidden sm:inline">{t.installApp}</span>
            </button>
            <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition">
              <Globe size={14} /> {t.language}
            </button>
            <button onClick={() => setAuthed(false)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition">
              <LogOut size={14} /> <span className="hidden sm:inline">{t.logout}</span>
            </button>
          </div>
        </div>
        {/* Tabs */}
        <nav className="max-w-7xl mx-auto px-2 pb-2 flex gap-1 overflow-x-auto">
          {t.tabs.map((tabItem) => (
            <button
              key={tabItem.id}
              onClick={() => setTab(tabItem.id)}
              className={`shrink-0 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                tab === tabItem.id
                  ? 'bg-[#4169E1] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{tabItem.icon}</span> {tabItem.label}
            </button>
          ))}
        </nav>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 py-5">
        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-4 sm:p-6">
          {tab === 'shift' && <ShiftSection lang={lang} />}
          {tab === 'rep' && <MedRepSection lang={lang} />}
          {tab === 'pediatric' && <PediatricSection lang={lang} />}
          {tab === 'cold' && <ColdChainSection lang={lang} />}
          {tab === 'substitutes' && <SubstitutesSection lang={lang} />}
          {tab === 'shortage' && <ShortageSection lang={lang} />}
          {tab === 'expenses' && <ExpensesSection lang={lang} />}
          {tab === 'maps' && <MapsSection lang={lang} />}
          {tab === 'network' && <NetworkSection lang={lang} />}
          {tab === 'captain' && <CaptainSection lang={lang} />}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-6 text-center">
        <button
          onClick={() => setAdminPrompt(true)}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-[#4169E1] transition"
        >
          <ShieldCheck size={13} /> {t.adminLogin}
        </button>
        <p className="mt-2 text-[11px] text-slate-400">
          {lang === 'ar' ? PharmacyTemplateConfig.pharmacyNameAR : PharmacyTemplateConfig.pharmacyNameEN} · {new Date().getFullYear()}
        </p>
      </footer>

      {/* Admin prompt */}
      {adminPrompt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm grid place-items-center p-4" onClick={() => setAdminPrompt(false)}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-[#006064] mb-3">{t.adminLogin}</h3>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t.ownerPassword}</label>
            <input
              type="password"
              value={adminPw}
              onChange={(e) => setAdminPw(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && adminLogin()}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4169E1]"
              autoFocus
            />
            {adminErr && <p className="text-xs text-red-600 mt-2">{t.wrongPassword}</p>}
            <div className="mt-4 flex gap-2">
              <button onClick={adminLogin} className="flex-1 rounded-lg bg-[#4169E1] py-2 text-sm font-semibold text-white hover:bg-[#3556c9]">{t.enter}</button>
              <button onClick={() => setAdminPrompt(false)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">{t.cancel}</button>
            </div>
          </div>
        </div>
      )}

      {adminOpen && <AdminPanel lang={lang} onClose={() => setAdminOpen(false)} />}
    </div>
  );
}
