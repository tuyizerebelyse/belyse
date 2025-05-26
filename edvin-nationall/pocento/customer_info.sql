-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 19, 2025 at 10:38 AM
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
-- Database: `customer_info`
--

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `customerid` int(11) NOT NULL,
  `cust_fname` varchar(255) NOT NULL,
  `cust_lname` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `telephone` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`customerid`, `cust_fname`, `cust_lname`, `location`, `telephone`) VALUES
(1, 'TUYIZERE', 'Pacifique', 'Nyamagabe', 787863435),
(2, 'Ibrahim', 'UMUREHAYIRE', 'Gisagara', 788947235);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `ordernumber` int(11) NOT NULL,
  `orderdate` date NOT NULL,
  `productcode` int(11) NOT NULL,
  `customerid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`ordernumber`, `orderdate`, `productcode`, `customerid`) VALUES
(1, '2025-05-25', 4, 1);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `productcode` int(11) NOT NULL,
  `productname` varchar(255) NOT NULL,
  `productquantity` int(11) NOT NULL,
  `unitprice` int(11) NOT NULL,
  `totalprice` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`productcode`, `productname`, `productquantity`, `unitprice`, `totalprice`) VALUES
(2, 'umuceri', 53, 1200, 63600),
(4, 'ibijumba', 8, 900, 7200),
(6, 'Inanasi', 45, 1000, 45000);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userid` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userid`, `username`, `password`) VALUES
(1, 'paccy', '$2b$10$j6BuDAzvi5FusUgneTsfMeckwlGabUavzgJPMD87SZS1gbApYnf8q'),
(2, 'jackson', '$2b$10$mNqEgxkQAgogyIJsS72Na.aDzabWTeWsVWPX8Usb8OGNCsKe56ddG'),
(3, 'jackson', '$2b$10$DqFIV.QzlhaZuaSqN.qPWejM58I5MUPRF28NbSf6K0z8BpVJhAiL.'),
(6, 'abouba', '$2b$10$/xFILXoSllqjSbl3XSu5S.c0bEhi.SFUFMSFMhV/SzpynG95/sRsm'),
(7, 'emmanuel', '$2b$10$b5xpwQjwbO//CkpIUENLIOjkldX29PlrYf95WXS4p0WiZEnCmA5KO'),
(8, 'emma', '$2b$10$aQDrDq7CWXJCl5ChJmY0B.FMFMkxwyyLmLrAbhEUMj3DtsbYCJDk.'),
(9, 'Chance', '$2b$10$WHA.NY9ZeHHACXANEbhCpujtpeZXgpvXn6pmVepgXOMwnlXBglcPG');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`customerid`),
  ADD UNIQUE KEY `telephone` (`telephone`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`ordernumber`),
  ADD KEY `productcode` (`productcode`),
  ADD KEY `customerid` (`customerid`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`productcode`),
  ADD UNIQUE KEY `unique_productname` (`productname`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `customerid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `ordernumber` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `productcode` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`productcode`) REFERENCES `products` (`productcode`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`customerid`) REFERENCES `customers` (`customerid`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
