import React, { useEffect, useState } from 'react';
import {
  Layers,
  Flame,
  CheckCircle,
  Calendar,
  RefreshCw,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { WasteApiService } from '../services/api';
import type { DashboardStatsResponse } from '../types/waste';
import { StatCard } from '../components/dashboard/StatCard';
import { CategoryChart } from '../components/dashboard/CategoryChart';
import { TimeSeriesChart } from '../components/dashboard/TimeSeriesChart';
import { DEFAULT_WASTE_CATEGORIES } from '../constants/wasteCategories';
import type { NavTab } from '../components/common/Sidebar';

interface DashboardPageProps {
  onNavigate: (tab: NavTab) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await WasteApiService.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error(err);
      setError('Không thể tải dữ liệu thống kê từ hệ thống. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-7">
      {/* Banner chào mừng & call-to-action */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-900 text-white p-7 lg:p-9 shadow-lg shadow-emerald-900/15">
        <div className="relative z-10 max-w-2xl space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs sm:text-sm font-bold text-white shadow-2xs">
            <Sparkles size={16} className="text-emerald-300" />
            Trí tuệ nhân tạo bảo vệ môi trường
          </div>
          <h2 className="text-3xl lg:text-4xl font-black tracking-tight leading-snug">
            Hệ thống nhận diện & phân loại rác thải tự động
          </h2>
          <p className="text-emerald-50 text-base lg:text-lg leading-relaxed font-normal">
            Ứng dụng mô hình học sâu YOLO để phát hiện và phân loại các loại rác thải
            sinh hoạt, hỗ trợ tái chế và tối ưu hóa quy trình xử lý rác thải đô thị.
          </p>
          <div className="pt-3 flex flex-wrap gap-3.5">
            <button
              onClick={() => onNavigate('detect')}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-white text-emerald-900 font-extrabold text-sm sm:text-base shadow-md hover:bg-emerald-50 transition-all cursor-pointer"
            >
              Thử nghiệm nhận diện ngay
              <ArrowRight size={18} />
            </button>
            <button
              onClick={fetchStats}
              disabled={loading}
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm sm:text-base backdrop-blur-md transition-all cursor-pointer"
            >
              <RefreshCw size={17} className={loading ? 'animate-spin' : ''} />
              Làm mới dữ liệu
            </button>
          </div>
        </div>
        {/* Background decorative graphic */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
          <Layers size={280} />
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && !stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 rounded-3xl bg-white animate-pulse border border-slate-200/90 p-6"
            />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm font-semibold">
            <AlertCircle size={22} className="shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchStats}
            className="px-4 py-2 bg-rose-600 text-white text-sm font-bold rounded-xl hover:bg-rose-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Metric Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Tổng số lượt nhận diện"
            value={stats.total_scans.toLocaleString()}
            subtitle="Đã lưu trong CSDL"
            icon={Layers}
            iconBgColor="bg-emerald-50"
            iconColor="text-emerald-600"
            trend={{ value: '+12% tuần này', isPositive: true }}
          />

          <StatCard
            title="Loại rác phổ biến nhất"
            value={stats.most_common_type}
            subtitle="Tỷ lệ xuất hiện cao nhất"
            icon={Flame}
            iconBgColor="bg-amber-50"
            iconColor="text-amber-600"
          />

          <StatCard
            title="Độ chính xác TB (Confidence)"
            value={`${stats.average_confidence}%`}
            subtitle="Mô hình YOLO Model"
            icon={CheckCircle}
            iconBgColor="bg-blue-50"
            iconColor="text-blue-600"
            trend={{ value: 'Đạt chuẩn cao', isPositive: true }}
          />

          <StatCard
            title="Lượt quét hôm nay"
            value={stats.today_scans.toLocaleString()}
            subtitle="Cập nhật theo thời gian thực"
            icon={Calendar}
            iconBgColor="bg-teal-50"
            iconColor="text-teal-600"
          />
        </div>
      )}

      {/* Biểu đồ thống kê: Recharts Category + Time Series */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <CategoryChart data={stats.category_counts} />
          </div>
          <div className="lg:col-span-5">
            <TimeSeriesChart data={stats.time_series} />
          </div>
        </div>
      )}

      {/* Danh mục các nhóm rác hỗ trợ bởi hệ thống */}
      <div className="bg-white rounded-3xl p-6 lg:p-7 border border-slate-200/90 shadow-xs space-y-5">
        <div>
          <h4 className="text-lg lg:text-xl font-extrabold text-slate-900">
            7 Nhóm rác được hệ thống nhận dạng
          </h4>
          <p className="text-sm font-medium text-slate-500 mt-0.5">
            Hỗ trợ phân loại tại nguồn theo quy chuẩn bảo vệ môi trường
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Object.values(DEFAULT_WASTE_CATEGORIES).map((cat) => (
            <div
              key={cat.key}
              className="p-5 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all bg-slate-50/60 flex flex-col justify-between space-y-3.5"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className="w-3.5 h-3.5 rounded-full shadow-2xs"
                    style={{ backgroundColor: cat.chartColor }}
                  />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {cat.labelEn}
                  </span>
                </div>
                <h5 className="font-extrabold text-slate-900 text-base">{cat.labelVi}</h5>
                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed line-clamp-3">
                  {cat.defaultGuide}
                </p>
              </div>
              <div className="pt-2.5 border-t border-slate-200 flex items-center justify-between text-xs sm:text-[13px] font-bold text-slate-700">
                <span>{cat.binColorName}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
