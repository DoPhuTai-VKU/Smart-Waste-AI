import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

app = FastAPI(
    title="Smart Waste AI API",
    description="Backend API phục vụ nhận diện và phân loại rác thải bằng mô hình YOLO & MySQL",
    version="1.0.0"
)

# Cấu hình CORS cho phép Frontend React (Vite) giao tiếp thông suốt
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Phục vụ thư mục ảnh tĩnh để Frontend có thể hiển thị ảnh qua URL
uploads_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")


@app.get("/")
def read_root():
    return {
        "message": "Smart Waste AI Backend is running!",
        "docs_url": "/docs",
        "contract": "Tham khảo tài liệu docs/API_CONTRACT.md để triển khai các router"
    }


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "smart-waste-backend"}

# =========================================================================
# THÀNH VIÊN 1 KẾT NỐI CÁC ROUTER TẠI ĐÂY:
# from app.routers import predict, history, dashboard
# app.include_router(predict.router, prefix="/api", tags=["Prediction"])
# app.include_router(history.router, prefix="/api", tags=["History"])
# app.include_router(dashboard.router, prefix="/api", tags=["Dashboard"])
# =========================================================================
