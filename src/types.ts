export type PecsCategory = 'subjek' | 'kata-kerja' | 'benda' | 'sifat' | 'tempat' | 'waktu' | 'perasaan';

export interface PecsItem {
  id: string;
  word: string;
  category: PecsCategory;
  imageUrl?: string;
  emoji?: string;
  isCustom?: boolean;
}

export interface AppSettings {
  childName: string;
  chronologicalAge: number;
  developmentalAge: number;
  level: number;
  gender: 'L' | 'P';
}
