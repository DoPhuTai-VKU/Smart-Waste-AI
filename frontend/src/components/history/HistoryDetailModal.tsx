import React from 'react';
import type { HistoryItem } from '../../types/waste';
import { Modal } from '../common/Modal';
import { CategoryBadge } from '../common/Badge';
import { getCategoryInfo } from '../../constants/wasteCategories';
import { Trash2, Clock, Leaf } from 'lucide-react';

interface HistoryDetailModalProps {
  item: HistoryItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const HistoryDetailModal: React.FC<HistoryDetailModalProps> = ({
  item,
  isOpen,
  onClose,
}) => {
  if (!item) return null;

  const catInfo = getCategoryInfo(item.category);
  const confidencePercent = Math.round(item.confidence * 100);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Chi tiết nhận diện #${item.id}`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Ảnh */}
        <div className="rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center max-h-[380px]">
          <img
            src={item.processed_image_url || item.original_image_url}
            alt={item.primary_label}
            className="max-h-[380px] w-auto object-contain"
          />
        </div>

        {/* Thông tin chính */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <CategoryBadge category={item.category} size="md" showBinIndicator />
              <span className="text-xs sm:text-sm font-mono font-bold text-slate-400">
                ID: #{item.id}
              </span>
            </div>
            <h4 className="text-2xl font-black text-slate-900 leading-tight">
              {item.primary_label}
            </h4>
          </div>

          <div className="text-right">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-400 block">
              Độ tin cậy
            </span>
            <span className="text-2xl font-black text-emerald-600">
              {confidencePercent}%
            </span>
          </div>
        </div>

        {/* Hướng dẫn xử lý và màu nhận diện */}
        <div
          className="p-5 rounded-2xl border flex items-start gap-4"
          style={{
            backgroundColor: `${catInfo.binHex}12`,
            borderColor: `${catInfo.binHex}40`,
          }}
        >
          <div
            className="p-3 rounded-2xl shrink-0 mt-0.5 shadow-xs"
            style={{ backgroundColor: catInfo.binHex }}
          >
            <Trash2 size={22} color={catInfo.key === 'styrofoam' ? '#334155' : '#FFFFFF'} />
          </div>
          <div className="space-y-1.5">
            <span className="text-base font-extrabold text-slate-900">
              {catInfo.binColorName}
            </span>
            <p className="text-sm font-medium text-slate-700 leading-relaxed">
              {item.treatment_guide || catInfo.defaultGuide}
            </p>
          </div>
        </div>

        {/* Tác động môi trường */}
        {catInfo.environmentalImpact && (
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-sm text-emerald-950 font-medium leading-relaxed">
            <Leaf size={20} className="text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-emerald-900">Ý nghĩa phân loại: </span>
              <span>{catInfo.environmentalImpact}</span>
            </div>
          </div>
        )}

        {item.predictions && item.predictions.length > 0 && (
          <div className="space-y-3">
            <h5 className="font-extrabold text-slate-900">
              Tất cả vật thể phát hiện ({item.predictions.length})
            </h5>
            {item.predictions.map((pred, index) => {
              const info = getCategoryInfo(pred.category);
              return (
                <div key={pred.id || index} className="p-4 rounded-2xl border border-slate-200 space-y-2"
                  style={{ borderLeftWidth: 4, borderLeftColor: info.chartColor }}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-extrabold text-slate-900">#{index + 1} {pred.label}</span>
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
        )}

        {/* Thời gian */}
        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500 pt-2 border-t border-slate-100">
          <Clock size={16} />
          <span>Thời gian ghi nhận vào cơ sở dữ liệu: {item.created_at}</span>
        </div>
      </div>
    </Modal>
  );
};
