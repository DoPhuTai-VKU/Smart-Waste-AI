-- ========================================================
-- Bảy waste categories tương ứng một-một với bảy detection classes.
-- Màu HEX là màu nhận diện vật liệu trên giao diện, không phải màu thùng quy chuẩn.
-- ========================================================

USE `smart_waste_db`;

INSERT INTO `waste_categories` (`category_key`, `name_vi`, `name_en`, `bin_color_name`, `bin_color_hex`, `default_guide`)
VALUES 
('banana-peel', 'Vỏ chuối', 'Banana Peel', 'Màu nhận diện vỏ chuối', '#D4A017', 'Thu gom riêng cùng rác hữu cơ; có thể ủ phân nếu phù hợp.'),
('glass', 'Thủy tinh', 'Glass', 'Màu nhận diện thủy tinh', '#67C5B5', 'Rửa sạch; bọc và thu gom riêng mảnh vỡ.'),
('metal', 'Kim loại', 'Metal', 'Màu nhận diện kim loại', '#9CA3AF', 'Làm sạch lon, hộp; chú ý cạnh sắc.'),
('orange-peel', 'Vỏ cam', 'Orange Peel', 'Màu nhận diện vỏ cam', '#F97316', 'Thu gom cùng rác hữu cơ; bỏ tem, bao bì trước khi ủ phân.'),
('paper', 'Giấy', 'Paper', 'Màu nhận diện giấy', '#C4A484', 'Giữ khô và sạch; tách phần dính dầu hoặc vật liệu khác.'),
('plastic', 'Nhựa', 'Plastic', 'Màu nhận diện nhựa', '#3B82F6', 'Làm sạch, để khô và phân loại theo khả năng thu gom tại địa phương.'),
('styrofoam', 'Xốp EPS', 'Styrofoam', 'Màu nhận diện xốp EPS', '#E5E7EB', 'Giữ sạch, khô; kiểm tra điểm thu gom chuyên biệt, không mặc định bỏ chung với nhựa tái chế.')
ON DUPLICATE KEY UPDATE
  `name_vi` = VALUES(`name_vi`),
  `name_en` = VALUES(`name_en`),
  `bin_color_name` = VALUES(`bin_color_name`),
  `bin_color_hex` = VALUES(`bin_color_hex`),
  `default_guide` = VALUES(`default_guide`);
