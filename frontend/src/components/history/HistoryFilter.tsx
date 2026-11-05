import React from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { DEFAULT_WASTE_CATEGORIES } from '../../constants/wasteCategories';

interface HistoryFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  sortBy: 'newest' | 'oldest' | 'confidence';
  onSortChange: (sort: 'newest' | 'oldest' | 'confidence') => void;
}

export const HistoryFilter: React.FC<HistoryFilterProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4">
      {/* Ô tìm kiếm */}
      <div className="relative flex-1 min-w-[260px]">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm kiếm theo tên rác thải (vd: chai nhựa, lon nhôm...)"
          className="w-full pl-11 pr-4 py-2.5 text-sm font-medium rounded-2xl border border-slate-200 focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 placeholder-slate-400"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Lọc theo nhóm rác */}
        <div className="flex items-center gap-2">
          <Filter size={17} className="text-slate-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="text-sm py-2.5 px-3.5 rounded-2xl border border-slate-200 bg-white text-slate-800 focus:outline-hidden focus:border-emerald-500 font-bold cursor-pointer"
          >
            <option value="all">Tất cả nhóm rác</option>
            {Object.values(DEFAULT_WASTE_CATEGORIES).map((cat) => (
              <option key={cat.key} value={cat.key}>
                {cat.labelVi} ({cat.labelEn})
              </option>
            ))}
          </select>
        </div>

        {/* Sắp xếp */}
        <div className="flex items-center gap-2">
          <ArrowUpDown size={17} className="text-slate-400 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) =>
              onSortChange(e.target.value as 'newest' | 'oldest' | 'confidence')
            }
            className="text-sm py-2.5 px-3.5 rounded-2xl border border-slate-200 bg-white text-slate-800 focus:outline-hidden focus:border-emerald-500 font-bold cursor-pointer"
          >
            <option value="newest">Mới nhất trước</option>
            <option value="oldest">Cũ nhất trước</option>
            <option value="confidence">Độ chính xác cao nhất</option>
          </select>
        </div>
      </div>
    </div>
  );
};
