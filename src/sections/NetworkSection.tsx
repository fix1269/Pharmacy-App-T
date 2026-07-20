import { useState, useEffect } from 'react';
import { Plus, Trash2, MessageCircle, MapPin } from 'lucide-react';
import type { Lang } from '../i18n';
import { translations } from '../i18n';
import type { DoctorRecord } from '../types';
import { saveDoctor, deleteDoctor, loadDoctors } from '../db';
import { uid, shareWhatsApp } from '../utils';
import { Field, SaveButton, inputCls, textareaCls } from './ShiftSection';

export function NetworkSection({ lang }: { lang: Lang }) {
  const t = translations[lang];
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [mapsUrl, setMapsUrl] = useState('');
  const [doctors, setDoctors] = useState<DoctorRecord[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadDoctors().then(setDoctors); }, []);

  async function add() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const d: DoctorRecord = {
        id: uid(),
        name, specialty, phone, address, mapsUrl,
        createdAt: new Date().toISOString(),
      };
      await saveDoctor(d);
      setName(''); setSpecialty(''); setPhone(''); setAddress(''); setMapsUrl('');
      await loadDoctors().then(setDoctors);
    } catch (e) {
      console.error('[network] doctor save failed', e);
    } finally {
      setSaving(false);
    }
  }

  function sendToPatient(d: DoctorRecord) {
    const text = lang === 'ar'
      ? `*${d.name}*\nالتخصص: ${d.specialty}\nالهاتف: ${d.phone}\nالعنوان: ${d.address}${d.mapsUrl ? `\nالموقع: ${d.mapsUrl}` : ''}`
      : `*${d.name}*\nSpecialty: ${d.specialty}\nPhone: ${d.phone}\nAddress: ${d.address}${d.mapsUrl ? `\nLocation: ${d.mapsUrl}` : ''}`;
    shareWhatsApp(text);
  }

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-[#006064]">{t.network}</h2>

      <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 shadow-sm">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label={t.doctorName}><input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} /></Field>
          <Field label={t.specialty}><input value={specialty} onChange={(e) => setSpecialty(e.target.value)} className={inputCls} /></Field>
          <Field label={t.phone}><input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} /></Field>
          <Field label={t.address}><input value={address} onChange={(e) => setAddress(e.target.value)} className={inputCls} /></Field>
        </div>
        <Field label="Google Maps URL"><input value={mapsUrl} onChange={(e) => setMapsUrl(e.target.value)} className={inputCls} placeholder="https://maps.google.com/..." /></Field>
        <SaveButton onClick={add} loading={saving} label={t.addDoctor} />
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {doctors.map((d) => (
          <div key={d.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-bold text-[#006064]">{d.name}</div>
                <div className="text-sm text-slate-600">{d.specialty}</div>
              </div>
              <button onClick={() => { if (confirm(t.confirmDelete)) { deleteDoctor(d.id).then(() => loadDoctors().then(setDoctors)); } }} className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100">
                <Trash2 size={16} />
              </button>
            </div>
            <div className="mt-2 text-sm text-slate-700 space-y-0.5">
              <div>📞 {d.phone}</div>
              <div>📍 {d.address}</div>
              {d.mapsUrl && <a href={d.mapsUrl} target="_blank" rel="noopener" className="text-[#4169E1] text-xs inline-flex items-center gap-1"><MapPin size={12} /> {lang === 'ar' ? 'فتح الخريطة' : 'Open map'}</a>}
            </div>
            <button onClick={() => sendToPatient(d)} className="mt-3 inline-flex items-center gap-2 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700">
              <MessageCircle size={14} /> {t.sendToPatient}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
