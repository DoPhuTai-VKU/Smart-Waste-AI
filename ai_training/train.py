"""
Script huấn luyện mô hình YOLOv8 nhận diện rác thải
Thành viên 1 có thể chạy lệnh: python train.py
"""

from pathlib import Path

from ultralytics import YOLO

def main():
    training_dir = Path(__file__).resolve().parent
    data_yaml = training_dir / "data.yaml"
    dataset_dir = (training_dir / "../../dataset.v1i.yolov8").resolve()

    for split in ("train", "valid", "test"):
        images_dir = dataset_dir / split / "images"
        labels_dir = dataset_dir / split / "labels"
        if not images_dir.is_dir() or not labels_dir.is_dir():
            raise FileNotFoundError(f"Missing YOLO dataset split at {dataset_dir / split}")

    # 1. Khởi tạo mô hình pretrained (yolov8n.pt, yolov8s.pt hoặc yolov8m.pt)
    model = YOLO("yolov8s.pt")

    # 2. Bắt đầu huấn luyện với dataset
    model.train(
        data=str(data_yaml),
        epochs=100,
        imgsz=640,
        batch=-1,  # Auto-size for the available GPU memory.
        workers=0,  # Avoid Windows checkpoint serialization failures with worker processes.
        name="smart_waste_yolo",
        save=True,
    )

    best_weights = Path(model.trainer.save_dir) / "weights" / "best.pt"
    print(f"Training complete. Best weights: {best_weights}")
    print(f"Backend weights destination: {training_dir.parent / 'backend' / 'weights' / 'best.pt'}")

if __name__ == "__main__":
    main()
