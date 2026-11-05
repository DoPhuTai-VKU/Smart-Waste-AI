"""
Script huấn luyện mô hình YOLOv8 nhận diện rác thải
Thành viên 1 có thể chạy lệnh: python train.py
"""

from ultralytics import YOLO

def main():
    # 1. Khởi tạo mô hình pretrained (yolov8n.pt, yolov8s.pt hoặc yolov8m.pt)
    model = YOLO("yolov8s.pt")

    # 2. Bắt đầu huấn luyện với dataset
    results = model.train(
        data="data.yaml",
        epochs=100,
        imgsz=640,
        batch=16,
        name="smart_waste_yolo",
        save=True,
    )

    print("Huấn luyện hoàn tất! File weights tốt nhất nằm tại runs/detect/smart_waste_yolo/weights/best.pt")
    print("Vui lòng copy file best.pt vào thư mục: backend/weights/best.pt")

if __name__ == "__main__":
    main()
