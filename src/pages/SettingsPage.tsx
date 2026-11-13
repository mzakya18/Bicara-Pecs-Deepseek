import { useRef } from 'react';
import { Download, Upload, ShieldCheck, Info, RefreshCw } from 'lucide-react';
import { exportData, importData } from '../utils/backup';
import { db } from '../db/database';
import { DEFAULT_CARDS } from '../data/defaultCards';

export default function SettingsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importData(file);
      e.target.value = '';
    }
  };

  const handleResetDefaults = async () => {
    if (confirm('Muat ulang kartu bawaan? Kartu buatan Anda sendiri tidak akan terhapus, hanya kartu bawaan yang akan diperbarui.')) {
      // Hapus hanya kartu yang bukan buatan user (isCustom === false atau undefined)
      const allCards = await db.cards.toArray();
      const customCards = allCards.filter(c => c.isCustom);
      
      await db.cards.clear();
      await db.cards.bulkAdd([...DEFAULT_CARDS, ...customCards]);
      
      alert('Kartu bawaan berhasil diperbarui dengan gambar baru!');
      window.location.reload();
    }
  };

  return (
    <div className="p-4 pb-24 max-w-md mx-auto">
      <div className="bg-white p-5 rounded-2xl shadow-sm mt-4">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Pengaturan & Data</h2>
        
        <div className="bg-blue-50 text-blue-800 p-4 rounded-xl mb-6 text-sm flex gap-3 items-start">
          <ShieldCheck className="flex-shrink-0 mt-0.5" size={20} />
          <p>Data Anda 100% tersimpan di perangkat ini secara offline. Tidak ada data yang dikirim ke server.</p>
        </div>

        <div className="space-y-3">
          <button 
            onClick={exportData}
            className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-4 rounded-xl transition-colors"
          >
            <Download size={20} /> Buat Cadangan (Export)
          </button>

          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-4 rounded-xl transition-colors"
          >
            <Upload size={20} /> Pulihkan Data (Import)
          </button>
          
          <input type="file" accept=".json" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

          <button 
            onClick={handleResetDefaults}
            className="w-full flex items-center justify-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold py-4 rounded-xl transition-colors mt-4"
          >
            <RefreshCw size={20} /> Muat Ulang Kartu Bawaan
          </button>
        </div>
      </div>

      <div className="mt-6 text-center text-slate-400 text-sm flex flex-col items-center gap-1">
        <Info size={16} />
        <p>Bicara PECS V2 &copy; 2024</p>
        <p>Dikembangkan untuk membantu komunikasi anak.</p>
      </div>
    </div>
  );
}
// ... (Kode atas biarkan sama) ...
      <div className="mt-8 text-center text-slate-400 text-xs flex flex-col items-center gap-1 pb-10">
        <p>Bicara PECS V2 &copy; 2024</p>
        <p>Dikembangkan untuk membantu komunikasi anak.</p>
        <div className="mt-4 p-3 bg-slate-100 rounded-lg text-[10px] text-slate-500">
          <p className="font-bold mb-1">Atribusi Aset:</p>
          <p>Simbol default menggunakan Emoji Standar.</p>
          <p>Integrasi simbol AAC menggunakan Mulberry Symbols (CC BY-SA 2.0).</p>
        </div>
      </div>
    </div>
  );
}
