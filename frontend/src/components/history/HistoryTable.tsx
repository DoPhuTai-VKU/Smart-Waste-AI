import React from 'react';
import type { HistoryItem } from '../../types/waste';
import { CategoryBadge } from '../common/Badge';
import { Eye, ChevronLeft, ChevronRight, Inbox, Clock } from 'lucide-react';

interface HistoryTableProps {
  items: HistoryItem[];
  total: number;
  currentPage: number;
  limit: number;
  onPageChange: (page: number) => void;
  onSelectItem: (item: HistoryItem) => void;
  loading?: boolean;
}

export const HistoryTable: React.FC<HistoryTableProps> = ({
  items,
  total,
  currentPage,
  limit,
  onPageChange,
  onSelectItem,
  loading = false,
}) => {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-72 rounded-3xl bg-white border border-slate-200/90 animate-pulse p-5 space-y-4"
          />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-14 text-center border border-slate-200/90 shadow-xs flex flex-col items-center justify-center space-y-3.5">
        <div className="w-18 h-18 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center">
          <Inbox size={36} />
        </div>
        <h4 className="text-lg font-extrabold text-slate-800">
          Chưa tìm thấy lịch sử nhận diện phù hợp
        </h4>
        <p className="text-sm font-medium text-slate-500 max-w-md leading-relaxed">
          Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc phân loại để hiển thị toàn bộ dữ liệu.
        </p>
      </div>
    );
  }

  const startRecord = (currentPage - 1) * limit + 1;
  const endRecord = Math.min(currentPage * limit, total);

  return (
    <div className="space-y-6">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => {
          const confidencePct = Math.round(item.confidence * 100);

          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-4/3 bg-slate-900 overflow-hidden">
                <img
                  src={item.processed_image_url || item.original_image_url}
                  alt={item.primary_label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3.5 left-3.5">
                  <CategoryBadge category={item.category} size="sm" showBinIndicator />
                </div>
                <div className="absolute top-3.5 right-3.5 bg-slate-900/80 backdrop-blur-md text-white font-black text-xs sm:text-sm px-3 py-1 rounded-full shadow-xs">
                  {confidencePct}%
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5">
                <div className="space-y-1">
                  <h4 className="text-base font-extrabold text-slate-900 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                    {item.primary_label}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 font-medium">
                    <Clock size={14} />
                    <span>{item.created_at}</span>
                  </div>
                </div>

                {/* Footer action */}
                <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-400">
                    #{item.id}
                  </span>
                  <button
                    onClick={() => onSelectItem(item)}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    <Eye size={16} />
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4 text-sm font-medium text-slate-600">
          <div>
            Hiển thị <span className="font-bold text-slate-900">{startRecord}</span> -{' '}
            <span className="font-bold text-slate-900">{endRecord}</span> trong số{' '}
            <span className="font-bold text-slate-900">{total}</span> lượt nhận diện
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              title="Trang trước"
            >
              <ChevronLeft size={18} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => onPageChange(pg)}
                className={`w-9 h-9 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                  currentPage === pg
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {pg}
              </button>
            ))}

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              title="Trang tiếp theo"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
