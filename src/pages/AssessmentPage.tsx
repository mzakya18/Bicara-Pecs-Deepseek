import { useState, useEffect } from 'react';
import { db } from '../db/database';
import { AppSettings } from '../types';

export default function AssessmentPage() {
  const [chronoAge, setChronoAge] = useState<number>(0);
  const [develAge, setDevelAge] = useState<number>(0);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    db.settings.toArray().then(data => {
      if (data.length > 0) {
        setChronoAge(data[0].chronologicalAge || 0);
        setDevelAge(data[0].developmentalAge || 0);
      }
    });
  }, []);

  const handleSave = async () => {
    await db.settings.clear();
    await db.settings.add({
      childName: '',
      chronologicalAge: chronoAge,
      developmentalAge: develAge,
      level: 1,
      gender: 'L'
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-4 pb-24 max-w-md mx-auto">
      <div className="bg-white p-5 rounded-2xl shadow-sm mt-4">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Asesmen Awal</h2>
        <p className="text-sm text-slate-500 mb-6">Masukkan data usia anak untuk membantu menyesuaikan indikator kemampuan.</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Usia Kronologis (Tahun)</label>
            <input 
              type="number" 
              value={chronoAge} 
              onChange={(e) => setChronoAge(Number(e.target.value))}
              className="w-full border-2 border-slate-200 rounded-lg p-3 text-lg"
              placeholder="Contoh: 5"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Usia Perkembangan (Tahun)</label>
            <input 
              type="number" 
              value={develAge} 
              onChange={(e) => setDevelAge(Number(e.target.value))}
              className="w-full border-2 border-slate-200 rounded-lg p-3 text-lg"
              placeholder="Contoh: 3"
            />
            <p className="text-xs text-slate-400 mt-1">*Diisi berdasarkan observasi atau hasil asesmen profesional.</p>
          </div>

          <button 
            onClick={handleSave}
            className={`w-full font-bold py-3 rounded-xl mt-6 text-white transition-colors ${saved ? 'bg-green-500' : 'bg-blue-500'}`}
          >
            {saved ? 'Data Tersimpan ✓' : 'Simpan Data'}
          </button>
        </div>
      </div>
    </div>
  );
}
