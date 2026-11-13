import { db } from '../db/database';

export const exportData = async () => {
  try {
    const cards = await db.cards.toArray();
    const settings = await db.settings.toArray();
    const history = await db.history.toArray();
    const schedules = await db.schedules.toArray(); // Ambil Jadwal
    const sequences = await db.sequences.toArray(); // Ambil Urutan

    const backupData = {
      app: 'BicaraPECS-v2',
      version: 2, // Naikkan versi karena ada data baru
      timestamp: new Date().toISOString(),
      data: { cards, settings, history, schedules, sequences }
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
    
    alert('Data (termasuk Jadwal & Urutan) berhasil diunduh!');
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
      return alert('File tidak valid!');
    }

    if (!confirm('Peringatan: Semua data saat ini akan DIGANTI dengan data dari file cadangan. Lanjutkan?')) {
      return;
    }

    // Pengecekan selesai, baru eksekusi (mencegah data terhapus jika file rusak)
    await db.transaction('rw', [db.cards, db.settings, db.history, db.schedules, db.sequences], async () => {
      await db.cards.clear();
      await db.settings.clear();
      await db.history.clear();
      await db.schedules.clear();
      await db.sequences.clear();

      if (parsed.data.cards) await db.cards.bulkAdd(parsed.data.cards);
      if (parsed.data.settings) await db.settings.bulkAdd(parsed.data.settings);
      if (parsed.data.history) await db.history.bulkAdd(parsed.data.history);
      if (parsed.data.schedules) await db.schedules.bulkAdd(parsed.data.schedules);
      if (parsed.data.sequences) await db.sequences.bulkAdd(parsed.data.sequences);
    });

    alert('Data berhasil dipulihkan!');
    window.location.reload();
  } catch (error) {
    console.error(error);
    alert('Gagal memulihkan data. File mungkin rusak.');
  }
};
