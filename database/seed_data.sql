-- ========================================================
-- DỮ LIỆU KHỞI TẠO BAN ĐẦU: 5 Nhóm rác chính
-- ========================================================

USE `smart_waste_db`;

INSERT INTO `waste_categories` (`category_key`, `name_vi`, `name_en`, `bin_color_name`, `bin_color_hex`, `default_guide`)
VALUES 
('plastic', 'Rác nhựa', 'Plastic', 'Thùng màu cam / vàng', '#F59E0B', 'Rửa sạch cặn bẩn, dẫm bẹp vỏ chai để giảm thể tích trước khi bỏ vào thùng rác tái chế.'),
('paper', 'Rác giấy', 'Paper', 'Thùng màu xanh dương', '#3B82F6', 'Giữ giấy khô ráo, phẳng phiu, loại bỏ ghim kim loại trước khi tái chế.'),
('metal', 'Kim loại', 'Metal', 'Thùng màu bạc / xám', '#64748B', 'Vệ sinh sạch lon hoặc vỏ đồ hộp kim loại, cẩn thận với các cạnh sắc nhọn.'),
('glass', 'Thủy tinh', 'Glass', 'Thùng màu xanh ngọc', '#10B981', 'Rửa sạch dầu mỡ hoặc nước thừa, phân loại riêng mảnh vỡ để tránh gây thương tích.'),
('organic', 'Rác hữu cơ', 'Organic', 'Thùng màu xanh lá cây', '#84CC16', 'Thu gom riêng thức ăn thừa, cuống rau củ để làm phân bón hữu cơ (compost).')
ON DUPLICATE KEY UPDATE `name_vi` = VALUES(`name_vi`);
