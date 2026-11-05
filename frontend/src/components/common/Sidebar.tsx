import React from 'react';
import {
  LayoutDashboard,
  Camera,
  History,
  BookOpen,
  Recycle,
  Sparkles,
  X,
} from 'lucide-react';

export type NavTab = 'dashboard' | 'detect' | 'history' | 'guide';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpen,
  onClose,
}) => {
  const navItems: Array<{
    id: NavTab;
    label: string;
    description: string;
    icon: React.ElementType;
    badge?: string;
  }> = [
    {
      id: 'dashboard',
      label: 'Tổng quan Dashboard',
      description: 'Chỉ số & biểu đồ thống kê',
      icon: LayoutDashboard,
    },
    {
      id: 'detect',
      label: 'Nhận diện rác',
      description: 'Upload ảnh & phân tích YOLO',
      icon: Camera,
      badge: 'AI',
    },
    {
      id: 'history',
      label: 'Lịch sử nhận diện',
      description: 'Dữ liệu lưu trữ & tìm kiếm',
      icon: History,
    },
    {
      id: 'guide',
      label: 'Quy chuẩn phân loại',
      description: 'Hướng dẫn các nhóm rác',
      icon: BookOpen,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/25">
              <Recycle size={26} className="animate-spin-slow" />
            </div>
            <div>
              <span className="font-black text-xl text-slate-900 tracking-tight flex items-center gap-1.5">
                Smart Waste <span className="text-emerald-600">AI</span>
              </span>
              <p className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full inline-block mt-0.5">
                AI Waste Classifier
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg lg:hidden"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            Chức năng chính
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3.5 rounded-2xl text-left transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/25'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-semibold'
                }`}
              >
                <div
                  className={`p-2.5 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600 group-hover:text-emerald-600 group-hover:bg-emerald-50'
                  }`}
                >
                  <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[15px] font-bold truncate leading-snug">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[11px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                          isActive
                            ? 'bg-white/25 text-white'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        <Sparkles size={11} />
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-xs truncate mt-0.5 ${
                      isActive ? 'text-emerald-50 font-medium' : 'text-slate-500 font-normal'
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
              </button>
            );
          })}
        </nav>

        {/* System info footer */}
        <div className="p-4 border-t border-slate-100">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/70 border border-emerald-200/80 text-sm">
            <div className="flex items-center gap-2 text-emerald-950 font-bold mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              Đồ án chuyên ngành
            </div>
            <p className="text-slate-600 text-xs leading-relaxed font-medium">
              Nhận diện rác thông minh bằng YOLO & Web Dashboard
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
