-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 18, 2021 at 09:28 AM
-- Server version: 10.4.19-MariaDB
-- PHP Version: 8.0.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mystudentdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `archive`
--

CREATE TABLE `archive` (
  `ID` int(9) NOT NULL,
  `Subject` varchar(25) NOT NULL,
  `Student` varchar(25) NOT NULL,
  `Remarks` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `class`
--

CREATE TABLE `class` (
  `ID` int(9) NOT NULL,
  `Class_name` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `class`
--

INSERT INTO `class` (`ID`, `Class_name`) VALUES
(3, 'Class 2'),
(4, 'class 3'),
(7, 'class 4');

-- --------------------------------------------------------

--
-- Table structure for table `conversation`
--

CREATE TABLE `conversation` (
  `ID` int(25) NOT NULL,
  `sender_id` int(25) DEFAULT NULL,
  `receiver_id` int(25) DEFAULT NULL,
  `conversation_type` varchar(25) DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `conversation`
--

INSERT INTO `conversation` (`ID`, `sender_id`, `receiver_id`, `conversation_type`, `date`) VALUES
(1, 15, 13, 'broadcast', '2021-07-17 17:39:38'),
(2, 15, 16, 'broadcast', '2021-07-17 17:39:38'),
(3, 15, 12, 'broadcast', '2021-07-17 17:39:38');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `ID` int(25) NOT NULL,
  `conversation_id` int(25) NOT NULL,
  `user_id` int(25) DEFAULT NULL,
  `message` varchar(255) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(25) NOT NULL DEFAULT 'unread'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`ID`, `conversation_id`, `user_id`, `message`, `date`, `status`) VALUES
(1, 1, 15, 'hello', '2021-07-17 17:39:38', 'unread'),
(2, 3, 15, 'hello', '2021-07-17 17:39:38', 'unread'),
(3, 2, 15, 'hello', '2021-07-17 17:39:38', 'unread'),
(4, 1, 15, 'hello again', '2021-07-17 18:04:27', 'unread');

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE `notification` (
  `ID` int(20) NOT NULL,
  `notification` varchar(45) NOT NULL,
  `receiver_id` int(10) NOT NULL,
  `sender_id` int(10) NOT NULL,
  `conversation_id` int(25) DEFAULT NULL,
  `status` varchar(25) DEFAULT 'unread',
  `date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `notification`
--

INSERT INTO `notification` (`ID`, `notification`, `receiver_id`, `sender_id`, `conversation_id`, `status`, `date`) VALUES
(12, 'umar has Sent You a New Message', 13, 15, 1, 'unread', '2021-07-17 17:39:38'),
(13, 'umar has Sent You a New Message', 13, 15, 1, 'unread', '2021-07-17 18:04:27');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `ID` int(9) NOT NULL,
  `Student_name` varchar(25) NOT NULL,
  `Grade` varchar(9) NOT NULL,
  `Remarks` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `student_class`
--

CREATE TABLE `student_class` (
  `ID` int(10) NOT NULL,
  `class_id` int(10) NOT NULL,
  `student_id` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `student_class`
--

INSERT INTO `student_class` (`ID`, `class_id`, `student_id`) VALUES
(28, 4, 13),
(30, 3, 12),
(31, 4, 16),
(40, 7, 17);

-- --------------------------------------------------------

--
-- Table structure for table `student_subject`
--

CREATE TABLE `student_subject` (
  `ID` int(9) NOT NULL,
  `subject_id` int(15) NOT NULL,
  `student_id` varchar(25) NOT NULL,
  `average_grade` int(20) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `student_subject`
--

INSERT INTO `student_subject` (`ID`, `subject_id`, `student_id`, `average_grade`) VALUES
(1, 4, '13', 46),
(2, 4, '12', 41),
(3, 1, '12', 0),
(4, 4, '16', 0),
(19, 11, '17', 0),
(20, 10, '17', 0);

-- --------------------------------------------------------

--
-- Table structure for table `student_test`
--

CREATE TABLE `student_test` (
  `ID` int(10) NOT NULL,
  `test_id` int(10) NOT NULL,
  `student_id` int(10) NOT NULL,
  `student_grades` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `student_test`
--

INSERT INTO `student_test` (`ID`, `test_id`, `student_id`, `student_grades`) VALUES
(1, 3, 13, '46'),
(2, 3, 12, '31'),
(3, 4, 12, '20'),
(4, 5, 12, '50');

-- --------------------------------------------------------

--
-- Table structure for table `subject`
--

CREATE TABLE `subject` (
  `ID` int(9) NOT NULL,
  `Subject_name` varchar(45) NOT NULL,
  `teacher_id` int(25) DEFAULT NULL,
  `subject_status` varchar(45) NOT NULL DEFAULT 'available',
  `class_id` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `subject`
--

INSERT INTO `subject` (`ID`, `Subject_name`, `teacher_id`, `subject_status`, `class_id`) VALUES
(1, 'English', 15, 'archived', 3),
(3, 'Computer Science', 15, 'available', 3),
(4, 'Data Science', 15, 'available', 4),
(5, 'IT', 15, 'available', 4),
(6, 'Networks', 15, 'available', 4),
(7, 'Web', 15, 'available', 4),
(8, 'Cloud Application', 15, 'available', 3),
(9, 'Software Service', 15, 'available', 3),
(10, 'Linear Algebra', 18, 'available', 7),
(11, 'Calculas', 19, 'available', 7);

-- --------------------------------------------------------

--
-- Table structure for table `teacher`
--

CREATE TABLE `teacher` (
  `id` int(9) NOT NULL,
  `Remarks` varchar(35) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `teacher_subjects`
--

CREATE TABLE `teacher_subjects` (
  `ID` int(10) NOT NULL,
  `subject_id` int(10) DEFAULT NULL,
  `teacher_id` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `test`
--

CREATE TABLE `test` (
  `ID` int(10) NOT NULL,
  `test_name` varchar(45) NOT NULL,
  `subject_id` int(10) NOT NULL,
  `test_date` date NOT NULL,
  `batch_grades` varchar(45) NOT NULL,
  `total_marks` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `test`
--

INSERT INTO `test` (`ID`, `test_name`, `subject_id`, `test_date`, `batch_grades`, `total_marks`) VALUES
(2, 'asd', 3, '2021-07-08', '', 10),
(3, 'test 1', 4, '2021-07-29', 'public/uploads/4/3/student_test_grades.csv', 60),
(4, 'test 2', 1, '2021-07-27', 'public/uploads/1/4/grades.csv', 50),
(5, 'test of subject 4', 4, '2021-06-27', 'public/uploads/4/5/student_test_grades.csv', 50);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `ID` int(9) NOT NULL,
  `User_Name` varchar(25) NOT NULL,
  `Email` varchar(26) NOT NULL,
  `Password` varchar(60) NOT NULL,
  `First_Name` varchar(25) NOT NULL,
  `Last_Name` varchar(25) NOT NULL,
  `Roles` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`ID`, `User_Name`, `Email`, `Password`, `First_Name`, `Last_Name`, `Roles`) VALUES
(7, 'ali.sajjad25', 'alisajjad251992@gmail.com', '$2b$10$7Nieh/PtXcFe1LvBmuEAsuCAMz19MiJNAA/fsLQwYqFZehNWOYu.e', 'Hafiz Muhammad Ali', 'Sajjad Mughal', 'Admin'),
(12, 'Ali', 'alisajjad25@gmail.com', '$2b$10$2ym.fWaCwYBh/iuo4uPlNOy7AmTkeW4asWkJtdF7z4tnHUb9C0D5m', 'Ali', 'Sajjad', 'Student'),
(13, 'BilalIkram', 'bilal@gmail.com', '$2b$10$j15tnKmucO08W/9pMGFmXOWQWjZ4g3M7ozPsVpuP2VH9OawZosTry', 'Bilal', 'Ikram', 'Student'),
(15, 'umar', 'mbilalikram@hotmail.com', '$2b$10$jZ63ZutB/vklpNxjRRFcTO99qvbOLv9TlLAt.mYZqAD5ttUV9yLKG', 'Umar', 'Sajjad', 'Teacher'),
(16, 'hamza', 'hamza@gmail.com', '$2b$10$KCQ.NlkG4LJ8IoQX1NwcTeB81kHogQrPtxldFXnhf5PBY8vr.uSYy', 'Hamza', 'Altaf', 'Student'),
(17, 'abubakr', 'abubakar@gmail.com', '$2b$10$ExtBwFAstghlQu8AatWDwuI1Crl0EsjL6fZB3PerMbDrcle7y2NV6', 'Abu Bakar', 'Sajjad', 'Student'),
(18, 'abdullah', 'abdullah@gmail.com', '$2b$10$yq28iusaF.RaToVsYMEylOBSloCu9n.3GGE8d0bOS/1ewW6sVtkXK', 'Abdullah', 'Khan', 'Teacher'),
(19, 'john', 'john@gmail.com', '$2b$10$m4ln2lebKq5r3ZIXQnl6KuJK/YhfIVwyPGeruUFp/zKQzvaQESTta', 'John', 'Phillips', 'Teacher');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `archive`
--
ALTER TABLE `archive`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `class`
--
ALTER TABLE `class`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `Class_name` (`Class_name`);

--
-- Indexes for table `conversation`
--
ALTER TABLE `conversation`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `student_class`
--
ALTER TABLE `student_class`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `student_subject`
--
ALTER TABLE `student_subject`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `student_test`
--
ALTER TABLE `student_test`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `subject`
--
ALTER TABLE `subject`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `teacher`
--
ALTER TABLE `teacher`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `teacher_subjects`
--
ALTER TABLE `teacher_subjects`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `test`
--
ALTER TABLE `test`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `Email` (`Email`),
  ADD UNIQUE KEY `Password` (`Password`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `class`
--
ALTER TABLE `class`
  MODIFY `ID` int(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `conversation`
--
ALTER TABLE `conversation`
  MODIFY `ID` int(25) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `ID` int(25) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `notification`
--
ALTER TABLE `notification`
  MODIFY `ID` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `student_class`
--
ALTER TABLE `student_class`
  MODIFY `ID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `student_subject`
--
ALTER TABLE `student_subject`
  MODIFY `ID` int(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `student_test`
--
ALTER TABLE `student_test`
  MODIFY `ID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `subject`
--
ALTER TABLE `subject`
  MODIFY `ID` int(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `teacher`
--
ALTER TABLE `teacher`
  MODIFY `id` int(9) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `teacher_subjects`
--
ALTER TABLE `teacher_subjects`
  MODIFY `ID` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `test`
--
ALTER TABLE `test`
  MODIFY `ID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `ID` int(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
