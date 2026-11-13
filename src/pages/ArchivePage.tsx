import { useState } from 'react';
import { ArrowLeft, Trash2, Calendar, ListOrdered } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import CardVisual from '../components/CardVisual';

export default function ArchivePage({ type, onBack }: { type: 'schedule' | 'sequence', onBack: () => void }) {
  // Mengambil data jadwal atau urutan berdasarkan tipe
  const items = useLiveQuery(() => {
    return type === 'schedule' ? db.schedules.toArray() : db.sequences.toArray();
  }) || [];

  const handleDelete = async (id: number) => {
    if (confirm('Hapus data ini?')) {
      if (type === 'schedule') await db.schedules.delete(id);
      else await db.sequences.delete(id);
    }
  };

  return (
    <div className="pb-24">
      <header className="bg-white p-3 shadow-sm flex items-center gap-3 sticky top-0 z-10">
        <button onClick={onBack} className="p-2 bg-slate-100 rounded-full"><ArrowLeft size={20} /></button>
        <h1 className="text-lg font-bold text-slate-800 flex-1">
          Daftar {type === 'schedule' ? 'Jadwal' : 'Urutan'}
        </h1>
      </header>

      <div className="p-4 space-y-4">
        {items.length === 0 ? (
          <p className="text-center text-slate-400 mt-10">Belum ada data tersimpan.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  {type === 'schedule' ? <Calendar size={20} className="text-green-500"/> : <ListOrdered size={20} className="text-purple-500"/>}
                  <h2 className="font-bold text-slate-800">{item.title}</h2>
                </div>
                <button onClick={() => handleDelete(item.id!)} className="p-2 text-red-500 bg-red-50 rounded-full"><Trash2 size={18}/></button>
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-2">
                {item.items.map((card: any, index: number) => (
                  <div key={index} className="flex flex-col items-center flex-shrink-0">
                    <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-200">
                      <CardVisual card={card} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 mt-1">{card.word}</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
