import type { WasteCategoryInfo, WasteCategoryKey } from '../types/waste';

/**
 * Danh mục các loại rác chính của hệ thống Smart Waste AI.
 * Cấu hình tập trung tại đây giúp ứng dụng linh hoạt, không hardcode ở các component.
 */
export const DEFAULT_WASTE_CATEGORIES: Record<string, WasteCategoryInfo> = {
  plastic: {
    key: 'plastic',
    labelVi: 'Rác nhựa',
    labelEn: 'Plastic',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-700',
    badgeBorder: 'border-amber-200',
    chartColor: '#F59E0B',
    binColorName: 'Thùng màu cam / vàng',
    binHex: '#F59E0B',
    iconName: 'Package',
    defaultGuide: 'Rửa sạch cặn bẩn, dẫm bẹp vỏ chai để giảm thể tích trước khi bỏ vào thùng rác tái chế.',
    environmentalImpact: 'Nhựa mất từ 450 - 1000 năm để phân hủy nếu chôn lấp.',
  },
  paper: {
    key: 'paper',
    labelVi: 'Rác giấy',
    labelEn: 'Paper',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
    badgeBorder: 'border-blue-200',
    chartColor: '#3B82F6',
    binColorName: 'Thùng màu xanh dương',
    binHex: '#3B82F6',
    iconName: 'FileText',
    defaultGuide: 'Giữ giấy khô ráo, phẳng phiu, loại bỏ ghim kim loại trước khi tái chế.',
    environmentalImpact: 'Tái chế 1 tấn giấy cứu được 17 cây xanh và tiết kiệm 26.000 lít nước.',
  },
  metal: {
    key: 'metal',
    labelVi: 'Kim loại',
    labelEn: 'Metal',
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-700',
    badgeBorder: 'border-slate-300',
    chartColor: '#64748B',
    binColorName: 'Thùng màu bạc / xám',
    binHex: '#64748B',
    iconName: 'ShieldAlert',
    defaultGuide: 'Vệ sinh sạch lon hoặc vỏ đồ hộp kim loại, cẩn thận với các cạnh sắc nhọn.',
    environmentalImpact: 'Kim loại có thể tái chế vô hạn lần mà không giảm chất lượng.',
  },
  glass: {
    key: 'glass',
    labelVi: 'Thủy tinh',
    labelEn: 'Glass',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200',
    chartColor: '#10B981',
    binColorName: 'Thùng màu xanh ngọc',
    binHex: '#10B981',
    iconName: 'Wine',
    defaultGuide: 'Rửa sạch dầu mỡ hoặc nước thừa, phân loại riêng mảnh vỡ để tránh gây thương tích.',
    environmentalImpact: 'Thủy tinh cần hơn 1 triệu năm để tự phân hủy trong tự nhiên.',
  },
  organic: {
    key: 'organic',
    labelVi: 'Rác hữu cơ',
    labelEn: 'Organic',
    badgeBg: 'bg-lime-50',
    badgeText: 'text-lime-700',
    badgeBorder: 'border-lime-200',
    chartColor: '#84CC16',
    binColorName: 'Thùng màu xanh lá cây',
    binHex: '#84CC16',
    iconName: 'Apple',
    defaultGuide: 'Thu gom riêng thức ăn thừa, cuống rau củ để làm phân bón hữu cơ (compost).',
    environmentalImpact: 'Rác hữu cơ khi ủ đúng cách tạo thành nguồn phân bón giàu dinh dưỡng cho đất.',
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
  binColorName: 'Thùng rác chung',
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
