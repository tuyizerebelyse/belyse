-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 22, 2025 at 03:04 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `smartpark_cwsms`
--

-- --------------------------------------------------------

--
-- Table structure for table `cars`
--

CREATE TABLE `cars` (
  `plate_number` varchar(20) NOT NULL,
  `car_type` varchar(50) NOT NULL,
  `car_size` varchar(20) NOT NULL,
  `driver_name` varchar(100) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cars`
--

INSERT INTO `cars` (`plate_number`, `car_type`, `car_size`, `driver_name`, `phone_number`, `created_at`) VALUES
('RAD931H', 'Lamborghini ', 'Large', 'chanel', '0785562932', '2025-05-21 17:09:35'),
('RAE200G', 'YUTONG', 'Large', 'Edvin', '0796332122', '2025-05-21 09:31:41'),
('RAE433H', 'Supercharger', 'Medium', 'Edvin', '0796332122', '2025-05-22 13:02:17'),
('RRA799D', 'Benz', 'Medium', 'Plouis ', '0778876944', '2025-05-21 18:31:01');

-- --------------------------------------------------------

--
-- Table structure for table `packages`
--

CREATE TABLE `packages` (
  `package_number` int(11) NOT NULL,
  `package_name` varchar(100) NOT NULL,
  `package_description` text DEFAULT NULL,
  `package_price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `packages`
--

INSERT INTO `packages` (`package_number`, `package_name`, `package_description`, `package_price`) VALUES
(1, 'Basic wash', 'Exterior hand wash', 5000.00),
(2, 'Classic wash', 'Interior hand wash', 10000.00),
(3, 'Premium wash', 'Exterior and interior hand wash', 20000.00);

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `payment_number` int(11) NOT NULL,
  `record_number` int(11) NOT NULL,
  `amount_paid` decimal(10,2) NOT NULL,
  `payment_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `service_packages`
--

CREATE TABLE `service_packages` (
  `record_number` int(11) NOT NULL,
  `plate_number` varchar(20) NOT NULL,
  `package_number` int(11) NOT NULL,
  `service_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `service_packages`
--

INSERT INTO `service_packages` (`record_number`, `plate_number`, `package_number`, `service_date`) VALUES
(2, 'RAE200G', 3, '2025-05-21 15:06:00'),
(5, 'RAD931H', 3, '2025-05-21 17:11:00'),
(7, 'RAE200G', 3, '2025-02-14 17:27:00'),
(9, 'RAE200G', 3, '2025-05-22 10:42:00');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','receptionist') DEFAULT 'receptionist',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`, `created_at`) VALUES
(1, 'admin', '$2b$10$QBKTkqDamJhB1mQFnAsPfOabibutsX0ef6TqIHyQa0ath/kdLTWHi', 'admin', '2025-05-21 09:28:38'),
(3, 'chanel', '$2b$10$u/0sfTZS2CtunJ5kdeWIfOspxn.gtzJ0C.any7bybycj9vBvP/Vxq', 'receptionist', '2025-05-21 09:30:17'),
(4, 'nolan', '$2b$10$/TDE3kNqABedl65sYvWxy.lORMCNjh6Va6QUQSr1KbYss2ncsOpSK', 'receptionist', '2025-05-21 18:31:46'),
(5, 'gisubizofx', '$2b$10$fEBiCku56WvrP5W48MXuiudILMortBTlPRJlmFbIlCS5X1kcOF44y', 'admin', '2025-05-22 10:19:17');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cars`
--
ALTER TABLE `cars`
  ADD PRIMARY KEY (`plate_number`);

--
-- Indexes for table `packages`
--
ALTER TABLE `packages`
  ADD PRIMARY KEY (`package_number`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`payment_number`),
  ADD KEY `record_number` (`record_number`);

--
-- Indexes for table `service_packages`
--
ALTER TABLE `service_packages`
  ADD PRIMARY KEY (`record_number`),
  ADD KEY `plate_number` (`plate_number`),
  ADD KEY `package_number` (`package_number`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `packages`
--
ALTER TABLE `packages`
  MODIFY `package_number` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_number` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `service_packages`
--
ALTER TABLE `service_packages`
  MODIFY `record_number` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`record_number`) REFERENCES `service_packages` (`record_number`);

--
-- Constraints for table `service_packages`
--
ALTER TABLE `service_packages`
  ADD CONSTRAINT `service_packages_ibfk_1` FOREIGN KEY (`plate_number`) REFERENCES `cars` (`plate_number`) ON DELETE CASCADE,
  ADD CONSTRAINT `service_packages_ibfk_2` FOREIGN KEY (`package_number`) REFERENCES `packages` (`package_number`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
