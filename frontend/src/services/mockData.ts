import type { DashboardStatsResponse, HistoryItem, PredictionResponse } from '../types/waste';

// Dữ liệu mẫu ban đầu cho Lịch sử
export const INITIAL_MOCK_HISTORY: HistoryItem[] = [
  {
    id: 101,
    original_image_url: 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=600&q=80',
    processed_image_url: 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=600&q=80',
    primary_label: 'Chai nhựa PET',
    category: 'plastic',
    confidence: 0.96,
    created_at: '2026-11-02 16:45:12',
    treatment_guide: 'Súc sạch chất lỏng dư thừa, vặn nắp và nén dẹp trước khi cho vào thùng rác tái chế màu vàng/cam.',
    predictions: [
      {
        id: '1',
        label: 'Chai nhựa PET',
        category: 'plastic',
        confidence: 0.96,
        bbox: [110, 60, 390, 480],
        treatment_guide: 'Phân loại vào nhóm nhựa tái chế số 1 (PETE).',
      },
    ],
  },
  {
    id: 102,
    original_image_url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
    processed_image_url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
    primary_label: 'Hộp bìa Carton',
    category: 'paper',
    confidence: 0.93,
    created_at: '2026-11-02 15:20:00',
    treatment_guide: 'Tháo bỏ băng dính dán trên bề mặt thùng carton, gập phẳng để tiết kiệm diện tích thu gom.',
    predictions: [
      {
        id: '1',
        label: 'Hộp bìa Carton',
        category: 'paper',
        confidence: 0.93,
        bbox: [80, 50, 440, 420],
        treatment_guide: 'Giữ khô ráo, bỏ vào thùng rác tái chế giấy.',
      },
    ],
  },
  {
    id: 103,
    original_image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
    processed_image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
    primary_label: 'Lon nước ngọt nhôm',
    category: 'metal',
    confidence: 0.98,
    created_at: '2026-11-02 14:10:45',
    treatment_guide: 'Trút hết nước giải khát còn sót lại, làm dẹp vỏ lon và bỏ vào thùng rác kim loại.',
    predictions: [
      {
        id: '1',
        label: 'Lon nhôm',
        category: 'metal',
        confidence: 0.98,
        bbox: [120, 90, 360, 470],
        treatment_guide: 'Kim loại có giá trị tái chế cao và tiết kiệm 95% năng lượng sản xuất mới.',
      },
    ],
  },
  {
    id: 104,
    original_image_url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80',
    processed_image_url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80',
    primary_label: 'Vỏ chuối & thức ăn thừa',
    category: 'organic',
    confidence: 0.89,
    created_at: '2026-11-02 11:35:10',
    treatment_guide: 'Thu gom vào thùng rác hữu cơ màu xanh lá cây hoặc dùng làm nguyên liệu ủ phân sinh học.',
    predictions: [
      {
        id: '1',
        label: 'Vỏ chuối',
        category: 'organic',
        confidence: 0.89,
        bbox: [70, 110, 420, 390],
        treatment_guide: 'Rác hữu cơ dễ phân hủy sinh học, tránh để lâu bốc mùi.',
      },
    ],
  },
  {
    id: 105,
    original_image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    processed_image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    primary_label: 'Chai thủy tinh đồ uống',
    category: 'glass',
    confidence: 0.95,
    created_at: '2026-11-01 19:40:22',
    treatment_guide: 'Rửa sạch cặn bên trong, tháo nắp kim loại/nhựa riêng biệt và bỏ vào thùng rác thủy tinh.',
    predictions: [
      {
        id: '1',
        label: 'Chai thủy tinh',
        category: 'glass',
        confidence: 0.95,
        bbox: [140, 70, 370, 500],
        treatment_guide: 'Thủy tinh có thể tái chế tuần hoàn vô số lần mà không suy giảm chất lượng.',
      },
    ],
  },
  {
    id: 106,
    original_image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    processed_image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    primary_label: 'Cốc nhựa dùng 1 lần',
    category: 'plastic',
    confidence: 0.91,
    created_at: '2026-11-01 14:15:30',
    treatment_guide: 'Bỏ ống hút và màng bọc nilon, rửa sạch trước khi bỏ vào thùng rác tái chế.',
    predictions: [
      {
        id: '1',
        label: 'Cốc nhựa PP',
        category: 'plastic',
        confidence: 0.91,
        bbox: [100, 100, 380, 440],
      },
    ],
  },
  {
    id: 107,
    original_image_url: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=600&q=80',
    processed_image_url: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=600&q=80',
    primary_label: 'Báo & Tạp chí cũ',
    category: 'paper',
    confidence: 0.94,
    created_at: '2026-10-31 16:50:00',
    treatment_guide: 'Xếp chồng gọn gàng, buộc dây cố định để thuận tiện vận chuyển đến cơ sở tái chế giấy.',
    predictions: [
      {
        id: '1',
        label: 'Báo cũ',
        category: 'paper',
        confidence: 0.94,
        bbox: [50, 60, 450, 410],
      },
    ],
  },
  {
    id: 108,
    original_image_url: 'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&w=600&q=80',
    processed_image_url: 'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&w=600&q=80',
    primary_label: 'Hộp thiếc đựng thực phẩm',
    category: 'metal',
    confidence: 0.88,
    created_at: '2026-10-31 09:25:40',
    treatment_guide: 'Rửa sạch dầu mỡ bên trong hộp thiếc trước khi phân loại.',
    predictions: [
      {
        id: '1',
        label: 'Hộp thiếc',
        category: 'metal',
        confidence: 0.88,
        bbox: [130, 110, 370, 410],
      },
    ],
  },
];

