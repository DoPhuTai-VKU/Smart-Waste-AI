# 🌿 Smart Waste AI – Hệ thống Nhận diện và Phân loại Rác thải bằng Trí tuệ Nhân tạo

Đồ án chuyên ngành CNTT & AI gồm 2 thành viên:
* **Thành viên 1**: Phụ trách AI Model (YOLO), Dataset, Huấn luyện và Xây dựng Backend API (FastAPI + MySQL).
* **Thành viên 2**: Phụ trách Frontend (React + TypeScript + Tailwind CSS) & Hệ thống giao tiếp API.

---

## 📁 Cấu trúc Thư mục Toàn bộ Dự án

```text
Smart Waste AI/
├── 📂 frontend/        # Toàn bộ mã nguồn giao diện React + TypeScript (Thành viên 2)
├── 📂 backend/         # Mã nguồn FastAPI, API nhận diện, kết nối MySQL (Thành viên 1)
│   ├── app/            # Core, Models, Routers, Services
│   ├── weights/        # Chứa file mô hình YOLO (best.pt)
│   └── uploads/        # Lưu trữ ảnh gốc và ảnh đã detect Bounding Box
├── 📂 ai_training/     # Script huấn luyện YOLO & cấu hình dataset (Thành viên 1)
├── 📂 database/        # Script tạo CSDL MySQL (schema.sql, seed_data.sql)
└── 📂 docs/            # Tài liệu dự án & Đặc tả API (API_CONTRACT.md)
```

---

## 🚀 Hướng dẫn Khởi chạy cho Từng Thành viên

### 1. Dành cho Thành viên 2 (Frontend)
```bash
# 1. Đi vào thư mục frontend
cd frontend

# 2. Cài đặt thư viện (nếu chưa cài)
npm install

# 3. Chạy giao diện phát triển (Development)
npm run dev
```
👉 Truy cập giao diện tại: `http://localhost:5173`  
*(Frontend có sẵn nút chuyển đổi linh hoạt giữa **Demo Mock API** và **Live FastAPI**)*

---

### 2. Dành cho Thành viên 1 (Backend & AI)
```bash
# 1. Đi vào thư mục backend
cd backend

# 2. Tạo môi trường ảo Python
python -m venv venv

# 3. Kích hoạt môi trường ảo
# Trên Windows:
venv\Scripts\activate
# Trên Linux/macOS:
source venv/bin/activate

# 4. Cài đặt các thư viện cần thiết
pip install -r requirements.txt

# 5. Khởi chạy FastAPI Server
uvicorn app.main:app --reload --port 8000
```
👉 Swagger API Docs tương tác tại: `http://localhost:8000/docs`

---

### 3. Cài đặt Cơ sở dữ liệu MySQL
1. Mở MySQL Workbench hoặc phpMyAdmin.
2. Chạy file [`database/schema.sql`](database/schema.sql) để tạo cơ sở dữ liệu `smart_waste_db` và các bảng.
3. Chạy file [`database/seed_data.sql`](database/seed_data.sql) để nạp 5 nhóm rác mẫu.
4. Cập nhật thông tin tài khoản MySQL vào file `backend/.env`.

---

## 📑 Tài liệu Đặc tả Kết nối API
Xem chi tiết quy chuẩn các Endpoint, tham số và định dạng JSON tại:  
👉 [`docs/API_CONTRACT.md`](docs/API_CONTRACT.md)
