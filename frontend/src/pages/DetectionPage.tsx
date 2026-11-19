import React, { useRef, useState } from 'react';
import axios from 'axios';
import {
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { WasteApiService } from '../services/api';
import type { PredictionResponse } from '../types/waste';
import { ImageDropzone } from '../components/detection/ImageDropzone';
import { ImageDetectionViewer } from '../components/detection/ImageDetectionViewer';
import { DetectionResultCard } from '../components/detection/DetectionResultCard';

export const DetectionPage: React.FC = () => {
  const newFileInput = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStage, setLoadingStage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResponse | null>(null);

  const handleFileSelect = (file: File) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setError(null);
    setResult(null);
  };

  const handleClear = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setError(null);
    setResult(null);
  };

  const handleRunDetection = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);
    setLoadingStage('Đang tải ảnh lên máy chủ...');

    try {
      setTimeout(() => {
        setLoadingStage('Mô hình YOLO đang phát hiện và khoanh vùng đối tượng...');
      }, 500);

      setTimeout(() => {
        setLoadingStage('Đang trích xuất nhãn, phân loại và hướng dẫn xử lý...');
      }, 900);

      const response = await WasteApiService.predictWaste(selectedFile);
      setResult(response);
    } catch (err: unknown) {
      console.error(err);
      const apiDetail = axios.isAxiosError<{ detail?: string }>(err)
        ? err.response?.data?.detail
        : undefined;
      const fallbackMessage = err instanceof Error
          ? err.message
          : 'Không thể kết nối đến API nhận diện. Vui lòng kiểm tra lại kết nối Backend hoặc chuyển sang chế độ Demo Mock API.';
      setError(typeof apiDetail === 'string' ? apiDetail : fallbackMessage);
    } finally {
      setLoading(false);
      setLoadingStage('');
    }
  };

  // Sample quick tests
  const handlePickSample = async (sampleUrl: string, sampleName: string) => {
    try {
      const response = await fetch(sampleUrl);
      if (!response.ok) throw new Error(`Sample image unavailable: ${response.status}`);
      const blob = await response.blob();
      const file = new File([blob], sampleName, { type: 'image/jpeg' });
      handleFileSelect(file);
    } catch {
      setError('Không thể tải ảnh mẫu thử nghiệm.');
    }
  };

  return (
    <div className="space-y-7">
      <input ref={newFileInput} type="file" accept="image/jpeg,image/png,image/webp"
        className="hidden" aria-label="Chọn ảnh mới để nhận diện"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) handleFileSelect(file);
          event.target.value = '';
        }} />
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
            Nhận diện & Phân loại rác thải AI
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Tải ảnh chụp rác thải để hệ thống tự động nhận diện nhóm rác và hướng dẫn xử lý
          </p>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-3">
            <AlertCircle size={20} className="text-rose-600 shrink-0" />
            <div className="space-y-0.5">
              <span className="font-bold">Đã xảy ra lỗi:</span>
              <p className="font-medium">{error}</p>
            </div>
          </div>
          <button
            onClick={() => setError(null)}
            className="px-3.5 py-1.5 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-colors cursor-pointer text-xs"
          >
            Đóng
          </button>
        </div>
      )}

      {/* State 1: Chưa nhận diện hoặc đang chọn ảnh */}
      {!result ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          <div className="lg:col-span-8 space-y-4">
            <ImageDropzone
              selectedFile={selectedFile}
              previewUrl={previewUrl}
              onFileSelect={handleFileSelect}
              onClear={handleClear}
            />

            {/* Nút kích hoạt nhận diện */}
            {selectedFile && (
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleRunDetection}
                  disabled={loading}
                  className={`inline-flex items-center gap-3 px-7 py-4 rounded-2xl font-black text-base shadow-lg transition-all cursor-pointer ${
                    loading
                      ? 'bg-emerald-400 text-white cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25 active:scale-98'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 size={22} className="animate-spin" />
                      <span>{loadingStage || 'Đang xử lý phân tích...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={22} />
                      <span>Bắt đầu nhận diện bằng AI</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Cột hướng dẫn & ảnh mẫu thử nghiệm nhanh */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-3.5">
              <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-base">
                <HelpCircle size={20} className="text-emerald-600" />
                <span>Mẹo chụp ảnh chính xác nhất</span>
              </div>
              <ul className="text-xs sm:text-sm text-slate-600 space-y-2.5 leading-relaxed font-medium">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>Đặt vật thể rác thải ở vị trí đủ sáng, trung tâm khung hình.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>Nên chụp trên nền trơn (bàn, sàn nhà, mặt đất) để giảm nhiễu.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>Hệ thống hỗ trợ phát hiện nhiều loại rác cùng lúc trong một ảnh.</span>
                </li>
              </ul>
            </div>

            {/* Quick Sample Photos */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-3.5">
              <p className="text-xs sm:text-sm font-extrabold text-slate-700 uppercase tracking-wider">
                Hoặc thử nhanh với ảnh mẫu
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    name: 'Chai nhựa',
                    url: '/samples/plastic-bottle.jpg',
                  },
                  {
                    name: 'Phong bì giấy',
                    url: '/samples/paper-envelope.jpg',
                  },
                  {
                    name: 'Lon kim loại',
                    url: '/samples/metal-can.jpg',
                  },
                  {
                    name: 'Vỏ chuối',
                    url: '/samples/banana-peel.jpg',
                  },
                ].map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePickSample(sample.url, `${sample.name}.jpg`)}
                    className="group relative rounded-2xl overflow-hidden aspect-video border border-slate-200 text-left hover:border-emerald-500 transition-all cursor-pointer shadow-2xs"
                  >
                    <img
                      src={sample.url}
                      alt={sample.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent flex items-end p-2.5">
                      <span className="text-xs font-bold text-white truncate">
                        {sample.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* State 2: Đã nhận diện thành công */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          {/* Cột ảnh */}
          <div className="lg:col-span-7">
            <ImageDetectionViewer
              originalUrl={previewUrl || result.original_image_url}
              processedUrl={result.processed_image_url}
              predictions={result.predictions || []}
            />
          </div>

          {/* Cột thông tin chi tiết kết quả */}
          <div className="lg:col-span-5">
            <DetectionResultCard result={result}
              onSelectNew={() => newFileInput.current?.click()} onClear={handleClear} />
          </div>
        </div>
      )}
    </div>
  );
};
