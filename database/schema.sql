-- ========================================================
-- CƠ SỞ DỮ LIỆU: Smart Waste AI
-- Hệ thống nhận diện & phân loại rác thải bằng YOLO
-- ========================================================

CREATE DATABASE IF NOT EXISTS `smart_waste_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `smart_waste_db`;

-- 1. Bảng danh mục nhóm rác
CREATE TABLE IF NOT EXISTS `waste_categories` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `category_key` VARCHAR(50) NOT NULL UNIQUE,       -- plastic, paper, metal, glass, organic
    `name_vi` VARCHAR(100) NOT NULL,                  -- Rác nhựa, Rác giấy...
    `name_en` VARCHAR(100) NOT NULL,                  -- Plastic, Paper...
    `bin_color_name` VARCHAR(100) NOT NULL,           -- Thùng màu vàng/cam...
    `bin_color_hex` VARCHAR(20) NOT NULL,             -- #F59E0B
    `default_guide` TEXT,                             -- Hướng dẫn xử lý quy chuẩn
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Bảng lưu trữ từng lần nhận diện rác
CREATE TABLE IF NOT EXISTS `detections` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `original_image_url` VARCHAR(500) NOT NULL,       -- Đường dẫn ảnh gốc
    `processed_image_url` VARCHAR(500) DEFAULT NULL,  -- Đường dẫn ảnh đã vẽ Bounding Box
    `primary_label` VARCHAR(150) NOT NULL,            -- Nhãn chính phát hiện (vd: Chai nhựa PET)
    `primary_category` VARCHAR(50) NOT NULL,          -- Nhóm rác (plastic, paper...)
    `confidence` FLOAT NOT NULL,                      -- Độ tin cậy (0.00 - 1.00)
    `treatment_guide` TEXT,                           -- Hướng dẫn phân loại cụ thể
    `raw_predictions_json` JSON DEFAULT NULL,         -- JSON đầy đủ các box phát hiện
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_category` (`primary_category`),
    INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Bảng lưu trữ chi tiết các vật thể trong một ảnh (Multi-object detection)
CREATE TABLE IF NOT EXISTS `detected_objects` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `detection_id` BIGINT NOT NULL,
    `label` VARCHAR(150) NOT NULL,
    `category` VARCHAR(50) NOT NULL,
    `confidence` FLOAT NOT NULL,
    `bbox_xmin` INT DEFAULT NULL,
    `bbox_ymin` INT DEFAULT NULL,
    `bbox_xmax` INT DEFAULT NULL,
    `bbox_ymax` INT DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_detection` FOREIGN KEY (`detection_id`) REFERENCES `detections`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
