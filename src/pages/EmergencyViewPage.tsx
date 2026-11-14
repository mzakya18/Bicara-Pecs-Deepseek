import { useState, useEffect } from 'react';
import { Phone, MessageCircle, MapPin, AlertTriangle } from 'lucide-react';
import { unpackData, flagsToLabels } from '../utils/emergencyUtils';

export default function EmergencyViewPage({ payload }: { payload: string }) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    unpackData(payload).then(setData).catch(() => setError(true));
  }, [payload]);

  if (error) return <div className="p-10 text-center text-red-600 font-bold">Data QR tidak valid atau rusak.</div>;
  if (!data) return <div className="p-10 text-center">Memuat data darurat...</div>;

  const handleGps = () => {
    if (!navigator.geolocation) return alert("GPS tidak tersedia.");
    navigator.geolocation.getCurrentPosition((pos) => {
      const maps = `https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`;
      const msg = `Saya menemukan ${data.n} di sini: ${maps}`;
      window.location.href = `https://wa.me/${data.w}?text=${encodeURIComponent(msg)}`;
    });
  };

  return (
    <div className="min-h-screen bg-red-50 p-4 max-w-md mx-auto">
      <div className="bg-red-600 text-white p-4 rounded-t-2xl text-center shadow-md">
        <AlertTriangle className="mx-auto mb-2" size={40} />
        <h1 className="text-xl font-bold">IDENTITAS DARURAT ANAK</h1>
      </div>

      <div className="bg-white p-6 rounded-b-2xl shadow-lg mb-4 text-center">
        <h2 className="text-3xl font-black text-slate-800 mb-1">{data.n}</h2>
        <p className="text-slate-500 font-bold mb-4">{data.k}</p>
        <div className="bg-red-50 text-red-800 p-3 rounded-xl text-sm mb-4 text-left">
          <p className="font-bold mb-1">Kondisi Khusus:</p>
          <ul className="list-disc pl-5">
            {flagsToLabels(data.f).map((l: string, i: number) => <li key={i}>{l}</li>)}
          </ul>
          {data.i && <p className="mt-2 italic">"{data.i}"</p>}
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-lg space-y-3">
        <h3 className="font-bold text-slate-800 text-center mb-2">Hubungi Orang Tua/Wali</h3>
        <p className="text-center font-bold text-lg text-slate-700 mb-4">{data.u}</p>
        <a href={`tel:+${data.w}`} className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-4 rounded-xl shadow-md">
          <Phone size={24} /> Telepon Sekarang
        </a>
        <a href={`https://wa.me/${data.w}?text=${encodeURIComponent(`Halo, saya menemukan ${data.n}.`)}`} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-4 rounded-xl shadow-md">
          <MessageCircle size={24} /> Kirim WhatsApp
        </a>
        <button onClick={handleGps} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-4 rounded-xl shadow-md">
          <MapPin size={24} /> Kirim Lokasi Saya
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-center text-sm font-bold">
        <a href="tel:112" className="bg-white p-3 rounded-xl shadow-sm text-red-600">Darurat: 112</a>
        <a href="tel:110" className="bg-white p-3 rounded-xl shadow-sm text-red-600">Polisi: 110</a>
      </div>
      <p className="text-center text-xs text-slate-400 mt-6 pb-10">Dibuat dengan Bicara PECS</p>
    </div>
  );
}
