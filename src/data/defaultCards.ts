import { PecsItem } from '../types';

export const DEFAULT_CARDS: PecsItem[] = [
  // SUBJEK
  { id: 's_saya', word: 'Saya', category: 'subjek', emoji: '🧒🏻' },
  { id: 's_ibu', word: 'Ibu', category: 'subjek', emoji: '👩🏻' },
  { id: 's_ayah', word: 'Ayah', category: 'subjek', emoji: '🧔🏻' },
  
  // KATA KERJA
  { id: 'v_mau', word: 'Mau', category: 'kata-kerja', emoji: '🤲' },
  { id: 'v_makan', word: 'Makan', category: 'kata-kerja', emoji: '😋' },
  { id: 'v_minum', word: 'Minum', category: 'kata-kerja', emoji: '🥤' },
  { id: 'v_main', word: 'Main', category: 'kata-kerja', emoji: '🎲' },
  
  // BENDA (Makanan & Mainan)
  { id: 'o_air', word: 'Air', category: 'benda', emoji: '💧' },
  { id: 'o_nasi', word: 'Nasi', category: 'benda', emoji: '🍚' },
  { id: 'o_susu', word: 'Susu', category: 'benda', emoji: '🥛' },
  { id: 'o_bola', word: 'Bola', category: 'benda', emoji: '⚽' },
  { id: 'o_mobil', word: 'Mobil', category: 'benda', emoji: '🚗' },
  { id: 'o_buku', word: 'Buku', category: 'benda', emoji: '📖' },
];
