-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 12, 2025 at 01:08 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `camellia`
--

-- --------------------------------------------------------

--
-- Table structure for table `activitylog`
--

CREATE TABLE `activitylog` (
  `id` int(11) NOT NULL,
  `action` varchar(255) NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp(),
  `icon` varchar(10) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activitylog`
--

INSERT INTO `activitylog` (`id`, `action`, `time`, `icon`, `userId`) VALUES
(1, 'User logged in: umwizerwa', '2025-05-09 13:03:08', '🔑', 2),
(2, 'User logged in: umwizerwa', '2025-05-09 13:04:35', '🔑', 2),
(3, 'Candidate added: bad guy', '2025-05-09 13:05:55', '👤', NULL),
(4, 'User logged in: umwizerwa', '2025-05-12 07:05:46', '🔑', 2),
(5, 'Candidate updated: kabagema benny', '2025-05-12 07:19:18', '✏️', 2),
(6, 'Candidate deleted: mwami forreal', '2025-05-12 07:32:03', '🗑️', NULL),
(7, 'Candidate deleted: kabagema benny', '2025-05-12 07:43:14', '🗑️', NULL),
(8, 'User logged in: umwizerwa', '2025-05-12 08:17:58', '🔑', 2),
(9, 'Post updated: Store keeper', '2025-05-12 09:13:09', '✏️', 2),
(10, 'Post created: Cleaner', '2025-05-12 09:13:28', '📝', 2),
(11, 'Post deleted: Cleaner', '2025-05-12 09:19:30', '🗑️', 2),
(12, 'User logged in: umwizerwa', '2025-05-12 10:43:11', '🔑', 2),
(13, 'Post created: Cleaner', '2025-05-12 10:45:33', '📝', 2),
(14, 'Post updated: Cleanergcg', '2025-05-12 10:45:58', '✏️', 2),
(15, 'Post deleted: Cleanergcg', '2025-05-12 10:46:09', '🗑️', 2),
(16, 'Post created: It manager', '2025-05-12 10:46:27', '📝', 2),
(17, 'Candidate added: SEMINEGA Pascal', '2025-05-12 10:50:07', '👤', NULL),
(18, 'Candidate added: ISHIMWE Emmanuel', '2025-05-12 10:53:34', '👤', NULL),
(19, 'User logged out: umwizerwa', '2025-05-12 11:02:00', '🚪', 2),
(20, 'User logged in: umwizerwa', '2025-05-12 11:04:11', '🔑', 2);

-- --------------------------------------------------------

--
-- Table structure for table `candidate`
--

CREATE TABLE `candidate` (
  `CandidateNationalId` varchar(50) NOT NULL,
  `FirstName` varchar(50) NOT NULL,
  `LastName` varchar(50) NOT NULL,
  `Gender` varchar(10) DEFAULT NULL,
  `DataOfficials` date DEFAULT NULL,
  `PostID` int(11) DEFAULT NULL,
  `ExamDate` date DEFAULT NULL,
  `PhoneNumber` varchar(20) DEFAULT NULL,
  `Marks` decimal(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `candidate`
--

INSERT INTO `candidate` (`CandidateNationalId`, `FirstName`, `LastName`, `Gender`, `DataOfficials`, `PostID`, `ExamDate`, `PhoneNumber`, `Marks`) VALUES
('12004347857832', 'SEMINEGA', 'Pascal', 'Male', '2009-01-13', 6, '2025-05-12', '0783448140', 43.00),
('123456789', 'Edvin', 'Umwizerwa', 'Male', '2025-05-07', 1, '2025-05-10', '+250788123456', 98.50),
('1234567890123457', 'ISHIMWE', 'Emmanuel', 'Male', '2025-02-05', 6, '2025-05-12', '0783448149', 110.00),
('1234568', 'bad', 'guy', 'Male', '2000-05-23', 2, '2025-05-09', '0798832050', 89.00);

-- --------------------------------------------------------

--
-- Table structure for table `post`
--

CREATE TABLE `post` (
  `PostID` int(11) NOT NULL,
  `PostName` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `post`
--

INSERT INTO `post` (`PostID`, `PostName`) VALUES
(1, 'Developer'),
(2, 'Social media manager'),
(3, 'Store keeper'),
(6, 'It manager');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `UserID` int(11) NOT NULL,
  `UserName` varchar(50) NOT NULL,
  `Password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`UserID`, `UserName`, `Password`) VALUES
(1, 'edvin', '123'),
(2, 'umwizerwa', '$2b$10$/sSFsoDdKjCi2zZGGaj6S.kU4Ap83B1nNY3luaBvUq2dhQ2bRYt52');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activitylog`
--
ALTER TABLE `activitylog`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `candidate`
--
ALTER TABLE `candidate`
  ADD PRIMARY KEY (`CandidateNationalId`),
  ADD KEY `PostID` (`PostID`);

--
-- Indexes for table `post`
--
ALTER TABLE `post`
  ADD PRIMARY KEY (`PostID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`UserID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activitylog`
--
ALTER TABLE `activitylog`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `post`
--
ALTER TABLE `post`
  MODIFY `PostID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activitylog`
--
ALTER TABLE `activitylog`
  ADD CONSTRAINT `activitylog_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`UserID`);

--
-- Constraints for table `candidate`
--
ALTER TABLE `candidate`
  ADD CONSTRAINT `candidate_ibfk_1` FOREIGN KEY (`PostID`) REFERENCES `post` (`PostID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
