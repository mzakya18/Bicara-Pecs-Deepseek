import { useState, useEffect } from 'react';
import { db } from '../db/database';
import { AppSettings } from '../types';
import { CheckCircle2, ChevronRight } from 'lucide-react';

const ASSESSMENT_QUESTIONS = [
  { id: 1, text: "Apakah anak bisa menunjuk atau meraih benda yang diinginkan?", options: [{ label: "Belum bisa / Menangis saja", score: 1 }, { label: "Bisa meraih, tapi belum konsisten", score: 2 }, { label: "Bisa menunjuk dengan jelas", score: 3 }] },
  { id: 2, text: "Saat diberikan 2 gambar, apakah anak bisa memilih salah satu yang ia mau?", options: [{ label: "Belum bisa membedakan gambar", score: 1 }, { label: "Bisa memilih jika dibantu", score: 2 }, { label: "Bisa memilih sendiri dengan tepat", score: 3 }] },
  { id: 3, text: "Apakah anak bisa menempelkan gambar ke papan komunikasi (bertukar gambar)?", options: [{ label: "Belum bisa", score: 1 }, { label: "Bisa menyerahkan gambar ke tangan orang lain", score: 2 }, { label: "Bisa menempel gambar di papan secara mandiri", score: 3 }] },
  { id: 4, text: "Apakah anak bisa merangkai 2 gambar atau lebih (misal: 'Saya' + 'Makan')?", options: [{ label: "Belum bisa", score: 1 }, { label: "Bisa jika diarahkan", score: 2 }, { label: "Bisa mandiri merangkai kalimat", score: 3 }] }
];

export default function AssessmentPage() {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [isDone, setIsDone] = useState(false);
  const [existingData, setExistingData] = useState<AppSettings | null>(null);
  
  const [chronoAge, setChronoAge] = useState<number | ''>('');
  const [develAge, setDevelAge] = useState<number | ''>('');

  useEffect(() => {
    db.settings.toArray().then(data => {
      if (data.length > 0) {
        setExistingData(data[0]);
        setChronoAge(data[0].chronologicalAge || '');
        setDevelAge(data[0].developmentalAge || '');
      }
    });
  }, []);

  const handleAnswer = (score: number) => {
    const newScores = [...scores, score];
    setScores(newScores);
    if (step < ASSESSMENT_QUESTIONS.length - 1) setStep(step + 1);
    else setIsDone(true);
  };

  const handleSave = async () => {
    const totalScore = scores.reduce((a, b) => a + b, 0);
    let recommendedLevel = 1;
    if (totalScore >= 6 && totalScore < 9) recommendedLevel = 2;
    if (totalScore >= 9 && totalScore < 11) recommendedLevel = 3;
    if (totalScore >= 11) recommendedLevel = 4;

    // Perbaikan: Jangan hapus data lama (nama/gender), cukup perbarui
    const idToUpdate = existingData?.id;
    const newData: AppSettings = {
      childName: existingData?.childName || '',
      gender: existingData?.gender || 'L',
      chronologicalAge: Number(chronoAge) || 0,
      developmentalAge: Number(develAge) || 0,
      level: recommendedLevel
    };

    if (idToUpdate) {
      await db.settings.update(idToUpdate, newData);
    } else {
      await db.settings.add(newData);
    }

    alert(`Asesmen selesai! Rekomendasi Level: ${recommendedLevel}`);
    setIsDone(false); setStep(0); setScores([]);
  };

  return (
    <div className="p-4 pb-24 max-w-md mx-auto">
      <div className="bg-white p-5 rounded-2xl shadow-sm mt-4">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Asesmen Awal</h2>
        <p className="text-sm text-slate-500 mb-6">Alat bantu skrining (Adaptasi TASP & Fase PECS).</p>

        {isDone ? (
          <div className="text-center py-6">
            <CheckCircle2 size={60} className="text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">Asesmen Selesai!</h3>
            <button onClick={handleSave} className="w-full bg-blue-500 text-white font-bold py-3 rounded-xl">Simpan Hasil Asesmen</button>
          </div>
        ) : (
          <>
            {step === 0 && (
              <div className="space-y-4 mb-8 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Usia Kronologis (Tahun)</label>
                  <input type="number" min="0" value={chronoAge} onChange={(e) => setChronoAge(Number(e.target.value))} className="w-full border-2 border-slate-200 rounded-lg p-2" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Usia Perkembangan (Tahun)</label>
                  <input type="number" min="0" value={develAge} onChange={(e) => setDevelAge(Number(e.target.value))} className="w-full border-2 border-slate-200 rounded-lg p-2" />
                </div>
              </div>
            )}
            <div className="mb-4">
              <div className="flex gap-1 mb-4">
                {ASSESSMENT_QUESTIONS.map((q, i) => (
                  <div key={q.id} className={`h-2 flex-1 rounded-full ${i <= step ? 'bg-blue-500' : 'bg-slate-200'}`} />
                ))}
              </div>
              <p className="text-xs font-bold text-blue-600 mb-2">Pertanyaan {step + 1} dari {ASSESSMENT_QUESTIONS.length}</p>
              <h3 className="text-lg font-bold text-slate-800 mb-4">{ASSESSMENT_QUESTIONS[step].text}</h3>
              <div className="space-y-3">
                {ASSESSMENT_QUESTIONS[step].options.map((opt, i) => (
                  <button key={i} onClick={() => handleAnswer(opt.score)} className="w-full text-left p-4 rounded-xl border-2 border-slate-200 hover:border-blue-500 flex justify-between items-center">
                    <span className="text-sm font-semibold text-slate-700">{opt.label}</span>
                    <ChevronRight size={18} className="text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
