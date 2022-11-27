-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: Nov 27, 2022 at 02:13 AM
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
-- Database: `database_development`
--
CREATE DATABASE IF NOT EXISTS `database_development` DEFAULT CHARACTER SET latin1 COLLATE latin1_general_ci;
USE `database_development`;

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
CREATE TABLE IF NOT EXISTS `accounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) COLLATE latin1_general_ci NOT NULL,
  `password` varchar(255) COLLATE latin1_general_ci NOT NULL,
  `level` int(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `field` text COLLATE latin1_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `username_2` (`username`),
  UNIQUE KEY `username_3` (`username`),
  UNIQUE KEY `username_4` (`username`),
  UNIQUE KEY `username_5` (`username`),
  UNIQUE KEY `username_6` (`username`),
  UNIQUE KEY `username_7` (`username`),
  UNIQUE KEY `username_8` (`username`),
  UNIQUE KEY `username_9` (`username`),
  UNIQUE KEY `username_10` (`username`),
  UNIQUE KEY `username_11` (`username`),
  UNIQUE KEY `username_12` (`username`),
  UNIQUE KEY `username_13` (`username`),
  UNIQUE KEY `username_14` (`username`),
  UNIQUE KEY `username_15` (`username`),
  UNIQUE KEY `username_16` (`username`),
  UNIQUE KEY `username_17` (`username`),
  UNIQUE KEY `username_18` (`username`),
  UNIQUE KEY `username_19` (`username`),
  UNIQUE KEY `username_20` (`username`),
  UNIQUE KEY `username_21` (`username`),
  UNIQUE KEY `username_22` (`username`),
  UNIQUE KEY `username_23` (`username`),
  UNIQUE KEY `username_24` (`username`),
  UNIQUE KEY `username_25` (`username`),
  UNIQUE KEY `username_26` (`username`),
  UNIQUE KEY `username_27` (`username`),
  UNIQUE KEY `username_28` (`username`),
  UNIQUE KEY `username_29` (`username`),
  UNIQUE KEY `username_30` (`username`),
  UNIQUE KEY `username_31` (`username`),
  UNIQUE KEY `username_32` (`username`),
  UNIQUE KEY `username_33` (`username`),
  UNIQUE KEY `username_34` (`username`),
  UNIQUE KEY `username_35` (`username`),
  UNIQUE KEY `username_36` (`username`),
  UNIQUE KEY `username_37` (`username`),
  UNIQUE KEY `username_38` (`username`),
  UNIQUE KEY `username_39` (`username`),
  UNIQUE KEY `username_40` (`username`),
  UNIQUE KEY `username_41` (`username`),
  UNIQUE KEY `username_42` (`username`),
  UNIQUE KEY `username_43` (`username`),
  UNIQUE KEY `username_44` (`username`),
  UNIQUE KEY `username_45` (`username`),
  UNIQUE KEY `username_46` (`username`),
  UNIQUE KEY `username_47` (`username`),
  UNIQUE KEY `username_48` (`username`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) COLLATE latin1_general_ci NOT NULL,
  `last_name` varchar(255) COLLATE latin1_general_ci NOT NULL,
  `email` varchar(255) COLLATE latin1_general_ci NOT NULL,
  `phone_number` int(10) DEFAULT NULL,
  `street` varchar(255) COLLATE latin1_general_ci NOT NULL,
  `city` varchar(255) COLLATE latin1_general_ci NOT NULL,
  `region` varchar(2) COLLATE latin1_general_ci NOT NULL,
  `country` varchar(3) COLLATE latin1_general_ci NOT NULL,
  `postal_code` varchar(6) COLLATE latin1_general_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `accounts`
--
ALTER TABLE `accounts`
  ADD CONSTRAINT `Accounts_user_id_foreign_idx` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `accounts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `accounts_ibfk_10` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `accounts_ibfk_11` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `accounts_ibfk_12` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `accounts_ibfk_13` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `accounts_ibfk_14` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `accounts_ibfk_15` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `accounts_ibfk_16` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `accounts_ibfk_17` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `accounts_ibfk_18` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `accounts_ibfk_19` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `accounts_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `accounts_ibfk_20` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `accounts_ibfk_21` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `accounts_ibfk_22` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `accounts_ibfk_23` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `accounts_ibfk_24` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `accounts_ibfk_25` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `accounts_ibfk_26` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `accounts_ibfk_27` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `accounts_ibfk_28` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `accounts_ibfk_29` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `accounts_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `accounts_ibfk_30` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `accounts_ibfk_31` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `accounts_ibfk_32` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `accounts_ibfk_33` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `accounts_ibfk_34` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `accounts_ibfk_4` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `accounts_ibfk_5` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `accounts_ibfk_6` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `accounts_ibfk_7` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `accounts_ibfk_8` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `accounts_ibfk_9` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
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
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `climbs`
--

