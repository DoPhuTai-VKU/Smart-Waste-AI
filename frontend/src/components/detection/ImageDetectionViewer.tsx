import React, { useState } from 'react';
import { Layers, Eye, Cpu, Download } from 'lucide-react';
import type { DetectedObject } from '../../types/waste';
import { CanvasBoundingBox } from './CanvasBoundingBox';

interface ImageDetectionViewerProps {
  originalUrl: string;
  processedUrl?: string;
  predictions: DetectedObject[];
}

export const ImageDetectionViewer: React.FC<ImageDetectionViewerProps> = ({
  originalUrl,
  processedUrl,
  predictions,
}) => {
  // Chế độ xem: 'processed' (ưu tiên kết quả backend), 'canvas' (vẽ canvas tọa độ), 'original' (ảnh gốc)
  const [viewMode, setViewMode] = useState<'processed' | 'canvas' | 'original'>('processed');

  const hasBoxes = predictions.some((p) => p.bbox && p.bbox.length === 4);
  const activeImageUrl = viewMode === 'original' || !processedUrl ? originalUrl : processedUrl;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = activeImageUrl;
    link.download = `smart-waste-detected-${Date.now()}.jpg`;
    link.target = '_blank';
    link.click();
  };

  return (
    <div className="bg-slate-900 rounded-3xl p-5 overflow-hidden border border-slate-800 shadow-xl flex flex-col space-y-4">
      {/* Top toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        {/* Toggle Mode Pills */}
        <div className="inline-flex rounded-2xl bg-slate-800/90 p-1.5 border border-slate-700/80 text-sm">
          <button
            type="button"
            onClick={() => setViewMode('processed')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              viewMode === 'processed'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Cpu size={16} />
            <span>Ảnh kết quả (Backend)</span>
          </button>

          {hasBoxes && (
            <button
              type="button"
              onClick={() => setViewMode('canvas')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                viewMode === 'canvas'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Layers size={16} />
              <span>Canvas Overlay</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setViewMode('original')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              viewMode === 'original'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Eye size={16} />
            <span>Ảnh gốc</span>
          </button>
        </div>

        {/* Action: Download / Save */}
        <button
          type="button"
          onClick={handleDownload}
          className="px-3.5 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer text-sm font-bold flex items-center gap-2"
          title="Tải ảnh về máy"
        >
          <Download size={17} />
          <span className="hidden sm:inline">Lưu ảnh</span>
        </button>
      </div>

      {/* Main Image View Area */}
      <div className="relative min-h-[360px] max-h-[500px] rounded-2xl bg-slate-950 flex items-center justify-center overflow-hidden p-2">
        {viewMode === 'canvas' && hasBoxes ? (
          <CanvasBoundingBox imageUrl={originalUrl} predictions={predictions} />
        ) : (
          <img
            src={activeImageUrl}
            alt="Kết quả nhận diện"
            className="max-h-[480px] w-auto max-w-full rounded-2xl object-contain"
          />
        )}
      </div>

      {/* Caption indicator */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-slate-300 px-2 font-medium">
        <span className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
          {viewMode === 'processed' && 'Hiển thị ảnh phân tích từ YOLO Backend'}
          {viewMode === 'canvas' && 'Hiển thị tọa độ Bounding Box được vẽ bằng Canvas'}
          {viewMode === 'original' && 'Hiển thị ảnh gốc chưa can thiệp'}
        </span>
        <span className="font-bold text-emerald-400">
          Phát hiện {predictions.length} đối tượng
        </span>
      </div>
    </div>
  );
};
