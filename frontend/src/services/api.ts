import axios from 'axios';
import type {
  DashboardStatsResponse,
  HistoryFilterParams,
  HistoryItem,
  HistoryListResponse,
  PredictionResponse,
} from '../types/waste';
import {
  INITIAL_MOCK_DASHBOARD_STATS,
  INITIAL_MOCK_HISTORY,
  generateMockPrediction,
} from './mockData';

// Cấu hình URL Backend (mặc định lấy từ biến môi trường hoặc cổng FastAPI chuẩn 8000)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Khởi tạo bộ nhớ tạm cho Mock History trong phiên làm việc
let mockHistoryStore: HistoryItem[] = [...INITIAL_MOCK_HISTORY];

/**
 * Kiểm tra trạng thái dùng Mock API hay Backend thật
 */
export const isMockMode = (): boolean => {
  const stored = localStorage.getItem('SW_USE_MOCK');
  if (stored !== null) {
    return stored === 'true';
  }
  // Mặc định bật mock mode để Frontend chạy ngay, tắt khi có backend live
  return import.meta.env.VITE_USE_MOCK !== 'false';
};

export const setMockMode = (enabled: boolean): void => {
  localStorage.setItem('SW_USE_MOCK', enabled ? 'true' : 'false');
  window.dispatchEvent(new Event('mock-mode-changed'));
};

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30s cho inference AI
});

export const WasteApiService = {
  /**
   * Gửi ảnh để nhận diện loại rác
   */
  async predictWaste(file: File): Promise<PredictionResponse> {
    if (isMockMode()) {
      // Giả lập độ trễ mạng và tính toán YOLO (1.2s)
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Tạo URL local từ file
      const tempUrl = URL.createObjectURL(file);
      const mockResult = generateMockPrediction(tempUrl, file.name);

      // Thêm vào danh sách lịch sử trong phiên
      const newHistoryItem: HistoryItem = {
        id: mockResult.id,
        original_image_url: mockResult.original_image_url,
        processed_image_url: mockResult.processed_image_url,
        primary_label: mockResult.primary_label,
        category: mockResult.primary_category,
        confidence: mockResult.confidence,
        created_at: mockResult.timestamp,
        treatment_guide: mockResult.treatment_guide,
        predictions: mockResult.predictions,
      };
      mockHistoryStore.unshift(newHistoryItem);

      return mockResult;
    }

    // Gửi multipart/form-data đến Backend FastAPI của Thành viên 1
    const formData = new FormData();
    formData.append('file', file);

    const response = await client.post<PredictionResponse>('/api/predict', formData, {
      timeout: 120000,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  /**
   * Lấy danh sách lịch sử nhận diện có phân trang, lọc và tìm kiếm
   */
  async getHistory(params: HistoryFilterParams = {}): Promise<HistoryListResponse> {
    const { category, search, sortBy = 'newest', page = 1, limit = 9 } = params;

    if (isMockMode()) {
      await new Promise((resolve) => setTimeout(resolve, 300));

      let filtered = [...mockHistoryStore];

      // Lọc theo loại rác
      if (category && category !== 'all') {
        filtered = filtered.filter(
          (item) => item.category.toLowerCase() === category.toLowerCase()
        );
      }

      // Tìm kiếm theo tên nhãn
      if (search && search.trim()) {
        const query = search.toLowerCase().trim();
        filtered = filtered.filter((item) =>
          item.primary_label.toLowerCase().includes(query)
        );
      }

      // Sắp xếp
      if (sortBy === 'oldest') {
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      } else if (sortBy === 'confidence') {
        filtered.sort((a, b) => b.confidence - a.confidence);
      } else {
        // Mặc định newest
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }

      const total = filtered.length;
      const startIndex = (page - 1) * limit;
      const paginatedItems = filtered.slice(startIndex, startIndex + limit);

      return {
        total,
        page,
        limit,
        items: paginatedItems,
      };
    }

    const response = await client.get<HistoryListResponse>('/api/history', {
      params,
    });
    return response.data;
  },

  /**
   * Lấy chi tiết một lần nhận diện
   */
  async getHistoryDetail(id: string | number): Promise<HistoryItem | null> {
    if (isMockMode()) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const found = mockHistoryStore.find((item) => String(item.id) === String(id));
      return found || null;
    }

    const response = await client.get<PredictionResponse>(`/api/history/${id}`);
    const detail = response.data;
    return {
      id: detail.id,
      original_image_url: detail.original_image_url,
      processed_image_url: detail.processed_image_url,
      primary_label: detail.primary_label,
      category: detail.primary_category,
      confidence: detail.confidence,
      created_at: detail.timestamp,
      treatment_guide: detail.treatment_guide,
      predictions: detail.predictions,
    };
  },

  async deleteHistory(id: string | number): Promise<void> {
    if (isMockMode()) {
      mockHistoryStore = mockHistoryStore.filter((item) => String(item.id) !== String(id));
      return;
    }
    await client.delete(`/api/history/${encodeURIComponent(String(id))}`);
  },

  /**
   * Lấy dữ liệu thống kê cho Dashboard
   */
  async getDashboardStats(): Promise<DashboardStatsResponse> {
    if (isMockMode()) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      
      // Cập nhật thống kê động dựa trên mockHistoryStore
      const total = mockHistoryStore.length + 1240;
      return {
        ...INITIAL_MOCK_DASHBOARD_STATS,
        total_scans: total,
      };
    }

    const response = await client.get<DashboardStatsResponse>('/api/dashboard/stats');
    return response.data;
  },

  /**
   * Kiểm tra tình trạng kết nối tới Backend FastAPI
   */
  async checkHealth(): Promise<boolean> {
    try {
      const res = await client.get('/health', { timeout: 3000 });
      return res.status === 200;
    } catch {
      return false;
    }
  },
};
