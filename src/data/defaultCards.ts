import { PecsItem } from '../types';

// Menggunakan CDN jsDelivr untuk akses yang lebih cepat dan stabil
const M = 'https://cdn.jsdelivr.net/gh/straight-street/mulberry-symbols@master/EN';

export const DEFAULT_CARDS: PecsItem[] = [
  // SUBJEK
  { id: 's_saya', word: 'Saya', category: 'subjek', emoji: '🧒🏻', imageUrl: `${M}/people/me.svg` },
  { id: 's_ibu', word: 'Ibu', category: 'subjek', emoji: '👩🏻', imageUrl: `${M}/people/mother.svg` },
  { id: 's_ayah', word: 'Ayah', category: 'subjek', emoji: '🧔🏻', imageUrl: `${M}/people/father.svg` },
  
  // KATA KERJA
  { id: 'v_mau', word: 'Mau', category: 'kata-kerja', emoji: '🤲', imageUrl: `${M}/actions/want.svg` },
  { id: 'v_makan', word: 'Makan', category: 'kata-kerja', emoji: '😋', imageUrl: `${M}/food/eat.svg` },
  { id: 'v_minum', word: 'Minum', category: 'kata-kerja', emoji: '🥤', imageUrl: `${M}/food/drink.svg` },
  { id: 'v_main', word: 'Main', category: 'kata-kerja', emoji: '🎲', imageUrl: `${M}/leisure/play.svg` },
  { id: 'v_tidur', word: 'Tidur', category: 'kata-kerja', emoji: '🛌🏻', imageUrl: `${M}/actions/sleep.svg` },
  
  // BENDA (Makanan & Mainan)
  { id: 'o_air', word: 'Air', category: 'benda', emoji: '💧', imageUrl: `${M}/food/water.svg` },
  { id: 'o_nasi', word: 'Nasi', category: 'benda', emoji: '🍚', imageUrl: `${M}/food/rice.svg` },
  { id: 'o_susu', word: 'Susu', category: 'benda', emoji: '🥛', imageUrl: `${M}/food/milk.svg` },
  { id: 'o_bola', word: 'Bola', category: 'benda', emoji: '⚽', imageUrl: `${M}/leisure/ball.svg` },
  { id: 'o_mobil', word: 'Mobil', category: 'benda', emoji: '🚗', imageUrl: `${M}/transport/car.svg` },
  { id: 'o_buku', word: 'Buku', category: 'benda', emoji: '📖', imageUrl: `${M}/school/book.svg` },
];
