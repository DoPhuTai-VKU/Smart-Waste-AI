import React from 'react';
import { getCategoryInfo } from '../../constants/wasteCategories';
import type { WasteCategoryKey } from '../../types/waste';

interface BadgeProps {
  category: WasteCategoryKey;
  customText?: string;
  size?: 'sm' | 'md' | 'lg';
  showBinIndicator?: boolean;
}

export const CategoryBadge: React.FC<BadgeProps> = ({
  category,
  customText,
  size = 'md',
  showBinIndicator = false,
}) => {
  const info = getCategoryInfo(category);

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1 font-bold',
    md: 'text-sm px-3.5 py-1.5 font-bold',
    lg: 'text-base px-4 py-2 font-extrabold',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border shadow-2xs ${info.badgeBg} ${info.badgeText} ${info.badgeBorder} ${sizeClasses}`}
    >
      {showBinIndicator && (
        <span
          className="inline-block w-2.5 h-2.5 rounded-full ring-2 ring-white/80 shrink-0"
          style={{ backgroundColor: info.binHex }}
        />
      )}
      {customText || info.labelVi}
    </span>
  );
};
