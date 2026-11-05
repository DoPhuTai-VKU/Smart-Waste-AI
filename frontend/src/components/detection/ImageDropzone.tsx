import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, AlertTriangle, X, RefreshCw } from 'lucide-react';

interface ImageDropzoneProps {
  selectedFile: File | null;
  previewUrl: string | null;
  onFileSelect: (file: File) => void;
  onClear: () => void;
  maxSizeBytes?: number; // default 10MB
}

export const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  selectedFile,
  previewUrl,
  onFileSelect,
  onClear,
  maxSizeBytes = 10 * 1024 * 1024, // 10MB
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndSelect = (file: File) => {
    setErrorMessage(null);

    // 1. Kiểm tra định dạng ảnh
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage(
        'Định dạng tệp không được hỗ trợ. Vui lòng chọn ảnh định dạng JPG, JPEG, PNG hoặc WEBP.'
      );
      return;
    }

    // 2. Kiểm tra dung lượng
    if (file.size > maxSizeBytes) {
      const maxMb = (maxSizeBytes / (1024 * 1024)).toFixed(0);
      setErrorMessage(
        `Dung lượng ảnh vượt quá giới hạn cho phép (${maxMb}MB). Vui lòng chọn ảnh nhẹ hơn.`
      );
      return;
    }

    onFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSelect(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSelect(e.target.files[0]);
    }
  };

  // Format file size
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-4">
      {/* Ẩn input file gốc */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Thông báo lỗi định dạng hoặc kích thước */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertTriangle size={18} className="text-amber-600 shrink-0" />
            <span className="font-medium">{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="p-1 hover:bg-amber-100 rounded-lg text-amber-800"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Khu vực Dropzone hoặc Preview */}
      {!selectedFile || !previewUrl ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-9 lg:p-14 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-4.5 ${
            isDragOver
              ? 'border-emerald-500 bg-emerald-50/70 scale-[1.01]'
              : 'border-slate-300 hover:border-emerald-500 hover:bg-slate-50/60 bg-white'
          }`}
        >
          <div className="w-18 h-18 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
            <UploadCloud size={38} />
          </div>

          <div className="space-y-1.5">
            <p className="text-lg lg:text-xl font-extrabold text-slate-800">
              Kéo thả ảnh rác thải vào đây hoặc <span className="text-emerald-600 underline">chọn từ máy tính</span>
            </p>
            <p className="text-sm font-medium text-slate-500">
              Hỗ trợ các định dạng: PNG, JPG, JPEG, WEBP (Tối đa 10MB)
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs sm:text-sm font-medium text-slate-400 pt-1">
            <span className="flex items-center gap-1.5">
              <ImageIcon size={16} /> Độ phân giải cao
            </span>
            <span>•</span>
            <span>Tự động tối ưu hóa</span>
          </div>
        </div>
      ) : (
        /* Preview ảnh đã chọn */
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-5">
          <div className="relative rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center max-h-[400px]">
            <img
              src={previewUrl}
              alt="Ảnh đầu vào đã chọn"
              className="max-h-[400px] w-auto object-contain"
            />
            <div className="absolute top-3.5 left-3.5 bg-slate-900/80 backdrop-blur-md text-white text-xs sm:text-sm px-3.5 py-1.5 rounded-full flex items-center gap-2 font-bold">
              <ImageIcon size={15} />
              Ảnh gốc chờ nhận diện
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="min-w-0">
              <p className="text-base font-extrabold text-slate-900 truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
                Kích thước: {formatSize(selectedFile.size)} • Loại: {selectedFile.type}
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <RefreshCw size={15} />
                Đổi ảnh khác
              </button>
              <button
                type="button"
                onClick={onClear}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
              >
                <X size={15} />
                Hủy ảnh
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
