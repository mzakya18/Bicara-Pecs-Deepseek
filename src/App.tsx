import { useState } from 'react';
import { Volume2, Trash2, Settings } from 'lucide-react';

const DUMMY_CARDS = [
  { id: '1', word: 'Saya', emoji: '🧒🏻' },
  { id: '2', word: 'Mau', emoji: '🤲' },
  { id: '3', word: 'Makan', emoji: '😋' },
  { id: '4', word: 'Minum', emoji: '🥤' },
  { id: '5', word: 'Air', emoji: '💧' },
  { id: '6', word: 'Nasi', emoji: '🍚' },
  { id: '7', word: 'Bola', emoji: '⚽' },
  { id: '8', word: 'Main', emoji: '🎲' },
];

export default function App() {
  const [sentence, setSentence] = useState<any[]>([]);

  const addToSentence = (card: any) => {
    setSentence([...sentence, card]);
  };

  const clearSentence = () => setSentence([]);

  const speakSentence = () => {
    if (sentence.length === 0) return;
    const text = sentence.map((s) => s.word).join(' ');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-20 max-w-md mx-auto flex flex-col font-sans">
      <header className="bg-white p-4 shadow-sm flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-xl font-bold text-slate-800">Papan Bicara</h1>
        <button className="p-2 bg-slate-100 rounded-full text-slate-600">
          <Settings size={20} />
        </button>
      </header>

      <div className="p-4 bg-white m-4 rounded-xl shadow-sm min-h-[100px] border-2 border-dashed border-slate-300 flex gap-2 flex-wrap">
        {sentence.length === 0 ? (
          <p className="text-slate-400 text-sm w-full text-center m-auto">Ketuk gambar untuk menyusun kalimat...</p>
        ) : (
          sentence.map((item, index) => (
            <div key={index} className="bg-slate-100 p-2 rounded-lg flex flex-col items-center border border-slate-200">
              <span className="text-2xl">{item.emoji}</span>
              <span className="text-xs font-bold mt-1 text-slate-700">{item.word}</span>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-3 px-4 mb-4">
        <button 
          onClick={speakSentence}
          className="flex-[2] bg-blue-500 active:bg-blue-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-md"
        >
          <Volume2 size={24} /> Bicara
        </button>
        <button 
          onClick={clearSentence}
          className="flex-1 bg-red-500 active:bg-red-600 text-white font-bold py-4 rounded-xl flex items-center justify-center shadow-md"
        >
          <Trash2 size={24} />
        </button>
      </div>

      <div className="px-4 grid grid-cols-3 gap-3">
        {DUMMY_CARDS.map((card) => (
          <button
            key={card.id}
            onClick={() => addToSentence(card)}
            className="bg-white aspect-square rounded-2xl shadow-sm border-2 border-slate-200 flex flex-col items-center justify-center active:scale-95 transition-transform hover:border-blue-300"
          >
            <span className="text-4xl mb-1">{card.emoji}</span>
            <span className="font-bold text-slate-700 text-sm">{card.word}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
