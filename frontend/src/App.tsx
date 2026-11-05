import { useState } from 'react';
import { Sidebar, type NavTab } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { DashboardPage } from './pages/DashboardPage';
import { DetectionPage } from './pages/DetectionPage';
import { HistoryPage } from './pages/HistoryPage';
import { GuidePage } from './pages/GuidePage';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const getPageTitle = (tab: NavTab): string => {
    switch (tab) {
      case 'dashboard':
        return 'Tổng quan Dashboard';
      case 'detect':
        return 'Nhận diện & Phân loại AI';
      case 'history':
        return 'Lịch sử nhận diện';
      case 'guide':
        return 'Quy chuẩn phân loại rác';
      default:
        return 'Smart Waste AI';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Sidebar điều hướng */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:pl-72 transition-all">
        {/* Header trên cùng */}
        <Header
          pageTitle={getPageTitle(activeTab)}
          onToggleSidebar={() => setSidebarOpen(true)}
        />

        {/* Nội dung trang theo Tab */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardPage onNavigate={(tab) => setActiveTab(tab)} />
          )}
          {activeTab === 'detect' && <DetectionPage />}
          {activeTab === 'history' && <HistoryPage />}
          {activeTab === 'guide' && <GuidePage />}
        </main>

        {/* Footer */}
        <footer className="px-6 py-5 border-t border-slate-200/90 bg-white/80 text-center text-sm font-medium text-slate-500">
          Smart Waste AI © {new Date().getFullYear()} • Đồ án chuyên ngành CNTT & Trí tuệ nhân tạo
        </footer>
      </div>
    </div>
  );
}

export default App;