INSERT INTO `climbs` (`id`, `title`, `description`, `style`, `difficulty_level`, `img_urls`, `createdAt`, `updatedAt`) VALUES
(1, 'Climb 1', 'description', 'sport', '5.12', NULL, '2022-11-27 01:53:01', '2022-11-27 01:53:01');

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
  UNIQUE KEY `title_2` (`title`),
  UNIQUE KEY `title_3` (`title`),
  UNIQUE KEY `title_4` (`title`),
  UNIQUE KEY `title_5` (`title`),
  UNIQUE KEY `title_6` (`title`),
  UNIQUE KEY `title_7` (`title`),
  UNIQUE KEY `title_8` (`title`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `places`
--

INSERT INTO `places` (`id`, `title`, `description`, `steps`, `latitude`, `longitude`, `user_id`, `createdAt`, `updatedAt`) VALUES
(1, 'Place 6', 'description', 'steps', 0, 0, 1, '2022-11-27 01:52:47', '2022-11-27 01:52:47');

-- --------------------------------------------------------

--
-- Table structure for table `place_climbs`
--

DROP TABLE IF EXISTS `place_climbs`;
CREATE TABLE IF NOT EXISTS `place_climbs` (
  `place_id` int(11) DEFAULT NULL,
  `climb_id` int(11) NOT NULL,
  KEY `climb_id` (`climb_id`),
  KEY `place_id` (`place_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `place_climbs`
--

INSERT INTO `place_climbs` (`place_id`, `climb_id`) VALUES
(1, 1);

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
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `email_4` (`email`),
  UNIQUE KEY `email_5` (`email`),
  UNIQUE KEY `email_6` (`email`),
  UNIQUE KEY `email_7` (`email`),
  UNIQUE KEY `email_8` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `access_level`, `createdAt`, `updatedAt`) VALUES
(1, 'bob martin', 'm@s.com', '$2b$12$Sb9bzbJgNN4QLTF1QR2cSelNJGtCwD0eaCUPmOWIjR5mfHvsl89XS', 1, '2022-11-27 01:52:17', '2022-11-27 01:52:17');

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
-- Constraints for table `places`
--
ALTER TABLE `places`
  ADD CONSTRAINT `places_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `places_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `places_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `places_ibfk_4` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `places_ibfk_5` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `places_ibfk_6` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `places_ibfk_7` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `places_ibfk_8` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `place_climbs`
--
ALTER TABLE `place_climbs`
  ADD CONSTRAINT `place_climbs_ibfk_1` FOREIGN KEY (`place_id`) REFERENCES `places` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `place_climbs_ibfk_10` FOREIGN KEY (`climb_id`) REFERENCES `climbs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `place_climbs_ibfk_11` FOREIGN KEY (`place_id`) REFERENCES `places` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `place_climbs_ibfk_12` FOREIGN KEY (`place_id`) REFERENCES `places` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `place_climbs_ibfk_13` FOREIGN KEY (`place_id`) REFERENCES `places` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `place_climbs_ibfk_2` FOREIGN KEY (`climb_id`) REFERENCES `climbs` (`id`),
  ADD CONSTRAINT `place_climbs_ibfk_3` FOREIGN KEY (`place_id`) REFERENCES `places` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `place_climbs_ibfk_4` FOREIGN KEY (`climb_id`) REFERENCES `climbs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `place_climbs_ibfk_5` FOREIGN KEY (`place_id`) REFERENCES `places` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `place_climbs_ibfk_6` FOREIGN KEY (`climb_id`) REFERENCES `climbs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `place_climbs_ibfk_7` FOREIGN KEY (`place_id`) REFERENCES `places` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `place_climbs_ibfk_8` FOREIGN KEY (`climb_id`) REFERENCES `climbs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `place_climbs_ibfk_9` FOREIGN KEY (`place_id`) REFERENCES `places` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `user_rates`
--
ALTER TABLE `user_rates`
  ADD CONSTRAINT `user_rates_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_rates_ibfk_10` FOREIGN KEY (`climb_id`) REFERENCES `climbs` (`id`),
  ADD CONSTRAINT `user_rates_ibfk_2` FOREIGN KEY (`climb_id`) REFERENCES `climbs` (`id`),
  ADD CONSTRAINT `user_rates_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_rates_ibfk_4` FOREIGN KEY (`climb_id`) REFERENCES `climbs` (`id`),
  ADD CONSTRAINT `user_rates_ibfk_5` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_rates_ibfk_6` FOREIGN KEY (`climb_id`) REFERENCES `climbs` (`id`),
  ADD CONSTRAINT `user_rates_ibfk_7` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_rates_ibfk_8` FOREIGN KEY (`climb_id`) REFERENCES `climbs` (`id`),
  ADD CONSTRAINT `user_rates_ibfk_9` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
