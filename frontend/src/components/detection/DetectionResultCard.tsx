import React from 'react';
import {
  Trash2,
  Leaf,
  Clock,
  Sparkles,
  ImagePlus,
} from 'lucide-react';
import type { PredictionResponse } from '../../types/waste';
import { CategoryBadge } from '../common/Badge';
import { getCategoryInfo } from '../../constants/wasteCategories';

interface DetectionResultCardProps {
  result: PredictionResponse;
  onSelectNew: () => void;
  onClear: () => void;
}

export const DetectionResultCard: React.FC<DetectionResultCardProps> = ({
  result,
  onSelectNew,
  onClear,
}) => {
  const catInfo = getCategoryInfo(result.primary_category);
  const confidencePercent = Math.round(result.confidence * 100);

  // Chọn màu cho thanh tiến trình confidence
  const confidenceColor =
    confidencePercent >= 90
      ? 'bg-emerald-500'
      : confidencePercent >= 75
      ? 'bg-amber-500'
      : 'bg-rose-500';

  return (
    <div className="bg-white rounded-3xl p-6 lg:p-7 border border-slate-200/90 shadow-sm space-y-6">
      {/* Header Result */}
      <div className="flex flex-wrap items-start justify-between gap-3 pb-5 border-b border-slate-100">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500">
              Kết quả phân loại
            </span>
            <CategoryBadge category={result.primary_category} size="sm" showBinIndicator />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
            {result.primary_label}
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={onSelectNew}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer">
            <ImagePlus size={16} /> Chọn ảnh mới
          </button>
          <button type="button" onClick={onClear}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer">
            Xóa khỏi màn hình
          </button>
        </div>
      </div>

      {/* Confidence Meter */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
        <div className="flex items-center justify-between text-sm font-bold">
          <span className="flex items-center gap-2 text-slate-700">
            <Sparkles size={16} className="text-amber-500" />
            Độ tin cậy của mô hình (Confidence)
          </span>
          <span className="text-slate-900 font-black text-lg">
            {confidencePercent}%
          </span>
        </div>
        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${confidenceColor}`}
            style={{ width: `${confidencePercent}%` }}
          />
        </div>
        <p className="text-xs font-medium text-slate-500">
          Dự đoán bởi mô hình học sâu YOLO với độ chính xác cao
        </p>
      </div>

      {/* Hướng dẫn xử lý và màu nhận diện */}
      <div
        className="p-5 rounded-2xl border flex items-start gap-4 transition-all"
        style={{
          backgroundColor: `${catInfo.binHex}12`, // 7% tint
          borderColor: `${catInfo.binHex}40`,
        }}
      >
        <div
          className="p-3 rounded-2xl shrink-0 mt-0.5 shadow-xs"
          style={{ backgroundColor: catInfo.binHex }}
        >
          <Trash2 size={24} color={catInfo.key === 'styrofoam' ? '#334155' : '#FFFFFF'} />
        </div>
        <div className="space-y-1.5 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-extrabold text-base text-slate-900">
              Màu nhận diện:
            </span>
            <span
              className="text-xs sm:text-sm font-bold px-3 py-0.5 rounded-lg shadow-2xs"
              style={{ backgroundColor: catInfo.binHex, color: catInfo.key === 'styrofoam' ? '#334155' : '#FFFFFF' }}
            >
              {catInfo.binColorName}
            </span>
          </div>
          <p className="text-sm font-medium text-slate-700 leading-relaxed">
            {result.treatment_guide || catInfo.defaultGuide}
          </p>
        </div>
      </div>

      {/* Environmental Impact note */}
      {catInfo.environmentalImpact && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-sm text-emerald-950 font-medium">
          <Leaf size={20} className="text-emerald-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-extrabold text-emerald-900">Tác động môi trường: </span>
            <span>{catInfo.environmentalImpact}</span>
          </div>
        </div>
      )}

      {/* Danh sách các vật thể phát hiện trong ảnh (Multi-object detection) */}
      {result.predictions && result.predictions.length > 0 && (
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-600">
            <span>Tất cả vật thể phát hiện ({result.predictions.length})</span>
          </div>

          <div className="space-y-3">
            {result.predictions.map((pred, i) => {
              const info = getCategoryInfo(pred.category);
              return (
                <div key={pred.id || i} className="p-4 border border-slate-200 rounded-2xl space-y-3"
                  style={{ borderLeftWidth: 4, borderLeftColor: info.chartColor }}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-extrabold text-slate-900">#{i + 1} {pred.label}</span>
                      <CategoryBadge category={pred.category} size="sm" />
                    </div>
                    <span className="font-extrabold text-slate-800">{(pred.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    <span className="font-bold">Hướng dẫn xử lý: </span>
                    {pred.treatment_guide || info.defaultGuide}
                  </p>
                  {pred.bbox && <p className="font-mono text-xs text-slate-500">Box: [{pred.bbox.join(', ')}]</p>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Timestamp */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 pt-2 border-t border-slate-100 font-medium">
        <Clock size={15} />
        <span>Thời gian nhận diện: {result.timestamp}</span>
      </div>
    </div>
  );
};
