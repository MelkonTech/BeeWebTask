-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Фев 12 2020 г., 15:42
-- Версия сервера: 10.4.11-MariaDB
-- Версия PHP: 7.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `beewebtask`
--

-- --------------------------------------------------------

--
-- Структура таблицы `notes`
--

CREATE TABLE `notes` (
  `note` varchar(200) NOT NULL DEFAULT 'Untitled',
  `id` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deletedAt` timestamp NULL DEFAULT NULL,
  `author` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `notes`
--

INSERT INTO `notes` (`note`, `id`, `createdAt`, `updatedAt`, `deletedAt`, `author`) VALUES
('First note!!!', 11, '2020-02-11 21:41:29', '2020-02-11 21:41:29', NULL, 46),
('Updated note', 12, '2020-02-11 21:43:04', '2020-02-12 13:17:13', '2020-02-12 13:17:13', 45),
('lorem ipsum ...', 13, '2020-02-12 12:12:08', '2020-02-12 14:42:25', '2020-02-12 13:23:53', 45),
('My Awesome note :) ', 14, '2020-02-12 14:05:21', '2020-02-12 14:42:03', NULL, 47);

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `name` varchar(200) NOT NULL,
  `email` varchar(250) NOT NULL,
  `password` varchar(255) NOT NULL,
  `id` int(11) NOT NULL,
  `surname` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`name`, `email`, `password`, `id`, `surname`) VALUES
('Melqon', 'melqon@mail.ru', '$2b$10$9KexusJVOzaAzzknZzMH6uSi8huJiFa4tyOR2zpGbvbC2XDa8I4Be', 45, 'Hovhannisyan'),
('Aper', 'aper@mail.ru', '$2b$10$t7LzrvrjoL1lFJsg5XNwreEuB/7z37M/KrFoSuncbBHlytPm65Qiq', 46, 'Movsisyan'),
('Armen', 'armen@mail.ru', '$2b$10$IuieHVsbVL5.UlsTpKahn.yCNWOGpGA5Cy0Q7IrK3CJRevvQbvZnG', 47, 'Armenakyan');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `notes`
--
ALTER TABLE `notes`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`,`email`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `notes`
--
ALTER TABLE `notes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
