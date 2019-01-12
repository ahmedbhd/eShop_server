-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le :  sam. 12 jan. 2019 à 18:28
-- Version du serveur :  5.7.23
-- Version de PHP :  7.2.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `db_shop`
--

-- --------------------------------------------------------

--
-- Structure de la table `ads`
--

DROP TABLE IF EXISTS `ads`;
CREATE TABLE IF NOT EXISTS `ads` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(250) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_house` int(11) NOT NULL,
  `transaction` varchar(250) NOT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `price` float NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ad64646454sqd` (`id_house`),
  KEY `ad87878aze545` (`id_user`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `ads`
--

INSERT INTO `ads` (`id`, `title`, `id_user`, `id_house`, `transaction`, `date`, `price`) VALUES
(2, 'New apartment for .................', 1, 2, 'sell', '2019-01-11 14:00:19', 220000),
(3, 'BEST Villa trés chic prix negociable...........', 3, 3, 'rent', '2019-01-11 16:34:38', 100000000),
(4, 'VILLA pré de ........', 1, 1, 'rent', '2019-01-11 16:38:01', 19000000);

-- --------------------------------------------------------

--
-- Structure de la table `contracts`
--

DROP TABLE IF EXISTS `contracts`;
CREATE TABLE IF NOT EXISTS `contracts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_seller` int(11) NOT NULL,
  `id_buyer` int(11) NOT NULL,
  `id_ad` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `c546465qsd5` (`id_ad`),
  KEY `c797654qsd654` (`id_seller`),
  KEY `c64654qsd6548` (`id_buyer`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `contracts`
--

INSERT INTO `contracts` (`id`, `id_seller`, `id_buyer`, `id_ad`, `date`) VALUES
(1, 1, 2, 3, '2019-01-11 16:14:13'),
(2, 2, 1, 2, '2019-01-11 16:35:13');

-- --------------------------------------------------------

--
-- Structure de la table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
CREATE TABLE IF NOT EXISTS `favorites` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `id_ad` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id65454313qd` (`id_ad`),
  KEY `id6546879azeaze55` (`id_user`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `favorites`
--

INSERT INTO `favorites` (`id`, `id_user`, `id_ad`) VALUES
(2, 1, 2),
(3, 2, 2),
(4, 1, 4);

-- --------------------------------------------------------

--
-- Structure de la table `houses`
--

DROP TABLE IF EXISTS `houses`;
CREATE TABLE IF NOT EXISTS `houses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `city` varchar(250) NOT NULL,
  `adress` varchar(250) NOT NULL,
  `lat` varchar(250) NOT NULL,
  `lng` varchar(250) NOT NULL,
  `surface` float NOT NULL,
  `description` text NOT NULL,
  `nbr_room` int(11) NOT NULL,
  `category` varchar(250) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `house654654654qs6d54` (`id_user`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `houses`
--

INSERT INTO `houses` (`id`, `id_user`, `city`, `adress`, `lat`, `lng`, `surface`, `description`, `nbr_room`, `category`) VALUES
(1, 2, 'Toronto', 'agba', '36.789511', '10.108328', 60, 'appartement', 2, 'villa'),
(2, 1, 'Toronto', 'cite de jardin', '35.608533', '10.761534', 100, 'a louer', 3, 'apartment'),
(3, 1, 'Toronto', 'cite de jardin', '35.608533', '10.761534', 500, 'a vendre', 5, 'villa');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(250) NOT NULL,
  `surname` varchar(250) NOT NULL,
  `username` varchar(250) NOT NULL,
  `password` varchar(250) NOT NULL,
  `email` varchar(250) NOT NULL,
  `phone` varchar(250) NOT NULL,
  `adress` varchar(250) NOT NULL,
  `gendre` varchar(250) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `name`, `surname`, `username`, `password`, `email`, `phone`, `adress`, `gendre`) VALUES
(1, 'ahmed', 'bhd', 'ahmedbhd', 'ahmed', 'ahmed@gmail.com', '53594242', 'jemmal', 'male'),
(2, 'ala', 'bk', 'alabk', '$2a$10$zTJFnsv/sYb9hkQX9DsVK.JiF8Yv6KcDeB0fuUjndkiBx2oD5JSWG', 'ala@gmail.com', '11111111', 'monastir', 'male'),
(3, 'ahmed', 'bhd', 'ahmedbhd', '$2a$10$OCzwCcYFW/hbhhj3nGas/eMWsKbbdlAVIHj7niud6u1IN0Y1Nb9Pe', 'ahmed@gmail.com', '53594242', 'jemmal', 'male');

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `ads`
--
ALTER TABLE `ads`
  ADD CONSTRAINT `ad64646454sqd` FOREIGN KEY (`id_house`) REFERENCES `houses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ad87878aze545` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `contracts`
--
ALTER TABLE `contracts`
  ADD CONSTRAINT `c546465qsd5` FOREIGN KEY (`id_ad`) REFERENCES `ads` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `c64654qsd6548` FOREIGN KEY (`id_buyer`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `c797654qsd654` FOREIGN KEY (`id_seller`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `id65454313qd` FOREIGN KEY (`id_ad`) REFERENCES `ads` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `id6546879azeaze55` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `houses`
--
ALTER TABLE `houses`
  ADD CONSTRAINT `house654654654qs6d54` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
