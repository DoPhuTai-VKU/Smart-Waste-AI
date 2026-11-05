import React, { useEffect, useRef } from 'react';
import type { DetectedObject } from '../../types/waste';
import { getCategoryInfo } from '../../constants/wasteCategories';

interface CanvasBoundingBoxProps {
  imageUrl: string;
  predictions: DetectedObject[];
}

export const CanvasBoundingBox: React.FC<CanvasBoundingBoxProps> = ({
  imageUrl,
  predictions,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    img.onload = () => {
      // Thiết lập kích thước canvas theo đúng tỉ lệ ảnh
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      // Vẽ ảnh nền
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      // Vẽ từng Bounding Box
      predictions.forEach((pred) => {
        if (!pred.bbox || pred.bbox.length < 4) return;
        const [x1, y1, x2, y2] = pred.bbox;
        const width = x2 - x1;
        const height = y2 - y1;

        const info = getCategoryInfo(pred.category);
        const boxColor = info.chartColor || '#10B981';

        // 1. Vẽ khung viền Bounding Box
        ctx.strokeStyle = boxColor;
        ctx.lineWidth = Math.max(3, Math.round(canvas.width / 250));
        ctx.strokeRect(x1, y1, width, height);

        // Nền mờ nhẹ bên trong hộp nhận diện
        ctx.fillStyle = `${boxColor}22`; // 13% opacity
        ctx.fillRect(x1, y1, width, height);

        // 2. Vẽ nhãn thông tin (Label Tag)
        const labelText = `${pred.label} ${(pred.confidence * 100).toFixed(0)}%`;
        const fontSize = Math.max(14, Math.round(canvas.width / 35));
        ctx.font = `bold ${fontSize}px sans-serif`;
        const textMetrics = ctx.measureText(labelText);
        const textWidth = textMetrics.width;
        const textHeight = fontSize * 1.2;
        const tagPadding = Math.max(4, Math.round(fontSize / 3));

        const tagX = Math.max(0, x1);
        const tagY = Math.max(0, y1 - textHeight - tagPadding * 2);

        // Tag background
        ctx.fillStyle = boxColor;
        ctx.beginPath();
        ctx.roundRect
          ? ctx.roundRect(tagX, tagY, textWidth + tagPadding * 2, textHeight + tagPadding * 2, 4)
          : ctx.fillRect(tagX, tagY, textWidth + tagPadding * 2, textHeight + tagPadding * 2);
        ctx.fill();

        // Tag text
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(labelText, tagX + tagPadding, tagY + textHeight);
      });
    };
  }, [imageUrl, predictions]);

  return (
    <div ref={containerRef} className="relative w-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="max-h-[460px] w-auto max-w-full rounded-2xl object-contain shadow-inner"
      />
    </div>
  );
};
