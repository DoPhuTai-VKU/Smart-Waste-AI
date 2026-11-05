import React, { useState, useEffect } from 'react';
import { Menu, Activity, Sparkles, CheckCircle2 } from 'lucide-react';
import { isMockMode, setMockMode } from '../../services/api';

interface HeaderProps {
  pageTitle: string;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ pageTitle, onToggleSidebar }) => {
  const [useMock, setUseMock] = useState(isMockMode());

  useEffect(() => {
    const handleModeChange = () => {
      setUseMock(isMockMode());
    };
    window.addEventListener('mock-mode-changed', handleModeChange);
    return () => window.removeEventListener('mock-mode-changed', handleModeChange);
  }, []);

  const handleToggle = () => {
    const nextVal = !useMock;
    setMockMode(nextVal);
    setUseMock(nextVal);
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4.5 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="flex items-center gap-3.5">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-slate-700 hover:text-emerald-600 hover:bg-slate-100 rounded-xl lg:hidden transition-colors cursor-pointer"
          title="Mở menu điều hướng"
        >
          <Menu size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {pageTitle}
          </h1>
          <p className="text-sm font-medium text-slate-500 hidden sm:block mt-0.5">
            Smart Waste AI • Hệ thống nhận diện & phân loại rác tự động
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Toggle Mode Control: Mock vs Live API */}
        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-slate-100 border border-slate-200 text-sm">
          <span className="flex items-center gap-1.5 font-medium text-slate-700">
            {useMock ? (
              <>
                <Sparkles size={16} className="text-amber-500 animate-pulse" />
                <span className="hidden md:inline font-semibold">Chế độ:</span>
                <span className="text-amber-700 font-bold">Demo Mock API</span>
              </>
            ) : (
              <>
                <Activity size={16} className="text-emerald-500" />
                <span className="hidden md:inline font-semibold">Chế độ:</span>
                <span className="text-emerald-700 font-bold">Live FastAPI</span>
              </>
            )}
          </span>
          <button
            onClick={handleToggle}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs ${
              useMock
                ? 'bg-amber-500 text-white hover:bg-amber-600'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
            title="Nhấn để chuyển đổi giữa Mock API và Backend Live"
          >
            Đổi sang {useMock ? 'Live API' : 'Mock'}
          </button>
        </div>

        {/* Status Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-sm font-bold">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>Sẵn sàng</span>
        </div>
      </div>
    </header>
  );
};
