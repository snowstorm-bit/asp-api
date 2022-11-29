-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: Nov 29, 2022 at 07:10 PM
-- Server version: 10.6.5-MariaDB
-- PHP Version: 7.4.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `find_your_way`
--
CREATE DATABASE IF NOT EXISTS `find_your_way` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `find_your_way`;

-- --------------------------------------------------------

--
-- Table structure for table `climbs`
--

DROP TABLE IF EXISTS `climbs`;
CREATE TABLE IF NOT EXISTS `climbs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `description` varchar(500) NOT NULL,
  `style` varchar(255) NOT NULL,
  `difficulty_level` decimal(3,2) NOT NULL,
  `img_urls` text DEFAULT NULL,
  `place_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `place_id` (`place_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `places`
--

DROP TABLE IF EXISTS `places`;
CREATE TABLE IF NOT EXISTS `places` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `description` varchar(500) NOT NULL,
  `steps` varchar(500) NOT NULL,
  `latitude` float NOT NULL,
  `longitude` float NOT NULL,
  `user_id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `title` (`title`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `places`
--

INSERT INTO `places` (`id`, `title`, `description`, `steps`, `latitude`, `longitude`, `user_id`, `createdAt`, `updatedAt`) VALUES
(1, 'Place 7', 'description', 'steps', 0, 0, 1, '2022-11-29 18:35:57', '2022-11-29 18:35:57');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `access_level` int(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `access_level`, `createdAt`, `updatedAt`) VALUES
(1, 'bob martin', 'm@s.com', '$2b$12$ELo6XzkcZMbZnn6mlrlLc.W17CTZpuNKCMF8HVaSndjKtUf51wYBi', 1, '2022-11-29 18:35:22', '2022-11-29 18:35:22');

-- --------------------------------------------------------

--
-- Table structure for table `user_rates`
--

DROP TABLE IF EXISTS `user_rates`;
CREATE TABLE IF NOT EXISTS `user_rates` (
  `user_id` int(11) NOT NULL,
  `climb_id` int(11) NOT NULL,
  `rate` int(1) NOT NULL,
  KEY `user_id` (`user_id`),
  KEY `climb_id` (`climb_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `climbs`
--
ALTER TABLE `climbs`
  ADD CONSTRAINT `climbs_ibfk_1` FOREIGN KEY (`place_id`) REFERENCES `places` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `climbs_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `places`
--
ALTER TABLE `places`
  ADD CONSTRAINT `places_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_rates`
--
ALTER TABLE `user_rates`
  ADD CONSTRAINT `user_rates_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_rates_ibfk_2` FOREIGN KEY (`climb_id`) REFERENCES `climbs` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
