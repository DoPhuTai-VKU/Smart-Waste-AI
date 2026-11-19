import React from 'react';
import { DEFAULT_WASTE_CATEGORIES } from '../constants/wasteCategories';
import { CategoryBadge } from '../components/common/Badge';
import {
  Trash2,
  Recycle,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

export const GuidePage: React.FC = () => {
  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
          Quy chuẩn phân loại rác thải tại nguồn
        </h2>
        <p className="text-sm font-medium text-slate-500 mt-1">
          Hướng dẫn nhận biết từng loại rác, cách xử lý sơ bộ và giá trị bảo vệ môi trường
        </p>
      </div>

      {/* Grid of Waste Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.values(DEFAULT_WASTE_CATEGORIES).map((cat) => (
          <div
            key={cat.key}
            className="bg-white rounded-3xl p-6 lg:p-7 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-5 hover:shadow-md transition-shadow"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <CategoryBadge category={cat.key} size="md" showBinIndicator />
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider font-mono">
                  {cat.labelEn}
                </span>
              </div>

              {/* Màu nhận diện vật liệu */}
              <div
                className="p-4 rounded-2xl border flex items-center gap-3.5 text-sm"
                style={{
                  backgroundColor: `${cat.binHex}14`,
                  borderColor: `${cat.binHex}40`,
                }}
              >
                <div
                  className="p-3 rounded-2xl shrink-0 shadow-xs"
                  style={{ backgroundColor: cat.binHex }}
                >
                  <Trash2 size={22} color={cat.key === 'styrofoam' ? '#334155' : '#FFFFFF'} />
                </div>
                <div>
                  <span className="font-extrabold text-slate-900 block text-base">
                    {cat.binColorName}
                  </span>
                  <span className="text-xs font-semibold text-slate-600">
                    Màu nhận diện trên giao diện
                  </span>
                </div>
              </div>

              {/* Hướng dẫn xử lý */}
              <div className="space-y-2">
                <span className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-600" />
                  Hướng dẫn xử lý sơ bộ:
                </span>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/80 font-medium">
                  {cat.defaultGuide}
                </p>
              </div>
            </div>

            {/* Ý nghĩa môi trường */}
            {cat.environmentalImpact && (
              <div className="pt-3 border-t border-slate-100 flex items-start gap-2.5 text-xs sm:text-sm text-emerald-950 bg-emerald-50 p-3.5 rounded-2xl font-medium leading-relaxed">
                <Recycle size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>{cat.environmentalImpact}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Info card: FAQ / Tiêu chí đồ án */}
      <div className="bg-white rounded-3xl p-6 lg:p-7 border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex items-center gap-2.5 font-extrabold text-slate-900 text-base">
          <HelpCircle size={22} className="text-emerald-600" />
          <span>Lưu ý về danh mục phân loại trong đồ án Smart Waste AI</span>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed font-medium">
          Hệ thống được thiết kế theo kiến trúc mở và linh hoạt. Khi Thành viên 1 cập nhật thêm
          hoặc hiệu chỉnh các lớp (classes) trong mô hình YOLO (ví dụ: bổ sung rác thải nguy hại,
          pin, thiết bị điện tử...), Frontend sẽ tự động nhận diện và hiển thị huy hiệu phù hợp
          mà không cần thay đổi cấu trúc mã nguồn.
        </p>
      </div>
    </div>
  );
};
