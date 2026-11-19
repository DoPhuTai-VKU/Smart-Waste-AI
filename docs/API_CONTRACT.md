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
  "primary_label": "plastic",
  "primary_category": "plastic",
  "confidence": 0.95,
  "treatment_guide": "Làm sạch, để khô và phân loại theo khả năng thu gom tại địa phương.",
  "predictions": [
    {
      "id": "det-1",
      "label": "plastic",
      "category": "plastic",
      "confidence": 0.95,
      "bbox": [120, 85, 340, 520],
      "treatment_guide": "Làm sạch, để khô và phân loại theo khả năng thu gom tại địa phương."
    }
  ]
}
```

> **Ghi chú về Bounding Box & Ảnh**:
> - `processed_image_url`: Ảnh đã được Backend vẽ sẵn khung Bounding Box (Ưu tiên hiển thị mặc định).
> - `bbox`: Mảng 4 tọa độ pixel `[x_min, y_min, x_max, y_max]` tương ứng trên ảnh gốc. Frontend có tích hợp sẵn Canvas để có thể tự vẽ overlay đè lên ảnh nếu cần.
> - `primary_category` và `predictions[].category`: Một trong 7 waste categories có key trùng với detection class: `banana-peel`, `glass`, `metal`, `orange-peel`, `paper`, `plastic`, `styrofoam`.

* **Không phát hiện vật thể phù hợp (422)**: Sau khi phân tích ảnh, nếu không có box nào thuộc 7 class đạt ngưỡng confidence, API trả `{ "detail": "Không phát hiện loại rác phù hợp" }`. Ảnh tải từ ngoài dataset vẫn được phân tích bình thường.

---

### 2.2. Danh sách lịch sử nhận diện (`GET /api/history`)

* **Endpoint**: `GET /api/history`
* **Mô tả**: Lấy danh sách các lượt nhận diện đã lưu trữ trong MySQL, hỗ trợ phân trang, tìm kiếm và lọc.
* **Query Parameters**:
  * `page` (int, default: `1`): Trang hiện tại.
  * `limit` (int, default: `6` hoặc `10`): Số lượng bản ghi trên một trang.
  * `category` (string, optional): Lọc theo 1 trong 7 category key ở mục 3, hoặc `all`.
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
      "primary_label": "plastic",
      "category": "plastic",
      "confidence": 0.95,
      "created_at": "2026-11-02 17:30:00",
      "treatment_guide": "Làm sạch, để khô và phân loại theo khả năng thu gom tại địa phương."
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
  "most_common_type": "Nhựa",
  "average_confidence": 94.2,
  "today_scans": 28,
  "category_counts": [
    { "category": "Nhựa", "categoryKey": "plastic", "count": 386, "percentage": 31, "color": "#3B82F6" },
    { "category": "Giấy", "categoryKey": "paper", "count": 312, "percentage": 25, "color": "#C4A484" },
    { "category": "Kim loại", "categoryKey": "metal", "count": 198, "percentage": 16, "color": "#9CA3AF" },
    { "category": "Thủy tinh", "categoryKey": "glass", "count": 142, "percentage": 11, "color": "#67C5B5" },
    { "category": "Vỏ chuối", "categoryKey": "banana-peel", "count": 55, "percentage": 4, "color": "#D4A017" },
    { "category": "Vỏ cam", "categoryKey": "orange-peel", "count": 55, "percentage": 4, "color": "#F97316" },
    { "category": "Xốp EPS", "categoryKey": "styrofoam", "count": 100, "percentage": 8, "color": "#E5E7EB" }
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

### 2.5. Xóa một lượt nhận diện (`DELETE /api/history/{id}`)

* **Endpoint**: `DELETE /api/history/{id}`
* **Mô tả**: Xóa một lượt nhận diện trong MySQL. Các vật thể thuộc lượt đó được xóa theo khóa ngoại; ảnh gốc và ảnh đã vẽ bounding box do hệ thống lưu cũng được gỡ khỏi `uploads/`.
* **Response Success**: `204 No Content`, không có response body.
* **ID không tồn tại**: `404 Not Found`, `{ "detail": "Detection not found" }`.
* Frontend yêu cầu người dùng xác nhận trước khi gửi lệnh xóa. Danh sách History và số liệu Dashboard được tải lại từ Backend sau khi xóa.

---

## 3. Danh mục 7 waste categories

Mỗi detection class của YOLO được giữ nguyên và ánh xạ một-một tới waste category cùng key. Màu dưới đây là **màu nhận diện vật liệu trên giao diện**, không quy định màu thùng thu gom tại địa phương. Frontend cấu hình tập trung tại `src/constants/wasteCategories.ts`; backend và MySQL dùng cùng tên, màu, hướng dẫn.

| Category key | Tên hiển thị | Màu nhận diện | Hướng dẫn xử lý |
| --- | --- | --- | --- |
| `banana-peel` | Vỏ chuối | `#D4A017` | Thu gom riêng cùng rác hữu cơ; có thể ủ phân nếu phù hợp. |
| `glass` | Thủy tinh | `#67C5B5` | Rửa sạch; bọc và thu gom riêng mảnh vỡ. |
| `metal` | Kim loại | `#9CA3AF` | Làm sạch lon, hộp; chú ý cạnh sắc. |
| `orange-peel` | Vỏ cam | `#F97316` | Thu gom cùng rác hữu cơ; bỏ tem, bao bì trước khi ủ phân. |
| `paper` | Giấy | `#C4A484` | Giữ khô và sạch; tách phần dính dầu hoặc vật liệu khác. |
| `plastic` | Nhựa | `#3B82F6` | Làm sạch, để khô và phân loại theo khả năng thu gom tại địa phương. |
| `styrofoam` | Xốp EPS | `#E5E7EB` | Giữ sạch, khô; kiểm tra điểm thu gom chuyên biệt, không mặc định bỏ chung với nhựa tái chế. |
