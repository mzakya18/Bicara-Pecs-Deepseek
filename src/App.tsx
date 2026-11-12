import { useState } from 'react';
import { LayoutGrid, ClipboardList, Settings } from 'lucide-react';
import BoardPage from './pages/BoardPage';
import AssessmentPage from './pages/AssessmentPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'board' | 'assessment' | 'settings'>('board');

  return (
    <div className="min-h-screen bg-slate-100 max-w-md mx-auto flex flex-col font-sans relative pb-16">
      
      <main className="flex-1 overflow-y-auto">
        {currentTab === 'board' && <BoardPage />}
        {currentTab === 'assessment' && <AssessmentPage />}
        {currentTab === 'settings' && <SettingsPage />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-200 flex justify-around items-center h-16 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
        <button 
          onClick={() => setCurrentTab('board')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${currentTab === 'board' ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <LayoutGrid size={22} />
          <span className="text-[10px] font-bold">Papan</span>
        </button>

        <button 
          onClick={() => setCurrentTab('assessment')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${currentTab === 'assessment' ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <ClipboardList size={22} />
          <span className="text-[10px] font-bold">Asesmen</span>
        </button>

        <button 
          onClick={() => setCurrentTab('settings')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${currentTab === 'settings' ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <Settings size={22} />
          <span className="text-[10px] font-bold">Pengaturan</span>
        </button>
      </nav>

    </div>
  );
}
