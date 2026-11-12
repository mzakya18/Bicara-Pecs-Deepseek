import { db } from '../db/database';
import { PecsItem, AppSettings } from '../types';

export const exportData = async () => {
  try {
    const cards = await db.cards.toArray();
    const settings = await db.settings.toArray();
    const history = await db.history.toArray();

    const backupData = {
      app: 'BicaraPECS-v2',
      version: 1,
      timestamp: new Date().toISOString(),
      data: { cards, settings, history }
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `BicaraPECS-Backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('Data berhasil diunduh! Simpan file ini di tempat yang aman.');
  } catch (error) {
    console.error(error);
    alert('Gagal membuat cadangan.');
  }
};

export const importData = async (file: File) => {
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);

    if (parsed.app !== 'BicaraPECS-v2' || !parsed.data) {
      return alert('File tidak valid! Pastikan ini file cadangan Bicara PECS V2.');
    }

    if (!confirm('Peringatan: Semua data kartu saat ini akan DIGANTI dengan data dari file cadangan. Lanjutkan?')) {
      return;
    }

    await db.cards.clear();
    await db.settings.clear();
    await db.history.clear();

    if (parsed.data.cards) await db.cards.bulkAdd(parsed.data.cards);
    if (parsed.data.settings) await db.settings.bulkAdd(parsed.data.settings);
    if (parsed.data.history) await db.history.bulkAdd(parsed.data.history);

    alert('Data berhasil dipulihkan! Aplikasi akan dimuat ulang.');
    window.location.reload();
  } catch (error) {
    console.error(error);
    alert('Gagal memulihkan data. Pastikan file berformat JSON yang benar.');
  }
};
