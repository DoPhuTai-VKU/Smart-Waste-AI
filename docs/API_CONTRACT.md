# 📋 SMART WASTE AI - API CONTRACT & TÀI LIỆU TÍCH HỢP HỆ THỐNG

Tài liệu này được soạn thảo bởi **Thành viên 2 (Frontend & System)** gửi tới **Thành viên 1 (AI Model & Backend FastAPI)** nhằm thống nhất cấu trúc dữ liệu REST API giữa Frontend và Backend/MySQL.

---

## 1. Tổng quan cấu hình kết nối

* **Base URL mặc định**: `http://localhost:8000`
* **Content-Type chung**: `application/json` (ngoại trừ API upload ảnh là `multipart/form-data`)
* **Chế độ kiểm thử phía Frontend**:
  * Frontend có sẵn bộ chuyển đổi **Demo Mock API** và **Live FastAPI** tại Header hoặc thông qua file `.env` (`VITE_USE_MOCK=false`).

---

## 2. Đặc tả chi tiết các Endpoint

### 2.1. Nhận diện rác qua ảnh (`POST /api/predict`)

* **Endpoint**: `POST /api/predict`
* **Mô tả**: Tiếp nhận file ảnh do người dùng tải lên, đưa qua mô hình YOLO để nhận diện và lưu vào CSDL MySQL.
* **Content-Type**: `multipart/form-data`
* **Request Body**:
  * `file`: File ảnh dạng binary (`image/jpeg`, `image/png`, `image/webp`).

* **Response Success (200 OK)**:
```json
{
  "id": 105,
  "timestamp": "2026-11-02 17:30:00",
  "original_image_url": "http://localhost:8000/uploads/originals/img_105.jpg",
  "processed_image_url": "http://localhost:8000/uploads/predictions/img_105_yolo.jpg",
  "primary_label": "Chai nhựa PET",
  "primary_category": "plastic",
  "confidence": 0.95,
  "treatment_guide": "Làm rỗng nước, vặn chặt nắp và làm bẹp chai trước khi bỏ vào thùng rác tái chế màu vàng.",
  "predictions": [
    {
      "id": "det-1",
      "label": "Chai nhựa PET",
      "category": "plastic",
      "confidence": 0.95,
      "bbox": [120, 85, 340, 520],
      "treatment_guide": "Nhựa PET có thể tái chế thành hạt nhựa hoặc sợi polyester."
    }
  ]
}
```

> **Ghi chú về Bounding Box & Ảnh**:
> - `processed_image_url`: Ảnh đã được Backend vẽ sẵn khung Bounding Box (Ưu tiên hiển thị mặc định).
> - `bbox`: Mảng 4 tọa độ pixel `[x_min, y_min, x_max, y_max]` tương ứng trên ảnh gốc. Frontend có tích hợp sẵn Canvas để có thể tự vẽ overlay đè lên ảnh nếu cần.
> - `primary_category`: Giá trị thuộc 1 trong các nhóm chính: `plastic`, `paper`, `metal`, `glass`, `organic` (hoặc nhóm mới nếu Thành viên 1 bổ sung vào dataset).

---

### 2.2. Danh sách lịch sử nhận diện (`GET /api/history`)

* **Endpoint**: `GET /api/history`
* **Mô tả**: Lấy danh sách các lượt nhận diện đã lưu trữ trong MySQL, hỗ trợ phân trang, tìm kiếm và lọc.
* **Query Parameters**:
  * `page` (int, default: `1`): Trang hiện tại.
  * `limit` (int, default: `6` hoặc `10`): Số lượng bản ghi trên một trang.
  * `category` (string, optional): Lọc theo nhóm rác (`plastic`, `paper`, `metal`, `glass`, `organic`, hoặc `all`).
  * `search` (string, optional): Tìm kiếm theo từ khóa nhãn rác.
  * `sortBy` (string, optional): `newest` (mới nhất), `oldest` (cũ nhất), `confidence` (độ tin cậy cao nhất).

* **Response Success (200 OK)**:
```json
{
  "total": 128,
  "page": 1,
  "limit": 6,
  "items": [
    {
      "id": 105,
      "original_image_url": "http://localhost:8000/uploads/originals/img_105.jpg",
      "processed_image_url": "http://localhost:8000/uploads/predictions/img_105_yolo.jpg",
      "primary_label": "Chai nhựa PET",
      "category": "plastic",
      "confidence": 0.95,
      "created_at": "2026-11-02 17:30:00",
      "treatment_guide": "Làm rỗng nước, vặn chặt nắp và làm bẹp chai trước khi bỏ vào thùng rác tái chế màu vàng."
    }
  ]
}
```

---

### 2.3. Chi tiết một lần nhận diện (`GET /api/history/{id}`)

* **Endpoint**: `GET /api/history/{id}`
* **Mô tả**: Lấy toàn bộ thông tin chi tiết của một lần nhận diện theo ID để mở Modal hiển thị chi tiết.
* **Response Success (200 OK)**: Cấu trúc tương tự như item chi tiết của `POST /api/predict`.

---

### 2.4. Dữ liệu thống kê Dashboard (`GET /api/dashboard/stats`)

* **Endpoint**: `GET /api/dashboard/stats`
* **Mô tả**: Trả về số liệu tổng quan phục vụ các thẻ Metric và biểu đồ Recharts trên trang Dashboard.
* **Response Success (200 OK)**:
```json
{
  "total_scans": 1248,
  "most_common_type": "Rác nhựa (Plastic)",
  "average_confidence": 94.2,
  "today_scans": 28,
  "category_counts": [
    { "category": "Rác nhựa", "categoryKey": "plastic", "count": 486, "percentage": 39, "color": "#F59E0B" },
    { "category": "Rác giấy", "categoryKey": "paper", "count": 312, "percentage": 25, "color": "#3B82F6" },
    { "category": "Kim loại", "categoryKey": "metal", "count": 198, "percentage": 16, "color": "#64748B" },
    { "category": "Thủy tinh", "categoryKey": "glass", "count": 142, "percentage": 11, "color": "#10B981" },
    { "category": "Rác hữu cơ", "categoryKey": "organic", "count": 110, "percentage": 9, "color": "#84CC16" }
  ],
  "time_series": [
    { "date": "27/10", "count": 32 },
    { "date": "28/10", "count": 45 },
    { "date": "29/10", "count": 41 },
    { "date": "30/10", "count": 58 },
    { "date": "31/10", "count": 64 },
    { "date": "01/11", "count": 72 },
    { "date": "02/11", "count": 28 }
  ]
}
```

---

## 3. Danh mục 5 nhóm rác chính (Hỗ trợ mở rộng động)

Frontend đã thiết lập cấu hình tập trung tại `src/constants/wasteCategories.ts`:
1. **Plastic (Rác nhựa)**: Thùng vàng/cam (`#F59E0B`)
2. **Paper (Rác giấy)**: Thùng xanh dương (`#3B82F6`)
3. **Metal (Kim loại)**: Thùng xám/bạc (`#64748B`)
4. **Glass (Thủy tinh)**: Thùng xanh ngọc (`#10B981`)
5. **Organic (Rác hữu cơ)**: Thùng xanh lá (`#84CC16`)

> Frontend được lập trình an toàn: Nếu Backend trả về một class mới ngoài 5 nhóm trên, hệ thống sẽ tự động gán nhãn và tạo màu badge tự động, không gây gián đoạn giao diện!
