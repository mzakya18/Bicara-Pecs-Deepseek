import { PecsItem } from '../types';

export default function CardVisual({ card, isPrint = false }: { card: PecsItem, isPrint?: boolean }) {
  // Jika ada gambar (URL atau Base64), tampilkan gambar
  if (card.imageUrl) {
    return (
      <img 
        src={card.imageUrl} 
        alt={card.word} 
        className={`object-contain ${isPrint ? 'w-full h-full p-1' : 'w-12 h-12 mb-1'}`}
        onError={(e) => {
          // Jika gambar gagal dimuat (link mati), ganti dengan emoji
          e.currentTarget.style.display = 'none';
          e.currentTarget.nextElementSibling?.classList.remove('hidden');
        }}
      />
    );
  }

  // Jika tidak ada gambar, tampilkan Emoji sebagai cadangan
  return (
    <span 
      className={`${isPrint ? 'text-[40pt]' : 'text-4xl mb-1'} ${card.imageUrl ? 'hidden' : ''}`}
    >
      {card.emoji || '🖼️'}
    </span>
  );
}
