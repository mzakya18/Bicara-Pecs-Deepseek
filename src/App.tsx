import { useState } from 'react';
import { LayoutGrid, ClipboardList, Settings, Layers } from 'lucide-react';
import BoardPage from './pages/BoardPage';
import AssessmentPage from './pages/AssessmentPage';
import SettingsPage from './pages/SettingsPage';
import ToolsPage from './pages/ToolsPage';
import SchedulePage from './pages/SchedulePage';

export default function App() {
  // Tambahkan state untuk 'tools' dan 'schedule'
  const [currentTab, setCurrentTab] = useState<string>('board');

  return (
    <div className="min-h-screen bg-slate-100 max-w-md mx-auto flex flex-col font-sans relative pb-16">
      
      <main className="flex-1 overflow-y-auto">
        {currentTab === 'board' && <BoardPage />}
        {currentTab === 'assessment' && <AssessmentPage />}
        {currentTab === 'tools' && <ToolsPage onNavigate={setCurrentTab} />}
        {currentTab === 'schedule' && <SchedulePage onBack={() => setCurrentTab('tools')} />}
        {currentTab === 'settings' && <SettingsPage />}
      </main>

      {/* Sembunyikan Navigasi Bawah Jika Sedang di Halaman Schedule */}
      {currentTab !== 'schedule' && (
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-200 flex justify-around items-center h-16 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40">
          
          <button onClick={() => setCurrentTab('board')} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${currentTab === 'board' ? 'text-blue-600' : 'text-slate-400'}`}>
            <LayoutGrid size={22} />
            <span className="text-[10px] font-bold">Papan</span>
          </button>

          <button onClick={() => setCurrentTab('tools')} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${currentTab === 'tools' || currentTab === 'schedule' ? 'text-blue-600' : 'text-slate-400'}`}>
            <Layers size={22} />
            <span className="text-[10px] font-bold">Fitur</span>
          </button>

          <button onClick={() => setCurrentTab('assessment')} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${currentTab === 'assessment' ? 'text-blue-600' : 'text-slate-400'}`}>
            <ClipboardList size={22} />
            <span className="text-[10px] font-bold">Asesmen</span>
          </button>

          <button onClick={() => setCurrentTab('settings')} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${currentTab === 'settings' ? 'text-blue-600' : 'text-slate-400'}`}>
            <Settings size={22} />
            <span className="text-[10px] font-bold">Data</span>
          </button>
          
        </nav>
      )}
    </div>
  );
}
