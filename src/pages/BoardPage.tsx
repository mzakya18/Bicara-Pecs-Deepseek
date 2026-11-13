import { useState } from 'react';
import { Volume2, Trash2, Plus, X, Image as ImageIcon } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { PecsItem, PecsCategory } from '../types';
import CardVisual from '../components/CardVisual';

// Fungsi Kompresi Gambar
const compressImage = (file: File, maxSize = 400): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > height && width > maxSize) {
          height *= maxSize / width;
          width = maxSize;
        } else if (height > maxSize) {
          width *= maxSize / height;
          height = maxSize;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7)); // Kualitas 70%
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

export default function BoardPage() {
  const [sentence, setSentence] = useState<PecsItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('subjek');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWord, setNewWord] = useState('');
  const [newEmoji, setNewEmoji] = useState('🌟');
  const [newCategory, setNewCategory] = useState<PecsCategory>('benda');
  const [newImageUrl, setNewImageUrl] = useState<string>('');
  const [isCompressing, setIsCompressing] = useState(false);

  const cards = useLiveQuery(() => db.cards.toArray()) || [];

  const addToSentence = (card: PecsItem) => {
    setSentence([...sentence, card]);
    speakText(card.word);
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsCompressing(true);
    try {
      const compressedBase64 = await compressImage(file);
      setNewImageUrl(compressedBase64);
    } catch (err) {
      alert('Gagal memproses gambar.');
    }
    setIsCompressing(false);
  };

  const handleAddCard = async () => {
    if (!newWord.trim()) return alert('Tuliskan nama kartu!');

    await db.cards.add({
      id: 'custom_' + Date.now(),
      word: newWord,
      category: newCategory,
      emoji: newEmoji,
      imageUrl: newImageUrl || undefined,
      isCustom: true
    });

    setNewWord(''); setNewEmoji('🌟'); setNewImageUrl(''); setIsModalOpen(false);
  };

  // (Sisa fungsi dan JSX sama seperti sebelumnya...)
  const handleDeleteCard = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Hapus kartu ini?')) await db.cards.delete(id);
  };

  const categories = [
    { key: 'subjek', label: '👤 Subjek' },
    { key: 'kata-kerja', label: '🟢 Kata Kerja' },
    { key: 'benda', label: '🍎 Objek' },
  ];

  const filteredCards = cards.filter(c => c.category === activeCategory);

  return (
    <div className="pb-24">
      <header className="bg-white p-3 shadow-sm flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-lg font-bold text-slate-800">Papan Bicara</h1>
        <button onClick={() => setIsModalOpen(true)} className="p-2 bg-blue-100 rounded-full text-blue-600"><Plus size={20} /></button>
      </header>

      <div className="p-3 bg-white mx-3 mt-3 rounded-xl shadow-sm min-h-[90px] border-2 border-dashed border-slate-300 flex gap-2 flex-wrap items-center">
        {sentence.length === 0 ? (
          <p className="text-slate-400 text-sm w-full text-center">Ketuk gambar di bawah untuk menyusun kalimat...</p>
        ) : (
          sentence.map((item, index) => (
            <button key={index} onClick={() => setSentence(sentence.filter((_, i) => i !== index))} className="bg-slate-100 p-2 rounded-lg flex flex-col items-center border border-slate-200 active:scale-95">
              <CardVisual card={item} />
              <span className="text-[10px] font-bold mt-1 text-slate-700">{item.word}</span>
            </button>
          ))
        )}
      </div>

      <div className="flex gap-2 px-3 mt-3">
        <button onClick={() => { const text = sentence.map(s => s.word).join(' '); if(text) speakText(text); }} className="flex-[2] bg-blue-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm"><Volume2 size={20} /> Bicara</button>
        <button onClick={() => setSentence([])} className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl flex items-center justify-center shadow-sm"><Trash2 size={20} /></button>
      </div>

      <div className="flex gap-2 px-3 mt-4 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button key={cat.key} onClick={() => setActiveCategory(cat.key)} className={`px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-colors ${activeCategory === cat.key ? 'bg-blue-500 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200'}`}>{cat.label}</button>
        ))}
      </div>

      <div className="px-3 mt-2 grid grid-cols-3 gap-2">
        {filteredCards.map((card) => (
          <div key={card.id} className="relative">
            <button onClick={() => addToSentence(card)} className="w-full bg-white aspect-square rounded-2xl shadow-sm border-2 border-slate-200 flex flex-col items-center justify-center active:scale-95 p-2">
              <CardVisual card={card} />
              <span className="font-bold text-slate-700 text-xs text-center px-1">{card.word}</span>
            </button>
            {card.isCustom && (
              <button onClick={(e) => handleDeleteCard(e, card.id)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md z-10"><X size={14} /></button>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-800">Tambah Kartu Baru</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400"><X size={24} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Nama Kartu</label>
                <input type="text" value={newWord} onChange={(e) => setNewWord(e.target.value)} className="w-full border-2 border-slate-200 rounded-lg p-2 focus:border-blue-500" />
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <label className="block text-sm font-bold text-slate-700 mb-2">Gambar Kartu (Otomatis Kompres)</label>
                {newImageUrl ? (
                  <div className="relative w-20 h-20 mx-auto mb-2">
                    <img src={newImageUrl} alt="Preview" className="w-full h-full object-contain" />
                    <button onClick={() => setNewImageUrl('')} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X size={12} /></button>
                  </div>
                ) : (
                  <p className="text-xs text-center text-slate-400 mb-2">{isCompressing ? 'Memproses...' : 'Belum ada gambar'}</p>
                )}
                <label className="w-full flex items-center justify-center gap-2 bg-blue-100 text-blue-600 font-bold py-2 rounded-lg cursor-pointer hover:bg-blue-200 transition-colors">
                  <ImageIcon size={18} /> Pilih Foto
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </label>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Emoji (Cadangan)</label>
                <input type="text" value={newEmoji} onChange={(e) => setNewEmoji(e.target.value)} className="w-full border-2 border-slate-200 rounded-lg p-2 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Kategori</label>
                <select value={newCategory} onChange={(e) => setNewCategory(e.target.value as PecsCategory)} className="w-full border-2 border-slate-200 rounded-lg p-2 focus:border-blue-500">
                  <option value="subjek">Subjek</option>
                  <option value="kata-kerja">Kata Kerja</option>
                  <option value="benda">Objek / Benda</option>
                </select>
              </div>
              <button onClick={handleAddCard} className="w-full bg-blue-500 text-white font-bold py-3 rounded-xl mt-4">Simpan Kartu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
