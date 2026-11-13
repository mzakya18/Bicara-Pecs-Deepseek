import { useState } from 'react';
import { ArrowLeft, Printer } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { PecsItem } from '../types';
import CardVisual from '../components/CardVisual';

// Fungsi acak yang lebih baik
const shuffleArray = (array: any[]) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

export default function WorksheetGeneratorPage({ onBack }: { onBack: () => void }) {
  const [selectedCards, setSelectedCards] = useState<PecsItem[]>([]);
  const [shuffledRight, setShuffledRight] = useState<PecsItem[]>([]);
  
  const allCards = useLiveQuery(() => db.cards.toArray()) || [];

  const toggleCard = (card: PecsItem) => {
    if (selectedCards.find(c => c.id === card.id)) {
      setSelectedCards(selectedCards.filter(c => c.id !== card.id));
    } else {
      if (selectedCards.length >= 5) return alert('Maksimal 5 kartu agar pas di kertas A4.');
      setSelectedCards([...selectedCards, card]);
    }
  };

  const handlePrint = () => {
    if (selectedCards.length < 2) return alert('Pilih minimal 2 kartu untuk dijodohkan!');
    
    // Logika: Acak sampai posisinya benar-benar berbeda dari urutan asli (jika memungkinkan)
    let rightItems = shuffleArray(selectedCards);
    if (selectedCards.length > 2) {
      let attempts = 0;
      while (rightItems.every((item, i) => item.id === selectedCards[i].id) && attempts < 10) {
        rightItems = shuffleArray(selectedCards);
        attempts++;
      }
    }

    setShuffledRight(rightItems);
    setTimeout(() => { window.print(); }, 500);
  };

  return (
    <div className="pb-24">
      <header className="no-print bg-white p-3 shadow-sm flex items-center gap-3 sticky top-0 z-10">
        <button onClick={onBack} className="p-2 bg-slate-100 rounded-full"><ArrowLeft size={20} /></button>
        <h1 className="text-lg font-bold text-slate-800 flex-1">Worksheet Generator</h1>
        <button onClick={handlePrint} className="p-2 bg-blue-100 text-blue-600 rounded-full"><Printer size={20} /></button>
      </header>

      <div className="no-print p-4">
        <p className="text-sm text-slate-500 mb-4">Pilih 2-5 kartu. Aplikasi akan membuat lembar kerja mencocokkan gambar dengan kata.</p>
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-bold text-slate-600">{selectedCards.length} / 5 Dipilih</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {allCards.map(card => {
            const isSelected = selectedCards.some(c => c.id === card.id);
            return (
              <button key={card.id} onClick={() => toggleCard(card)} className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center p-2 transition-colors ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white'}`}>
                <CardVisual card={card} />
                <span className="text-[10px] font-bold text-slate-700 mt-1 text-center">{card.word}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* AREA CETAK WORKSHEET */}
      <div className="hidden print:block print-worksheet-container">
        <div className="print-worksheet-header">
          <h1>Lembar Kerja: Menjodohkan</h1>
          <p>Tarik garis dari gambar di sebelah kiri ke kata yang tepat di sebelah kanan!</p>
        </div>

        {selectedCards.length > 0 && (
          <div className="print-worksheet-grid">
            <div className="print-column">
              {selectedCards.map((card, index) => (
                <div key={index} className="print-item left">
                  <div className="w-16 h-16 flex items-center justify-center">
                    <CardVisual card={card} isPrint={true} />
                  </div>
                  <div className="print-dot" style={{ marginLeft: 'auto' }}></div>
                </div>
              ))}
            </div>

            <div className="print-column">
              {shuffledRight.length > 0 ? shuffledRight.map((card, index) => (
                <div key={index} className="print-item right">
                  <div className="print-dot" style={{ marginRight: 'auto' }}></div>
                  <span>{card.word}</span>
                </div>
              )) : selectedCards.map((card, index) => (
                 // Fallback jika array shuffledRight belum siap
                 <div key={index} className="print-item right">
                  <div className="print-dot" style={{ marginRight: 'auto' }}></div>
                  <span>{card.word}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
