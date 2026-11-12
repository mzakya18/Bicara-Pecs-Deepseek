import { useState } from 'react';
import { Volume2, Trash2, Settings, ChevronDown } from 'lucide-react';
import { DEFAULT_CARDS } from './data/defaultCards';
import { PecsItem } from './types';

export default function App() {
  const [sentence, setSentence] = useState<PecsItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('subjek');

  const addToSentence = (card: PecsItem) => {
    setSentence([...sentence, card]);
    // Suara langsung saat kartu diketuk (opsional, bisa dimatikan nanti)
    speakText(card.word);
  };

  const clearSentence = () => setSentence([]);

  const removeFromSentence = (index: number) => {
    const newSentence = [...sentence];
    newSentence.splice(index, 1);
    setSentence(newSentence);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const speakSentence = () => {
    if (sentence.length === 0) return;
    const text = sentence.map((s) => s.word).join(' ');
    speakText(text);
  };

  const categories = [
    { key: 'subjek', label: '👤 Subjek' },
    { key: 'kata-kerja', label: '🟢 Kata Kerja' },
    { key: 'benda', label: '🍎 Objek' },
  ];

  const filteredCards = DEFAULT_CARDS.filter(c => c.category === activeCategory);

  return (
    <div className="min-h-screen bg-slate-100 pb-20 max-w-md mx-auto flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white p-3 shadow-sm flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-lg font-bold text-slate-800">Papan Bicara</h1>
        <button className="p-2 bg-slate-100 rounded-full text-slate-600">
          <Settings size={20} />
        </button>
      </header>

      {/* Sentence Strip */}
      <div className="p-3 bg-white mx-3 mt-3 rounded-xl shadow-sm min-h-[90px] border-2 border-dashed border-slate-300 flex gap-2 flex-wrap items-center">
        {sentence.length === 0 ? (
          <p className="text-slate-400 text-sm w-full text-center">Ketuk gambar di bawah untuk menyusun kalimat...</p>
        ) : (
          sentence.map((item, index) => (
            <button 
              key={index} 
              onClick={() => removeFromSentence(index)}
              className="bg-slate-100 p-2 rounded-lg flex flex-col items-center border border-slate-200 active:scale-95 transition-transform"
            >
              <span className="text-2xl">{item.emoji}</span>
              <span className="text-[10px] font-bold mt-1 text-slate-700">{item.word}</span>
            </button>
          ))
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-2 px-3 mt-3">
        <button 
          onClick={speakSentence}
          className="flex-[2] bg-blue-500 active:bg-blue-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
        >
          <Volume2 size={20} /> Bicara
        </button>
        <button 
          onClick={clearSentence}
          className="flex-1 bg-red-500 active:bg-red-600 text-white font-bold py-3 rounded-xl flex items-center justify-center shadow-sm transition-colors"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 px-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-colors ${
              activeCategory === cat.key 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid Kartu PECS */}
      <div className="px-3 mt-2 grid grid-cols-3 gap-2">
        {filteredCards.map((card) => (
          <button
            key={card.id}
            onClick={() => addToSentence(card)}
            className="bg-white aspect-square rounded-2xl shadow-sm border-2 border-slate-200 flex flex-col items-center justify-center active:scale-95 transition-transform hover:border-blue-300"
          >
            <span className="text-4xl mb-1">{card.emoji}</span>
            <span className="font-bold text-slate-700 text-xs text-center px-1">{card.word}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
