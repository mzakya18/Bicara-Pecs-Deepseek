import { CalendarDays, FileImage, ListOrdered, Zap, FileEdit, FolderOpen, History, ShieldAlert } from 'lucide-react';

export default function ToolsPage({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const tools = [
    { id: 'schedule', title: 'Buat Jadwal', desc: 'Buat urutan aktivitas harian.', icon: <CalendarDays size={28} />, color: 'bg-green-100 text-green-600' },
    { id: 'list_schedule', title: 'Daftar Jadwal', desc: 'Lihat jadwal tersimpan.', icon: <FolderOpen size={28} />, color: 'bg-emerald-100 text-emerald-600' },
    { id: 'sequence', title: 'Buat Urutan', desc: 'Buat langkah-langkah aktivitas.', icon: <ListOrdered size={28} />, color: 'bg-purple-100 text-purple-600' },
    { id: 'list_sequence', title: 'Daftar Urutan', desc: 'Lihat urutan tersimpan.', icon: <FolderOpen size={28} />, color: 'bg-fuchsia-100 text-fuchsia-600' },
    { id: 'pecs_generator', title: 'PECS Generator', desc: 'Cetak kartu PECS 5x5 cm.', icon: <FileImage size={28} />, color: 'bg-orange-100 text-orange-600' },
    { id: 'cause_effect', title: 'Sebab & Akibat', desc: 'Latihan interaktif sentuh.', icon: <Zap size={28} />, color: 'bg-red-100 text-red-600' },
    { id: 'worksheet', title: 'Worksheet', desc: 'Cetak lembar kerja.', icon: <FileEdit size={28} />, color: 'bg-teal-100 text-teal-600' },
    { id: 'history', title: 'Riwayat Kata', desc: 'Lihat kata yang sering dipakai.', icon: <History size={28} />, color: 'bg-blue-100 text-blue-600' },
    { id: 'emergency_id', title: 'ID Darurat', desc: 'Buat QR Code identitas darurat anak.', icon: <ShieldAlert size={28} />, color: 'bg-rose-100 text-rose-600' },
  ];

  return (
    <div className="p-4 pb-24 max-w-md mx-auto">
      <h1 className="text-xl font-bold text-slate-800 mt-4 mb-4">Menu Fitur</h1>
      <div className="grid grid-cols-2 gap-3">
        {tools.map(tool => (
          <button key={tool.id} onClick={() => onNavigate(tool.id)} className="bg-white p-4 rounded-2xl shadow-sm flex flex-col items-start gap-2 active:scale-95 border border-slate-100">
            <div className={`p-2 rounded-xl ${tool.color}`}>{tool.icon}</div>
            <div className="text-left">
              <h3 className="font-bold text-slate-800 text-sm">{tool.title}</h3>
              <p className="text-[10px] text-slate-500">{tool.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
