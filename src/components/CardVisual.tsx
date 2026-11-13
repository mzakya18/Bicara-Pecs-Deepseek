import { useState } from 'react';
import { PecsItem } from '../types';

export default function CardVisual({ card, isPrint = false }: { card: PecsItem, isPrint?: boolean }) {
  const [imgError, setImgError] = useState(false);

  if (card.imageUrl && !imgError) {
    return (
      <div className={`flex items-center justify-center ${isPrint ? 'w-full h-full' : 'w-12 h-12 mb-1'}`}>
        <img 
          src={card.imageUrl} 
          alt={card.word} 
          className="w-full h-full object-contain"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${isPrint ? 'text-[40pt]' : 'text-4xl mb-1'}`}>
      {card.emoji || '🖼️'}
    </div>
  );
}
