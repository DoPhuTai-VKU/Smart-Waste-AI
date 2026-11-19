from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import load_settings
from app.db import create_db_engine, create_session_factory
from app.storage import ImageStorage
from app.inference import InferenceService
from app.predict import router as predict_router
from app.history import router as history_router
from app.dashboard import router as dashboard_router


settings = load_settings()
storage = ImageStorage(settings.uploads_dir)
db_engine = create_db_engine(settings)

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
app.state.settings = settings
app.state.storage = storage
app.state.db_engine = db_engine
app.state.db_session_factory = create_session_factory(db_engine)
app.state.inference = InferenceService(settings)
app.mount("/uploads", StaticFiles(directory=settings.uploads_dir), name="uploads")
app.include_router(predict_router, prefix="/api", tags=["Prediction"])
app.include_router(history_router, prefix="/api", tags=["History"])
app.include_router(dashboard_router, prefix="/api", tags=["Dashboard"])


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
