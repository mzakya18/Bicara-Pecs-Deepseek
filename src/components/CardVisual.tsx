import { useState } from 'react';
import { PecsItem } from '../types';

export default function CardVisual({ card, isPrint = false }: { card: PecsItem, isPrint?: boolean }) {
  const [imgError, setImgError] = useState(false);

  // Jika ada gambar dan belum error, tampilkan gambar
  if (card.imageUrl && !imgError) {
    return (
      <img 
        src={card.imageUrl} 
        alt={card.word} 
        className={`object-contain ${isPrint ? 'w-full h-full p-1' : 'w-12 h-12 mb-1'}`}
        onError={() => setImgError(true)} // Jika gagal load, ubah state jadi error
      />
    );
  }

  // Jika tidak ada gambar ATAU gambar gagal load, tampilkan Emoji
  return (
    <span className={`${isPrint ? 'text-[40pt]' : 'text-4xl mb-1'} flex items-center justify-center`}>
      {card.emoji || '🖼️'}
    </span>
  );
}
