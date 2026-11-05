import React, { useEffect, useState, useCallback } from 'react';
import type { HistoryItem, HistoryListResponse } from '../types/waste';
import { WasteApiService } from '../services/api';
import { HistoryFilter } from '../components/history/HistoryFilter';
import { HistoryTable } from '../components/history/HistoryTable';
import { HistoryDetailModal } from '../components/history/HistoryDetailModal';
import { RefreshCw, AlertCircle } from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const [data, setData] = useState<HistoryListResponse>({
    total: 0,
    page: 1,
    limit: 6,
    items: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'confidence'>('newest');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Selected item for modal
  const [activeItem, setActiveItem] = useState<HistoryItem | null>(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await WasteApiService.getHistory({
        search: searchTerm,
        category: selectedCategory,
        sortBy: sortBy,
        page: currentPage,
        limit: 6,
      });
      setData(response);
    } catch (err) {
      console.error(err);
      setError('Không thể tải lịch sử nhận diện từ máy chủ.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory, sortBy, currentPage]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // reset về trang 1 khi gõ tìm kiếm
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1); // reset về trang 1 khi đổi nhóm rác
  };

  const handleSortChange = (sort: 'newest' | 'oldest' | 'confidence') => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-7">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
            Lịch sử nhận diện rác thải
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Tra cứu các lần phân loại trước đó được lưu trữ trong cơ sở dữ liệu
          </p>
        </div>

        <button
          onClick={fetchHistory}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          <span>Tải lại</span>
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center justify-between">
          <div className="flex items-center gap-3 font-semibold">
            <AlertCircle size={20} className="text-rose-600" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchHistory}
            className="px-3.5 py-1.5 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 text-xs"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Bộ lọc và tìm kiếm */}
      <HistoryFilter
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
      />

      {/* Bảng danh sách & Phân trang */}
      <HistoryTable
        items={data.items}
        total={data.total}
        currentPage={data.page}
        limit={data.limit}
        onPageChange={(pg) => setCurrentPage(pg)}
        onSelectItem={(item) => setActiveItem(item)}
        loading={loading}
      />

      {/* Modal chi tiết một lần nhận diện */}
      <HistoryDetailModal
        isOpen={Boolean(activeItem)}
        onClose={() => setActiveItem(null)}
        item={activeItem}
      />
    </div>
  );
};
