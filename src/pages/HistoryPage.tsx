import { ArrowLeft, Trash2 } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';

export default function HistoryPage({ onBack }: { onBack: () => void }) {
  // Ambil riwayat 24 jam terakhir
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  const history = useLiveQuery(() => 
    db.history.where('timestamp').above(oneDayAgo).reverse().toArray()
  ) || [];

  const clearHistory = async () => {
    if (confirm('Hapus semua riwayat?')) await db.history.clear();
  };

  return (
    <div className="pb-24">
      <header className="bg-white p-3 shadow-sm flex items-center gap-3 sticky top-0 z-10">
        <button onClick={onBack} className="p-2 bg-slate-100 rounded-full"><ArrowLeft size={20} /></button>
        <h1 className="text-lg font-bold text-slate-800 flex-1">Riwayat Kata (24 Jam)</h1>
        <button onClick={clearHistory} className="p-2 text-red-500 bg-red-50 rounded-full"><Trash2 size={20} /></button>
      </header>

      <div className="p-4 space-y-2">
        {history.length === 0 ? (
          <p className="text-center text-slate-400 mt-10">Belum ada riwayat hari ini.</p>
        ) : (
          history.map((item) => (
            <div key={item.id} className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center">
              <span className="font-bold text-slate-700">{item.word}</span>
              <span className="text-xs text-slate-400">
                {new Date(item.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
