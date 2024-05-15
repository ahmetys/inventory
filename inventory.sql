-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Anamakine: 127.0.0.1
-- Üretim Zamanı: 30 Nis 2024, 22:23:54
-- Sunucu sürümü: 10.4.32-MariaDB
-- PHP Sürümü: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `inventory`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `cart`
--

CREATE TABLE `cart` (
  `cart_product_id` int(11) NOT NULL,
  `cart_product_quantity` int(11) NOT NULL,
  `cart_user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `cart`
--

INSERT INTO `cart` (`cart_product_id`, `cart_product_quantity`, `cart_user_id`) VALUES
(1, 5, 1);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `categories`
--

CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `category_parent_id` int(11) DEFAULT NULL,
  `category_name` varchar(100) NOT NULL,
  `category_sub` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `categories`
--

INSERT INTO `categories` (`category_id`, `category_parent_id`, `category_name`, `category_sub`) VALUES
(1, 0, 'APPLE', 1),
(2, 1, 'IPHONE 15 PRO MAX', 1),
(3, 1, 'IPHONE 15 PRO', NULL),
(4, 1, 'IPHONE 15 PLUS', NULL),
(5, 1, 'IPHONE 15', NULL),
(6, 2, 'PANZERGLAS', 0),
(7, 2, 'HÜLLE', 0),
(8, 2, 'ERSATZTEIL', NULL),
(9, 2, 'ZUBEHÖR', NULL),
(10, 0, 'SAMSUNG', NULL);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `order_user_id` int(11) NOT NULL,
  `order_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `order_notes` varchar(5000) NOT NULL,
  `order_status` enum('ordered','completed','','') NOT NULL DEFAULT 'ordered'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `orders`
--

INSERT INTO `orders` (`order_id`, `order_user_id`, `order_date`, `order_notes`, `order_status`) VALUES
(1, 1, '2024-04-28 16:37:32', 'ilk siparis', 'completed'),
(2, 1, '2024-04-28 16:40:31', 'ikinci siparis', 'completed'),
(3, 2, '2024-04-28 16:55:38', 'client siparisi', 'completed'),
(4, 2, '2024-04-28 17:12:56', 'Hıkm', 'ordered');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `order_details`
--

CREATE TABLE `order_details` (
  `order_id` int(11) NOT NULL,
  `ordered_product_id` int(11) NOT NULL,
  `ordered_product_name` varchar(500) NOT NULL,
  `ordered_product_quantity` int(11) NOT NULL,
  `ordered_product_wprice` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `order_details`
--

INSERT INTO `order_details` (`order_id`, `ordered_product_id`, `ordered_product_name`, `ordered_product_quantity`, `ordered_product_wprice`) VALUES
(1, 1, '', 4, 3.5),
(1, 2, '', 6, 2),
(1, 42, 'REDMI NOTE 10 DISPLAY', 1, 35),
(2, 3, 'HANDYHÜLLE', 3, 5),
(2, 4, 'HANDYHÜLLE', 4, 6),
(2, 5, 'HANDYHÜLLE', 2, 35),
(2, 43, 'TASCHE', 1, 25),
(3, 1, '', 6, 3.5),
(3, 2, '', 7, 2),
(4, 1, '', 4, 3.5),
(4, 2, '', 3, 2),
(4, 4, '', 4, 6),
(4, 3, '', 3, 5),
(4, 5, '', 4, 35);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `product_category_id` int(11) NOT NULL,
  `product_image` varchar(500) NOT NULL,
  `product_name` varchar(250) NOT NULL,
  `product_brand` varchar(250) NOT NULL,
  `product_pprice` float NOT NULL,
  `product_wprice` float NOT NULL,
  `product_rprice` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `products`
--

INSERT INTO `products` (`product_id`, `product_category_id`, `product_image`, `product_name`, `product_brand`, `product_pprice`, `product_wprice`, `product_rprice`) VALUES
(1, 6, 'product-image-input_1713984541406.png', '9D PANZERGLAS', 'BLADE', 1.5, 3.5, 20),
(2, 6, 'product-image-input_1713984564745.jpg', 'PANZERGLAS', 'XSSIVE', 1, 2, 15),
(3, 7, 'product-image-input_1713984630600.jpg', 'HANDYHÜLLE', 'TEST', 2, 5, 15),
(4, 7, 'product-image-input_1713984667565.jpg', 'HANDYHÜLLE', 'NOCH', 5, 6, 25),
(5, 7, 'update-product-image-input_1713984958365.jpg', 'HANDYHÜLLE', 'GLITZER', 10, 35, 45),
(29, 0, 'no-picture.jpg', 'Yeni ürün', '', 0, 0, 0),
(31, 0, 'no-picture.jpg', 'Yeni ürün', '', 0, 0, 0),
(39, 0, 'no-picture.jpg', 'Yeni ürün', '', 0, 0, 0),
(41, 0, 'no-picture.jpg', 'Yeni ürün', '', 0, 0, 0),
(42, 0, 'no-picture.jpg', 'REDMI NOTE 10 DISPLAY', '', 0, 35, 0),
(43, 0, 'no-picture.jpg', 'TASCHE', '', 0, 25, 0);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `user_name` varchar(50) NOT NULL,
  `user_password` varchar(250) NOT NULL,
  `user_role` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `users`
--

INSERT INTO `users` (`user_id`, `user_name`, `user_password`, `user_role`) VALUES
(1, 'admin', 'Ka76133@', 'admin'),
(2, 'client', 'client', 'client');

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`);

--
-- Tablo için indeksler `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`);

--
-- Tablo için indeksler `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`);

--
-- Tablo için indeksler `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Tablo için AUTO_INCREMENT değeri `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Tablo için AUTO_INCREMENT değeri `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- Tablo için AUTO_INCREMENT değeri `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
