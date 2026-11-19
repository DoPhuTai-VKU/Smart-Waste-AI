import type { WasteCategoryInfo, WasteCategoryKey } from '../types/waste';

/**
 * Bảy waste categories tương ứng với bảy detection classes của YOLO.
 * Màu chỉ dùng để nhận diện vật liệu trên giao diện, không quy định màu thùng rác.
 * Cấu hình tập trung tại đây giúp ứng dụng linh hoạt, không hardcode ở các component.
 */
export const DEFAULT_WASTE_CATEGORIES: Record<string, WasteCategoryInfo> = {
  plastic: {
    key: 'plastic',
    labelVi: 'Nhựa',
    labelEn: 'Plastic',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
    badgeBorder: 'border-blue-200',
    chartColor: '#3B82F6',
    binColorName: 'Màu nhận diện nhựa',
    binHex: '#3B82F6',
    iconName: 'Package',
    defaultGuide: 'Làm sạch, để khô và phân loại theo khả năng thu gom tại địa phương.',
    environmentalImpact: 'Nhựa mất từ 450 - 1000 năm để phân hủy nếu chôn lấp.',
  },
  paper: {
    key: 'paper',
    labelVi: 'Giấy',
    labelEn: 'Paper',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800',
    badgeBorder: 'border-amber-200',
    chartColor: '#C4A484',
    binColorName: 'Màu nhận diện giấy',
    binHex: '#C4A484',
    iconName: 'FileText',
    defaultGuide: 'Giữ khô và sạch; tách phần dính dầu hoặc vật liệu khác.',
    environmentalImpact: 'Tái chế 1 tấn giấy cứu được 17 cây xanh và tiết kiệm 26.000 lít nước.',
  },
  metal: {
    key: 'metal',
    labelVi: 'Kim loại',
    labelEn: 'Metal',
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-700',
    badgeBorder: 'border-slate-300',
    chartColor: '#9CA3AF',
    binColorName: 'Màu nhận diện kim loại',
    binHex: '#9CA3AF',
    iconName: 'ShieldAlert',
    defaultGuide: 'Làm sạch lon, hộp; chú ý cạnh sắc.',
    environmentalImpact: 'Kim loại có thể tái chế vô hạn lần mà không giảm chất lượng.',
  },
  glass: {
    key: 'glass',
    labelVi: 'Thủy tinh',
    labelEn: 'Glass',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200',
    chartColor: '#67C5B5',
    binColorName: 'Màu nhận diện thủy tinh',
    binHex: '#67C5B5',
    iconName: 'Wine',
    defaultGuide: 'Rửa sạch; bọc và thu gom riêng mảnh vỡ.',
    environmentalImpact: 'Thủy tinh cần hơn 1 triệu năm để tự phân hủy trong tự nhiên.',
  },
  'banana-peel': {
    key: 'banana-peel',
    labelVi: 'Vỏ chuối',
    labelEn: 'Banana Peel',
    badgeBg: 'bg-yellow-50',
    badgeText: 'text-yellow-800',
    badgeBorder: 'border-yellow-200',
    chartColor: '#D4A017',
    binColorName: 'Màu nhận diện vỏ chuối',
    binHex: '#D4A017',
    iconName: 'Apple',
    defaultGuide: 'Thu gom riêng cùng rác hữu cơ; có thể ủ phân nếu phù hợp.',
    environmentalImpact: 'Vỏ chuối có thể trở thành nguyên liệu ủ phân hữu cơ.',
  },
  'orange-peel': {
    key: 'orange-peel',
    labelVi: 'Vỏ cam',
    labelEn: 'Orange Peel',
    badgeBg: 'bg-orange-50',
    badgeText: 'text-orange-700',
    badgeBorder: 'border-orange-200',
    chartColor: '#F97316',
    binColorName: 'Màu nhận diện vỏ cam',
    binHex: '#F97316',
    iconName: 'Apple',
    defaultGuide: 'Thu gom cùng rác hữu cơ; bỏ tem, bao bì trước khi ủ phân.',
    environmentalImpact: 'Thu gom riêng vỏ cam giúp tận dụng nguyên liệu hữu cơ.',
  },
  styrofoam: {
    key: 'styrofoam',
    labelVi: 'Xốp EPS',
    labelEn: 'Styrofoam',
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-700',
    badgeBorder: 'border-slate-300',
    chartColor: '#E5E7EB',
    binColorName: 'Màu nhận diện xốp EPS',
    binHex: '#E5E7EB',
    iconName: 'Package',
    defaultGuide: 'Giữ sạch, khô; kiểm tra điểm thu gom chuyên biệt, không mặc định bỏ chung với nhựa tái chế.',
    environmentalImpact: 'Xốp EPS khó thu gom tái chế trong nhiều hệ thống địa phương.',
  },
};

/**
 * Fallback mặc định cho các nhóm rác mới hoặc chưa định nghĩa
 */
export const FALLBACK_CATEGORY: WasteCategoryInfo = {
  key: 'other',
  labelVi: 'Khác / Hỗn hợp',
  labelEn: 'Other / Mixed',
  badgeBg: 'bg-purple-50',
  badgeText: 'text-purple-700',
  badgeBorder: 'border-purple-200',
  chartColor: '#8B5CF6',
  binColorName: 'Màu nhận diện khác',
  binHex: '#8B5CF6',
  iconName: 'Trash2',
  defaultGuide: 'Vui lòng kiểm tra lại chất liệu hoặc liên hệ điểm thu gom rác thải địa phương.',
  environmentalImpact: 'Cần phân loại kỹ để tránh ô nhiễm thứ cấp.',
};

/**
 * Hàm trợ giúp lấy thông tin danh mục rác, an toàn trước giá trị undefined/mới
 */
export function getCategoryInfo(rawKey?: WasteCategoryKey | string): WasteCategoryInfo {
  if (!rawKey) return FALLBACK_CATEGORY;
  const normalized = rawKey.toLowerCase().trim();
  
  // Kiểm tra key chuẩn
  if (DEFAULT_WASTE_CATEGORIES[normalized]) {
    return DEFAULT_WASTE_CATEGORIES[normalized];
  }

  // Khớp gần đúng (nếu backend trả về tên tiếng Việt hoặc tên nhãn chi tiết)
  for (const [key, info] of Object.entries(DEFAULT_WASTE_CATEGORIES)) {
    if (
      normalized.includes(key) ||
      normalized.includes(info.labelEn.toLowerCase()) ||
      normalized.includes(info.labelVi.toLowerCase())
    ) {
      return info;
    }
  }

  // Tạo dynamically nếu là nhóm mới
  return {
    ...FALLBACK_CATEGORY,
    key: rawKey,
    labelVi: rawKey,
    labelEn: rawKey,
  };
}
