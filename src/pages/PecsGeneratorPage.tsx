import { useState } from 'react';
import { ArrowLeft, Printer, CheckSquare, Square } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { PecsItem } from '../types';

export default function PecsGeneratorPage({ onBack }: { onBack: () => void }) {
  const [selectedCards, setSelectedCards] = useState<PecsItem[]>([]);
  const allCards = useLiveQuery(() => db.cards.toArray()) || [];

  const toggleCard = (card: PecsItem) => {
    if (selectedCards.find(c => c.id === card.id)) {
      setSelectedCards(selectedCards.filter(c => c.id !== card.id));
    } else {
      setSelectedCards([...selectedCards, card]);
    }
  };

  const handleSelectAll = () => {
    if (selectedCards.length === allCards.length) {
      setSelectedCards([]);
    } else {
      setSelectedCards([...allCards]);
    }
  };

  return (
    <div className="pb-24">
      <header className="no-print bg-white p-3 shadow-sm flex items-center gap-3 sticky top-0 z-10">
        <button onClick={onBack} className="p-2 bg-slate-100 rounded-full"><ArrowLeft size={20} /></button>
        <h1 className="text-lg font-bold text-slate-800 flex-1">PECS Generator</h1>
        <button onClick={() => window.print()} className="p-2 bg-blue-100 text-blue-600 rounded-full">
          <Printer size={20} />
        </button>
      </header>

      <div className="no-print p-4">
        <p className="text-sm text-slate-500 mb-4">Pilih kartu yang ingin dicetak. Layout akan otomatis menyesuaikan ukuran kartu PECS (5x5 cm) di kertas A4.</p>
        
        <div className="flex justify-between items-center mb-3">
          <button onClick={handleSelectAll} className="text-sm font-bold text-blue-600 flex items-center gap-1">
            {selectedCards.length === allCards.length ? <CheckSquare size={16}/> : <Square size={16}/>} Pilih Semua
          </button>
          <span className="text-sm font-bold text-slate-600">{selectedCards.length} Dipilih</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {allCards.map(card => {
            const isSelected = selectedCards.some(c => c.id === card.id);
            return (
              <button
                key={card.id}
                onClick={() => toggleCard(card)}
                className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center p-2 transition-colors ${
                  isSelected ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white'
                }`}
              >
                <span className="text-3xl">{card.emoji}</span>
                <span className="text-[10px] font-bold text-slate-700 mt-1 text-center">{card.word}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* AREA CETAK PECS */}
      <div className="hidden print:block print-container">
        <div className="print-pecs-grid">
          {selectedCards.map((card) => (
            <div key={card.id} className="print-pecs-card">
              <div className="emoji">{card.emoji}</div>
              <div className="word">{card.word}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
