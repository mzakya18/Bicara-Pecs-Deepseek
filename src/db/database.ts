import Dexie, { Table } from 'dexie';
import { PecsItem, AppSettings } from '../types';

export class BicaraPecsDB extends Dexie {
  cards!: Table<PecsItem>;
  settings!: Table<AppSettings>;
  history!: Table<{ id?: number; word: string; timestamp: number }>;

  constructor() {
    super('BicaraPecsDatabase');
    this.version(1).stores({
      cards: 'id, category, word', 
      settings: '++id',
      history: '++id, word, timestamp'
    });
  }
}

export const db = new BicaraPecsDB();
