import { useState } from 'react';
import { ArrowLeft, Printer, Copy, ShieldAlert } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { FLAGS, packData, normalizePhone } from '../utils/emergencyUtils';

export default function EmergencyIdPage({ onBack }: { onBack: () => void }) {
  const [form, setForm] = useState({ n: '', k: '', i: '', u: '', w: '', cn: '', cw: '', f: 0 });
  const [qrUrl, setQrUrl] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.n || !form.k || !form.u || !form.w) return alert('Lengkapi data wajib!');
    
    // Perbaikan format nomor telepon
    const formattedForm = { ...form, w: normalizePhone(form.w) };
    
    const payload = await packData(formattedForm);
    const url = window.location.origin + window.location.pathname + '#emergency=' + payload;
    setQrUrl(url);
  };

  const copyLink = () => {
    if (qrUrl) {
      navigator.clipboard.writeText(qrUrl);
      alert('Tautan disalin!');
    }
  };

  return (
    <div className="pb-24 max-w-md mx-auto">
      <header className="no-print bg-white p-3 shadow-sm flex items-center gap-3 sticky top-0 z-10">
        <button onClick={onBack} className="p-2 bg-slate-100 rounded-full"><ArrowLeft size={20} /></button>
        <h1 className="text-lg font-bold text-slate-800 flex-1">ID Darurat Anak</h1>
      </header>

      {!qrUrl ? (
        <form onSubmit={handleGenerate} className="no-print p-4 space-y-4">
          <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm mb-4 flex gap-2">
            <ShieldAlert size={24} className="flex-shrink-0" />
            <p>Data ini akan tertanam di dalam QR Code. Siapa pun yang memindai QR dapat melihat data ini.</p>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Nama Panggilan Anak *</label>
            <input type="text" value={form.n} onChange={e => setForm({...form, n: e.target.value})} className="w-full border-2 border-slate-200 rounded-lg p-2" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Kota *</label>
            <input type="text" value={form.k} onChange={e => setForm({...form, k: e.target.value})} className="w-full border-2 border-slate-200 rounded-lg p-2" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Kondisi Khusus (Opsional)</label>
            <div className="space-y-2 mt-2">
              {FLAGS.map((flag, idx) => (
                <label key={idx} className="flex items-start gap-2 text-sm">
                  <input type="checkbox" checked={(form.f & (1 << idx)) !== 0} 
                    onChange={(e) => {
                      const newF = e.target.checked ? form.f | (1 << idx) : form.f & ~(1 << idx);
                      setForm({...form, f: newF});
                    }} className="mt-1" />
                  <span>{flag}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Catatan Tambahan</label>
            <textarea value={form.i} onChange={e => setForm({...form, i: e.target.value})} className="w-full border-2 border-slate-200 rounded-lg p-2" rows={3} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Nama Kontak Utama *</label>
            <input type="text" value={form.u} onChange={e => setForm({...form, u: e.target.value})} className="w-full border-2 border-slate-200 rounded-lg p-2" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">No WhatsApp Utama *</label>
            <input type="tel" value={form.w} onChange={e => setForm({...form, w: e.target.value})} className="w-full border-2 border-slate-200 rounded-lg p-2" placeholder="0812..." />
          </div>
          <button type="submit" className="w-full bg-red-600 text-white font-bold py-3 rounded-xl mt-6">Buat QR Code Darurat</button>
        </form>
      ) : (
        <div className="p-4 flex flex-col items-center">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 flex flex-col items-center">
            <h2 className="text-xl font-bold text-slate-800 mb-2">QR Code Siap</h2>
            <p className="text-sm text-slate-500 mb-6 text-center">Cetak dan tempelkan di tas atau baju anak.</p>
            <div className="bg-white p-2 rounded-xl">
              <QRCodeSVG value={qrUrl} size={250} />
            </div>
            <button onClick={copyLink} className="no-print mt-6 w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl">
              <Copy size={20} /> Salin Tautan
            </button>
            <button onClick={() => window.print()} className="no-print mt-2 w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 rounded-xl">
              <Printer size={20} /> Cetak QR
            </button>
            <button onClick={() => setQrUrl(null)} className="no-print mt-4 text-sm text-slate-500 font-bold underline">Buat Ulang Data</button>
          </div>
        </div>
      )}
    </div>
  );
}
