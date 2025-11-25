-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 25, 2025 at 05:29 PM
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
-- Database: `db_banksystems`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbladmin`
--

CREATE TABLE `tbladmin` (
  `BankTellerID` int(11) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Contact Number` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tblloans`
--

CREATE TABLE `tblloans` (
  `LoanID` int(11) NOT NULL,
  `UserID` varchar(10) NOT NULL,
  `LoanAmount` int(100) NOT NULL,
  `MonthsToPay` int(10) NOT NULL,
  `Reason` varchar(50) NOT NULL,
  `MonthlyIncome` int(100) NOT NULL,
  `Date` date NOT NULL,
  `Status` varchar(50) NOT NULL,
  `InterestRate` decimal(5,2) NOT NULL,
  `totalAmount` int(50) NOT NULL,
  `MonthlyPayment` int(50) NOT NULL,
  `RemainingBalance` int(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tblloans`
--

INSERT INTO `tblloans` (`LoanID`, `UserID`, `LoanAmount`, `MonthsToPay`, `Reason`, `MonthlyIncome`, `Date`, `Status`, `InterestRate`, `totalAmount`, `MonthlyPayment`, `RemainingBalance`) VALUES
(7, '2', 5000, 3, 'Family Income', 1000, '2025-11-25', 'Active', 5.00, 12000, 1500, 10500),
(8, '1', 10000, 3, 'Work', 15000, '2025-11-25', 'Finished', 5.00, 11000, 2500, 0),
(9, '1', 2000, 3, 'Work', 2500, '2025-11-25', 'Pending', 0.00, 0, 0, 0),
(10, '3', 50000, 6, 'Work', 30000, '2025-11-25', 'Active', 7.00, 55000, 7500, 55000),
(11, '4', 1000, 3, 'Family needed', 5000, '2025-11-25', 'Pending', 0.00, 0, 0, 0),
(13, '5', 1000, 3, 'School payment', 5000, '2025-11-25', 'Pending', 0.00, 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `tbltransactions`
--

CREATE TABLE `tbltransactions` (
  `TransactionID` int(11) NOT NULL,
  `UserID` varchar(10) NOT NULL,
  `FullName` varchar(100) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Type` varchar(50) NOT NULL,
  `Amount` int(100) NOT NULL,
  `Status` varchar(50) NOT NULL,
  `DateofTransaction` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbltransactions`
--

INSERT INTO `tbltransactions` (`TransactionID`, `UserID`, `FullName`, `Email`, `Type`, `Amount`, `Status`, `DateofTransaction`) VALUES
(36, '1', 'John Doe', 'johndoe@example.com', 'Deposit', 10000, 'Approved', '2025-11-25'),
(37, '4', 'Will Garcia', 'will@example.com', 'Deposit', 4000, 'Approved', '2025-11-25'),
(38, '3', 'Nancy Ocampo', 'will@example.com', 'Deposit', 54000, 'Approved', '2025-11-25'),
(39, '3', 'Nancy Ocampo', 'will@example.com', 'Withdrawal', 5000, 'Approved', '2025-11-25'),
(40, '4', 'Will Garcia', 'will@example.com', 'Withdrawal', 2000, 'Pending', '2025-11-25'),
(41, '4', 'Will Garcia', 'will@example.com', 'Deposit', 10000, 'Pending', '2025-11-25'),
(42, '3', 'Nancy Ocampo', 'nancy@example.com', 'Deposit', 10000, 'Pending', '2025-11-25'),
(43, '5', 'Lance Cruz', 'lance@example.com', 'Deposit', 500, 'Pending', '2025-11-25');

-- --------------------------------------------------------

--
-- Table structure for table `tblusers`
--

CREATE TABLE `tblusers` (
  `UserID` varchar(10) NOT NULL,
  `FullName` varchar(100) NOT NULL,
  `Balance` int(50) NOT NULL,
  `Age` int(10) NOT NULL,
  `Address` varchar(100) NOT NULL,
  `DateofBirth` date NOT NULL,
  `Gender` varchar(10) NOT NULL,
  `ContactNumber` varchar(20) NOT NULL,
  `EmailAddress` varchar(100) NOT NULL,
  `Status` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tblusers`
--

INSERT INTO `tblusers` (`UserID`, `FullName`, `Balance`, `Age`, `Address`, `DateofBirth`, `Gender`, `ContactNumber`, `EmailAddress`, `Status`) VALUES
('1', 'John Doe', 7500, 23, 'Manila City', '1997-11-10', 'M', '09030967054', 'johndoe@example.com', 'Active'),
('2', 'David Glenn Gevana', 3500, 19, 'Batangas', '2006-08-02', 'M', '09753248742', 'davidglen@example.com', 'Active'),
('3', 'Nancy Ocampo', 49000, 20, 'Manila', '2007-10-15', 'F', '09734529372', 'nancy@example.com', 'Active'),
('4', 'Will Garcia', 4000, 24, 'Sto.tomas Batangas', '2001-11-12', 'M', '097365352', 'will@example.com', 'Active'),
('5', 'Lance Cruz', 0, 23, 'Manila City', '2000-01-10', 'M', '09865243728', 'lance@example.com', 'Active');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbladmin`
--
ALTER TABLE `tbladmin`
  ADD PRIMARY KEY (`BankTellerID`);

--
-- Indexes for table `tblloans`
--
ALTER TABLE `tblloans`
  ADD PRIMARY KEY (`LoanID`);

--
-- Indexes for table `tbltransactions`
--
ALTER TABLE `tbltransactions`
  ADD PRIMARY KEY (`TransactionID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbladmin`
--
ALTER TABLE `tbladmin`
  MODIFY `BankTellerID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tblloans`
--
ALTER TABLE `tblloans`
  MODIFY `LoanID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `tbltransactions`
--
ALTER TABLE `tbltransactions`
  MODIFY `TransactionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
