-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: Dec 13, 2022 at 06:18 AM
-- Server version: 10.6.5-MariaDB
-- PHP Version: 7.4.26

SET
SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET
time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_development`
--
CREATE
DATABASE IF NOT EXISTS `db_development` DEFAULT CHARACTER SET latin1 COLLATE latin1_general_ci;
USE
`db_development`;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users`
(
    `id` int
(
    11
) NOT NULL AUTO_INCREMENT,
    `username` varchar
(
    50
) COLLATE latin1_general_ci NOT NULL,
    `email` varchar
(
    50
) COLLATE latin1_general_ci NOT NULL,
    `password` varchar
(
    255
) COLLATE latin1_general_ci NOT NULL,
    `access_level` int
(
    1
) NOT NULL,
    `createdAt` datetime NOT NULL,
    `updatedAt` datetime NOT NULL,
    PRIMARY KEY
(
    `id`
),
    UNIQUE KEY `email`
(
    `email`
)
    ) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1 COLLATE =latin1_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `places`
--

DROP TABLE IF EXISTS `places`;
CREATE TABLE IF NOT EXISTS `places`
(
    `id` int
(
    11
) NOT NULL AUTO_INCREMENT,
    `title` varchar
(
    50
) COLLATE latin1_general_ci NOT NULL,
    `description` varchar
(
    500
) COLLATE latin1_general_ci NOT NULL,
    `steps` varchar
(
    500
) COLLATE latin1_general_ci NOT NULL,
    `latitude` float NOT NULL,
    `longitude` float NOT NULL,
    `user_id` int
(
    11
) NOT NULL,
    `createdAt` datetime NOT NULL,
    `updatedAt` datetime NOT NULL,
    PRIMARY KEY
(
    `id`
),
    UNIQUE KEY `title`
(
    `title`
),
    KEY `user_id`
(
    `user_id`
)
    ) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1 COLLATE =latin1_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `climbs`
--

DROP TABLE IF EXISTS `climbs`;
CREATE TABLE IF NOT EXISTS `climbs`
(
    `id` int
(
    11
) NOT NULL AUTO_INCREMENT,
    `title` varchar
(
    50
) COLLATE latin1_general_ci NOT NULL,
    `description` varchar
(
    500
) COLLATE latin1_general_ci NOT NULL,
    `style` enum
(
    'traditional',
    'sport',
    'top_roping'
) COLLATE latin1_general_ci NOT NULL,
    `difficulty_level` decimal
(
    3,
    2
) NOT NULL,
    `images` text COLLATE latin1_general_ci NOT NULL,
    `place_id` int
(
    11
) NOT NULL,
    `user_id` int
(
    11
) NOT NULL,
    `createdAt` datetime NOT NULL,
    `updatedAt` datetime NOT NULL,
    PRIMARY KEY
(
    `id`
),
    KEY `place_id`
(
    `place_id`
),
    KEY `user_id`
(
    `user_id`
)
    ) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1 COLLATE =latin1_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_rates`
--

DROP TABLE IF EXISTS `user_rates`;
CREATE TABLE IF NOT EXISTS `user_rates`
(
    `user_id` int
(
    11
) NOT NULL,
    `climb_id` int
(
    11
) NOT NULL,
    `rate` int
(
    1
) NOT NULL,
    PRIMARY KEY
(
    `user_id`,
    `climb_id`
),
    KEY `climb_id`
(
    `climb_id`
)
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE =latin1_general_ci;

--
-- Constraints for table `places`
--
ALTER TABLE `places`
    ADD CONSTRAINT `places_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `climbs`
--
ALTER TABLE `climbs`
    ADD CONSTRAINT `climbs_ibfk_1` FOREIGN KEY (`place_id`) REFERENCES `places` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `climbs_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON
DELETE
CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user_rates`
--
ALTER TABLE `user_rates`
    ADD CONSTRAINT `user_rates_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_rates_ibfk_2` FOREIGN KEY (`climb_id`) REFERENCES `climbs` (`id`) ON
DELETE
CASCADE ON UPDATE CASCADE;

INSERT INTO `users` (`id`, `username`, `email`, `password`, `access_level`, `createdAt`, `updatedAt`)
VALUES (1, 'admin', 'admin@asp.ca', '$2b$12$yJlprxEMwsDTfTy0H4sFvuPkf/50vLDBSLW50tkGdcOtNIUHl8d4q', 2,
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
