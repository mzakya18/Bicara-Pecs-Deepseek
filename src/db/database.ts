import Dexie, { Table } from 'dexie';
import { PecsItem, AppSettings } from '../types';

export interface Schedule {
  id?: number;
  title: string;
  items: PecsItem[];
  createdAt: number;
}

export interface Sequence {
  id?: number;
  title: string;
  items: PecsItem[];
  createdAt: number;
}

export class BicaraPecsDB extends Dexie {
  cards!: Table<PecsItem>;
  settings!: Table<AppSettings>;
  history!: Table<{ id?: number; word: string; timestamp: number }>;
  schedules!: Table<Schedule>;
  sequences!: Table<Sequence>;

  constructor() {
    super('BicaraPecsDatabase');
    this.version(3).stores({
      cards: 'id, category, word', 
      settings: '++id',
      history: '++id, word, timestamp',
      schedules: '++id, title',
      sequences: '++id, title'
    });
  }
}

export const db = new BicaraPecsDB();
