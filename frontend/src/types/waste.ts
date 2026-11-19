export type WasteCategoryKey =
  | 'banana-peel'
  | 'glass'
  | 'metal'
  | 'orange-peel'
  | 'paper'
  | 'plastic'
  | 'styrofoam'
  | string;

export interface WasteCategoryInfo {
  key: WasteCategoryKey;
  labelVi: string;
  labelEn: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  chartColor: string;
  binColorName: string;
  binHex: string;
  iconName: string;
  defaultGuide: string;
  environmentalImpact?: string;
}

export interface DetectedObject {
  id?: string | number;
  label: string;
  category: WasteCategoryKey;
  confidence: number; // 0.0 to 1.0 (hoặc 0 to 100)
  bbox?: [number, number, number, number]; // [x_min, y_min, x_max, y_max] pixel coordinates or [x, y, w, h]
  treatment_guide?: string;
}

export interface PredictionResponse {
  id: number | string;
  timestamp: string;
  original_image_url: string;
  processed_image_url?: string; // Ảnh có vẽ bounding box sẵn từ Backend
  primary_label: string;
  primary_category: WasteCategoryKey;
  confidence: number;
  treatment_guide?: string;
  predictions: DetectedObject[];
}

export interface HistoryItem {
  id: number | string;
  original_image_url: string;
  processed_image_url?: string;
  primary_label: string;
  category: WasteCategoryKey;
  confidence: number;
  created_at: string;
  predictions?: DetectedObject[];
  treatment_guide?: string;
}

export interface HistoryListResponse {
  total: number;
  page: number;
  limit: number;
  items: HistoryItem[];
}

export interface CategoryStat {
  category: string;
  categoryKey: WasteCategoryKey;
  count: number;
  percentage?: number;
  color: string;
}

export interface TimeSeriesStat {
  date: string;
  count: number;
}

export interface DashboardStatsResponse {
  total_scans: number;
  most_common_type: string;
  average_confidence: number;
  today_scans: number;
  category_counts: CategoryStat[];
  time_series: TimeSeriesStat[];
}

export interface HistoryFilterParams {
  category?: string;
  search?: string;
  sortBy?: 'newest' | 'oldest' | 'confidence';
  page?: number;
  limit?: number;
}
