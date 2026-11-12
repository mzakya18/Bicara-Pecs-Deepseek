import { useState } from 'react';
import { ArrowLeft, Plus, X, Save, Printer } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { PecsItem } from '../types';

export default function SchedulePage({ onBack }: { onBack: () => void }) {
  const [title, setTitle] = useState('Jadwal Pagi');
  const [selectedCards, setSelectedCards] = useState<PecsItem[]>([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const allCards = useLiveQuery(() => db.cards.toArray()) || [];

  const handleAddCard = (card: PecsItem) => {
    setSelectedCards([...selectedCards, card]);
    setIsPickerOpen(false);
  };

  const removeCard = (index: number) => {
    const newCards = [...selectedCards];
    newCards.splice(index, 1);
    setSelectedCards(newCards);
  };

  const handleSave = async () => {
    if (!title.trim()) return alert('Beri nama jadwal!');
    if (selectedCards.length === 0) return alert('Tambahkan minimal 1 kegiatan!');

    await db.schedules.add({
      title,
      items: selectedCards,
      createdAt: Date.now()
    });

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onBack();
    }, 1500);
  };

  const handlePrint = () => {
    if (selectedCards.length === 0) return alert('Tambahkan kegiatan sebelum mencetak!');
    window.print(); // Memicu dialog cetak browser
  };

  return (
    <div className="pb-24">
      {/* HEADER APLIKASI (Disembunyikan saat print) */}
      <header className="no-print bg-white p-3 shadow-sm flex items-center gap-3 sticky top-0 z-10">
        <button onClick={onBack} className="p-2 bg-slate-100 rounded-full"><ArrowLeft size={20} /></button>
        <h1 className="text-lg font-bold text-slate-800 flex-1">Buat Jadwal</h1>
        <button onClick={handlePrint} className="p-2 bg-slate-100 text-slate-600 rounded-full mr-1">
          <Printer size={20} />
        </button>
        <button onClick={handleSave} className={`p-2 rounded-full text-white ${saved ? 'bg-green-500' : 'bg-blue-500'}`}>
          <Save size={20} />
        </button>
      </header>

      {/* AREA EDITOR (Disembunyikan saat print) */}
      <div className="no-print p-4">
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-lg font-bold border-b-2 border-slate-300 pb-2 mb-4 focus:outline-none focus:border-blue-500 bg-transparent"
          placeholder="Nama Jadwal (ex: Rutinitas Pagi)"
        />

        <div className="space-y-3">
          {selectedCards.map((card, index) => (
            <div key={index} className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                {index + 1}
              </div>
              <span className="text-3xl">{card.emoji}</span>
              <span className="font-bold text-slate-700 flex-1">{card.word}</span>
              <button onClick={() => removeCard(index)} className="text-red-400 p-2"><X size={18} /></button>
            </div>
          ))}
        </div>

        <button 
          onClick={() => setIsPickerOpen(true)}
          className="w-full mt-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-4 rounded-xl flex items-center justify-center gap-2 border-2 border-dashed border-slate-300"
        >
          <Plus size={20} /> Tambah Kegiatan
        </button>
      </div>

      {/* ===== AREA KHUSUS CETAK (Hanya muncul di kertas) ===== */}
      <div className="hidden print:block print-container">
        <h1 className="print-title">{title}</h1>
        <div className="print-grid">
          {selectedCards.map((card, index) => (
            <div key={index} className="print-card">
              <div className="text-xs font-bold text-slate-500 mb-1">Langkah {index + 1}</div>
              <div className="emoji">{card.emoji}</div>
              <div className="word">{card.word}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Pilih Kartu */}
      {isPickerOpen && (
        <div className="no-print fixed inset-0 bg-black/50 z-50 flex flex-col justify-end">
          <div className="bg-white w-full max-w-md mx-auto rounded-t-3xl h-[70vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-bold">Pilih Kartu</h2>
              <button onClick={() => setIsPickerOpen(false)} className="p-2 bg-slate-100 rounded-full"><X size={20} /></button>
            </div>
            <div className="p-4 overflow-y-auto grid grid-cols-3 gap-2">
              {allCards.map(card => (
                <button 
                  key={card.id}
                  onClick={() => handleAddCard(card)}
                  className="bg-slate-50 aspect-square rounded-xl border border-slate-200 flex flex-col items-center justify-center p-2"
                >
                  <span className="text-3xl">{card.emoji}</span>
                  <span className="text-[10px] font-bold text-slate-700 mt-1 text-center">{card.word}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
