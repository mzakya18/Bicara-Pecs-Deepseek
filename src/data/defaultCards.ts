import { PecsItem } from '../types';

// Base URL untuk gambar Mulberry Symbols (Lisensi Komersial)
const M = 'https://raw.githubusercontent.com/straight-street/mulberry-symbols/master/EN';

export const DEFAULT_CARDS: PecsItem[] = [
  // SUBJEK
  { id: 's_saya', word: 'Saya', category: 'subjek', emoji: '🧒🏻', imageUrl: `${M}/People/Me.svg` },
  { id: 's_ibu', word: 'Ibu', category: 'subjek', emoji: '👩🏻', imageUrl: `${M}/People/Mother.svg` },
  { id: 's_ayah', word: 'Ayah', category: 'subjek', emoji: '🧔🏻', imageUrl: `${M}/People/Father.svg` },
  
  // KATA KERJA
  { id: 'v_mau', word: 'Mau', category: 'kata-kerja', emoji: '🤲', imageUrl: `${M}/General/Want.svg` },
  { id: 'v_makan', word: 'Makan', category: 'kata-kerja', emoji: '😋', imageUrl: `${M}/Food/Eat.svg` },
  { id: 'v_minum', word: 'Minum', category: 'kata-kerja', emoji: '🥤', imageUrl: `${M}/Food/Drink.svg` },
  { id: 'v_main', word: 'Main', category: 'kata-kerja', emoji: '🎲', imageUrl: `${M}/Leisure/Play.svg` },
  { id: 'v_tidur', word: 'Tidur', category: 'kata-kerja', emoji: '🛌🏻', imageUrl: `${M}/General/Sleep.svg` },
  
  // BENDA (Makanan & Mainan)
  { id: 'o_air', word: 'Air', category: 'benda', emoji: '💧', imageUrl: `${M}/Food/Water.svg` },
  { id: 'o_nasi', word: 'Nasi', category: 'benda', emoji: '🍚', imageUrl: `${M}/Food/Rice.svg` },
  { id: 'o_susu', word: 'Susu', category: 'benda', emoji: '🥛', imageUrl: `${M}/Food/Milk.svg` },
  { id: 'o_bola', word: 'Bola', category: 'benda', emoji: '⚽', imageUrl: `${M}/Leisure/Ball.svg` },
  { id: 'o_mobil', word: 'Mobil', category: 'benda', emoji: '🚗', imageUrl: `${M}/Transport/Car.svg` },
  { id: 'o_buku', word: 'Buku', category: 'benda', emoji: '📖', imageUrl: `${M}/School/Book.svg` },
];