// Dữ liệu mẫu thống kê Dashboard
export const INITIAL_MOCK_DASHBOARD_STATS: DashboardStatsResponse = {
  total_scans: 1248,
  most_common_type: 'Rác nhựa (Plastic)',
  average_confidence: 94.2,
  today_scans: 28,
  category_counts: [
    { category: 'Rác nhựa', categoryKey: 'plastic', count: 486, percentage: 39, color: '#F59E0B' },
    { category: 'Rác giấy', categoryKey: 'paper', count: 312, percentage: 25, color: '#3B82F6' },
    { category: 'Kim loại', categoryKey: 'metal', count: 198, percentage: 16, color: '#64748B' },
    { category: 'Thủy tinh', categoryKey: 'glass', count: 142, percentage: 11, color: '#10B981' },
    { category: 'Rác hữu cơ', categoryKey: 'organic', count: 110, percentage: 9, color: '#84CC16' },
  ],
  time_series: [
    { date: '27/10', count: 32 },
    { date: '28/10', count: 45 },
    { date: '29/10', count: 41 },
    { date: '30/10', count: 58 },
    { date: '31/10', count: 64 },
    { date: '01/11', count: 72 },
    { date: '02/11', count: 28 },
  ],
};

/**
 * Giả lập quá trình suy luận của YOLO Model khi ở chế độ Mock
 */
export function generateMockPrediction(imageUrl: string, _filename?: string): PredictionResponse {
  // Lựa chọn ngẫu nhiên hoặc theo tên file để tạo sự chân thực
  const sampleCategories: Array<{
    category: string;
    label: string;
    guide: string;
  }> = [
    {
      category: 'plastic',
      label: 'Chai nhựa Polyethylene (PET)',
      guide: 'Làm rỗng chất lỏng, tháo nắp chai riêng và bỏ vào thùng rác tái chế màu vàng.',
    },
    {
      category: 'paper',
      label: 'Túi giấy mua sắm',
      guide: 'Đảm bảo túi khô ráo, không dính dầu mỡ thực phẩm trước khi tái chế.',
    },
    {
      category: 'metal',
      label: 'Vỏ lon đồ uống bằng nhôm',
      guide: 'Rửa sơ qua nước, bóp dẹp để giảm diện tích rồi bỏ vào thùng rác kim loại.',
    },
    {
      category: 'glass',
      label: 'Lọ thủy tinh thực phẩm',
      guide: 'Rửa sạch cặn thức ăn, để khô và phân loại vào thùng rác thủy tinh.',
    },
    {
      category: 'organic',
      label: 'Thức ăn thừa & Rau củ',
      guide: 'Phân loại riêng để ủ phân vi sinh (compost) hoặc phục vụ chăn nuôi.',
    },
  ];

  const picked = sampleCategories[Math.floor(Math.random() * sampleCategories.length)];
  const confidence = Number((0.88 + Math.random() * 0.1).toFixed(2));

  return {
    id: Date.now(),
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    original_image_url: imageUrl,
    processed_image_url: imageUrl, // Trong mock, dùng trực tiếp image preview
    primary_label: picked.label,
    primary_category: picked.category,
    confidence: confidence,
    treatment_guide: picked.guide,
    predictions: [
      {
        id: 'det-1',
        label: picked.label,
        category: picked.category,
        confidence: confidence,
        bbox: [100, 80, 420, 460],
        treatment_guide: picked.guide,
      },
    ],
  };
}
