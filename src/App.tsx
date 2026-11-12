import { useState, useEffect } from 'react';
import { Volume2, Trash2, Settings, Plus, X } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db/database';
import { DEFAULT_CARDS } from './data/defaultCards';
import { PecsItem, PecsCategory } from './types';

export default function App() {
  const [sentence, setSentence] = useState<PecsItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('subjek');
  
  // State untuk Modal Tambah Kartu
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWord, setNewWord] = useState('');
  const [newEmoji, setNewEmoji] = useState('🌟');
  const [newCategory, setNewCategory] = useState<PecsCategory>('benda');

  // Mengambil data kartu dari Database secara Real-time
  const cards = useLiveQuery(() => db.cards.toArray()) || [];

  // Mengisi database dengan kartu bawaan (hanya sekali saat aplikasi pertama dibuka)
  useEffect(() => {
    db.cards.count().then(count => {
      if (count === 0) {
        db.cards.bulkAdd(DEFAULT_CARDS);
      }
    });
  }, []);

  const addToSentence = (card: PecsItem) => {
    setSentence([...sentence, card]);
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

  // Fungsi Tambah & Hapus Kartu
  const handleAddCard = async () => {
    if (!newWord.trim()) return alert('Tuliskan nama kartu!');
    
    await db.cards.add({
      id: 'custom_' + Date.now(),
      word: newWord,
      category: newCategory,
      emoji: newEmoji,
      isCustom: true
    });

    setNewWord('');
    setNewEmoji('🌟');
    setIsModalOpen(false);
  };

  const handleDeleteCard = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Mencegah kartu masuk ke kalimat saat tombol hapus diklik
    if (confirm('Hapus kartu ini?')) {
      await db.cards.delete(id);
    }
  };

  const categories = [
    { key: 'subjek', label: '👤 Subjek' },
    { key: 'kata-kerja', label: '🟢 Kata Kerja' },
    { key: 'benda', label: '🍎 Objek' },
  ];

  const filteredCards = cards.filter(c => c.category === activeCategory);

  return (
    <div className="min-h-screen bg-slate-100 pb-20 max-w-md mx-auto flex flex-col font-sans relative">
      {/* Header */}
      <header className="bg-white p-3 shadow-sm flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-lg font-bold text-slate-800">Papan Bicara</h1>
        <div className="flex gap-2">
          <button onClick={() => setIsModalOpen(true)} className="p-2 bg-blue-100 rounded-full text-blue-600">
            <Plus size={20} />
          </button>
          <button className="p-2 bg-slate-100 rounded-full text-slate-600">
            <Settings size={20} />
          </button>
        </div>
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
          <div key={card.id} className="relative">
            <button
              onClick={() => addToSentence(card)}
              className="w-full bg-white aspect-square rounded-2xl shadow-sm border-2 border-slate-200 flex flex-col items-center justify-center active:scale-95 transition-transform hover:border-blue-300"
            >
              <span className="text-4xl mb-1">{card.emoji}</span>
              <span className="font-bold text-slate-700 text-xs text-center px-1">{card.word}</span>
            </button>
            
            {/* Tombol Hapus (Hanya muncul untuk kartu buatan sendiri) */}
            {card.isCustom && (
              <button 
                onClick={(e) => handleDeleteCard(e, card.id)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md"
              >
                <X size={14} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Modal Tambah Kartu */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-800">Tambah Kartu Baru</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Nama Kartu</label>
                <input 
                  type="text" 
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  placeholder="Contoh: Es Krim"
                  className="w-full border-2 border-slate-200 rounded-lg p-2 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Emoji (Sementara)</label>
                <input 
                  type="text" 
                  value={newEmoji}
                  onChange={(e) => setNewEmoji(e.target.value)}
                  placeholder="Contoh: 🍦"
                  className="w-full border-2 border-slate-200 rounded-lg p-2 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Kategori</label>
                <select 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as PecsCategory)}
                  className="w-full border-2 border-slate-200 rounded-lg p-2 focus:border-blue-500 focus:outline-none"
                >
                  <option value="subjek">Subjek</option>
                  <option value="kata-kerja">Kata Kerja</option>
                  <option value="benda">Objek / Benda</option>
                </select>
              </div>

              <button 
                onClick={handleAddCard}
                className="w-full bg-blue-500 text-white font-bold py-3 rounded-xl mt-4 active:bg-blue-600"
              >
                Simpan Kartu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
