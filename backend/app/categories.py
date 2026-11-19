"""Approved one-to-one mapping from YOLO classes to waste categories."""

from dataclasses import dataclass


@dataclass(frozen=True)
class WasteCategory:
    key: str
    name_vi: str
    name_en: str
    color_hex: str
    treatment_guide: str


YOLO_CLASS_NAMES = (
    "banana-peel", "glass", "metal", "orange-peel", "paper", "plastic", "styrofoam"
)

CATEGORIES = {
    "banana-peel": WasteCategory("banana-peel", "Vỏ chuối", "Banana Peel", "#D4A017", "Thu gom riêng cùng rác hữu cơ; có thể ủ phân nếu phù hợp."),
    "glass": WasteCategory("glass", "Thủy tinh", "Glass", "#67C5B5", "Rửa sạch; bọc và thu gom riêng mảnh vỡ."),
    "metal": WasteCategory("metal", "Kim loại", "Metal", "#9CA3AF", "Làm sạch lon, hộp; chú ý cạnh sắc."),
    "orange-peel": WasteCategory("orange-peel", "Vỏ cam", "Orange Peel", "#F97316", "Thu gom cùng rác hữu cơ; bỏ tem, bao bì trước khi ủ phân."),
    "paper": WasteCategory("paper", "Giấy", "Paper", "#C4A484", "Giữ khô và sạch; tách phần dính dầu hoặc vật liệu khác."),
    "plastic": WasteCategory("plastic", "Nhựa", "Plastic", "#3B82F6", "Làm sạch, để khô và phân loại theo khả năng thu gom tại địa phương."),
    "styrofoam": WasteCategory("styrofoam", "Xốp EPS", "Styrofoam", "#E5E7EB", "Giữ sạch, khô; kiểm tra điểm thu gom chuyên biệt, không mặc định bỏ chung với nhựa tái chế."),
}


def get_category(class_name: str) -> WasteCategory:
    """Fail explicitly if weights contain a class outside the approved dataset."""
    return CATEGORIES[class_name]
