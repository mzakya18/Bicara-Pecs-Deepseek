import { CalendarDays } from 'lucide-react';

export default function ToolsPage({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const tools = [
    { id: 'schedule', title: 'Jadwal Kegiatan', desc: 'Buat urutan aktivitas harian anak.', icon: <CalendarDays size={28} />, color: 'bg-green-100 text-green-600' },
    // Fitur lain akan menyusul di sini
  ];

  return (
    <div className="p-4 pb-24 max-w-md mx-auto">
      <h1 className="text-xl font-bold text-slate-800 mt-4 mb-4">Menu Fitur Tambahan</h1>
      <div className="grid grid-cols-2 gap-4">
        {tools.map(tool => (
          <button 
            key={tool.id}
            onClick={() => onNavigate(tool.id)}
            className="bg-white p-4 rounded-2xl shadow-sm flex flex-col items-start gap-3 active:scale-95 transition-transform border border-slate-100"
          >
            <div className={`p-3 rounded-xl ${tool.color}`}>
              {tool.icon}
            </div>
            <div className="text-left">
              <h3 className="font-bold text-slate-800 text-sm">{tool.title}</h3>
              <p className="text-[10px] text-slate-500 mt-1">{tool.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
