import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const EFFECTS = [
  { id: 'bubble', icon: '🫧', text: 'Gelembung!', color: 'bg-blue-400' },
  { id: 'star', icon: '⭐', text: 'Bintang!', color: 'bg-yellow-400' },
  { id: 'car', icon: '🚗', text: 'Mobil Jalan!', color: 'bg-red-400' },
  { id: 'animal', icon: '🦁', text: 'Raawr!', color: 'bg-orange-400' },
  { id: 'music', icon: '🎵', text: 'Musik!', color: 'bg-purple-400' },
  { id: 'clap', icon: '👏', text: 'Hore!', color: 'bg-green-400' },
];

export default function CauseEffectPage({ onBack }: { onBack: () => void }) {
  const [activeEffect, setActiveEffect] = useState<string | null>(null);

  const triggerEffect = (effect: typeof EFFECTS[0]) => {
    setActiveEffect(effect.id);
    
    // Suara
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(effect.text);
      utterance.lang = 'id-ID';
      utterance.rate = 1.2;
      window.speechSynthesis.speak(utterance);
    }

    // Animasi selesai
    setTimeout(() => setActiveEffect(null), 1000);
  };

  return (
    <div className="min-h-screen bg-slate-900 pb-10 flex flex-col">
      <header className="bg-slate-800 p-4 flex items-center gap-3">
        <button onClick={onBack} className="p-2 bg-slate-700 rounded-full text-white"><ArrowLeft size={20} /></button>
        <h1 className="text-lg font-bold text-white flex-1">Sebab & Akibat</h1>
      </header>

      <div className="p-4 text-center mt-4">
        <p className="text-slate-300 text-sm">Ketuk gambar dan lihat apa yang terjadi!</p>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4 p-4">
        {EFFECTS.map((effect) => (
          <button
            key={effect.id}
            onClick={() => triggerEffect(effect)}
            className={`${effect.color} rounded-3xl shadow-xl flex flex-col items-center justify-center aspect-square active:scale-90 transition-all duration-150 ${
              activeEffect === effect.id ? 'scale-110 ring-8 ring-white/50' : ''
            }`}
          >
            <span className={`text-6xl ${activeEffect === effect.id ? 'animate-bounce' : ''}`}>
              {effect.icon}
            </span>
            <span className="mt-2 font-bold text-white text-lg drop-shadow-md">
              {effect.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
