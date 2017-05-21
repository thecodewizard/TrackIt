-- phpMyAdmin SQL Dump
-- version 4.4.14
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Gegenereerd op: 25 jan 2016 om 23:27
-- Serverversie: 5.5.44
-- PHP-versie: 5.6.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `transit`
--

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `sites`
--

CREATE TABLE IF NOT EXISTS `sites` (
  `id` int(11) NOT NULL,
  `ip` varchar(50) NOT NULL,
  `country` varchar(1000) NOT NULL,
  `lat` varchar(100) NOT NULL,
  `lng` varchar(100) NOT NULL,
  `host` varchar(1000) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;

--
-- Gegevens worden geëxporteerd voor tabel `sites`
--

INSERT INTO `sites` (`id`, `ip`, `country`, `lat`, `lng`, `host`) VALUES
(1, '178.208.33.250', 'Belgium', '50.8504', '4.34878', '4gamers.be'),
(2, '194.7.45.66', 'Belgium', '50.9106', '4.44174', 'Teleticketservice.com'),
(3, '52.28.222.220', 'Germany', '50.1155', '8.68417', '9gag.com'),
(4, '54.93.199.239', 'Germany', '50.1155', '8.68417', '9gag.com'),
(5, '81.245.156.140', 'Belgium', '50.745', '3.20639', 'estebandenis.ddns.net'),
(6, '69.171.230.68', 'United States', '37.4369', '-122.194', 'facebook.com'),
(7, '157.193.43.104', 'Belgium', '51.05', '3.71667', 'leho.howest.be'),
(8, '66.220.146.36', 'United States', '44.2999', '-120.834', 'facebook.com'),
(9, '95.130.42.39', 'Belgium', '50.8504', '4.34878', 'canvas.be'),
(10, '31.192.117.132', 'Netherlands', '52.374', '4.88969', 'pornhub.com'),
(11, '50.31.225.93', 'United States', '41.8782', '-87.6254', 'github.org'),
(12, '104.16.56.23', 'United States', '34.0522', '-118.244', 'yelp.com'),
(13, '193.191.136.205', 'Belgium', '50.8504', '4.34878', 'howest.be'),
(14, '66.220.158.68', 'United States', '35.334', '-81.8651', 'facebook.com'),
(15, '104.16.57.23', 'United States', '34.0522', '-118.244', 'yelp.com'),
(16, '69.192.73.79', 'Netherlands', '52.374', '4.88969', 'Dominos.be'),
(17, '213.177.32.240', 'United Kingdom', '51.5085', '-0.12574', 'delijn.be'),
(18, '193.191.245.4', 'Belgium', '50.8504', '4.34878', 'belgium.be'),
(19, '173.252.120.68', 'United States', '44.8903', '-85.966', 'facebook.com'),
(20, '81.245.137.156', 'Belgium', '50.745', '3.20639', 'yelp.com'),
(21, '81.245.137.156', 'Belgium', '50.745', '3.20639', 'connectionstrings.org'),
(22, '81.245.137.156', 'Belgium', '50.745', '3.20639', 'leho.howest.be'),
(23, '81.245.137.156', 'Belgium', '50.745', '3.20639', 'Teleticketservice.com'),
(24, '81.245.137.156', 'Belgium', '50.745', '3.20639', '4gamers.be');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `sitesdev`
--

CREATE TABLE IF NOT EXISTS `sitesdev` (
  `id` int(11) NOT NULL,
  `ip` varchar(50) NOT NULL,
  `country` varchar(1000) NOT NULL,
  `lat` varchar(100) NOT NULL,
  `lng` varchar(100) NOT NULL,
  `host` varchar(1000) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=utf8;

--
-- Gegevens worden geëxporteerd voor tabel `sitesdev`
--

INSERT INTO `sitesdev` (`id`, `ip`, `country`, `lat`, `lng`, `host`) VALUES
(84, '69.171.230.68', 'United States', '37.4369', '-122.194', 'facebook.com'),
(85, '62.50.27.114', 'United Kingdom', '51.5085', '-0.12574', 'coolblue.be'),
(86, '69.147.76.173', 'United States', '43.1706', '-78.6903', 'flickr.com'),
(87, '184.72.62.132', 'United States', '37.7749', '-122.419', 'xyz.xyz'),
(89, '173.252.120.68', 'United States', '44.8903', '-85.966', 'facebook.com'),
(90, '54.215.1.97', 'United States', '37.7749', '-122.419', 'xyz.xyz'),
(91, '66.220.158.68', 'United States', '35.334', '-81.8651', 'facebook.com'),
(92, '173.252.90.132', 'United States', '41.6442', '-93.4647', 'facebook.com'),
(93, '23.214.253.238', 'United States', '34.0522', '-118.244', 'Www.kelloggs.be'),
(94, '81.245.156.140', 'Belgium', '50.745', '3.20639', 'estebandenis.ddns.net'),
(95, '173.252.89.132', 'United States', '41.6442', '-93.4647', 'facebook.com');

--
-- Indexen voor geëxporteerde tabellen
--

--
-- Indexen voor tabel `sites`
--
ALTER TABLE `sites`
  ADD PRIMARY KEY (`id`);

--
-- Indexen voor tabel `sitesdev`
--
ALTER TABLE `sitesdev`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT voor geëxporteerde tabellen
--

--
-- AUTO_INCREMENT voor een tabel `sites`
--
ALTER TABLE `sites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=25;
--
-- AUTO_INCREMENT voor een tabel `sitesdev`
--
ALTER TABLE `sitesdev`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=96;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
