-- MySQL dump 10.13  Distrib 9.3.0, for Win64 (x86_64)
--
-- Host: localhost    Database: vtsa_production
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `callback_history`
--

DROP TABLE IF EXISTS `callback_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `callback_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pms_id` int DEFAULT NULL,
  `date_conducted` date DEFAULT NULL,
  `inspection_done` tinyint DEFAULT (0),
  `contract_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pms_id` (`pms_id`),
  KEY `contract_id` (`contract_id`),
  CONSTRAINT `callback_history_ibfk_1` FOREIGN KEY (`pms_id`) REFERENCES `pms_projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `callback_history_ibfk_2` FOREIGN KEY (`contract_id`) REFERENCES `contracts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `callback_history`
--

LOCK TABLES `callback_history` WRITE;
/*!40000 ALTER TABLE `callback_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `callback_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `callback_inspection_team`
--

DROP TABLE IF EXISTS `callback_inspection_team`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `callback_inspection_team` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pms_tech_id` int DEFAULT NULL,
  `client_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `callback_inspection_team`
--

LOCK TABLES `callback_inspection_team` WRITE;
/*!40000 ALTER TABLE `callback_inspection_team` DISABLE KEYS */;
INSERT INTO `callback_inspection_team` VALUES (3,83,267);
/*!40000 ALTER TABLE `callback_inspection_team` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `client_baby_book`
--

DROP TABLE IF EXISTS `client_baby_book`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `client_baby_book` (
  `pms_id` int NOT NULL,
  `book_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`pms_id`),
  CONSTRAINT `fk_babybook_pms` FOREIGN KEY (`pms_id`) REFERENCES `pms_projects` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client_baby_book`
--

LOCK TABLES `client_baby_book` WRITE;
/*!40000 ALTER TABLE `client_baby_book` DISABLE KEYS */;
INSERT INTO `client_baby_book` VALUES (1,'Grand Horizon Commercial Towers','2025-11-03 04:50:57'),(45,'Greenfield Residences','2025-10-31 14:21:35'),(47,'SunMall Group','2025-10-31 17:13:34'),(266,'Titan Manufacturing Co.','2025-11-06 14:04:59'),(267,'EcoHomes Development Corp.','2025-11-03 07:37:41'),(343,'Mall Group','2025-11-09 14:25:28');
/*!40000 ALTER TABLE `client_baby_book` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `client_callback_history`
--

DROP TABLE IF EXISTS `client_callback_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `client_callback_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pms_id` int DEFAULT NULL,
  `date_conducted` date DEFAULT NULL,
  `inspection_done` tinyint DEFAULT (0),
  `contract_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pms_id` (`pms_id`),
  KEY `contract_id` (`contract_id`),
  CONSTRAINT `client_callback_history_ibfk_1` FOREIGN KEY (`pms_id`) REFERENCES `pms_projects` (`id`),
  CONSTRAINT `client_callback_history_ibfk_2` FOREIGN KEY (`contract_id`) REFERENCES `contracts` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client_callback_history`
--

LOCK TABLES `client_callback_history` WRITE;
/*!40000 ALTER TABLE `client_callback_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `client_callback_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contract_documents`
--

DROP TABLE IF EXISTS `contract_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contract_documents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `contract_id` int DEFAULT NULL,
  `contract_document_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `doc_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `contract_id` (`contract_id`),
  CONSTRAINT `contract_documents_ibfk_1` FOREIGN KEY (`contract_id`) REFERENCES `contracts` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contract_documents`
--

LOCK TABLES `contract_documents` WRITE;
/*!40000 ALTER TABLE `contract_documents` DISABLE KEYS */;
/*!40000 ALTER TABLE `contract_documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contracts`
--

DROP TABLE IF EXISTS `contracts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contracts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `baby_book_id` int NOT NULL,
  `contract_number` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contract_start_date` date DEFAULT NULL,
  `contract_end_date` date DEFAULT NULL,
  `renewal_number` int DEFAULT '1',
  `current_contract` tinyint DEFAULT '1',
  `free_pms` tinyint DEFAULT (1),
  PRIMARY KEY (`id`),
  KEY `contracts_ibfk_1` (`baby_book_id`),
  CONSTRAINT `contracts_ibfk_1` FOREIGN KEY (`baby_book_id`) REFERENCES `client_baby_book` (`pms_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contracts`
--

LOCK TABLES `contracts` WRITE;
/*!40000 ALTER TABLE `contracts` DISABLE KEYS */;
INSERT INTO `contracts` VALUES (2,1,NULL,NULL,NULL,1,1,1),(3,45,NULL,NULL,NULL,1,1,1),(4,47,NULL,NULL,NULL,1,1,1),(5,266,NULL,NULL,NULL,1,1,1),(6,267,NULL,NULL,NULL,1,1,1),(7,343,NULL,NULL,NULL,1,1,1);
/*!40000 ALTER TABLE `contracts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `daily_report_photos`
--

DROP TABLE IF EXISTS `daily_report_photos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `daily_report_photos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `report_id` int NOT NULL,
  `photo_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `daily_report_photos_ibfk_1` (`report_id`),
  CONSTRAINT `daily_report_photos_ibfk_1` FOREIGN KEY (`report_id`) REFERENCES `project_daily_report` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `daily_report_photos`
--

LOCK TABLES `daily_report_photos` WRITE;
/*!40000 ALTER TABLE `daily_report_photos` DISABLE KEYS */;
INSERT INTO `daily_report_photos` VALUES (13,25,'/uploads/1760973315900-Untitled.png'),(14,25,'/uploads/1760973315905-gatobestvillain.jpg'),(15,26,'/uploads/1762155316652-Construction-Site-Handover-Letter-Template-edit-online.png'),(16,27,'/uploads/1762434910290-istockphoto-479362384-612x612.jpg');
/*!40000 ALTER TABLE `daily_report_photos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `edit_team_members`
--

DROP TABLE IF EXISTS `edit_team_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `edit_team_members` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int DEFAULT NULL,
  `foreman_id` int DEFAULT NULL,
  `emp_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `foreman_id` (`foreman_id`),
  KEY `emp_id` (`emp_id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `edit_team_members_ibfk_1` FOREIGN KEY (`foreman_id`) REFERENCES `teams` (`team_id`),
  CONSTRAINT `edit_team_members_ibfk_2` FOREIGN KEY (`emp_id`) REFERENCES `employees` (`employee_id`),
  CONSTRAINT `edit_team_members_ibfk_3` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=310 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `edit_team_members`
--

LOCK TABLES `edit_team_members` WRITE;
/*!40000 ALTER TABLE `edit_team_members` DISABLE KEYS */;
/*!40000 ALTER TABLE `edit_team_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  `employee_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `job` varchar(25) DEFAULT NULL,
  `prev_foreman` int DEFAULT NULL,
  `secondary_job` varchar(255) DEFAULT NULL,
  `hire_date` date DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '0',
  `refresh_token` varchar(550) DEFAULT NULL,
  `island_group` enum('Luzon','Visayas','Mindanao') DEFAULT NULL,
  `in_house` tinyint DEFAULT (1),
  PRIMARY KEY (`employee_id`),
  KEY `prev_foreman` (`prev_foreman`),
  CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`prev_foreman`) REFERENCES `employees` (`employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=112 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES ('FitzgeraldJ','12345678',1,'John','Fitzgerald','Admin',NULL,NULL,'2023-01-02',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkZpdHpnZXJhbGRKIiwiaWF0IjoxNzYyOTQ1ODY3LCJleHAiOjE3NjMwMzIyNjd9.qrkDLV12sdczQzwpmEJDBx8snwYkPURldFuuhX3Jlh0','Luzon',1),('ColeN','12345678',2,'Nathan','Cole','Project Manager',NULL,NULL,'2023-01-03',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkNvbGVOIiwiaWF0IjoxNzYzMDQ4MTMzLCJleHAiOjE3NjMxMzQ1MzN9.EWnr8bnRRoOzss9yXULL60hcYVwR5PA1yVe0lWr4vjE','Luzon',1),('ReyesI','12345678',3,'Isabella','Reyes','Project Engineer',NULL,NULL,'2024-01-04',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlJleWVzSSIsImlhdCI6MTc2MzA1MDA4NSwiZXhwIjoxNzYzMTM2NDg1fQ.91bFCuwb5cnYZMlbxlqpYNvmRvO0rNpwHhSatk2m6_Y','Luzon',1),('MontgomeryH','password123',4,'Hazel','Montgomery','Project Engineer',NULL,NULL,'2023-01-05',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik1vbnRnb21lcnlIIiwiaWF0IjoxNzYzMDE4MTU1LCJleHAiOjE3NjMxMDQ1NTV9.W9daCD5Ek8BEszfTeU4AtsbB7iW_NmOSyxf16HJdGrM','Luzon',1),('CruzN','password',5,'Nathaniel','Cruz','Project Engineer',NULL,NULL,'2023-01-06',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkNydXpOIiwiaWF0IjoxNzYyOTQ3Mzc5LCJleHAiOjE3NjMwMzM3Nzl9.3ZG37YH0biIHmDrz0IkG-f50-oyiCh_s_4_KgumYLwE','Luzon',1),('ReyesD','12345678',6,'Dominic','Reyes','Project Engineer',NULL,NULL,'2023-01-07',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlJleWVzRCIsImlhdCI6MTc2MzA0OTcxNCwiZXhwIjoxNzYzMTM2MTE0fQ.XsF7xbEaodChsDkZzbL5OrNnnzqvndPHZPifegRp2nI','Luzon',1),('NavarroA','password',7,'Althea','Navarro','Project Engineer',NULL,NULL,'2023-02-01',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik5hdmFycm9BIiwiaWF0IjoxNzYyNjk0ODI5LCJleHAiOjE3NjI3ODEyMjl9.54S-fBeZv2fqiPASrTLpYsYGCHR64zKUzcJOoAdQE_Q','Luzon',1),('KarenP','12345678',8,'Karen','Plankto','Project Engineer',NULL,NULL,'2022-11-15',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkthcmVuUCIsImlhdCI6MTc2MzA0OTkwOCwiZXhwIjoxNzYzMTM2MzA4fQ.D0hxwMPCiTbGZZS2B2Ugvi3q9UDfhxSjDfYbjo_uUOs','Luzon',1),('UyC','password',9,'Clarisse','Uy','Project Engineer',NULL,NULL,'2023-03-10',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlV5QyIsImlhdCI6MTc2MzAzNTczMywiZXhwIjoxNzYzMTIyMTMzfQ._33iR2qrNm3Hci3vW9B2J-A7oWhHVtS1n1cLKgfDlL8','Luzon',1),('NatP','12345678',10,'Nat','Peterson','Foreman',NULL,NULL,'2023-04-05',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik5hdFAiLCJpYXQiOjE3NjIxNTQwODUsImV4cCI6MTc2MjI0MDQ4NX0.QIUPfhhy91e4FuYBkWdVSu6IV6ZXBBCi1amp6-4UTKM','Luzon',1),('Tom','12345678',11,'Tom','Johnson','Skilled Installer',NULL,NULL,'2023-05-12',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlRvbSIsImlhdCI6MTc2MTAzMjIwNiwiZXhwIjoxNzYxMTE4NjA2fQ.f3qgrJD-6WcYfsjsGbHl8joT0C-BmpFsVY5CMBIH7co','Luzon',1),('Fred','12345678',12,'Fred','Fish','Skilled Installer',NULL,NULL,'2023-05-15',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkZyZWQiLCJpYXQiOjE3NTc1ODUxODYsImV4cCI6MTc1NzY3MTU4Nn0.zpCYclwwmnS7aBWq6CZY1X2ZuRmGwpmwdky0XCoGphM','Luzon',1),('Nebby','12345678',13,'Nebby','Star','Foreman',NULL,NULL,'2023-06-01',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik5lYmJ5IiwiaWF0IjoxNzYzMDM2MDkxLCJleHAiOjE3NjMxMjI0OTF9.ecyzXduRgrVoaer8yxDm7YI-1DP1jjm5Ji1ORN_DYIY','Luzon',1),('Barny','12345678',14,'Barny','Fish','Skilled Installer',NULL,NULL,'2023-06-10',1,NULL,'Luzon',1),('Martha','12345678',15,'Marthanah','Starfish','Skilled Installer',NULL,NULL,'2023-07-01',1,NULL,'Luzon',1),('Betsy','12345678',16,'Betsy','Krabs','Skilled Installer',NULL,NULL,'2023-07-15',1,NULL,'Luzon',1),('Gary','12345678',17,'Gary','Snail','Skilled Installer',NULL,NULL,'2023-08-01',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkdhcnkiLCJpYXQiOjE3NTc0MTU5NTMsImV4cCI6MTc1NzUwMjM1M30.597DoSWVcHz-29ZG_J1vW5QmzLaP17MPJKQaDODM710','Luzon',1),('MermaidMan','12345678',18,'Mermaid','Man','Foreman',NULL,NULL,'2023-08-10',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik1lcm1haWRNYW4iLCJpYXQiOjE3NjE0OTE3NjgsImV4cCI6MTc2MTU3ODE2OH0.57mJWzgi74yvaCpOGcfor2j_WgLHPPo_yYkyzpX3j_0','Luzon',1),('ConnorN','12345678',19,'Nick','Connor','Skilled Installer',NULL,NULL,'2023-09-01',1,NULL,'Luzon',1),('KingNeptune','12345678',20,'King','Neptune','Installer',NULL,NULL,'2023-09-15',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IktpbmdOZXB0dW5lIiwiaWF0IjoxNzYxOTA1NDg4LCJleHAiOjE3NjE5OTE4ODh9.e8m3cgdQtyzlFSaDHlADfLwTy-WlUT7ZDVabE2Vfmhc','Luzon',1),('DirtyBubble','12345678',21,'Dirty','Bubble','Installer',NULL,NULL,'2023-10-01',1,NULL,'Luzon',1),('JohnDoe','password123',37,'John','Doe','Foreman',NULL,NULL,'2023-07-01',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkpvaG5Eb2UiLCJpYXQiOjE3NjMwNDk3MzgsImV4cCI6MTc2MzEzNjEzOH0.vZAfwlet5Qtm7YITcfuj6Ui8TT8ta45dQmAFLRRzh-4','Luzon',1),('JaneSmith','securepass',38,'Jane','Smith','Installer',NULL,NULL,'2023-07-05',1,NULL,'Luzon',1),('MikeJohnson','mikepass',39,'Mike','Johnson','Installer',NULL,NULL,'2023-07-10',0,NULL,'Luzon',1),('SarahWilson','sarah123',40,'Sarah','Wilson','Installer',NULL,NULL,'2023-07-15',0,NULL,'Luzon',1),('DavidBrown','davidpass',41,'David','Brown','Installer',NULL,NULL,'2023-07-20',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkRhdmlkQnJvd24iLCJpYXQiOjE3NjE4Mjg1NDksImV4cCI6MTc2MTkxNDk0OX0.7qwm23U60x1L79DgE6bV6Tifw6otgzATi1zSqqSXj8o','Luzon',1),('EmilyDavis','emily456',42,'Emily','Davis','Installer',NULL,NULL,'2023-08-01',0,NULL,'Luzon',1),('RobertLee','robertpass',43,'Robert','Lee','Installer',NULL,NULL,'2023-08-05',0,NULL,'Luzon',1),('LisaTaylor','lisa789',44,'Lisa','Taylor','Installer',NULL,NULL,'2023-08-10',0,NULL,'Luzon',1),('ChrisMartin','chrispass',45,'Chris','Martin','Installer',NULL,NULL,'2023-08-15',0,NULL,'Luzon',1),('AmyClark','amypass',46,'Amy','Clark','Installer',NULL,NULL,'2023-08-20',0,NULL,'Luzon',1),('KevinWhite','kevin123',47,'Kevin','White','Installer',NULL,NULL,'2023-09-01',0,NULL,'Luzon',1),('MichelleHall','michellepass',48,'Michelle','Hall','Installer',NULL,NULL,'2023-09-05',0,NULL,'Luzon',1),('BrianScott','brian456',49,'Brian','Scott','Installer',NULL,NULL,'2023-09-10',1,NULL,'Luzon',1),('JessicaKing','jessicapass',50,'Jessica','King','Installer',NULL,NULL,'2023-09-15',0,NULL,'Luzon',1),('DanielYoung','daniel789',51,'Daniel','Young','Installer',NULL,NULL,'2023-09-20',0,NULL,'Luzon',1),('JohnD','12345678',52,'Ray','Ban','Foreman',NULL,NULL,'2023-04-10',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkpvaG5EIiwiaWF0IjoxNzYxNDAwMTk2LCJleHAiOjE3NjE0ODY1OTZ9.41qabzHa3JFTZIzLkrbNugs7_mtRSdU5TOhfOgE0BuE','Luzon',1),('MichaelB','12345678',53,'Michael','Brown','Foreman',NULL,NULL,'2023-04-12',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik1pY2hhZWxCIiwiaWF0IjoxNzYzMDQ5OTI1LCJleHAiOjE3NjMxMzYzMjV9.sy_LZXiS5Fo0Yq5genjDgOk3juJy2G6p6-_0rDvcnY8','Luzon',1),('DavidW','12345678',54,'David','Williams','Foreman',NULL,NULL,'2023-04-15',0,NULL,'Luzon',1),('ChrisT','12345678',55,'Chris','Taylor','Foreman',NULL,NULL,'2023-04-18',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkNocmlzVCIsImlhdCI6MTc2MjQyNTcwMSwiZXhwIjoxNzYyNTEyMTAxfQ.CmKuLCgK9HiSPM3SfrPx9m-vhz165xjXMNm00iQ8avk','Luzon',1),('AnthonyM','12345678',56,'Anthony','Miller','Foreman',NULL,NULL,'2023-04-20',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFudGhvbnlNIiwiaWF0IjoxNzYzMDM2NDA3LCJleHAiOjE3NjMxMjI4MDd9.q4ZGMe82ItobA2evh23nctWuAtlXOZb5vZq0HcFpGL4','Luzon',1),('RyanLee','ryanpass123',57,'Ryan','Lee','Installer',NULL,NULL,'2023-10-01',1,NULL,'Luzon',1),('SarahBrown','sarah456',58,'Sarah','Brown','Installer',NULL,NULL,'2023-10-05',0,NULL,'Luzon',1),('JasonChen','jasonpass',59,'Jason','Chen','Installer',NULL,NULL,'2023-10-10',0,NULL,'Luzon',1),('EmilyWright','emily789',60,'Emily','Wright','Installer',NULL,NULL,'2023-10-15',0,NULL,'Luzon',1),('MichaelTurner','mike123',61,'Michael','Turner','Installer',NULL,NULL,'2023-10-20',0,NULL,'Luzon',1),('OliviaParker','olivia456',62,'Olivia','Parker','Installer',NULL,NULL,'2023-10-25',0,NULL,'Luzon',1),('DavidMiller','davidpass',63,'David','Miller','Installer',NULL,NULL,'2023-11-01',0,NULL,'Luzon',1),('SophiaGarcia','sophia789',64,'Sophia','Garcia','Installer',NULL,NULL,'2023-11-05',0,NULL,'Luzon',1),('AndrewHill','andrew123',65,'Andrew','Hill','Installer',NULL,NULL,'2023-11-10',1,NULL,'Luzon',1),('GraceLewis','grace456',66,'Grace','Lewis','Installer',NULL,NULL,'2023-11-15',1,NULL,'Luzon',1),('JoshuaWalker','joshua789',67,'Joshua','Walker','Installer',NULL,NULL,'2023-11-20',0,NULL,'Luzon',1),('ChloeRobinson','chloe123',68,'Chloe','Robinson','Installer',NULL,NULL,'2023-11-25',0,NULL,'Luzon',1),('NicholasHall','nick456',69,'Nicholas','Hall','Installer',NULL,NULL,'2023-12-01',0,NULL,'Luzon',1),('LilyAllen','lily789',70,'Lily','Allen','Installer',NULL,NULL,'2023-12-05',0,NULL,'Luzon',1),('TylerYoung','tyler123',71,'Tyler','Young','Installer',NULL,NULL,'2023-12-10',0,NULL,'Luzon',1),('HannahKing','hannah456',72,'Hannah','King','Installer',NULL,NULL,'2023-12-15',0,NULL,'Luzon',1),('BrandonScott','brandon789',73,'Brandon','Scott','Installer',NULL,NULL,'2023-12-20',0,NULL,'Luzon',1),('AvaGreen','avapass123',74,'Ava','Green','Installer',NULL,NULL,'2023-12-25',0,NULL,'Luzon',1),('JustinAdams','justin456',75,'Justin','Adams','Installer',NULL,NULL,'2023-12-30',0,NULL,'Luzon',1),('MiaNelson','mia789',76,'Mia','Nelson','Installer',NULL,NULL,'2024-01-04',0,NULL,'Luzon',1),('KordianM','12345678',77,'Mawunyo','Kordian','PMS Coordinator',NULL,NULL,'2025-10-31',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IktvcmRpYW5NIiwiaWF0IjoxNzYzMDM5MzE1LCJleHAiOjE3NjMxMjU3MTV9.9ENMNWMYTstV3og_rFPbsSIPvHNG1oy7jv_FN9X9HIo','Luzon',1),('ArcheD','12345678',78,'Denitsa','Arche','PMS Technician',NULL,NULL,'2025-10-31',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFyY2hlRCIsImlhdCI6MTc2MTc0MzU1MCwiZXhwIjoxNzYxODI5OTUwfQ.Y1LSkuU_y92ALsLy6dm3aNpKosH8ZjhymsA0NVC6mz4','Mindanao',1),('YusufK','12345678',79,'Kassia','Yusuf','PMS Technician',NULL,NULL,'2025-10-31',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ill1c3VmSyIsImlhdCI6MTc2Mjg4MDIzOCwiZXhwIjoxNzYyOTY2NjM4fQ.URd-PtF6V2bUfMbBFxZl871NyWa8XyK7LWUUe4wH7Jo','Luzon',1),('KalpanaK','12345678',80,'Kamran','Kalpana','PMS Technician',NULL,NULL,'2025-10-31',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkthbHBhbmFLIiwiaWF0IjoxNzYyNDM3OTkwLCJleHAiOjE3NjI1MjQzOTB9.vo7-XlyFapKZDsuTZkS_MEYDMo1d6SJTjS8JeFG5CfI','Luzon',1),('DipakaT','12345678',81,'Toshiko','Dipaka','PMS Technician',NULL,NULL,'2025-10-31',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkRpcGFrYVQiLCJpYXQiOjE3NjI2MDgxMTIsImV4cCI6MTc2MjY5NDUxMn0.oRdDykRHGtwVJd1xlw9erkVYyBe76BRPiv-j2cPnQeE','Luzon',1),('YuuriI','12345678',82,'Ipek','Yuri','PMS Technician',NULL,NULL,'2025-10-31',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ill1dXJpSSIsImlhdCI6MTc2MjA4NjE4NCwiZXhwIjoxNzYyMTcyNTg0fQ.I66FuQuBmfM6BpJkRMGJFO8iQ8rLIdGDYdeJD1TyM4Y','Luzon',1),('KeanK','12345678',83,'Kiuk','Kean','PMS Technician',NULL,NULL,'2025-10-31',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IktlYW5LIiwiaWF0IjoxNzYyODgwMjQ5LCJleHAiOjE3NjI5NjY2NDl9.mn9VY1bM9CX49QOX61xFdJnOdgy8Ydf1mcXOh24Jcj4','Luzon',1),('GallaF','12345678',86,'Faiza','Galla','TNC Technician',NULL,NULL,'2025-10-31',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkdhbGxhRiIsImlhdCI6MTc2MjY5MDA1OSwiZXhwIjoxNzYyNzc2NDU5fQ.vMCMWZFu3w1wzlJBFgdYY7RJc__w1vtwJPnrjoSNhoU','Luzon',1),('LoganP','12345678',87,'Pepcan','Logan','TNC Technician',NULL,NULL,'2025-10-31',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkxvZ2FuUCIsImlhdCI6MTc2MzAzNTY1OSwiZXhwIjoxNzYzMTIyMDU5fQ.KvgWONgyNdv8OZg4Ph_GUgEJKEKdcI8hoiA3W9jJJX8','Luzon',1),('IgnaasM','12345678',88,'Machlain','Ignaas','TNC Technician',NULL,NULL,'2025-10-31',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IklnbmFhc00iLCJpYXQiOjE3NjMwMTY1NjksImV4cCI6MTc2MzEwMjk2OX0.dLlxDWtnm8hi3s0Kxp6d0m0IB4WBQvvkJLvhNlyZAaM','Luzon',1),('RoosN','12345678',89,'Nelle','Roos','TNC Technician',NULL,NULL,'2025-10-31',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlJvb3NOIiwiaWF0IjoxNzYzMDQ3NTAxLCJleHAiOjE3NjMxMzM5MDF9.HsQ7BJL5NaK1korcNlTaecDcWS0AnJFu5mg6Myf6CPI','Luzon',1),('RajaD','12345678',90,'Declan','Raja','TNC Technician',NULL,NULL,'2025-10-31',0,NULL,'Luzon',1),('Humphry','12345678',91,'Vincenzo','Humphry','QAQC',NULL,NULL,'2025-10-31',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ikh1bXBocnkiLCJpYXQiOjE3NjMwMzU4NTEsImV4cCI6MTc2MzEyMjI1MX0.uPxWgpe9yOAUFH4HTLdIaC3BCdgAA7qZpUpbZisM73Q','Luzon',1),('TomWilson','tomqapass',92,'Tom','Wilson','QAQC',NULL,NULL,'2024-01-15',0,NULL,'Luzon',1),('JessicaBrown','jessicaqa',93,'Jessica','Brown','QAQC',NULL,NULL,'2024-01-20',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ikplc3NpY2FCcm93biIsImlhdCI6MTc2MjQyNTg0MiwiZXhwIjoxNzYyNTEyMjQyfQ.HZLG4QdIbf0R_no1ggvY2z0Cy5SVzPqyY6c0K7r-Wok','Luzon',1),('MichaelChen','mikeqaqc',94,'Michael','Chen','QAQC',NULL,NULL,'2024-01-25',0,NULL,'Luzon',1),('IneigoB','12345678',95,'Ineigo','Benivaldez','QAQC Coordinator',NULL,NULL,'2025-10-31',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkluZWlnb0IiLCJpYXQiOjE3NjMwMzU2OTMsImV4cCI6MTc2MzEyMjA5M30.PPTicmUYEV9WRSxVhKzLifhdu9SJKvLD29Bvscr1yGA','Luzon',1),('BodigasM','12345678',96,'Mark','Bodigas','TNC Coordinator',NULL,NULL,'2025-10-31',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkJvZGlnYXNNIiwiaWF0IjoxNzYzMDQ3MDU2LCJleHAiOjE3NjMxMzM0NTZ9.94bM866XWikAlrQalqR-o_DYVn63imzAe8h9fkQJjRY','Luzon',1),('BunagJ','12345678',97,'Julian','Bunag','QAQC',NULL,NULL,'2025-10-31',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkJ1bmFnSiIsImlhdCI6MTc2MTYyMDgzMCwiZXhwIjoxNzYxNzA3MjMwfQ.KIybmblSV1fJ_D-sc_DyiUHA7oRXI8JMnFYtQl2S8OA','Luzon',1),('CardenasA','12345678',98,'Andrew','Cardenas','QAQC',NULL,NULL,'2025-10-31',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkNhcmRlbmFzQSIsImlhdCI6MTc2MTc1MzYwNywiZXhwIjoxNzYxODQwMDA3fQ.ZTF2L6wgbaKns42O3seCmoekJEvNCJkD4em6S5wMzgE','Luzon',1),('MarkS','12345678',102,'Mark','Sanders','Skilled Installer',NULL,NULL,'2023-06-15',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mark1','Luzon',1),('LeoM','12345678',103,'Leo','Mendoza','Skilled Installer',NULL,NULL,'2023-07-01',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.leo2','Luzon',1),('AndreC','12345678',104,'Andre','Cruz','Skilled Installer',NULL,NULL,'2023-07-12',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.andre3','Luzon',1),('JeromeG','12345678',105,'Jerome','Garcia','Skilled Installer',NULL,NULL,'2023-07-20',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.jerome4','Luzon',1),('CarlD','12345678',106,'Carl','Dela Cruz','Skilled Installer',NULL,NULL,'2023-08-02',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.carl5','Luzon',1),('RandyP','12345678',107,'Randy','Perez','Skilled Installer',NULL,NULL,'2023-08-10',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.randy6','Luzon',1),('OscarB','12345678',108,'Oscar','Bautista','Skilled Installer',NULL,NULL,'2023-08-20',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.oscar7','Luzon',1),('JaredT','12345678',109,'Jared','Tolentino','Skilled Installer',NULL,NULL,'2023-09-01',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.jared8','Luzon',1);
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `forecast_team_members`
--

DROP TABLE IF EXISTS `forecast_team_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `forecast_team_members` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int DEFAULT NULL,
  `foreman_id` int DEFAULT NULL,
  `emp_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `foreman_id` (`foreman_id`),
  KEY `emp_id` (`emp_id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `forecast_team_members_ibfk_1` FOREIGN KEY (`foreman_id`) REFERENCES `teams` (`team_id`),
  CONSTRAINT `forecast_team_members_ibfk_2` FOREIGN KEY (`emp_id`) REFERENCES `employees` (`employee_id`),
  CONSTRAINT `forecast_team_members_ibfk_3` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=346 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `forecast_team_members`
--

LOCK TABLES `forecast_team_members` WRITE;
/*!40000 ALTER TABLE `forecast_team_members` DISABLE KEYS */;
INSERT INTO `forecast_team_members` VALUES (310,44,NULL,12),(311,44,NULL,17),(312,44,NULL,19);
/*!40000 ALTER TABLE `forecast_team_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `forecasted_project_manpower`
--

DROP TABLE IF EXISTS `forecasted_project_manpower`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `forecasted_project_manpower` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int DEFAULT NULL,
  `foreman_id` int DEFAULT NULL,
  `emp_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  KEY `foreman_id` (`foreman_id`),
  KEY `emp_id` (`emp_id`),
  CONSTRAINT `forecasted_project_manpower_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`),
  CONSTRAINT `forecasted_project_manpower_ibfk_2` FOREIGN KEY (`foreman_id`) REFERENCES `employees` (`employee_id`),
  CONSTRAINT `forecasted_project_manpower_ibfk_3` FOREIGN KEY (`emp_id`) REFERENCES `employees` (`employee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `forecasted_project_manpower`
--

LOCK TABLES `forecasted_project_manpower` WRITE;
/*!40000 ALTER TABLE `forecasted_project_manpower` DISABLE KEYS */;
/*!40000 ALTER TABLE `forecasted_project_manpower` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `handover_documents`
--

DROP TABLE IF EXISTS `handover_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `handover_documents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int DEFAULT NULL,
  `document_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT (_utf8mb4'Handover Document'),
  `doc_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `handover_documents_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `handover_documents`
--

LOCK TABLES `handover_documents` WRITE;
/*!40000 ALTER TABLE `handover_documents` DISABLE KEYS */;
INSERT INTO `handover_documents` VALUES (1,1,'Handover Document','/uploads/1761813847862-handover_doc_IC-Project-Handover-Plan-Template.png'),(2,1,'Handover Document','/uploads/1761813847886-handover_doc_2019-03-12-Example-Template-Project-Project-Handover-Checklist-1-page-001.jpg'),(3,45,'Handover Document','/uploads/1761914720414-handover_doc_2019-03-12-Example-Template-Project-Project-Handover-Checklist-1-page-001.jpg'),(4,45,'Handover Document','/uploads/1761915386948-handover_doc_IC-Project-Handover-Plan-Template.png'),(5,45,'Handover Document','/uploads/1761920495000-handover_doc_IC-Project-Handover-Plan-Template.png'),(6,47,'Handover Document','/uploads/1761930814150-handover_doc_Construction-Site-Handover-Letter-Template-edit-online.png'),(7,47,'Handover Document','/uploads/1761930814173-handover_doc_77e48e83af3f9881dc84e8d9d9cee061.jpg'),(8,1,'Handover Document','/uploads/1762145457562-handover_doc_mqdefault.jpg'),(9,267,'Handover Document','/uploads/1762155460845-handover_doc_mqdefault.jpg'),(10,267,'Handover Document','/uploads/1762155460847-handover_doc_IC-Project-Handover-Plan-Template.png'),(11,267,'Handover Document','/uploads/1762155460847-handover_doc_Construction-Site-Handover-Letter-Template-edit-online.png'),(12,267,'Handover Document','/uploads/1762155460855-handover_doc_2019-03-12-Example-Template-Project-Project-Handover-Checklist-1-page-001.jpg'),(13,266,'Handover Document','/uploads/1762437898711-handover_doc_Checklist Prior Handover.PNG'),(14,266,'Handover Document','/uploads/1762437898738-handover_doc_IC-Project-Handover-Plan-Template.png'),(15,343,'Handover Document','/uploads/1762698328584-handover_doc_project_contract_photo.jpg');
/*!40000 ALTER TABLE `handover_documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kickoff_checklist`
--

DROP TABLE IF EXISTS `kickoff_checklist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kickoff_checklist` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_name` varchar(255) NOT NULL,
  `site_address` varchar(255) DEFAULT NULL,
  `project_no` varchar(100) DEFAULT NULL,
  `project_date` date DEFAULT NULL,
  `client_name` varchar(255) DEFAULT NULL,
  `pic_name` varchar(255) DEFAULT NULL,
  `contact_no` varchar(50) DEFAULT NULL,
  `elevator_type` varchar(255) DEFAULT NULL,
  `finishes` varchar(255) DEFAULT NULL,
  `install_method` varchar(255) DEFAULT NULL,
  `design_req` varchar(255) DEFAULT NULL,
  `building_status` varchar(255) DEFAULT NULL,
  `project_others` text,
  `toolbox` tinyint(1) DEFAULT '0',
  `qaqc` tinyint(1) DEFAULT '0',
  `drawing` tinyint(1) DEFAULT '0',
  `installation_manual` tinyint(1) DEFAULT '0',
  `start_date` date DEFAULT NULL,
  `project_schedule` varchar(255) DEFAULT NULL,
  `completion_date` date DEFAULT NULL,
  `manpower` varchar(255) DEFAULT NULL,
  `tools` varchar(255) DEFAULT NULL,
  `program_others` text,
  `lodging` varchar(255) DEFAULT NULL,
  `other_req` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `project_id` int DEFAULT NULL,
  `updated_at` date DEFAULT (curdate()),
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `kickoff_checklist_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=268 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kickoff_checklist`
--

LOCK TABLES `kickoff_checklist` WRITE;
/*!40000 ALTER TABLE `kickoff_checklist` DISABLE KEYS */;
INSERT INTO `kickoff_checklist` VALUES (1,'SkyLift1003','Site address','',NULL,'','','','Some capacity','','','','','',0,0,0,0,NULL,'',NULL,'I shall use this manpower','','','','','2025-10-06 06:46:03',NULL,'2025-10-07'),(2,'','Site address','',NULL,'','','','','','','','','',0,0,0,0,NULL,'',NULL,'','','','','','2025-10-06 06:54:15',1,'2025-10-07'),(5,'SkyLift 1003',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-10-06 06:54:43',NULL,'2025-10-07'),(6,'','test','',NULL,'','','','','','','','','',0,0,0,0,NULL,'',NULL,'','','','','','2025-10-06 07:26:41',44,'2025-10-07'),(7,'','adsf','',NULL,'','','','','','','','','',0,0,0,0,NULL,'',NULL,'','','','','','2025-10-06 07:29:46',44,'2025-10-07'),(44,'','dsaf','',NULL,'','','','','','','','','',0,0,0,0,NULL,'',NULL,'','','','','','2025-10-06 07:31:03',NULL,'2025-10-07'),(47,'',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-10-09 06:23:55',NULL,'2025-10-09'),(267,'',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-10-07 07:15:04',NULL,'2025-10-07');
/*!40000 ALTER TABLE `kickoff_checklist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `message_recipients`
--

DROP TABLE IF EXISTS `message_recipients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `message_recipients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `message_id` int NOT NULL,
  `recipient_id` int NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `read_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `message_id` (`message_id`),
  KEY `recipient_id` (`recipient_id`),
  CONSTRAINT `message_recipients_ibfk_1` FOREIGN KEY (`message_id`) REFERENCES `messages` (`message_id`) ON DELETE CASCADE,
  CONSTRAINT `message_recipients_ibfk_2` FOREIGN KEY (`recipient_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=307 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `message_recipients`
--

LOCK TABLES `message_recipients` WRITE;
/*!40000 ALTER TABLE `message_recipients` DISABLE KEYS */;
INSERT INTO `message_recipients` VALUES (291,57,2,1,'2025-11-06 20:15:11'),(292,58,3,1,'2025-11-06 20:28:15'),(293,59,7,1,'2025-11-06 23:09:32'),(294,60,5,1,'2025-11-06 20:53:12'),(295,61,7,1,'2025-11-06 23:09:32'),(296,62,5,1,'2025-11-06 21:13:02'),(297,63,5,0,NULL),(298,64,77,1,'2025-11-06 22:06:18'),(299,65,7,1,'2025-11-06 23:09:31'),(300,66,7,1,'2025-11-06 23:09:55'),(301,67,86,1,'2025-11-09 20:07:43'),(302,68,86,1,'2025-11-09 20:09:22'),(303,69,2,1,'2025-11-11 17:37:05'),(304,69,96,1,'2025-11-13 03:21:40'),(305,70,1,0,NULL),(306,71,2,1,'2025-11-13 22:18:42');
/*!40000 ALTER TABLE `message_recipients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `message_id` int NOT NULL AUTO_INCREMENT,
  `sender_id` int NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `thread_id` int DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`message_id`),
  KEY `sender_id` (`sender_id`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (57,7,'Project on Hold','2025-11-06 20:15:04',NULL,0),(58,2,'Create Schedule for Apex Lift','2025-11-06 20:28:01',NULL,0),(59,5,'Concerning about the project...','2025-11-06 20:42:08',NULL,0),(60,56,'Regarding the issue','2025-11-06 20:53:02',NULL,0),(61,91,'PUnchlistig items to need to recitfy','2025-11-06 21:08:49',NULL,0),(62,91,'Punchlist needing attention..','2025-11-06 21:12:55',NULL,0),(63,91,'Punch list rectified','2025-11-06 21:14:02',NULL,0),(64,7,'Prepare Hydro Lift for Handover','2025-11-06 22:04:02',NULL,0),(65,2,'Project Details to be discussed','2025-11-06 23:09:10',NULL,0),(66,2,'Project Details to be updated','2025-11-06 23:09:49',NULL,0),(67,96,'Look sharp, inspection now','2025-11-09 20:07:18',NULL,0),(68,4,'Begin now','2025-11-09 20:08:23',NULL,0),(69,77,'Message Sent!','2025-11-11 17:36:54',NULL,0),(70,77,'Look to update user','2025-11-11 17:56:00',NULL,0),(71,77,'boss','2025-11-13 22:18:25',NULL,0);
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `notification_id` int NOT NULL AUTO_INCREMENT,
  `subject` varchar(255) NOT NULL,
  `body` varchar(255) NOT NULL,
  `date` date DEFAULT (curdate()),
  `project_id` int DEFAULT NULL,
  `short_description` text,
  `notify_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`notification_id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `notification_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=458 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
INSERT INTO `notification` VALUES (184,'Project Created','Project 1 Reyes Isabella at 2025-10-30','2025-10-30',NULL,NULL,'2025-10-31 00:49:50'),(185,'Project Assigned','Project Assigned for SkyLift 1003 (Grand Horizon Commercial Towers)','2025-10-30',NULL,NULL,'2025-10-31 00:49:50'),(186,'Project Assigned','Project Assigned for SkyLift 1003 (Grand Horizon Commercial Towers)','2025-10-30',NULL,NULL,'2025-10-31 00:49:50'),(187,'Project Assigned','Project Assigned for SkyLift 1003 (Grand Horizon Commercial Towers)','2025-10-30',NULL,NULL,'2025-10-31 00:49:50'),(188,'Request for Inspection','Inspection to be conducted for SkyLift 1003 (Client: Grand Horizon Commercial Towers)\n                     at 2025-10-30for Template Setting','2025-10-30',NULL,NULL,'2025-10-31 00:49:50'),(189,'Assigned for QAQC Inspection','QAQC Inspection to be conducted for SkyLift 1003 is assigned to Humphry Vincenzo (91)','2025-10-30',NULL,NULL,'2025-10-31 00:49:50'),(190,'Project Created','Project 44 Montgomery Hazel at 2025-10-30','2025-10-30',NULL,NULL,'2025-10-31 00:49:50'),(191,'Project Created','Project 44 Cruz Nathaniel at 2025-10-30','2025-10-31',NULL,NULL,'2025-10-31 02:32:07'),(192,'Project Assigned','Project Assigned for Office Tower Elevator A (MetroRise Developers Inc.)','2025-10-31',NULL,NULL,'2025-10-31 02:48:25'),(193,'Project Created','Project 45 Reyes Dominic at 2025-10-30','2025-10-31',NULL,NULL,'2025-10-31 02:51:25'),(194,'Project Assigned','Project Assigned for Residential Lift A (Greenfield Residences)','2025-10-31',NULL,NULL,'2025-10-31 03:07:33'),(195,'Request for Inspection','Inspection to be conducted for Residential Lift A (Client: Greenfield Residences)\n                     at 2025-10-30for Template Setting','2025-10-31',NULL,NULL,'2025-10-31 03:22:07'),(196,'Assigned for QAQC Inspection','QAQC Inspection to be conducted for Residential Lift A is assigned to Humphry Vincenzo (91)','2025-10-31',NULL,NULL,'2025-10-31 03:22:42'),(197,'Request for Inspection','Inspection to be conducted for Residential Lift A (Client: Greenfield Residences)\n                     at 2025-10-31for Template Setting','2025-10-31',NULL,NULL,'2025-10-31 11:11:18'),(198,'Assigned for QAQC Inspection','QAQC Inspection to be conducted for Residential Lift A is assigned to Humphry Vincenzo (91)','2025-10-31',NULL,NULL,'2025-10-31 11:21:31'),(199,'Punchlist','Punchlist items to be rectified for Residential Lift A (Client: Greenfield Residences)','2025-10-31',NULL,NULL,'2025-10-31 12:51:56'),(200,'Project Created','Project 46 Navarro Althea at 2025-10-31','2025-10-31',NULL,NULL,'2025-10-31 13:27:32'),(201,'Project Created','Project 47 Uy Clarisse at 2025-10-31','2025-10-31',NULL,NULL,'2025-10-31 14:45:35'),(202,'Request for Inspection','Inspection to be conducted for Residential Lift A (Client: Greenfield Residences)\n                     at 2025-10-31','2025-10-31',NULL,NULL,'2025-10-31 18:31:27'),(203,'Request for Inspection','Inspection to be conducted for Residential Lift A (Client: Greenfield Residences)\n                     at 2025-10-31for Template Setting','2025-10-31',NULL,NULL,'2025-10-31 18:31:33'),(204,'Assigned for QAQC Inspection','QAQC Inspection to be conducted for Residential Lift A is assigned to Humphry Vincenzo (91)','2025-10-31',NULL,NULL,'2025-10-31 18:37:10'),(205,'Assigned for TNC Inspection','TNC Inspection to be conducted for Residential Lift A is assigned to Galla Faiza (86)','2025-10-31',NULL,NULL,'2025-10-31 18:51:52'),(206,'Request for Inspection','Inspection to be conducted for Residential Lift A (Client: Greenfield Residences)\n                     at 2025-10-31','2025-10-31',NULL,NULL,'2025-10-31 19:01:44'),(207,'Approved and Assigned for Final Join Inspection','Final Joint Inspection to be conducted for Residential Lift A (Client: Greenfield Residences)\n                     at 2025-10-30T16:00:00.000Z. Assigned PMS Technician: Kalpana Kamran','2025-10-31',NULL,NULL,'2025-10-31 19:14:12'),(208,'Request for Inspection','Inspection to be conducted for Shopping Mall Panoramic (Client: SunMall Group)\n                     at 2025-10-31for Handover','2025-11-01',NULL,NULL,'2025-11-01 00:35:21'),(209,'Request for Inspection','Inspection to be conducted for Shopping Mall Panoramic (Client: SunMall Group)\n                     at 2025-10-31','2025-11-01',NULL,NULL,'2025-11-01 00:35:27'),(210,'Request for Inspection','Inspection to be conducted for Shopping Mall Panoramic (Client: SunMall Group)\n                     at 2025-10-31','2025-11-01',NULL,NULL,'2025-11-01 00:35:32'),(211,'Approved and Assigned for Final Join Inspection','Final Joint Inspection to be conducted for Shopping Mall Panoramic (Client: SunMall Group)\n                     at 2025-10-30T16:00:00.000Z. Assigned PMS Technician: Kean Kiuk','2025-11-01',NULL,NULL,'2025-11-01 00:36:37'),(212,'Assigned for TNC Inspection','TNC Inspection to be conducted for Shopping Mall Panoramic is assigned to Galla Faiza (86)','2025-11-01',NULL,NULL,'2025-11-01 00:40:48'),(213,'Assigned for QAQC Inspection','QAQC Inspection to be conducted for Shopping Mall Panoramic is assigned to Humphry Vincenzo (91)','2025-11-01',NULL,NULL,'2025-11-01 00:43:12'),(214,'Punchlist','Punchlist items to be rectified for Shopping Mall Panoramic (Client: SunMall Group)','2025-11-01',NULL,NULL,'2025-11-01 00:43:52'),(215,'Prepare Handover','Prepare handover for Shopping Mall Panoramic (Client: SunMall Group)','2025-11-01',NULL,NULL,'2025-11-01 01:10:51'),(216,'Assigned for PMS Inspection','PMS Inspection to be condected for SunMall Group (Shopping Mall Panoramic)\n                    at 2025-12-01','2025-11-02',NULL,NULL,'2025-11-02 20:46:43'),(217,'Assigned for PMS Inspection','PMS Inspection to be condected for SunMall Group (Shopping Mall Panoramic)\n                    at 2025-12-01','2025-11-02',NULL,NULL,'2025-11-02 20:47:56'),(218,'Assigned for PMS Inspection','PMS Inspection to be condected for SunMall Group (Shopping Mall Panoramic)\n                    at 2025-12-01','2025-11-02',NULL,NULL,'2025-11-02 20:48:29'),(219,'Assigned for PMS Inspection','PMS Inspection to be condected for SunMall Group (Shopping Mall Panoramic)\n                    at 2025-12-01','2025-11-02',NULL,NULL,'2025-11-02 20:49:34'),(220,'Request for Hold','Request Hold for SkyLift 1003 (Client: Grand Horizon Commercial Towers)\n                     at undefined','2025-11-02',NULL,NULL,'2025-11-02 23:42:33'),(221,'Approve for Hold','Approved Hold for SkyLift 1003 (Client: Grand Horizon Commercial Towers)\n                     at undefined','2025-11-03',NULL,NULL,'2025-11-03 00:11:47'),(222,'Task Pending for completion','Hauling Works pending for completion for SkyLift 1003 (Client: Grand Horizon Commercial Towers)','2025-11-03',NULL,NULL,'2025-11-03 11:59:10'),(223,'Request for Inspection','Inspection to be conducted for SkyLift 1003 (Client: Grand Horizon Commercial Towers)\n                     at 2025-11-03for Template Setting','2025-11-03',NULL,NULL,'2025-11-03 11:59:54'),(224,'Request for Inspection','Inspection to be conducted for SkyLift 1003 (Client: Grand Horizon Commercial Towers)\n                     at 2025-11-03 for Template Setting','2025-11-03',NULL,NULL,'2025-11-03 12:00:35'),(225,'Assigned for QAQC Inspection','QAQC Inspection to be conducted for SkyLift 1003 is assigned to Humphry Vincenzo (91)','2025-11-03',NULL,NULL,'2025-11-03 12:01:17'),(226,'Task Pending for completion','Hauling Works pending for completion for SkyLift 1003 (Client: Grand Horizon Commercial Towers)','2025-11-03',NULL,NULL,'2025-11-03 12:02:35'),(227,'Task Pending for completion','Template Setting pending for completion for SkyLift 1003 (Client: Grand Horizon Commercial Towers)','2025-11-03',NULL,NULL,'2025-11-03 12:03:09'),(228,'Punchlist','Punchlist items to be rectified for SkyLift 1003 (Client: Grand Horizon Commercial Towers)','2025-11-03',NULL,NULL,'2025-11-03 12:03:53'),(229,'Task Pending for completion','Template Setting pending for completion for SkyLift 1003 (Client: Grand Horizon Commercial Towers)','2025-11-03',NULL,NULL,'2025-11-03 12:12:41'),(230,'Request for Inspection','Inspection to be conducted for SkyLift 1003 (Client: Grand Horizon Commercial Towers)\n                     at 2026-01-02 for Handover','2025-11-03',NULL,NULL,'2025-11-03 12:14:49'),(231,'Request for Inspection','Inspection to be conducted for SkyLift 1003 (Client: Grand Horizon Commercial Towers)\n                     at 2026-01-02','2025-11-03',NULL,NULL,'2025-11-03 12:14:59'),(232,'Request for Inspection','Inspection to be conducted for SkyLift 1003 (Client: Grand Horizon Commercial Towers)\n                     at 2026-01-02','2025-11-03',NULL,NULL,'2025-11-03 12:15:03'),(233,'Assigned for QAQC Inspection','QAQC Inspection to be conducted for SkyLift 1003 is assigned to Humphry Vincenzo (91)','2025-11-03',NULL,NULL,'2025-11-03 12:17:30'),(234,'Request for Inspection','Inspection to be conducted for SkyLift 1003 (Client: Grand Horizon Commercial Towers)\n                     at 2025-11-03 for Template Setting','2025-11-03',NULL,NULL,'2025-11-03 12:24:40'),(235,'Request for Inspection','Inspection to be conducted for SkyLift 1003 (Client: Grand Horizon Commercial Towers)\n                     at 2025-11-03','2025-11-03',NULL,NULL,'2025-11-03 12:24:43'),(236,'Request for Inspection','Inspection to be conducted for SkyLift 1003 (Client: Grand Horizon Commercial Towers)\n                     at 2025-11-03','2025-11-03',NULL,NULL,'2025-11-03 12:26:03'),(237,'Assigned for QAQC Inspection','QAQC Inspection to be conducted for SkyLift 1003 is assigned to Humphry Vincenzo (91)','2025-11-03',NULL,NULL,'2025-11-03 12:26:16'),(238,'Approved and Assigned for Final Join Inspection','Final Joint Inspection to be conducted for SkyLift 1003 (Client: Grand Horizon Commercial Towers)\n                     at 2025-11-02T16:00:00.000Z. Assigned PMS Technician: Yusuf Kassia','2025-11-03',NULL,NULL,'2025-11-03 12:27:39'),(239,'Assigned for TNC Inspection','TNC Inspection to be conducted for SkyLift 1003 is assigned to Galla Faiza (86)','2025-11-03',NULL,NULL,'2025-11-03 12:28:44'),(240,'Prepare Handover','Prepare handover for SkyLift 1003 (Client: Grand Horizon Commercial Towers)','2025-11-03',NULL,NULL,'2025-11-03 12:32:50'),(241,'Assigned for PMS Inspection','PMS Inspection to be condected for Greenfield Residences (Residential Lift B)\n                    at 2025-12-04','2025-11-03',NULL,NULL,'2025-11-03 13:29:42'),(242,'Assigned for PMS Inspection','PMS Inspection to be condected for Grand Horizon Commercial Towers (SkyLift 1003)\n                    at 2025-11-03','2025-11-03',NULL,NULL,'2025-11-03 13:41:59'),(243,'Assigned for PMS Inspection','PMS Inspection to be condected for Grand Horizon Commercial Towers (SkyLift 1003)\n                    at 2025-11-03','2025-11-03',NULL,NULL,'2025-11-03 13:44:09'),(244,'Assigned for PMS Inspection','PMS Inspection to be condected for SunMall Group (Shopping Mall Panoramic)\n                    at 2025-12-03','2025-11-03',NULL,NULL,'2025-11-03 13:45:10'),(245,'Project Created','Project 48 Reyes Isabella at 2025-11-03','2025-11-03',NULL,NULL,'2025-11-03 13:48:27'),(246,'Project Created','Project 265 Montgomery Hazel at 2025-11-03','2025-11-03',NULL,NULL,'2025-11-03 13:50:50'),(247,'Project Created','Project 266 Navarro Althea at 2025-11-03','2025-11-03',NULL,NULL,'2025-11-03 13:55:07'),(248,'Project Assigned','Project Assigned for Hydro-Lift Freight Elevator (Titan Manufacturing Co.)','2025-11-03',NULL,NULL,'2025-11-03 13:59:12'),(249,'Project Created','Project 267 Uy Clarisse at 2025-11-03','2025-11-03',NULL,NULL,'2025-11-03 14:03:27'),(250,'Project Assigned','Project Assigned for Eco-Mini Residential Elevator (EcoHomes Development Corp.)','2025-11-03',NULL,NULL,'2025-11-03 14:16:53'),(251,'Project Created','Project 328 Navarro Althea at 2025-11-03','2025-11-03',NULL,NULL,'2025-11-03 15:01:29'),(252,'Project Assigned','Project Assigned for Hospital Service Elevator 1 (St. Mary’s Medical Center)','2025-11-03',NULL,NULL,'2025-11-03 15:09:22'),(253,'Request for Inspection','Inspection to be conducted for Hydro-Lift Freight Elevator (Client: Titan Manufacturing Co.)\n                     at 2025-11-03 for Template Setting','2025-11-03',NULL,NULL,'2025-11-03 15:12:33'),(254,'Assigned for QAQC Inspection','QAQC Inspection to be conducted for Hydro-Lift Freight Elevator is assigned to Humphry Vincenzo (91)','2025-11-03',NULL,NULL,'2025-11-03 15:13:27'),(255,'Task Pending for completion','Template Setting pending for completion for Hydro-Lift Freight Elevator (Client: Titan Manufacturing Co.)','2025-11-03',NULL,NULL,'2025-11-03 15:15:08'),(256,'Punchlist','Punchlist items to be rectified for Hydro-Lift Freight Elevator (Client: Titan Manufacturing Co.)','2025-11-03',NULL,NULL,'2025-11-03 15:15:57'),(257,'Request for Inspection','Inspection to be conducted for Eco-Mini Residential Elevator (Client: EcoHomes Development Corp.)\n                     at 2025-11-03 for Handover','2025-11-03',NULL,NULL,'2025-11-03 15:21:10'),(258,'Request for Inspection','Inspection to be conducted for Eco-Mini Residential Elevator (Client: EcoHomes Development Corp.)\n                     at 2025-11-03','2025-11-03',NULL,NULL,'2025-11-03 15:22:02'),(259,'Approved and Assigned for Final Join Inspection','Final Joint Inspection to be conducted for Eco-Mini Residential Elevator (Client: EcoHomes Development Corp.)\n                     at 2025-11-02T16:00:00.000Z. Assigned PMS Technician: Yusuf Kassia','2025-11-03',NULL,NULL,'2025-11-03 15:22:34'),(260,'Request for Inspection','Inspection to be conducted for Eco-Mini Residential Elevator (Client: EcoHomes Development Corp.)\n                     at 2025-11-03','2025-11-03',NULL,NULL,'2025-11-03 15:24:30'),(261,'Assigned for TNC Inspection','TNC Inspection to be conducted for Eco-Mini Residential Elevator is assigned to Galla Faiza (86)','2025-11-03',NULL,NULL,'2025-11-03 15:25:01'),(262,'Assigned for QAQC Inspection','QAQC Inspection to be conducted for Eco-Mini Residential Elevator is assigned to Humphry Vincenzo (91)','2025-11-03',NULL,NULL,'2025-11-03 15:25:56'),(263,'Prepare Handover','Prepare handover for Eco-Mini Residential Elevator (Client: EcoHomes Development Corp.)','2025-11-03',NULL,NULL,'2025-11-03 15:36:15'),(264,'Assigned for PMS Inspection','PMS Inspection to be condected for EcoHomes Development Corp. (Eco-Mini Residential Elevator)\n                    at 2025-12-04','2025-11-03',NULL,NULL,'2025-11-03 15:40:43'),(265,'Request for Hold','Request Hold for Office Tower Elevator A (Client: MetroRise Developers Inc.)\n                     at undefined','2025-11-03',NULL,NULL,'2025-11-03 15:48:19'),(266,'Request for Hold','Request Hold for Office Tower Elevator A (Client: MetroRise Developers Inc.)\n                     at undefined','2025-11-03',NULL,NULL,'2025-11-03 15:48:34'),(267,'Request for Hold','Request Hold for Office Tower Elevator A (Client: MetroRise Developers Inc.)\n                     at undefined','2025-11-03',NULL,NULL,'2025-11-03 15:48:35'),(268,'Approve for Hold','Approved Hold for Office Tower Elevator A (Client: MetroRise Developers Inc.)\n                     at undefined','2025-11-03',NULL,NULL,'2025-11-03 15:49:13'),(269,'Task Pending for completion','Marking and Boring of Holes pending for completion for Hydro-Lift Freight Elevator (Client: Titan Manufacturing Co.)','2025-11-05',NULL,NULL,'2025-11-05 12:32:15'),(270,'Request for Hold','Request Hold for Hospital Service Elevator 1 (Client: St. Mary’s Medical Center)\n                     at undefined','2025-11-05',NULL,NULL,'2025-11-05 15:25:06'),(271,'Request for Hold','Request Hold for Hospital Service Elevator 1 (Client: St. Mary’s Medical Center)\n                     at undefined','2025-11-05',NULL,NULL,'2025-11-05 15:25:08'),(272,'Approve for Hold','Approved Hold for Hospital Service Elevator 1 (Client: St. Mary’s Medical Center)\n                     at undefined','2025-11-05',NULL,NULL,'2025-11-05 15:25:41'),(273,'Request for Hold','Request Hold for Hydro-Lift Freight Elevator (Client: Titan Manufacturing Co.)\n                     at undefined','2025-11-05',NULL,NULL,'2025-11-05 15:25:58'),(274,'Approve for Hold','Approved Hold for Hydro-Lift Freight Elevator (Client: Titan Manufacturing Co.)\n                     at undefined','2025-11-05',NULL,NULL,'2025-11-05 15:26:11'),(275,'Request for Inspection','Inspection to be conducted for Hydro-Lift Freight Elevator (Client: Titan Manufacturing Co.)\n                     at 2025-11-05','2025-11-06',NULL,NULL,'2025-11-06 00:11:49'),(276,'Assigned for TNC Inspection','TNC Inspection to be conducted for Hydro-Lift Freight Elevator is assigned to undefined undefined (86)','2025-11-06',NULL,NULL,'2025-11-06 00:43:40'),(277,'Request for Inspection','Inspection to be conducted for Hydro-Lift Freight Elevator (Client: Titan Manufacturing Co.)\n                     at 2025-11-05 for Prior Testing and Commissioning','2025-11-06',NULL,NULL,'2025-11-06 00:44:00'),(278,'Project Created','Project 329 Cruz Nathaniel at 2025-11-06','2025-11-06',NULL,NULL,'2025-11-06 14:49:36'),(279,'Project Assigned','Project Assigned for new 1 (Iernus)','2025-11-06',NULL,NULL,'2025-11-06 15:06:19'),(280,'Task Pending for completion','Unloading of elevator equipments pending for completion for new 1 (Client: Iernus)','2025-11-06',NULL,NULL,'2025-11-06 15:31:38'),(281,'Task Pending for completion','Scaffolding Installation pending for completion for new 1 (Client: Iernus)','2025-11-06',NULL,NULL,'2025-11-06 15:34:23'),(282,'Task Pending for completion','Hauling Works pending for completion for new 1 (Client: Iernus)','2025-11-06',NULL,NULL,'2025-11-06 15:38:00'),(283,'Task Pending for completion','Unloading of elevator equipments pending for completion for new 1 (Client: Iernus)','2025-11-06',NULL,NULL,'2025-11-06 16:11:29'),(284,'Task Pending for completion','Scaffolding Installation pending for completion for new 1 (Client: Iernus)','2025-11-06',NULL,NULL,'2025-11-06 16:12:35'),(285,'Task Pending for completion','Hauling Works pending for completion for new 1 (Client: Iernus)','2025-11-06',NULL,NULL,'2025-11-06 16:13:15'),(286,'Task Pending for completion','Scaffolding Installation pending for completion for new 1 (Client: Iernus)','2025-11-06',NULL,NULL,'2025-11-06 16:24:28'),(287,'Task Pending for completion','Hauling Works pending for completion for new 1 (Client: Iernus)','2025-11-06',NULL,NULL,'2025-11-06 16:40:33'),(288,'Task Pending for completion','Hauling Works pending for completion for  3300/3300 XL (Client: Carmine Corp)','2025-11-06',NULL,NULL,'2025-11-06 16:51:13'),(289,'Request for Inspection','Inspection to be conducted for  3300/3300 XL (Client: Carmine Corp)\n                     at 2025-11-07 for Template Setting','2025-11-06',NULL,NULL,'2025-11-06 16:52:06'),(290,'Task Pending for completion','Hauling Works pending for completion for  3300/3300 XL (Client: Carmine Corp)','2025-11-06',NULL,NULL,'2025-11-06 17:13:15'),(291,'Task Pending for completion','Hauling Works pending for completion for  3300/3300 XL (Client: Carmine Corp)','2025-11-06',NULL,NULL,'2025-11-06 17:13:33'),(292,'Task Pending for completion','Hauling Works pending for completion for  3300/3300 XL (Client: Carmine Corp)','2025-11-06',NULL,NULL,'2025-11-06 17:28:24'),(293,'Assigned for QAQC Inspection','QAQC Inspection to be conducted for Hydro-Lift Freight Elevator is assigned to undefined undefined (93)','2025-11-06',NULL,NULL,'2025-11-06 17:32:12'),(294,'Assigned for QAQC Inspection','QAQC Inspection to be conducted for  3300/3300 XL is assigned to undefined undefined (91)','2025-11-06',NULL,NULL,'2025-11-06 17:55:00'),(295,'Request for Inspection','Inspection to be conducted for  3300/3300 XL (Client: Carmine Corp)\n                     at 2025-11-06 for Template Setting','2025-11-06',NULL,NULL,'2025-11-06 17:56:38'),(296,'Task Pending for completion','Template Setting pending for completion for  3300/3300 XL (Client: Carmine Corp)','2025-11-06',NULL,NULL,'2025-11-06 17:57:25'),(297,'Project Created','Project 328 Reyes Isabella at 2025-11-06','2025-11-06',NULL,NULL,'2025-11-06 18:20:59'),(298,'Project Created','Project 330 Reyes Dominic at 2025-11-06','2025-11-06',NULL,NULL,'2025-11-06 18:25:41'),(299,'Project Created','Project 330 Uy Clarisse at 2025-11-06','2025-11-06',NULL,NULL,'2025-11-06 18:26:54'),(300,'Project Created','Project 330 Reyes Dominic at 2025-11-06','2025-11-06',NULL,NULL,'2025-11-06 18:33:10'),(301,'Task Pending for completion','Installation of Pit Ladder / Hoistway Lighting pending for completion for Hydro-Lift Freight Elevator (Client: Titan Manufacturing Co.)','2025-11-06',NULL,NULL,'2025-11-06 18:42:49'),(302,'Request for Inspection','Inspection to be conducted for Hydro-Lift Freight Elevator (Client: Titan Manufacturing Co.)\n                     at 2025-11-06 for Prior Testing and Commissioning','2025-11-06',NULL,NULL,'2025-11-06 19:09:46'),(303,'Assigned for QAQC Inspection','QAQC Inspection to be conducted for Hydro-Lift Freight Elevator is assigned to undefined undefined (91)','2025-11-06',NULL,NULL,'2025-11-06 19:10:10'),(304,'Request for Inspection','Inspection to be conducted for Hydro-Lift Freight Elevator (Client: Titan Manufacturing Co.)\n                     at 2025-11-06 for Prior Testing and Commissioning','2025-11-06',NULL,NULL,'2025-11-06 19:11:18'),(305,'Assigned for QAQC Inspection','QAQC Inspection to be conducted for Hydro-Lift Freight Elevator is assigned to undefined undefined (91)','2025-11-06',NULL,NULL,'2025-11-06 19:11:55'),(306,'Project Created','Project 331 Reyes Isabella at 2025-11-06','2025-11-06',NULL,NULL,'2025-11-06 20:27:08'),(307,'Project Assigned','Project Assigned for Apex Lift 310 (Vandelay Industries)','2025-11-06',NULL,NULL,'2025-11-06 20:30:54'),(308,'Request for Inspection','Inspection to be conducted for  3300/3300 XL (Client: Carmine Corp)\n                     at 2025-11-06 for Template Setting','2025-11-06',NULL,NULL,'2025-11-06 21:02:17'),(309,'Assigned for QAQC Inspection','QAQC Inspection to be conducted for  3300/3300 XL is assigned to undefined undefined (91)','2025-11-06',NULL,NULL,'2025-11-06 21:03:03'),(310,'Task Pending for completion','Hauling Works pending for completion for  3300/3300 XL (Client: Carmine Corp)','2025-11-06',NULL,NULL,'2025-11-06 21:03:45'),(311,'Punchlist','Punchlist items to be rectified for  3300/3300 XL (Client: Carmine Corp)','2025-11-06',NULL,NULL,'2025-11-06 21:08:17'),(312,'Punchlist','Punchlist items to be rectified for  3300/3300 XL (Client: Carmine Corp)','2025-11-06',NULL,NULL,'2025-11-06 21:12:32'),(313,'Task Pending for completion','Template Setting pending for completion for  3300/3300 XL (Client: Carmine Corp)','2025-11-06',NULL,NULL,'2025-11-06 21:14:26'),(314,'Request for Inspection','Inspection to be conducted for  3300/3300 XL (Client: Carmine Corp)\n                     at 2025-12-05','2025-11-06',NULL,NULL,'2025-11-06 21:30:07'),(315,'Assigned for TNC Inspection','TNC Inspection to be conducted for  3300/3300 XL is assigned to undefined undefined (88)','2025-11-06',NULL,NULL,'2025-11-06 21:30:54'),(316,'Request for Inspection','Inspection to be conducted for  3300/3300 XL (Client: Carmine Corp)\n                     at 2025-12-05','2025-11-06',NULL,NULL,'2025-11-06 21:32:12'),(317,'Request for Inspection','Inspection to be conducted for  3300/3300 XL (Client: Carmine Corp)\n                     at 2025-12-05','2025-11-06',NULL,NULL,'2025-11-06 21:42:48'),(318,'Request for Inspection','Inspection to be conducted for  3300/3300 XL (Client: Carmine Corp)\n                     at 2025-12-05','2025-11-06',NULL,NULL,'2025-11-06 21:47:19'),(319,'Assigned for TNC Inspection','TNC Inspection to be conducted for  3300/3300 XL is assigned to undefined undefined (88)','2025-11-06',NULL,NULL,'2025-11-06 21:47:42'),(320,'Request for Inspection','Inspection to be conducted for Hydro-Lift Freight Elevator (Client: Titan Manufacturing Co.)\n                     at 2025-11-06 for Handover','2025-11-06',NULL,NULL,'2025-11-06 21:51:11'),(321,'Request for Inspection','Inspection to be conducted for Hydro-Lift Freight Elevator (Client: Titan Manufacturing Co.)\n                     at 2025-11-06 for Template Setting','2025-11-06',NULL,NULL,'2025-11-06 21:53:09'),(322,'Request for Inspection','Inspection to be conducted for Hydro-Lift Freight Elevator (Client: Titan Manufacturing Co.)\n                     at 2025-11-06 for Template Setting','2025-11-06',NULL,NULL,'2025-11-06 21:57:36'),(323,'Assigned for QAQC Inspection','QAQC Inspection to be conducted for Hydro-Lift Freight Elevator is assigned to undefined undefined (91)','2025-11-06',NULL,NULL,'2025-11-06 21:58:48'),(324,'Request for Inspection','Inspection to be conducted for Hydro-Lift Freight Elevator (Client: Titan Manufacturing Co.)\n                     at 2025-11-06','2025-11-06',NULL,NULL,'2025-11-06 21:59:43'),(325,'Approved and Assigned for Final Join Inspection','Final Joint Inspection to be conducted for Hydro-Lift Freight Elevator (Client: Titan Manufacturing Co.)\n                     at 2025-11-05T16:00:00.000Z. Assigned PMS Technician: Yusuf Kassia','2025-11-06',NULL,NULL,'2025-11-06 22:00:06'),(326,'Prepare Handover','Prepare handover for Hydro-Lift Freight Elevator (Client: Titan Manufacturing Co.)','2025-11-06',NULL,NULL,'2025-11-06 22:03:26'),(327,'Assigned for PMS Inspection','PMS Inspection to be condected for Titan Manufacturing Co. (Hydro-Lift Freight Elevator)\n                    at 2025-12-06','2025-11-06',NULL,NULL,'2025-11-06 22:05:56'),(328,'Task Pending for completion','Marking and Boring of Holes pending for completion for  3300/3300 XL (Client: Carmine Corp)','2025-11-07',NULL,NULL,'2025-11-07 18:20:17'),(329,'Approve for Hold','Approved Hold for Hospital Service Elevator 1 (Client: St. Mary’s Medical Center)\n                     at undefined','2025-11-08',NULL,NULL,'2025-11-08 15:56:53'),(330,'Project Created','Project 333 Montgomery Hazel at 2025-11-08','2025-11-08',NULL,NULL,'2025-11-08 17:53:51'),(331,'Project Created','Project 333 Uy Clarisse at 2025-11-08','2025-11-08',NULL,NULL,'2025-11-08 17:55:34'),(332,'Request for Inspection','Inspection to be conducted for 123 (Client: 123)\n                     at 2025-11-08 for Template Setting','2025-11-08',NULL,NULL,'2025-11-08 19:42:18'),(333,'Assigned for QAQC Inspection','QAQC Inspection to be conducted for 123 is assigned to undefined undefined (91)','2025-11-08',NULL,NULL,'2025-11-08 19:43:06'),(334,'Request for Inspection','Inspection to be conducted for 123 (Client: 123)\n                     at 2025-11-08 for Template Setting','2025-11-08',NULL,NULL,'2025-11-08 20:06:46'),(335,'Assigned for QAQC Inspection','QAQC Inspection to be conducted for 123 is assigned to undefined undefined (91)','2025-11-08',NULL,NULL,'2025-11-08 20:07:25'),(336,'Request for Inspection','Inspection to be conducted for 123 (Client: 123)\n                     at 2025-11-10 for Template Setting','2025-11-08',NULL,NULL,'2025-11-08 20:27:18'),(337,'Assigned for QAQC Inspection','QAQC Inspection to be conducted for 123 is assigned to undefined undefined (91)','2025-11-08',NULL,NULL,'2025-11-08 20:27:33'),(338,'Request for Inspection','Inspection to be conducted for 123 (Client: 123)\n                     at 2025-11-08 for Template Setting','2025-11-08',NULL,NULL,'2025-11-08 21:12:21'),(339,'Assigned for QAQC Inspection','QAQC Inspection to be conducted for 123 is assigned to undefined undefined (91)','2025-11-08',NULL,NULL,'2025-11-08 21:13:54'),(340,'Assigned for PMS Inspection','PMS Inspection to be condected for EcoHomes Development Corp. (Eco-Mini Residential Elevator)\n                    at 2025-11-08','2025-11-08',NULL,NULL,'2025-11-08 21:21:01'),(341,'Task Pending for completion','Hoistway pending for completion for 123 (Client: 123)','2025-11-08',NULL,NULL,'2025-11-08 21:36:53'),(342,'Request for Hold','Request Hold for 123 (Client: 123)\n                     at undefined','2025-11-08',NULL,NULL,'2025-11-08 21:37:53'),(343,'Approve for Hold','Approved Hold for 123 (Client: 123)\n                     at undefined','2025-11-08',NULL,NULL,'2025-11-08 21:50:04'),(344,'Request for Hold','Request Hold for 123 (Client: 123)\n                     at undefined','2025-11-08',NULL,NULL,'2025-11-08 21:57:08'),(345,'Approve for Hold','Approved Hold for 123 (Client: 123)\n                     at undefined','2025-11-08',NULL,NULL,'2025-11-08 21:57:30'),(346,'Request for Hold','Request Hold for 123 (Client: 123)\n                     at undefined','2025-11-08',NULL,NULL,'2025-11-08 22:03:42'),(347,'Approve for Hold','Approved Hold for 123 (Client: 123)\n                     at undefined','2025-11-08',NULL,NULL,'2025-11-08 22:04:14'),(348,'Request for Inspection','Inspection to be conducted for 123 (Client: 123)\n                     at 2025-11-08','2025-11-08',NULL,NULL,'2025-11-08 22:06:47'),(349,'Assigned for TNC Inspection','TNC Inspection to be conducted for 123 is assigned to undefined undefined (87)','2025-11-08',NULL,NULL,'2025-11-08 22:09:40'),(350,'Assigned for PMS Inspection','PMS Inspection to be condected for Greenfield Residences (Residential Lift B)\n                    at 2025-12-04','2025-11-09',NULL,NULL,'2025-11-09 18:29:16'),(351,'Assigned for PMS Inspection','PMS Inspection to be condected for Titan Manufacturing Co. (Hydro-Lift Freight Elevator)\n                    at 2025-12-06','2025-11-09',NULL,NULL,'2025-11-09 18:29:43'),(352,'Project Created','Project 342 Reyes Dominic at 2025-11-09','2025-11-09',NULL,NULL,'2025-11-09 18:55:43'),(353,'Task Pending for completion','Traction Machine pending for completion for Lift-D-004 (Client: Logistics Inc)','2025-11-09',NULL,NULL,'2025-11-09 18:57:35'),(354,'Task Pending for completion','Traction Machine pending for completion for Lift-D-004 (Client: Logistics Inc)','2025-11-09',NULL,NULL,'2025-11-09 19:36:14'),(355,'Project Created','Project 341 Montgomery Hazel at 2025-11-09','2025-11-09',NULL,NULL,'2025-11-09 20:04:05'),(356,'Request for Inspection','Inspection to be conducted for Lift-C-003 (Client: Skyline Towers)\n                     at 2025-11-09','2025-11-09',NULL,NULL,'2025-11-09 20:05:52'),(357,'Assigned for TNC Inspection','TNC Inspection to be conducted for Lift-C-003 is assigned to undefined undefined (86)','2025-11-09',NULL,NULL,'2025-11-09 20:06:24'),(358,'Project Created','Project 340 Plankto Karen at 2025-11-09','2025-11-09',NULL,NULL,'2025-11-09 20:13:35'),(359,'Task Pending for completion','Main/Car pending for completion for Lift-B-002 (Client: General Hospital)','2025-11-09',NULL,NULL,'2025-11-09 20:35:16'),(360,'Project Created','Project 339 Montgomery Hazel at 2025-11-09','2025-11-09',NULL,NULL,'2025-11-09 20:37:53'),(361,'Project Created','Project 343 Navarro Althea at 2025-11-09','2025-11-09',NULL,NULL,'2025-11-09 21:26:53'),(362,'Request for Inspection','Inspection to be conducted for Lift-E-005 (Client: Mall Group)\n                     at 2025-11-09','2025-11-09',NULL,NULL,'2025-11-09 21:35:21'),(363,'Approved and Assigned for Final Join Inspection','Final Joint Inspection to be conducted for Lift-E-005 (Client: Mall Group)\n                     at 2025-11-08T16:00:00.000Z. Assigned PMS Technician: Yusuf Kassia','2025-11-09',NULL,NULL,'2025-11-09 21:36:21'),(364,'Callback Scheduled','Callback scheduled for Grand Horizon Commercial Towers (SkyLift 1003) on 2026-02-03','2025-11-11',NULL,NULL,'2025-11-11 18:20:04'),(365,'Callback Scheduled','Callback scheduled for EcoHomes Development Corp. (Eco-Mini Residential Elevator) on 2025-12-08','2025-11-11',NULL,NULL,'2025-11-11 18:24:30'),(366,'Callback Scheduled','Callback scheduled for EcoHomes Development Corp. (Eco-Mini Residential Elevator) on 2025-12-08','2025-11-11',NULL,NULL,'2025-11-11 18:24:58'),(367,'Callback Scheduled','Callback scheduled for EcoHomes Development Corp. (Eco-Mini Residential Elevator) on 2025-12-08','2025-11-11',NULL,NULL,'2025-11-11 18:25:27'),(368,'PMS Inspection Updated','PMS Inspection rescheduled for SunMall Group (Shopping Mall Panoramic) on 2025-12-03','2025-11-11',NULL,NULL,'2025-11-11 19:28:54'),(369,'PMS Inspection Updated','PMS Inspection rescheduled for Greenfield Residences (Residential Lift B) on 2025-12-04','2025-11-11',NULL,NULL,'2025-11-11 20:05:28'),(370,'PMS Inspection Updated','PMS Inspection rescheduled for SunMall Group (Shopping Mall Panoramic) on 2025-12-05','2025-11-11',NULL,NULL,'2025-11-11 20:06:44'),(371,'PMS Inspection Updated','PMS Inspection rescheduled for Titan Manufacturing Co. (Hydro-Lift Freight Elevator) on 2025-12-07','2025-11-11',NULL,NULL,'2025-11-11 20:07:02'),(372,'Callback Scheduled','Callback scheduled for EcoHomes Development Corp. (Eco-Mini Residential Elevator) on 2025-12-25','2025-11-11',NULL,NULL,'2025-11-11 20:36:40'),(373,'Callback Scheduled','Callback scheduled for EcoHomes Development Corp. (Eco-Mini Residential Elevator) on 2025-11-11','2025-11-11',NULL,NULL,'2025-11-11 22:02:34'),(374,'Callback Scheduled','Callback scheduled for EcoHomes Development Corp. (Eco-Mini Residential Elevator) on 2025-11-12','2025-11-11',NULL,NULL,'2025-11-11 22:09:41'),(375,'Task Pending for completion','Support Beams pending for completion for Lift-D-004 (Client: Logistics Inc)','2025-11-12',NULL,NULL,'2025-11-12 00:20:27'),(376,'Task Pending for completion','Support Beams pending for completion for Lift-D-004 (Client: Logistics Inc)','2025-11-12',NULL,NULL,'2025-11-12 00:24:13'),(377,'Task Pending for completion','Support Beams pending for completion for Lift-D-004 (Client: Logistics Inc)','2025-11-12',NULL,NULL,'2025-11-12 00:27:26'),(378,'Task Pending for completion','Support Beams pending for completion for Lift-D-004 (Client: Logistics Inc)','2025-11-12',NULL,NULL,'2025-11-12 00:32:59'),(379,'Task Pending for completion','Support Beams pending for completion for Lift-D-004 (Client: Logistics Inc)','2025-11-12',NULL,NULL,'2025-11-12 00:35:00'),(380,'Task Pending for completion','Support Beams pending for completion for Lift-D-004 (Client: Logistics Inc)','2025-11-12',NULL,NULL,'2025-11-12 00:36:32'),(381,'Task Pending for completion','Support Beams pending for completion for Lift-D-004 (Client: Logistics Inc)','2025-11-12',NULL,NULL,'2025-11-12 00:37:32'),(382,'Task Pending for completion','Support Beams pending for completion for Lift-D-004 (Client: Logistics Inc)','2025-11-12',NULL,NULL,'2025-11-12 00:39:06'),(383,'Task Pending for completion','Support Beams pending for completion for Lift-D-004 (Client: Logistics Inc)','2025-11-12',NULL,NULL,'2025-11-12 00:47:41'),(384,'Task Pending for completion','Support Beams pending for completion for Lift-D-004 (Client: Logistics Inc)','2025-11-12',NULL,NULL,'2025-11-12 00:47:58'),(385,'Task Pending for completion','Support Beams pending for completion for Lift-D-004 (Client: Logistics Inc)','2025-11-12',NULL,NULL,'2025-11-12 00:48:45'),(386,'Task Pending for completion','Governor pending for completion for Lift-D-004 (Client: Logistics Inc)','2025-11-12',NULL,NULL,'2025-11-12 00:51:28'),(387,'Request for Hold','Request Hold for 123 (Client: 123)\n                     at undefined','2025-11-12',NULL,NULL,'2025-11-12 20:44:42'),(388,'Approve for Hold','Approved Hold for 123 (Client: 123)\n                  at Wed Nov 12 2025 00:00:00 GMT+0800 (Singapore Standard Time)','2025-11-12',NULL,NULL,'2025-11-12 22:14:07'),(389,'Request for Hold','Request Hold for 123 (Client: 123)\n                     at Wed Nov 12 2025 00:00:00 GMT+0800 (Singapore Standard Time)','2025-11-12',NULL,NULL,'2025-11-12 22:18:15'),(390,'Approve for Hold','Approved Hold for 123 (Client: 123)\n                  at Wed Nov 12 2025 00:00:00 GMT+0800 (Singapore Standard Time)','2025-11-12',NULL,NULL,'2025-11-12 22:18:22'),(391,'Request for Hold','Request Hold for 123 (Client: 123)\n                     at Wed Nov 12 2025 00:00:00 GMT+0800 (Singapore Standard Time)','2025-11-12',NULL,NULL,'2025-11-12 22:30:23'),(392,'Approve for Hold','Approved Hold for 123 (Client: 123)\n                  at Wed Nov 12 2025 00:00:00 GMT+0800 (Singapore Standard Time)','2025-11-12',NULL,NULL,'2025-11-12 22:33:16'),(393,'Request for Hold','Request Hold for 123 (Client: 123)\n                     at Wed Nov 12 2025 00:00:00 GMT+0800 (Singapore Standard Time)','2025-11-12',NULL,NULL,'2025-11-12 22:41:56'),(394,'Approve for Hold','Approved Hold for 123 (Client: 123)\n                  at Wed Nov 12 2025 00:00:00 GMT+0800 (Singapore Standard Time)','2025-11-12',NULL,NULL,'2025-11-12 22:43:00'),(395,'Request for Hold','Request Hold for 123 (Client: 123)\n                     at Wed Nov 12 2025 00:00:00 GMT+0800 (Singapore Standard Time)','2025-11-12',NULL,NULL,'2025-11-12 22:49:25'),(396,'Approve for Hold','Approved Hold for 123 (Client: 123)\n                  at Wed Nov 12 2025 00:00:00 GMT+0800 (Singapore Standard Time)','2025-11-12',NULL,NULL,'2025-11-12 22:49:36'),(397,'Request for Hold','Request Hold for 123 (Client: 123)\n                     at Wed Nov 12 2025 00:00:00 GMT+0800 (Singapore Standard Time)','2025-11-12',NULL,NULL,'2025-11-12 22:51:49'),(398,'Approve for Hold','Approved Hold for 123 (Client: 123)\n                  at Wed Nov 12 2025 00:00:00 GMT+0800 (Singapore Standard Time)','2025-11-12',NULL,NULL,'2025-11-12 22:52:13'),(399,'Request for Hold','Request Hold for 123 (Client: 123)\n                     at Wed Nov 12 2025 00:00:00 GMT+0800 (Singapore Standard Time)','2025-11-12',NULL,NULL,'2025-11-12 22:54:13'),(400,'Approve for Hold','Approved Hold for 123 (Client: 123)\n                  at Wed Nov 12 2025 00:00:00 GMT+0800 (Singapore Standard Time)','2025-11-12',NULL,NULL,'2025-11-12 22:55:02'),(401,'Request for Hold','Request Hold for 123 (Client: 123)\n                     at Wed Nov 12 2025 00:00:00 GMT+0800 (Singapore Standard Time)','2025-11-12',NULL,NULL,'2025-11-12 22:57:48'),(402,'Approve for Hold','Approved Hold for 123 (Client: 123)\n                  at Wed Nov 12 2025 00:00:00 GMT+0800 (Singapore Standard Time)','2025-11-12',NULL,NULL,'2025-11-12 22:57:57'),(403,'Request for Inspection','Inspection to be conducted for Lift-B-002 (Client: General Hospital)\n                     at 2025-11-12 for Template Setting','2025-11-13',NULL,NULL,'2025-11-13 00:01:31'),(404,'QAQC Assignment Updated','QAQC Inspection for Lift-B-002 is updated to Humphry Vincenzo','2025-11-13',NULL,NULL,'2025-11-13 00:02:11'),(405,'Request for Hold','Request Hold for 123 (Client: 123)\n                     at Thu Nov 13 2025 00:00:00 GMT+0800 (Singapore Standard Time)','2025-11-13',NULL,NULL,'2025-11-13 00:44:15'),(406,'Approve for Hold','Approved Hold for 123 (Client: 123)\n                  at Thu Nov 13 2025 00:00:00 GMT+0800 (Singapore Standard Time)','2025-11-13',NULL,NULL,'2025-11-13 00:44:32'),(407,'Approve for Hold','Approved Hold for 123 (Client: 123)\n                     at Thu Nov 13 2025 00:00:00 GMT+0800 (Singapore Standard Time)','2025-11-13',NULL,NULL,'2025-11-13 01:10:54'),(408,'Approve for Hold','Approved Hold for 123 (Client: 123)\n                     at Thu Nov 13 2025 00:00:00 GMT+0800 (Singapore Standard Time)','2025-11-13',NULL,NULL,'2025-11-13 01:18:18'),(409,'Approve for Hold','Approved Hold for 123 (Client: 123)\n                     at Thu Nov 13 2025 00:00:00 GMT+0800 (Singapore Standard Time)','2025-11-13',NULL,NULL,'2025-11-13 01:30:13'),(410,'Approve for Hold','Approved Hold for 123 (Client: 123)\n                     at Thu Nov 13 2025 00:00:00 GMT+0800 (Singapore Standard Time)','2025-11-13',NULL,NULL,'2025-11-13 01:31:58'),(411,'Approve for Hold','Approved Hold for 123 (Client: 123)\n                     at Thu Nov 13 2025 00:00:00 GMT+0800 (Singapore Standard Time)','2025-11-13',NULL,NULL,'2025-11-13 01:38:54'),(412,'Request for Hold','Request Hold for 123 (Client: 123)\n                     at Thu Nov 13 2025 00:00:00 GMT+0800 (Singapore Standard Time)','2025-11-13',NULL,NULL,'2025-11-13 02:13:15'),(413,'Approve for Hold','Approved Hold for 123 (Client: 123)\n                  at Thu Nov 13 2025 00:00:00 GMT+0800 (Singapore Standard Time)','2025-11-13',NULL,NULL,'2025-11-13 02:13:29'),(414,'Request for Hold','Request Hold for 123 (Client: 123)\n                     at Thu Nov 13 2025 00:00:00 GMT+0800 (Singapore Standard Time)','2025-11-13',NULL,NULL,'2025-11-13 02:25:32'),(415,'Approve for Hold','Approved Hold for 123 (Client: 123)\n                  at Thu Nov 13 2025 00:00:00 GMT+0800 (Singapore Standard Time)','2025-11-13',NULL,NULL,'2025-11-13 02:30:52'),(416,'Request for Hold','Request Hold for 123 (Client: 123)\n                     at Thu Nov 13 2025 00:00:00 GMT+0800 (Singapore Standard Time)','2025-11-13',NULL,NULL,'2025-11-13 16:28:33'),(417,'Approve for Hold','Approved Hold for 123 (Client: 123)\n                  at Thu Nov 13 2025 00:00:00 GMT+0800 (Singapore Standard Time)','2025-11-13',NULL,NULL,'2025-11-13 16:28:50'),(418,'Project Resume Request','Project 123 (Client: 123) requested to resume on 11/13/2025','2025-11-13',NULL,NULL,'2025-11-13 17:48:33'),(419,'Project Resume Approved','Your resume request for project 123 (Client: 123) has been approved. Project will resume on 11/13/2025. Please prepare accordingly.','2025-11-13',NULL,NULL,'2025-11-13 18:25:35'),(420,'Task Pending for completion','Unloading of elevator equipments pending for completion for 123 (Client: 123)','2025-11-13',NULL,NULL,'2025-11-13 18:44:07'),(421,'Task Pending for completion','Scaffolding Installation pending for completion for 123 (Client: 123)','2025-11-13',NULL,NULL,'2025-11-13 18:49:01'),(422,'Task Pending for completion','Hauling Works pending for completion for 123 (Client: 123)','2025-11-13',NULL,NULL,'2025-11-13 18:53:15'),(423,'Task Pending for completion','Template Setting pending for completion for 123 (Client: 123)','2025-11-13',NULL,NULL,'2025-11-13 19:00:10'),(424,'Task Pending for completion','Marking and Boring of Holes pending for completion for 123 (Client: 123)','2025-11-13',NULL,NULL,'2025-11-13 19:01:52'),(425,'Task Pending for completion','Rail Bracket Installation pending for completion for 123 (Client: 123)','2025-11-13',NULL,NULL,'2025-11-13 19:05:06'),(426,'Task Pending for completion','Main/Car pending for completion for 123 (Client: 123)','2025-11-13',NULL,NULL,'2025-11-13 19:06:49'),(427,'Task Pending for completion','Counterweight (CWT) pending for completion for 123 (Client: 123)','2025-11-13',NULL,NULL,'2025-11-13 19:07:27'),(428,'Task Pending for completion','Gauging pending for completion for 123 (Client: 123)','2025-11-13',NULL,NULL,'2025-11-13 19:09:42'),(429,'Task Pending for completion','Sills and Supports pending for completion for 123 (Client: 123)','2025-11-13',NULL,NULL,'2025-11-13 19:18:08'),(430,'Task Pending for completion','Jamb and Supports pending for completion for 123 (Client: 123)','2025-11-13',NULL,NULL,'2025-11-13 19:26:14'),(431,'Task Pending for completion','Frame and Doors pending for completion for 123 (Client: 123)','2025-11-13',NULL,NULL,'2025-11-13 19:28:17'),(432,'Task Pending for completion','Traction Machine pending for completion for 123 (Client: 123)','2025-11-13',NULL,NULL,'2025-11-13 19:30:22'),(433,'Task Pending for completion','Support Beams pending for completion for 123 (Client: 123)','2025-11-13',NULL,NULL,'2025-11-13 19:32:48'),(434,'Task Pending for completion','Governor pending for completion for 123 (Client: 123)','2025-11-13',NULL,NULL,'2025-11-13 19:33:06'),(435,'Task Pending for completion','Installation of Control Panel pending for completion for 123 (Client: 123)','2025-11-13',NULL,NULL,'2025-11-13 19:33:49'),(436,'Task Pending for completion','All Accessories pending for completion for 123 (Client: 123)','2025-11-13',NULL,NULL,'2025-11-13 19:34:42'),(437,'Task Pending for completion','Car Piping/Wiring pending for completion for 123 (Client: 123)','2025-11-13',NULL,NULL,'2025-11-13 19:38:53'),(438,'Task Pending for completion','Travelling Cable Layout pending for completion for 123 (Client: 123)','2025-11-13',NULL,NULL,'2025-11-13 19:39:38'),(439,'Task Pending for completion','Counterweight Assembly pending for completion for 123 (Client: 123)','2025-11-13',NULL,NULL,'2025-11-13 19:40:05'),(440,'Task Pending for completion','Hoisting pending for completion for 123 (Client: 123)','2025-11-13',NULL,NULL,'2025-11-13 19:40:54'),(441,'Task Pending for completion','Governor pending for completion for 123 (Client: 123)','2025-11-13',NULL,NULL,'2025-11-13 19:41:13'),(442,'Request for Inspection','Inspection to be conducted for 123 (Client: 123)\n                     at 2025-11-13 for Template Setting','2025-11-13',NULL,NULL,'2025-11-13 20:09:47'),(443,'QAQC Assignment Updated','QAQC Inspection for 123 is updated to Humphry Vincenzo','2025-11-13',NULL,NULL,'2025-11-13 20:10:23'),(444,'Task Pending for completion','Compensating pending for completion for 123 (Client: 123)','2025-11-13',NULL,NULL,'2025-11-13 20:15:05'),(445,'Task Pending for completion','Compensating pending for completion for 123 (Client: 123)','2025-11-13',NULL,NULL,'2025-11-13 20:18:50'),(446,'Project Hold Request','Project Warehouse Freight Lift (Client: Apex Logistics Corp.) has requested to be put on hold.\n\nReason: Billings are not settled\n\nThis will involve demobilizing manpower and resources from the site. Please review and approve the hold request.','2025-11-13',NULL,NULL,'2025-11-13 21:16:48'),(447,'Hold Request Approved','Your hold request for Warehouse Freight Lift (Client: Apex Logistics Corp.) has been approved.\n\nProject is now on hold and resources will be demobilized. You can request to resume when ready.','2025-11-13',NULL,NULL,'2025-11-13 21:28:33'),(448,'Project Resume Request','Project Warehouse Freight Lift (Client: Apex Logistics Corp.) requested to resume on 11/13/2025. Please review and approve the resume date.','2025-11-13',NULL,NULL,'2025-11-13 21:28:51'),(449,'Project Resume Approved','Your resume request for project Warehouse Freight Lift (Client: Apex Logistics Corp.) has been approved. Project will resume on 11/13/2025. Please prepare accordingly.','2025-11-13',NULL,NULL,'2025-11-13 21:29:06'),(450,'Request for Inspection','Inspection to be conducted for Apex Lift 310 (Client: Vandelay Industries)\n                     at 2025-11-13','2025-11-13',NULL,NULL,'2025-11-13 23:18:03'),(451,'Assigned for TNC Inspection','TNC Inspection for Apex Lift 310 is assigned to Roos Nelle from 11/13/2025 to 11/27/2025','2025-11-13',NULL,NULL,'2025-11-13 23:24:05'),(452,'Task Pending for completion','Support Beams pending for completion for Lift-D-004 (Client: Logistics Inc)','2025-11-14',NULL,NULL,'2025-11-14 00:02:35'),(453,'Task Pending for completion','Frame and Doors pending for completion for Lift-B-002 (Client: General Hospital)','2025-11-14',NULL,NULL,'2025-11-14 00:05:42'),(454,'Project Hold Request','Project Apex Lift 310 (Client: Vandelay Industries) has requested to be put on hold.\n\nReason: zz\n\nThis will involve demobilizing manpower and resources from the site. Please review and approve the hold request.','2025-11-14',NULL,NULL,'2025-11-14 00:08:39'),(455,'Hold Request Approved','Your hold request for Apex Lift 310 (Client: Vandelay Industries) has been approved.\n\nProject is now on hold and resources will be demobilized. You can request to resume when ready.','2025-11-14',NULL,NULL,'2025-11-14 00:08:58'),(456,'Project Resume Request','Project Apex Lift 310 (Client: Vandelay Industries) requested to resume on 11/15/2025. Please review and approve the resume date.','2025-11-14',NULL,NULL,'2025-11-14 00:09:21'),(457,'Project Resume Approved','Your resume request for project Apex Lift 310 (Client: Vandelay Industries) has been approved. Project will resume on 11/15/2025. Please prepare accordingly.','2025-11-14',NULL,NULL,'2025-11-14 00:10:03');
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification_recipients`
--

DROP TABLE IF EXISTS `notification_recipients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification_recipients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `notification_id` int DEFAULT NULL,
  `employee_id` int DEFAULT NULL,
  `has_read` tinyint DEFAULT (0),
  `mark_read` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `employee_id` (`employee_id`),
  KEY `notification_recipients_ibfk_1` (`notification_id`),
  CONSTRAINT `notification_recipients_ibfk_1` FOREIGN KEY (`notification_id`) REFERENCES `notification` (`notification_id`) ON DELETE CASCADE,
  CONSTRAINT `notification_recipients_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1041 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification_recipients`
--

LOCK TABLES `notification_recipients` WRITE;
/*!40000 ALTER TABLE `notification_recipients` DISABLE KEYS */;
INSERT INTO `notification_recipients` VALUES (600,184,3,0,0),(601,185,10,0,0),(602,185,14,0,0),(603,185,3,0,0),(604,185,19,0,0),(605,185,21,0,0),(606,186,10,0,0),(607,186,11,0,0),(608,186,38,0,0),(609,186,41,0,0),(610,186,3,0,0),(611,187,10,0,0),(612,187,21,0,0),(613,187,3,0,0),(614,187,41,0,0),(615,187,14,0,0),(616,188,95,0,0),(617,188,2,0,0),(618,189,91,0,0),(619,189,2,0,0),(620,189,3,0,0),(621,190,4,0,0),(622,191,5,0,0),(623,192,13,0,0),(624,192,16,0,0),(625,192,5,0,0),(626,192,21,0,0),(627,193,6,0,0),(628,194,37,0,0),(629,194,20,0,0),(630,194,17,0,0),(631,194,6,0,0),(632,195,95,0,0),(633,195,2,0,0),(634,196,91,0,0),(635,196,2,0,0),(636,196,6,0,0),(637,197,95,0,0),(638,197,2,0,0),(639,198,91,0,0),(640,198,6,0,0),(641,198,2,0,0),(642,199,6,0,0),(643,200,7,0,0),(644,201,9,0,0),(645,202,96,0,0),(646,202,2,0,0),(647,203,2,0,0),(648,203,95,0,0),(649,204,91,0,0),(650,204,6,0,0),(651,204,2,0,0),(652,205,86,0,0),(653,205,2,0,0),(654,205,6,0,0),(655,206,2,0,0),(656,206,96,0,0),(657,207,2,0,0),(658,207,6,0,0),(659,207,80,0,0),(660,208,95,0,0),(661,208,2,0,0),(662,209,96,0,0),(663,209,2,0,0),(664,210,96,0,0),(665,210,2,0,0),(666,211,2,0,0),(667,211,9,0,0),(668,211,83,0,0),(669,212,86,0,0),(670,212,2,0,0),(671,212,9,0,0),(672,213,91,0,0),(673,213,2,0,0),(674,213,9,0,0),(675,214,9,0,0),(676,215,2,0,0),(677,215,96,0,0),(678,219,83,0,0),(679,219,82,0,0),(680,220,2,0,0),(681,221,3,0,0),(682,222,3,0,0),(683,223,95,0,0),(684,223,2,0,0),(685,224,95,0,0),(686,224,2,0,0),(687,225,91,0,0),(688,225,2,0,0),(689,225,3,0,0),(690,226,3,0,0),(691,227,3,0,0),(692,228,3,0,0),(693,229,3,0,0),(694,230,95,0,0),(695,230,2,0,0),(696,231,96,0,0),(697,231,2,0,0),(698,232,96,0,0),(699,232,2,0,0),(700,233,91,0,0),(701,233,3,0,0),(702,233,2,0,0),(703,234,95,0,0),(704,234,2,0,0),(705,235,96,0,0),(706,235,2,0,0),(707,236,96,0,0),(708,236,2,0,0),(709,237,91,0,0),(710,237,2,0,0),(711,237,3,0,0),(712,238,2,0,0),(713,238,3,0,0),(714,238,79,0,0),(715,239,86,0,0),(716,239,2,0,0),(717,239,3,0,0),(718,240,77,0,0),(719,240,2,0,0),(720,241,79,0,0),(721,242,79,0,0),(722,243,79,0,0),(723,244,83,0,0),(724,244,79,0,0),(725,245,3,0,0),(726,246,4,0,0),(727,247,7,0,0),(728,248,10,0,0),(729,248,20,0,0),(730,248,15,0,0),(731,248,7,0,0),(732,249,9,0,0),(733,250,55,0,0),(734,250,57,0,0),(735,250,9,0,0),(736,250,19,0,0),(737,251,7,0,0),(738,252,37,0,0),(739,252,11,0,0),(740,252,14,0,0),(741,252,7,0,0),(742,252,38,0,0),(743,253,95,0,0),(744,253,2,0,0),(745,254,91,0,0),(746,254,2,0,0),(747,254,NULL,0,0),(748,255,7,0,0),(749,256,7,0,0),(750,257,95,0,0),(751,257,2,0,0),(752,258,96,0,0),(753,258,2,0,0),(754,259,2,0,0),(755,259,9,0,0),(756,259,79,0,0),(757,260,96,0,0),(758,260,2,0,0),(759,261,86,0,0),(760,261,2,0,0),(761,261,9,0,0),(762,262,91,0,0),(763,262,2,0,0),(764,262,9,0,0),(765,263,77,0,0),(766,263,2,0,0),(767,264,79,0,0),(768,264,83,0,0),(769,265,2,0,0),(770,266,2,0,0),(771,267,2,0,0),(772,268,5,0,0),(773,269,7,0,0),(774,270,2,0,0),(775,271,2,0,0),(776,272,7,0,0),(777,273,2,0,0),(778,274,7,0,0),(779,275,96,0,0),(780,275,2,0,0),(781,276,86,0,0),(782,276,2,0,0),(783,276,7,0,0),(784,277,95,0,0),(785,277,2,0,0),(786,278,5,0,0),(787,279,66,0,0),(788,279,5,0,0),(789,279,56,0,0),(790,279,16,0,0),(791,279,65,0,0),(792,280,5,0,0),(793,281,5,0,0),(794,282,5,0,0),(795,283,5,0,0),(796,284,5,0,0),(797,285,5,0,0),(798,286,5,0,0),(799,287,5,0,0),(800,288,5,0,0),(801,289,95,0,0),(802,289,2,0,0),(803,290,5,0,0),(804,291,5,0,0),(805,292,5,0,0),(806,293,93,0,0),(807,293,7,0,0),(808,293,2,0,0),(809,294,5,0,0),(810,294,91,0,0),(811,294,2,0,0),(812,295,95,0,0),(813,295,2,0,0),(814,296,5,0,0),(815,297,3,0,0),(816,298,6,0,0),(817,299,9,0,0),(818,300,6,0,0),(819,301,7,0,0),(820,302,2,0,0),(821,302,95,0,0),(822,303,91,0,0),(823,303,2,0,0),(824,303,7,0,0),(825,304,95,0,0),(826,304,2,0,0),(827,305,91,0,0),(828,305,2,0,0),(829,305,7,0,0),(830,306,3,0,0),(831,307,3,0,0),(832,307,49,0,0),(833,307,10,0,0),(834,307,103,0,0),(835,308,95,0,0),(836,308,2,0,0),(837,309,5,0,0),(838,309,91,0,0),(839,309,2,0,0),(840,310,5,0,0),(841,311,5,0,0),(842,312,5,0,0),(843,313,5,0,0),(844,314,96,0,0),(845,314,2,0,0),(846,315,88,0,0),(847,315,2,0,0),(848,315,5,0,0),(849,316,96,0,0),(850,316,2,0,0),(851,317,96,0,0),(852,317,2,0,0),(853,318,96,0,0),(854,318,2,0,0),(855,319,2,0,0),(856,319,5,0,0),(857,319,88,0,0),(858,320,95,0,0),(859,320,2,0,0),(860,321,2,0,0),(861,321,95,0,0),(862,322,95,0,0),(863,322,2,0,0),(864,323,91,0,0),(865,323,2,0,0),(866,323,7,0,0),(867,324,96,0,0),(868,324,2,0,0),(869,325,7,0,0),(870,325,2,0,0),(871,325,79,0,0),(872,326,77,0,0),(873,326,2,0,0),(874,327,79,0,0),(875,327,80,0,0),(876,328,5,0,0),(877,329,7,0,0),(878,330,4,0,0),(879,331,9,0,0),(880,332,95,0,0),(881,332,2,0,0),(882,333,91,0,0),(883,333,2,0,0),(884,333,9,0,0),(885,334,95,0,0),(886,334,2,0,0),(887,335,91,0,0),(888,335,2,0,0),(889,335,9,0,0),(890,336,2,0,0),(891,336,95,0,0),(892,337,91,0,0),(893,337,9,0,0),(894,337,2,0,0),(895,338,2,0,0),(896,338,95,0,0),(897,339,91,0,0),(898,339,2,0,0),(899,339,9,0,0),(900,340,81,0,0),(901,341,9,0,0),(902,342,2,0,0),(903,343,9,0,0),(904,344,2,0,0),(905,345,9,0,0),(906,346,2,0,0),(907,347,9,0,0),(908,348,96,0,0),(909,348,2,0,0),(910,349,87,0,0),(911,349,2,0,0),(912,349,9,0,0),(913,350,79,0,0),(914,351,80,0,0),(915,352,6,0,0),(916,353,6,0,0),(917,354,6,0,0),(918,355,4,0,0),(919,356,96,0,0),(920,356,2,0,0),(921,357,86,0,0),(922,357,NULL,0,0),(923,357,2,0,0),(924,358,8,0,0),(925,359,8,0,0),(926,360,4,0,0),(927,361,7,0,0),(928,362,96,0,0),(929,362,2,0,0),(930,363,2,0,0),(931,363,7,0,0),(932,363,79,0,0),(933,364,81,0,0),(934,365,79,0,0),(935,365,80,0,0),(936,366,81,0,0),(937,366,80,0,0),(938,367,81,0,0),(939,367,82,0,0),(940,368,79,0,0),(941,368,82,0,0),(942,369,79,0,0),(943,370,79,0,0),(944,370,82,0,0),(945,371,80,0,0),(946,372,83,0,0),(947,373,83,0,0),(948,374,83,0,0),(949,375,6,0,0),(950,376,6,0,0),(951,377,6,0,0),(952,378,6,0,0),(953,379,6,0,0),(954,380,6,0,0),(955,381,6,0,0),(956,382,6,0,0),(957,383,6,0,0),(958,384,6,0,0),(959,385,6,0,0),(960,386,6,0,0),(961,387,2,0,0),(962,388,9,0,0),(963,389,2,0,0),(964,390,9,0,0),(965,391,2,0,0),(966,392,9,0,0),(967,393,2,0,0),(968,394,9,0,0),(969,395,2,0,0),(970,396,9,0,0),(971,397,2,0,0),(972,398,9,0,0),(973,399,2,0,0),(974,400,9,0,0),(975,401,2,0,0),(976,402,9,0,0),(977,403,95,0,0),(978,403,2,0,0),(979,404,2,0,0),(980,404,91,0,0),(981,404,8,0,0),(982,405,2,0,0),(983,406,9,0,0),(984,407,9,0,0),(985,408,9,0,0),(986,409,9,0,0),(987,410,9,0,0),(988,411,9,0,0),(989,412,2,0,0),(990,413,9,0,0),(991,414,2,0,0),(992,415,9,0,0),(993,416,2,0,0),(994,417,9,0,0),(995,418,2,0,0),(996,419,9,0,0),(997,420,9,0,0),(998,421,9,0,0),(999,422,9,0,0),(1000,423,9,0,0),(1001,424,9,0,0),(1002,425,9,0,0),(1003,426,9,0,0),(1004,427,9,0,0),(1005,428,9,0,0),(1006,429,9,0,0),(1007,430,9,0,0),(1008,431,9,0,0),(1009,432,9,0,0),(1010,433,9,0,0),(1011,434,9,0,0),(1012,435,9,0,0),(1013,436,9,0,0),(1014,437,9,0,0),(1015,438,9,0,0),(1016,439,9,0,0),(1017,440,9,0,0),(1018,441,9,0,0),(1019,442,2,0,0),(1020,442,95,0,0),(1021,443,91,0,0),(1022,443,2,0,0),(1023,443,9,0,0),(1024,444,9,0,0),(1025,445,9,0,0),(1026,446,2,0,0),(1027,447,3,0,0),(1028,448,2,0,0),(1029,449,3,0,0),(1030,450,96,0,0),(1031,450,2,0,0),(1032,451,89,0,0),(1033,451,3,0,0),(1034,451,2,0,0),(1035,452,6,0,0),(1036,453,8,0,0),(1037,454,2,0,0),(1038,455,3,0,0),(1039,456,2,0,0),(1040,457,3,0,0);
/*!40000 ALTER TABLE `notification_recipients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pms_files`
--

DROP TABLE IF EXISTS `pms_files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pms_files` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pms_id` int DEFAULT NULL,
  `file` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_url` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pms_id` (`pms_id`),
  CONSTRAINT `pms_files_ibfk_1` FOREIGN KEY (`pms_id`) REFERENCES `pms_projects` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pms_files`
--

LOCK TABLES `pms_files` WRITE;
/*!40000 ALTER TABLE `pms_files` DISABLE KEYS */;
/*!40000 ALTER TABLE `pms_files` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pms_history`
--

DROP TABLE IF EXISTS `pms_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pms_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pms_id` int DEFAULT NULL,
  `report_details` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `date_conducted` date DEFAULT (curdate()),
  `inspection_done` tinyint DEFAULT (0),
  `contract_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pms_history_ibfk_1` (`pms_id`),
  KEY `contract_id` (`contract_id`),
  CONSTRAINT `pms_history_ibfk_1` FOREIGN KEY (`pms_id`) REFERENCES `pms_projects` (`id`),
  CONSTRAINT `pms_history_ibfk_2` FOREIGN KEY (`contract_id`) REFERENCES `contracts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pms_history`
--

LOCK TABLES `pms_history` WRITE;
/*!40000 ALTER TABLE `pms_history` DISABLE KEYS */;
INSERT INTO `pms_history` VALUES (1,47,NULL,'2025-11-01',1,4),(2,47,NULL,'2025-11-02',1,4),(3,45,NULL,'2025-11-02',1,3),(4,1,NULL,'2025-11-03',1,2),(5,1,NULL,'2025-11-03',1,2),(6,1,NULL,'2025-11-03',1,2),(7,267,NULL,'2025-11-03',1,6),(8,266,NULL,'2025-11-06',1,5),(9,267,NULL,'2025-11-08',1,6);
/*!40000 ALTER TABLE `pms_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pms_inspection_documents`
--

DROP TABLE IF EXISTS `pms_inspection_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pms_inspection_documents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `contract_id` int DEFAULT NULL,
  `inspection_document_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `doc_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `inspection_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pms_inspection_documents_ibfk_1` (`contract_id`),
  KEY `pms_inspection_documents_ibfk_2` (`inspection_id`),
  CONSTRAINT `pms_inspection_documents_ibfk_1` FOREIGN KEY (`contract_id`) REFERENCES `contracts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `pms_inspection_documents_ibfk_2` FOREIGN KEY (`inspection_id`) REFERENCES `pms_history` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pms_inspection_documents`
--

LOCK TABLES `pms_inspection_documents` WRITE;
/*!40000 ALTER TABLE `pms_inspection_documents` DISABLE KEYS */;
INSERT INTO `pms_inspection_documents` VALUES (1,3,'service_report_Construction-Site-Handover-Letter-Template-edit-online.png','/uploads/1761999763857-service_report_Construction-Site-Handover-Letter-Template-edit-online.png',1),(2,3,'service_report_77e48e83af3f9881dc84e8d9d9cee061.jpg','/uploads/1761999763871-service_report_77e48e83af3f9881dc84e8d9d9cee061.jpg',1),(3,3,'service_report_mqdefault.jpg','/uploads/1761999852533-service_report_mqdefault.jpg',1),(4,3,'service_report_Construction-Site-Handover-Letter-Template-edit-online.png','/uploads/1762005805530-service_report_Construction-Site-Handover-Letter-Template-edit-online.png',1),(5,3,'service_report_Construction-Site-Handover-Letter-Template-edit-online.png','/uploads/1762005902625-service_report_Construction-Site-Handover-Letter-Template-edit-online.png',1),(6,3,'service_report_Construction-Site-Handover-Letter-Template-edit-online.png','/uploads/1762006227819-service_report_Construction-Site-Handover-Letter-Template-edit-online.png',1),(7,3,'service_report_Construction-Site-Handover-Letter-Template-edit-online.png','/uploads/1762088847116-service_report_Construction-Site-Handover-Letter-Template-edit-online.png',2),(8,2,'service_report_77e48e83af3f9881dc84e8d9d9cee061.jpg','/uploads/1762089315683-service_report_77e48e83af3f9881dc84e8d9d9cee061.jpg',3),(9,4,'service_report_mqdefault.jpg','/uploads/1762147808898-service_report_mqdefault.jpg',4),(10,4,'service_report_mqdefault.jpg','/uploads/1762148563265-service_report_mqdefault.jpg',5),(11,4,'service_report_mqdefault.jpg','/uploads/1762148748981-service_report_mqdefault.jpg',6),(12,5,'service_report_2019-03-12-Example-Template-Project-Project-Handover-Checklist-1-page-001.jpg','/uploads/1762155824437-service_report_2019-03-12-Example-Template-Project-Project-Handover-Checklist-1-page-001.jpg',7),(13,6,'service_report_IC-Project-Handover-Plan-Template.png','/uploads/1762438091062-service_report_IC-Project-Handover-Plan-Template.png',8),(14,5,'service_report_2019-03-12-Example-Template-Project-Project-Handover-Checklist-1-page-001.jpg','/uploads/1762608427253-service_report_2019-03-12-Example-Template-Project-Project-Handover-Checklist-1-page-001.jpg',9);
/*!40000 ALTER TABLE `pms_inspection_documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pms_inspection_photos`
--

DROP TABLE IF EXISTS `pms_inspection_photos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pms_inspection_photos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `contract_id` int DEFAULT NULL,
  `inspection_id` int DEFAULT NULL,
  `doc_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `contract_id` (`contract_id`),
  KEY `inspection_id` (`inspection_id`),
  CONSTRAINT `pms_inspection_photos_ibfk_1` FOREIGN KEY (`contract_id`) REFERENCES `contracts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `pms_inspection_photos_ibfk_2` FOREIGN KEY (`inspection_id`) REFERENCES `pms_history` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pms_inspection_photos`
--

LOCK TABLES `pms_inspection_photos` WRITE;
/*!40000 ALTER TABLE `pms_inspection_photos` DISABLE KEYS */;
INSERT INTO `pms_inspection_photos` VALUES (1,3,1,'/uploads/1761999852536-evidence_Construction-Site-Handover-Letter-Template-edit-online.png'),(2,3,1,'/uploads/1762006227849-evidence_77e48e83af3f9881dc84e8d9d9cee061.jpg'),(3,3,2,'/uploads/1762088847155-evidence_77e48e83af3f9881dc84e8d9d9cee061.jpg'),(4,2,3,'/uploads/1762089315683-evidence_77e48e83af3f9881dc84e8d9d9cee061.jpg');
/*!40000 ALTER TABLE `pms_inspection_photos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pms_inspection_team`
--

DROP TABLE IF EXISTS `pms_inspection_team`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pms_inspection_team` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pms_id` int DEFAULT NULL,
  `pms_technician_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pms_id` (`pms_id`),
  KEY `pms_technician_id` (`pms_technician_id`),
  CONSTRAINT `pms_inspection_team_ibfk_1` FOREIGN KEY (`pms_id`) REFERENCES `pms_projects` (`id`),
  CONSTRAINT `pms_inspection_team_ibfk_2` FOREIGN KEY (`pms_technician_id`) REFERENCES `employees` (`employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pms_inspection_team`
--

LOCK TABLES `pms_inspection_team` WRITE;
/*!40000 ALTER TABLE `pms_inspection_team` DISABLE KEYS */;
INSERT INTO `pms_inspection_team` VALUES (72,45,79),(73,47,79),(74,47,82),(75,266,80);
/*!40000 ALTER TABLE `pms_inspection_team` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pms_projects`
--

DROP TABLE IF EXISTS `pms_projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pms_projects` (
  `id` int NOT NULL,
  `handover_date` date DEFAULT (curdate()),
  `free_pms` tinyint DEFAULT (1),
  `free_pms_end` date DEFAULT NULL,
  `pms_inspection_date` date DEFAULT NULL,
  `inspection_pending` tinyint DEFAULT (0),
  `inspection_assigned` tinyint DEFAULT (0),
  `inspection_ongoing` tinyint DEFAULT (0),
  `inspection_id` int DEFAULT NULL,
  `contract_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT (_utf8mb4'Monthly'),
  `last_inspection_date` date DEFAULT NULL,
  `callback_date` date DEFAULT NULL,
  `callback_id` int DEFAULT NULL,
  `callback_ongoing` tinyint DEFAULT (0),
  `approve_proposal` tinyint DEFAULT (0),
  PRIMARY KEY (`id`),
  CONSTRAINT `pms_projects_ibfk_1` FOREIGN KEY (`id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pms_projects`
--

LOCK TABLES `pms_projects` WRITE;
/*!40000 ALTER TABLE `pms_projects` DISABLE KEYS */;
INSERT INTO `pms_projects` VALUES (1,'2025-11-03',1,'2026-11-03','2026-02-03',1,0,0,6,'Quarterly','2025-11-03',NULL,NULL,0,0),(45,'2025-10-31',1,'2026-10-31','2025-12-04',1,1,0,NULL,'Monthly','2025-11-02',NULL,NULL,0,1),(47,'2025-11-01',1,'2026-11-01','2025-12-05',1,1,0,NULL,'Monthly','2025-11-02',NULL,NULL,0,0),(266,'2025-11-06',1,'2026-11-06','2025-12-07',1,1,0,NULL,'Monthly','2025-11-06',NULL,NULL,0,1),(267,'2025-11-03',1,'2026-11-03','2025-12-08',1,0,0,9,'Monthly','2025-11-08','2025-11-12',NULL,0,0),(343,'2025-11-09',1,'2026-11-09','2025-12-09',1,0,0,NULL,'Monthly',NULL,NULL,NULL,0,0);
/*!40000 ALTER TABLE `pms_projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pms_technician_inspection_history`
--

DROP TABLE IF EXISTS `pms_technician_inspection_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pms_technician_inspection_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `technician_id` int DEFAULT NULL,
  `inspection_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `technician_id` (`technician_id`),
  KEY `inspection_id` (`inspection_id`),
  CONSTRAINT `pms_technician_inspection_history_ibfk_1` FOREIGN KEY (`technician_id`) REFERENCES `employees` (`employee_id`),
  CONSTRAINT `pms_technician_inspection_history_ibfk_2` FOREIGN KEY (`inspection_id`) REFERENCES `pms_history` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pms_technician_inspection_history`
--

LOCK TABLES `pms_technician_inspection_history` WRITE;
/*!40000 ALTER TABLE `pms_technician_inspection_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `pms_technician_inspection_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `preinspection_checklist`
--

DROP TABLE IF EXISTS `preinspection_checklist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preinspection_checklist` (
  `project_id` int NOT NULL,
  `items_json` json DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`project_id`),
  CONSTRAINT `fk_preinspection_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `preinspection_checklist`
--

LOCK TABLES `preinspection_checklist` WRITE;
/*!40000 ALTER TABLE `preinspection_checklist` DISABLE KEYS */;
/*!40000 ALTER TABLE `preinspection_checklist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `product_id` int DEFAULT NULL,
  `product_name` varchar(25) DEFAULT NULL,
  `price` decimal(4,2) NOT NULL DEFAULT '0.00',
  UNIQUE KEY `product_name` (`product_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (100,'hamburger',3.99),(101,'fires',1.89),(102,'soda',1.00),(103,'ice cream',1.49),(104,'straw',0.00),(105,'napkin',0.00),(106,'fork',0.00),(107,'spoon',0.00);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_1_accomplishment`
--

DROP TABLE IF EXISTS `project_1_accomplishment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_1_accomplishment` (
  `item_id` int NOT NULL AUTO_INCREMENT,
  `section_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_code` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `unit` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `wt` decimal(5,2) DEFAULT '0.00',
  `pres_acc` decimal(5,2) DEFAULT '0.00',
  `prev_acc` decimal(5,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`item_id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_1_accomplishment`
--

LOCK TABLES `project_1_accomplishment` WRITE;
/*!40000 ALTER TABLE `project_1_accomplishment` DISABLE KEYS */;
INSERT INTO `project_1_accomplishment` VALUES (1,'General','1','Site Delivery','1 Lot',0.00,100.00,0.00,'2025-10-03 12:34:39'),(2,'General','2','Scaffolding','1 Lot',7.00,100.00,0.00,'2025-10-03 12:34:39'),(3,'General','3','Hauling Waste','1 Lot',7.00,100.00,0.00,'2025-10-03 12:34:39'),(4,'General','4','Templates','1 Lot',7.00,100.00,0.00,'2025-10-03 12:34:39'),(5,'General','5','Marking Pipes','1 Lot',0.00,100.00,0.00,'2025-10-03 12:34:39'),(6,'General','6','Rail Bracing','1 Lot',7.00,100.00,0.00,'2025-10-03 12:34:39'),(7,'Guide Rail','A','Main/Outrigger','1 Lot',5.00,100.00,0.00,'2025-10-03 12:34:39'),(8,'Guide Rail','B','Counter Weight','1 Lot',3.00,100.00,0.00,'2025-10-03 12:34:39'),(9,'Guide Rail','C','Gauging','1 Lot',3.00,100.00,0.00,'2025-10-03 12:34:39'),(10,'8 Landing Door Assembly','A','Sills and','1 Lot',2.00,100.00,0.00,'2025-10-03 12:34:39'),(11,'8 Landing Door Assembly','B','Jamb and','1 Lot',2.00,100.00,0.00,'2025-10-03 12:34:39'),(12,'8 Landing Door Assembly','C','Frame','1 Lot',3.00,100.00,0.00,'2025-10-03 12:34:39'),(13,'9 M/R Equipment Setting','A','Traction','1 Lot',5.00,100.00,0.00,'2025-10-03 12:34:39'),(14,'9 M/R Equipment Setting','B','Support','1 Lot',5.00,100.00,0.00,'2025-10-03 12:34:39'),(15,'9 M/R Equipment Setting','C','Governor','1 Lot',2.00,100.00,0.00,'2025-10-03 12:34:39'),(16,'9 M/R Equipment Setting','D','Control','1 Lot',3.00,100.00,0.00,'2025-10-03 12:34:39'),(17,'11 Car Assembly','A','All Accessories','1 Lot',3.00,100.00,0.00,'2025-10-03 12:34:39'),(18,'11 Car Assembly','B','Car Piping','1 Lot',3.00,100.00,0.00,'2025-10-03 12:34:39'),(19,'12 Travelling','A','Counterweight','1 Lot',2.00,100.00,0.00,'2025-10-03 12:34:39'),(20,'13 Counterweight','A','Item','1 Lot',2.00,100.00,0.00,'2025-10-03 12:34:39'),(21,'14 Laying Out of Ropes','A','Hoisting','1 Lot',2.00,100.00,0.00,'2025-10-03 12:34:39'),(22,'14 Laying Out of Ropes','B','Governor','1 Lot',3.00,100.00,0.00,'2025-10-03 12:34:39'),(23,'14 Laying Out of Ropes','C','Compensation','1 Lot',3.00,100.00,0.00,'2025-10-03 12:34:39'),(24,'15 Wiring','A','Machine','1 Lot',5.00,100.00,0.00,'2025-10-03 12:34:39'),(25,'15 Wiring','B','Hoistway','1 Lot',3.00,100.00,0.00,'2025-10-03 12:34:39'),(26,'16 Pit Access','A','Item','1 Lot',3.00,100.00,0.00,'2025-10-03 12:34:39'),(27,'17 Testing and Adjustment','A','Initial','1 Lot',3.00,100.00,0.00,'2025-10-03 12:34:39'),(28,'17 Testing and Adjustment','B','Slow Speed','1 Lot',1.00,100.00,0.00,'2025-10-03 12:34:39'),(29,'17 Testing and Adjustment','C','High Speed','1 Lot',2.00,100.00,0.00,'2025-10-03 12:34:39'),(30,'17 Testing and Adjustment','D','Loading','1 Lot',1.00,100.00,0.00,'2025-10-03 12:34:39'),(31,'17 Testing and Adjustment','E','Final Adjust','1 Lot',1.00,0.00,0.00,'2025-10-03 12:34:39'),(32,'18 Correction','A','Item','1 Lot',1.00,0.00,0.00,'2025-10-03 12:35:22'),(33,'19 Final Cleaning','A','Item','1 Lot',1.00,0.00,0.00,'2025-10-03 12:35:22');
/*!40000 ALTER TABLE `project_1_accomplishment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_1_schedule`
--

DROP TABLE IF EXISTS `project_1_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_1_schedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `task_id` int DEFAULT NULL,
  `task_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_start` date DEFAULT NULL,
  `task_end` date DEFAULT NULL,
  `task_duration` int DEFAULT NULL,
  `task_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_parent` int DEFAULT NULL,
  `task_approval` tinyint(1) DEFAULT '0',
  `task_done` tinyint(1) DEFAULT '0',
  `task_percent` int DEFAULT '0',
  `task_actual_current` tinyint DEFAULT '0',
  `section_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_code` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unit` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wt` decimal(5,2) DEFAULT '0.00',
  `pres_acc` decimal(5,2) DEFAULT '0.00',
  `prev_acc` decimal(5,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_1_schedule`
--

LOCK TABLES `project_1_schedule` WRITE;
/*!40000 ALTER TABLE `project_1_schedule` DISABLE KEYS */;
INSERT INTO `project_1_schedule` VALUES (1,104,'Submission of PO to Factory','2025-05-06','2025-05-07',1,'task',100,0,1,0,0,NULL,NULL,'Submission of PO to Factory','1',0.00,100.00,0.00,'2025-11-03 04:19:46'),(2,101,'Pre-Inspection(Checkin of Shaft)','2025-04-20','2025-04-27',6,'task',100,0,1,0,0,NULL,NULL,'Pre-Inspection(Checkin of Shaft)','1',0.00,100.00,0.00,'2025-11-03 04:19:46'),(3,300,'Manufacturing and Importation Process (Passenger Elevator)','2025-05-07','2025-08-03',75,'summary',NULL,0,1,0,0,NULL,NULL,'Manufacturing and Importation Process (Passenger Elevator)','1',0.00,100.00,0.00,'2025-11-03 04:19:46'),(4,102,'Layout of Drawing','2025-04-27','2025-04-30',3,'task',100,0,1,0,0,NULL,NULL,'Layout of Drawing','1',0.00,100.00,0.00,'2025-11-03 04:19:46'),(5,400,'Planning For Mobilization And Execution','2025-08-03','2025-08-26',20,'summary',NULL,0,1,0,0,NULL,NULL,'Planning For Mobilization And Execution','1',0.00,100.00,0.00,'2025-11-03 04:19:46'),(6,103,'Submission of Drawing and Finishes for Approval','2025-04-30','2025-05-06',5,'task',100,0,1,0,0,NULL,NULL,'Submission of Drawing and Finishes for Approval','1',0.00,100.00,0.00,'2025-11-03 04:19:46'),(7,301,'Manufacturing and Importation','2025-05-07','2025-08-03',75,'task',300,0,1,0,0,NULL,NULL,'Manufacturing and Importation','1',0.00,100.00,0.00,'2025-11-03 04:19:46'),(8,201,'Shaft Construction','2025-05-07','2025-08-03',75,'task',200,0,1,0,0,NULL,NULL,'Shaft Construction','1',0.00,100.00,0.00,'2025-11-03 04:19:46'),(9,200,'Structural/Civil Works','2025-05-07','2025-08-03',75,'summary',NULL,0,1,0,0,NULL,NULL,'Structural/Civil Works','1',0.00,100.00,0.00,'2025-11-03 04:19:46'),(10,100,'Preliminaries','2025-04-20','2025-05-07',15,'summary',NULL,0,1,0,0,NULL,NULL,'Preliminaries','1',0.00,100.00,0.00,'2025-11-03 04:19:46'),(11,401,'Preparation of tools and materials for elevator installation','2025-08-03','2025-08-19',14,'task',400,0,1,0,0,NULL,NULL,'Preparation of tools and materials for elevator installation','1',0.00,100.00,0.00,'2025-11-03 04:19:47'),(12,402,'Layout of boardup markings','2025-08-19','2025-08-22',3,'task',400,0,1,0,0,NULL,NULL,'Layout of boardup markings','1',0.00,100.00,0.00,'2025-11-03 04:19:47'),(13,403,'Partial delivery of tools and boardup materials','2025-08-22','2025-08-26',3,'task',400,0,1,0,0,NULL,NULL,'Partial delivery of tools and boardup materials','1',0.00,100.00,0.00,'2025-11-03 04:19:47'),(14,501,'Unloading of elevator equipments','2025-08-26','2025-08-27',1,'task',500,0,1,0,0,'General','1','Unloading of elevator equipments','1',0.00,100.00,0.00,'2025-11-03 04:19:47'),(15,503,'Hauling Works','2025-08-29','2025-09-01',2,'task',500,0,1,7,0,'General','3','Hauling Works','1',7.00,100.00,0.00,'2025-11-03 04:19:47'),(16,500,'Mechanical Installation (Passenger Elevator)','2025-08-26','2025-10-17',45,'summary',NULL,0,1,0,0,NULL,NULL,'Mechanical Installation (Passenger Elevator)','1',0.00,100.00,0.00,'2025-11-03 04:19:47'),(17,504,'Template Setting','2025-09-01','2025-09-03',2,'task',500,0,1,7,1,'General','4','Template Setting','1',7.00,100.00,0.00,'2025-11-03 04:19:47'),(18,502,'Scaffolding Installation','2025-08-27','2025-08-29',2,'task',500,0,1,7,0,'General','2','Scaffolding Installation','1',7.00,100.00,0.00,'2025-11-03 04:19:47'),(19,505,'Marking and Boring of Holes','2025-09-03','2025-09-04',1,'task',500,0,1,0,0,'General','5','Marking and Boring of Holes','1',0.00,100.00,0.00,'2025-11-03 04:19:47'),(20,506,'Rail Bracket Installation','2025-09-04','2025-09-07',2,'task',500,0,1,7,0,'General','6','Rail Bracket Installation','1',7.00,100.00,0.00,'2025-11-03 04:19:47'),(21,507,'Guide Rail Setting','2025-09-07','2025-09-12',5,'summary',500,0,1,0,0,NULL,NULL,'Guide Rail Setting','1',0.00,100.00,0.00,'2025-11-03 04:19:47'),(22,508,'Main/Car','2025-09-07','2025-09-09',2,'task',507,0,1,5,0,'Guide Rail Setting','A','Main/Car','1',5.00,100.00,0.00,'2025-11-03 04:19:47'),(23,509,'Counterweight (CWT)','2025-09-09','2025-09-11',2,'task',507,0,1,3,0,'Guide Rail Setting','B','Counterweight (CWT)','1',3.00,100.00,0.00,'2025-11-03 04:19:47'),(24,510,'Gauging','2025-09-11','2025-09-12',1,'task',507,0,1,3,0,'Guide Rail Setting','C','Gauging','1',3.00,100.00,0.00,'2025-11-03 04:19:47'),(25,511,'Landing Door Assembly','2025-09-12','2025-09-19',6,'summary',500,0,1,0,0,NULL,NULL,'Landing Door Assembly','1',0.00,100.00,0.00,'2025-11-03 04:19:47'),(26,512,'Sills and Supports','2025-09-12','2025-09-15',2,'task',511,0,1,2,0,'Landing Door Assembly','A','Sills and Supports','1',2.00,100.00,0.00,'2025-11-03 04:19:47'),(27,513,'Jamb and Supports','2025-09-15','2025-09-17',2,'task',511,0,1,2,0,'Landing Door Assembly','B','Jamb and Supports','1',2.00,100.00,0.00,'2025-11-03 04:19:47'),(28,514,'Frame and Doors','2025-09-17','2025-09-19',2,'task',511,0,1,3,0,'Landing Door Assembly','C','Frame and Doors','1',3.00,100.00,0.00,'2025-11-03 04:19:47'),(29,515,'M/R Equipment Setting','2025-09-19','2025-09-26',6,'summary',500,0,1,0,0,NULL,NULL,'M/R Equipment Setting','1',0.00,100.00,0.00,'2025-11-03 04:19:47'),(30,516,'Traction Machine','2025-09-19','2025-09-22',2,'task',515,0,1,5,0,'M/R Equipment Setting','A','Traction Machine','1',5.00,100.00,0.00,'2025-11-03 04:19:47'),(31,517,'Support Beams','2025-09-22','2025-09-24',2,'task',515,0,1,5,0,'M/R Equipment Setting','B','Support Beams','1',5.00,100.00,0.00,'2025-11-03 04:19:47'),(32,518,'Governor','2025-09-24','2025-09-26',2,'task',515,0,1,2,0,'M/R Equipment Setting','C','Governor','1',2.00,100.00,0.00,'2025-11-03 04:19:47'),(33,519,'Installation of Control Panel','2025-09-26','2025-09-29',2,'task',500,0,1,3,0,'M/R Equipment Setting','D','Installation of Control Panel','1',3.00,100.00,0.00,'2025-11-03 04:19:47'),(34,520,'Car Assembly','2025-09-29','2025-10-02',3,'summary',500,0,1,0,0,NULL,NULL,'Car Assembly','1',0.00,100.00,0.00,'2025-11-03 04:19:47'),(35,521,'All Accessories','2025-09-29','2025-10-01',2,'task',520,0,1,3,0,'Car Assembly','A','All Accessories','1',3.00,100.00,0.00,'2025-11-03 04:19:47'),(36,522,'Car Piping/Wiring','2025-10-01','2025-10-02',1,'task',520,0,1,3,0,'Car Assembly','B','Car Piping/Wiring','1',3.00,100.00,0.00,'2025-11-03 04:19:47'),(37,523,'Travelling Cable Layout','2025-10-02','2025-10-05',2,'task',500,0,1,2,0,'Car Assembly','C','Travelling Cable Layout','1',2.00,100.00,0.00,'2025-11-03 04:19:47'),(38,524,'Counterweight Assembly','2025-10-05','2025-10-07',2,'task',500,0,1,2,0,'Car Assembly','D','Counterweight Assembly','1',2.00,100.00,0.00,'2025-11-03 04:19:47'),(39,525,'Laying out of Ropes','2025-10-07','2025-10-13',5,'summary',500,0,1,0,0,NULL,NULL,'Laying out of Ropes','1',0.00,100.00,0.00,'2025-11-03 04:19:47'),(40,526,'Hoisting','2025-10-07','2025-10-09',2,'task',525,0,1,2,0,'Laying out of ropes','A','Hoisting','1',2.00,100.00,0.00,'2025-11-03 04:19:47'),(41,527,'Governor','2025-10-09','2025-10-12',2,'task',525,0,1,3,0,'Compensating','B','Governor','1',3.00,100.00,0.00,'2025-11-03 04:19:47'),(42,528,'Compensating','2025-10-12','2025-10-13',1,'task',525,0,1,3,0,'Laying out of ropes','C','Compensating','1',3.00,100.00,0.00,'2025-11-03 04:19:47'),(43,529,'Wiring','2025-10-13','2025-10-15',2,'summary',500,0,1,0,0,NULL,NULL,'Wiring','1',0.00,100.00,0.00,'2025-11-03 04:19:47'),(44,530,'Machine Room','2025-10-13','2025-10-14',1,'task',529,0,1,5,0,'Wiring','A','Machine Room','1',5.00,100.00,0.00,'2025-11-03 04:19:47'),(45,531,'Hoistway','2025-10-14','2025-10-15',1,'task',529,0,1,3,0,'Wiring','B','Hoistway','1',3.00,100.00,0.00,'2025-11-03 04:19:47'),(46,532,'Installation of Pit Ladder / Hoistway Lighting','2025-10-15','2025-10-17',2,'task',500,0,1,3,0,'Wiring','C','Installation of Pit Ladder / Hoistway Lighting','1',3.00,100.00,0.00,'2025-11-03 04:19:47'),(47,600,'Testing and Commissioning (Passenger Elevator)','2025-10-17','2025-11-04',15,'summary',NULL,0,1,0,0,NULL,NULL,'Testing and Commissioning (Passenger Elevator)','1',0.00,100.00,0.00,'2025-11-03 04:19:47'),(48,601,'Initial testing','2025-10-17','2025-10-21',3,'task',600,0,1,3,0,'Testing and Commissioning (Passenger Elevator)','A','Initial testing','1',3.00,100.00,0.00,'2025-11-03 04:19:47'),(49,602,'Slow speed','2025-10-21','2025-10-23',2,'task',600,0,1,1,0,'Testing and Commissioning (Passenger Elevator)','B','Slow speed','1',1.00,100.00,0.00,'2025-11-03 04:19:47'),(50,604,'Load Test','2025-10-26','2025-10-28',2,'task',600,0,1,1,0,'Testing and Commissioning (Passenger Elevator)','D','Load Test','1',1.00,100.00,0.00,'2025-11-03 04:19:47'),(51,603,'High speed and Mechanical Adjustment','2025-10-23','2025-10-26',2,'task',600,0,1,2,0,'Testing and Commissioning (Passenger Elevator)','C','High speed and Mechanical Adjustment','1',2.00,100.00,0.00,'2025-11-03 04:19:47'),(52,605,'Final Adjust','2025-10-28','2025-10-30',2,'task',600,0,1,1,0,'Testing and Commissioning (Passenger Elevator)','E','Final Adjust','1',1.00,100.00,0.00,'2025-11-03 04:19:47'),(53,606,'Features Test / Correction of Defects','2025-10-30','2025-11-02',2,'task',600,0,1,1,0,'Testing and Commissioning (Passenger Elevator)','F','Features Test / Correction of Defects','1',1.00,100.00,0.00,'2025-11-03 04:19:47'),(54,607,'Final Cleaning / Hand over','2025-11-02','2025-11-04',2,'task',600,1,1,1,1,'Testing and Commissioning (Passenger Elevator)','G','Final Cleaning / Hand over','1',1.00,100.00,0.00,'2025-11-03 04:19:47');
/*!40000 ALTER TABLE `project_1_schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_265_schedule`
--

DROP TABLE IF EXISTS `project_265_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_265_schedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `task_id` int DEFAULT NULL,
  `task_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_start` date DEFAULT NULL,
  `task_end` date DEFAULT NULL,
  `task_duration` int DEFAULT NULL,
  `task_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_parent` int DEFAULT NULL,
  `task_approval` tinyint(1) DEFAULT '0',
  `task_done` tinyint(1) DEFAULT '0',
  `task_percent` int DEFAULT '0',
  `task_actual_current` tinyint DEFAULT '0',
  `section_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_code` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unit` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wt` decimal(5,2) DEFAULT '0.00',
  `pres_acc` decimal(5,2) DEFAULT '0.00',
  `prev_acc` decimal(5,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_265_schedule`
--

LOCK TABLES `project_265_schedule` WRITE;
/*!40000 ALTER TABLE `project_265_schedule` DISABLE KEYS */;
INSERT INTO `project_265_schedule` VALUES (1,201,'Shaft Construction','2025-11-23','2026-01-16',47,'task',200,0,0,0,0,'General',NULL,'Shaft Construction','1',0.00,0.00,0.00,'2025-11-06 12:05:01'),(2,200,'Structural/Civil Works','2025-11-23','2026-01-16',47,'summary',NULL,0,0,0,0,'General',NULL,'Structural/Civil Works','1',0.00,0.00,0.00,'2025-11-06 12:05:01'),(3,301,'Manufacturing and Importation','2025-11-23','2026-01-16',47,'task',300,0,0,0,0,'General',NULL,'Manufacturing and Importation','1',0.00,0.00,0.00,'2025-11-06 12:05:01'),(4,101,'Pre-Inspection(Checkin of Shaft)','2025-11-05','2025-11-12',6,'task',100,0,0,0,1,'General',NULL,'Pre-Inspection(Checkin of Shaft)','1',0.00,0.00,0.00,'2025-11-06 12:05:01'),(5,104,'Submission of PO to Factory','2025-11-21','2025-11-23',1,'task',100,0,0,0,0,'General',NULL,'Submission of PO to Factory','1',0.00,0.00,0.00,'2025-11-06 12:05:01'),(6,300,'Manufacturing and Importation Process','2025-11-23','2026-01-16',47,'summary',NULL,0,0,0,0,'General',NULL,'Manufacturing and Importation Process','1',0.00,0.00,0.00,'2025-11-06 12:05:01'),(7,100,'Preliminaries','2025-11-05','2025-11-23',15,'summary',NULL,0,0,0,0,'General',NULL,'Preliminaries','1',0.00,0.00,0.00,'2025-11-06 12:05:01'),(8,102,'Layout of Drawing','2025-11-12','2025-11-16',3,'task',100,0,0,0,0,'General',NULL,'Layout of Drawing','1',0.00,0.00,0.00,'2025-11-06 12:05:01'),(9,103,'Submission of Drawing and Finishes for Approval','2025-11-16','2025-11-21',5,'task',100,0,0,0,0,'General',NULL,'Submission of Drawing and Finishes for Approval','1',0.00,0.00,0.00,'2025-11-06 12:05:01'),(10,400,'Planning For Mobilization And Execution','2026-01-16','2026-02-18',28,'summary',NULL,0,0,0,0,'General',NULL,'Planning For Mobilization And Execution','1',0.00,0.00,0.00,'2025-11-06 12:05:01'),(11,401,'Preparation of tools and materials for elevator installation','2026-01-16','2026-02-02',14,'task',400,0,0,0,0,'General',NULL,'Preparation of tools and materials for elevator installation','1',0.00,0.00,0.00,'2025-11-06 12:05:01'),(12,402,'Layout of boardup markings','2026-02-02','2026-02-05',3,'task',400,0,0,0,0,'General',NULL,'Layout of boardup markings','1',0.00,0.00,0.00,'2025-11-06 12:05:01'),(13,403,'Partial delivery of tools and boardup materials','2026-02-05','2026-02-09',3,'task',400,0,0,0,0,'General',NULL,'Partial delivery of tools and boardup materials','1',0.00,0.00,0.00,'2025-11-06 12:05:01'),(14,404,'Preperation for Installation/Manufacturing','2026-02-09','2026-02-18',8,'task',400,0,0,0,0,'General',NULL,'Preperation for Installation/Manufacturing','1',0.00,0.00,0.00,'2025-11-06 12:05:01'),(15,500,'Mechanical Installation','2026-02-18','2026-04-12',45,'summary',NULL,0,0,0,0,'General',NULL,'Mechanical Installation','1',0.00,0.00,0.00,'2025-11-06 12:05:01'),(16,501,'Unloading of elevator equipments','2026-02-18','2026-02-19',1,'task',500,0,0,0,0,'General','1','Unloading of elevator equipments','1',0.00,0.00,0.00,'2025-11-06 12:05:01'),(17,502,'Scaffolding Installation','2026-02-19','2026-02-22',2,'task',500,0,0,7,0,'General','2','Scaffolding Installation','1',7.00,0.00,0.00,'2025-11-06 12:05:01'),(18,503,'Hauling Works','2026-02-22','2026-02-24',2,'task',500,0,0,7,0,'General','3','Hauling Works','1',7.00,0.00,0.00,'2025-11-06 12:05:01'),(19,504,'Template Setting','2026-02-24','2026-02-26',2,'task',500,0,0,7,0,'General','4','Template Setting','1',7.00,0.00,0.00,'2025-11-06 12:05:01'),(20,505,'Marking and Boring of Holes','2026-02-26','2026-02-27',1,'task',500,0,0,0,0,'General','5','Marking and Boring of Holes','1',0.00,0.00,0.00,'2025-11-06 12:05:01'),(21,506,'Rail Bracket Installation','2026-02-27','2026-03-02',2,'task',500,0,0,7,0,'General','6','Rail Bracket Installation','1',7.00,0.00,0.00,'2025-11-06 12:05:01'),(22,507,'Guide Rail Setting','2026-03-02','2026-03-08',5,'summary',500,0,0,0,0,'General',NULL,'Guide Rail Setting','1',0.00,0.00,0.00,'2025-11-06 12:05:01'),(23,508,'Main/Car','2026-03-02','2026-03-04',2,'task',507,0,0,5,0,'Guide Rail Setting','A','Main/Car','1',5.00,0.00,0.00,'2025-11-06 12:05:01'),(24,509,'Counterweight (CWT)','2026-03-04','2026-03-06',2,'task',507,0,0,3,0,'Guide Rail Setting','B','Counterweight (CWT)','1',3.00,0.00,0.00,'2025-11-06 12:05:01'),(25,510,'Gauging','2026-03-06','2026-03-08',1,'task',507,0,0,3,0,'Guide Rail Setting','C','Gauging','1',3.00,0.00,0.00,'2025-11-06 12:05:01'),(26,511,'Landing Door Assembly','2026-03-08','2026-03-15',6,'summary',500,0,0,0,0,'General',NULL,'Landing Door Assembly','1',0.00,0.00,0.00,'2025-11-06 12:05:01'),(27,512,'Sills and Supports','2026-03-08','2026-03-10',2,'task',511,0,0,2,0,'Landing Door Assembly','A','Sills and Supports','1',2.00,0.00,0.00,'2025-11-06 12:05:01'),(28,513,'Jamb and Supports','2026-03-10','2026-03-12',2,'task',511,0,0,2,0,'Landing Door Assembly','B','Jamb and Supports','1',2.00,0.00,0.00,'2025-11-06 12:05:01'),(29,514,'Frame and Doors','2026-03-12','2026-03-15',2,'task',511,0,0,3,0,'Landing Door Assembly','C','Frame and Doors','1',3.00,0.00,0.00,'2025-11-06 12:05:01'),(30,515,'M/R Equipment Setting','2026-03-15','2026-03-22',6,'summary',500,0,0,0,0,'General',NULL,'M/R Equipment Setting','1',0.00,0.00,0.00,'2025-11-06 12:05:01'),(31,516,'Traction Machine','2026-03-15','2026-03-17',2,'task',515,0,0,5,0,'M/R Equipment Setting','A','Traction Machine','1',5.00,0.00,0.00,'2025-11-06 12:05:01'),(32,517,'Support Beams','2026-03-17','2026-03-19',2,'task',515,0,0,5,0,'M/R Equipment Setting','B','Support Beams','1',5.00,0.00,0.00,'2025-11-06 12:05:01'),(33,518,'Governor','2026-03-19','2026-03-22',2,'task',515,0,0,2,0,'M/R Equipment Setting','C','Governor','1',2.00,0.00,0.00,'2025-11-06 12:05:01'),(34,519,'Installation of Control Panel','2026-03-22','2026-03-24',2,'task',500,0,0,3,0,'M/R Equipment Setting','D','Installation of Control Panel','1',3.00,0.00,0.00,'2025-11-06 12:05:01'),(35,520,'Car Assembly','2026-03-24','2026-03-27',3,'summary',500,0,0,0,0,'General',NULL,'Car Assembly','1',0.00,0.00,0.00,'2025-11-06 12:05:01'),(36,521,'All Accessories','2026-03-24','2026-03-26',2,'task',520,0,0,3,0,'Car Assembly','A','All Accessories','1',3.00,0.00,0.00,'2025-11-06 12:05:01'),(37,522,'Car Piping/Wiring','2026-03-26','2026-03-27',1,'task',520,0,0,3,0,'Car Assembly','B','Car Piping/Wiring','1',3.00,0.00,0.00,'2025-11-06 12:05:01'),(38,523,'Travelling Cable Layout','2026-03-27','2026-03-30',2,'task',500,0,0,2,0,'Car Assembly','C','Travelling Cable Layout','1',2.00,0.00,0.00,'2025-11-06 12:05:01'),(39,524,'Counterweight Assembly','2026-03-30','2026-04-01',2,'task',500,0,0,2,0,'Car Assembly','D','Counterweight Assembly','1',2.00,0.00,0.00,'2025-11-06 12:05:01'),(40,525,'Laying out of Ropes','2026-04-01','2026-04-07',5,'summary',500,0,0,0,0,'General',NULL,'Laying out of Ropes','1',0.00,0.00,0.00,'2025-11-06 12:05:01'),(41,526,'Hoisting','2026-04-01','2026-04-03',2,'task',525,0,0,2,0,'Laying out of ropes','A','Hoisting','1',2.00,0.00,0.00,'2025-11-06 12:05:01'),(42,527,'Governor','2026-04-03','2026-04-06',2,'task',525,0,0,3,0,'Compensating','B','Governor','1',3.00,0.00,0.00,'2025-11-06 12:05:01'),(43,528,'Compensating','2026-04-06','2026-04-07',1,'task',525,0,0,3,0,'Laying out of ropes','C','Compensating','1',3.00,0.00,0.00,'2025-11-06 12:05:01'),(44,529,'Wiring','2026-04-07','2026-04-09',2,'summary',500,0,0,0,0,'General',NULL,'Wiring','1',0.00,0.00,0.00,'2025-11-06 12:05:01'),(45,530,'Machine Room','2026-04-07','2026-04-08',1,'task',529,0,0,5,0,'Wiring','A','Machine Room','1',5.00,0.00,0.00,'2025-11-06 12:05:01'),(46,531,'Hoistway','2026-04-08','2026-04-09',1,'task',529,0,0,3,0,'Wiring','B','Hoistway','1',3.00,0.00,0.00,'2025-11-06 12:05:01'),(47,532,'Installation of Pit Ladder / Hoistway Lighting','2026-04-09','2026-04-12',2,'task',500,0,0,3,0,'Wiring','C','Installation of Pit Ladder / Hoistway Lighting','1',3.00,0.00,0.00,'2025-11-06 12:05:01'),(48,600,'Testing and Commissioning','2026-04-12','2026-04-29',15,'summary',NULL,0,0,0,0,'General',NULL,'Testing and Commissioning','1',0.00,0.00,0.00,'2025-11-06 12:05:01'),(49,601,'Initial testing','2026-04-12','2026-04-15',3,'task',600,0,0,3,0,'Testing and Commissioning (Passenger Elevator)','A','Initial testing','1',3.00,0.00,0.00,'2025-11-06 12:05:01'),(50,602,'Slow speed','2026-04-15','2026-04-17',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','B','Slow speed','1',1.00,0.00,0.00,'2025-11-06 12:05:01'),(51,603,'High speed and Mechanical Adjustment','2026-04-17','2026-04-20',2,'task',600,0,0,2,0,'Testing and Commissioning (Passenger Elevator)','C','High speed and Mechanical Adjustment','1',2.00,0.00,0.00,'2025-11-06 12:05:01'),(52,604,'Load Test','2026-04-20','2026-04-22',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','D','Load Test','1',1.00,0.00,0.00,'2025-11-06 12:05:01'),(53,605,'Final Adjust','2026-04-22','2026-04-24',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','E','Final Adjust','1',1.00,0.00,0.00,'2025-11-06 12:05:01'),(54,606,'Features Test / Correction of Defects','2026-04-24','2026-04-27',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','F','Features Test / Correction of Defects','1',1.00,0.00,0.00,'2025-11-06 12:05:01'),(55,607,'Final Cleaning / Hand over','2026-04-27','2026-04-29',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','G','Final Cleaning / Hand over','1',1.00,0.00,0.00,'2025-11-06 12:05:01');
/*!40000 ALTER TABLE `project_265_schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_266_schedule`
--

DROP TABLE IF EXISTS `project_266_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_266_schedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `task_id` int DEFAULT NULL,
  `task_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_start` date DEFAULT NULL,
  `task_end` date DEFAULT NULL,
  `task_duration` int DEFAULT NULL,
  `task_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_parent` int DEFAULT NULL,
  `task_approval` tinyint(1) DEFAULT '0',
  `task_done` tinyint(1) DEFAULT '0',
  `task_percent` int DEFAULT '0',
  `task_actual_current` tinyint DEFAULT '0',
  `section_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_code` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unit` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wt` decimal(5,2) DEFAULT '0.00',
  `pres_acc` decimal(5,2) DEFAULT '0.00',
  `prev_acc` decimal(5,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_266_schedule`
--

LOCK TABLES `project_266_schedule` WRITE;
/*!40000 ALTER TABLE `project_266_schedule` DISABLE KEYS */;
INSERT INTO `project_266_schedule` VALUES (1,301,'Manufacturing and Importation','2025-06-03','2025-07-28',47,'task',300,0,1,0,0,'General',NULL,'Manufacturing and Importation','1',0.00,100.00,0.00,'2025-11-06 13:26:51'),(2,104,'Submission of PO to Factory','2025-06-02','2025-06-03',1,'task',100,0,1,0,0,'General',NULL,'Submission of PO to Factory','1',0.00,100.00,0.00,'2025-11-06 13:26:51'),(3,101,'Pre-Inspection(Checkin of Shaft)','2025-05-16','2025-05-23',6,'task',100,0,1,0,0,'General',NULL,'Pre-Inspection(Checkin of Shaft)','1',0.00,100.00,0.00,'2025-11-06 13:26:51'),(4,102,'Layout of Drawing','2025-05-23','2025-05-27',3,'task',100,0,1,0,0,'General',NULL,'Layout of Drawing','1',0.00,100.00,0.00,'2025-11-06 13:26:51'),(5,200,'Structural/Civil Works','2025-06-03','2025-07-28',47,'summary',NULL,0,1,0,0,'General',NULL,'Structural/Civil Works','1',0.00,100.00,0.00,'2025-11-06 13:26:51'),(6,100,'Preliminaries','2025-05-16','2025-06-03',15,'summary',NULL,0,1,0,0,'General',NULL,'Preliminaries','1',0.00,100.00,0.00,'2025-11-06 13:26:51'),(7,103,'Submission of Drawing and Finishes for Approval','2025-05-27','2025-06-02',5,'task',100,0,1,0,0,'General',NULL,'Submission of Drawing and Finishes for Approval','1',0.00,100.00,0.00,'2025-11-06 13:26:51'),(8,300,'Manufacturing and Importation Process','2025-06-03','2025-07-28',47,'summary',NULL,0,1,0,0,'General',NULL,'Manufacturing and Importation Process','1',0.00,100.00,0.00,'2025-11-06 13:26:51'),(9,400,'Planning For Mobilization And Execution','2025-07-28','2025-08-29',28,'summary',NULL,0,1,0,0,'General',NULL,'Planning For Mobilization And Execution','1',0.00,100.00,0.00,'2025-11-06 13:26:51'),(10,201,'Shaft Construction','2025-06-03','2025-07-28',47,'task',200,0,1,0,0,'General',NULL,'Shaft Construction','1',0.00,100.00,0.00,'2025-11-06 13:26:51'),(11,401,'Preparation of tools and materials for elevator installation','2025-07-28','2025-08-13',14,'task',400,0,1,0,0,'General',NULL,'Preparation of tools and materials for elevator installation','1',0.00,100.00,0.00,'2025-11-06 13:26:51'),(12,402,'Layout of boardup markings','2025-08-13','2025-08-17',3,'task',400,0,1,0,0,'General',NULL,'Layout of boardup markings','1',0.00,100.00,0.00,'2025-11-06 13:26:51'),(13,404,'Preperation for Installation/Manufacturing','2025-08-20','2025-08-29',8,'task',400,0,1,0,0,'General',NULL,'Preperation for Installation/Manufacturing','1',0.00,100.00,0.00,'2025-11-06 13:26:51'),(14,501,'Unloading of elevator equipments','2025-08-29','2025-08-31',1,'task',500,0,1,0,0,'General','1','Unloading of elevator equipments','1',0.00,100.00,0.00,'2025-11-06 13:26:51'),(15,502,'Scaffolding Installation','2025-08-31','2025-09-02',2,'task',500,0,1,7,0,'General','2','Scaffolding Installation','1',7.00,100.00,0.00,'2025-11-06 13:26:51'),(16,504,'Template Setting','2025-09-04','2025-09-07',2,'task',500,0,1,7,0,'General','4','Template Setting','1',7.00,100.00,0.00,'2025-11-06 13:26:51'),(17,403,'Partial delivery of tools and boardup materials','2025-08-17','2025-08-20',3,'task',400,0,1,0,0,'General',NULL,'Partial delivery of tools and boardup materials','1',0.00,100.00,0.00,'2025-11-06 13:26:51'),(18,503,'Hauling Works','2025-09-02','2025-09-04',2,'task',500,0,1,7,0,'General','3','Hauling Works','1',7.00,100.00,0.00,'2025-11-06 13:26:51'),(19,500,'Mechanical Installation','2025-08-29','2025-10-21',45,'summary',NULL,0,1,0,0,'General',NULL,'Mechanical Installation','1',0.00,100.00,0.00,'2025-11-06 13:26:51'),(20,505,'Marking and Boring of Holes','2025-09-07','2025-09-08',1,'task',500,0,1,0,0,'General','5','Marking and Boring of Holes','1',0.00,100.00,0.00,'2025-11-06 13:26:51'),(21,506,'Rail Bracket Installation','2025-09-08','2025-09-10',2,'task',500,0,1,7,0,'General','6','Rail Bracket Installation','1',7.00,100.00,0.00,'2025-11-06 13:26:51'),(22,507,'Guide Rail Setting','2025-09-10','2025-09-16',5,'summary',500,0,1,0,0,'General',NULL,'Guide Rail Setting','1',0.00,100.00,0.00,'2025-11-06 13:26:51'),(23,508,'Main/Car','2025-09-10','2025-09-12',2,'task',507,0,1,5,0,'Guide Rail Setting','A','Main/Car','1',5.00,100.00,0.00,'2025-11-06 13:26:51'),(24,509,'Counterweight (CWT)','2025-09-12','2025-09-15',2,'task',507,0,1,3,0,'Guide Rail Setting','B','Counterweight (CWT)','1',3.00,100.00,0.00,'2025-11-06 13:26:51'),(25,510,'Gauging','2025-09-15','2025-09-16',1,'task',507,0,1,3,0,'Guide Rail Setting','C','Gauging','1',3.00,100.00,0.00,'2025-11-06 13:26:51'),(26,511,'Landing Door Assembly','2025-09-16','2025-09-23',6,'summary',500,0,1,0,0,'General',NULL,'Landing Door Assembly','1',0.00,100.00,0.00,'2025-11-06 13:26:51'),(27,512,'Sills and Supports','2025-09-16','2025-09-18',2,'task',511,0,1,2,0,'Landing Door Assembly','A','Sills and Supports','1',2.00,100.00,0.00,'2025-11-06 13:26:51'),(28,513,'Jamb and Supports','2025-09-18','2025-09-21',2,'task',511,0,1,2,0,'Landing Door Assembly','B','Jamb and Supports','1',2.00,100.00,0.00,'2025-11-06 13:26:51'),(29,514,'Frame and Doors','2025-09-21','2025-09-23',2,'task',511,0,1,3,0,'Landing Door Assembly','C','Frame and Doors','1',3.00,100.00,0.00,'2025-11-06 13:26:51'),(30,515,'M/R Equipment Setting','2025-09-23','2025-09-30',6,'summary',500,0,1,0,0,'General',NULL,'M/R Equipment Setting','1',0.00,100.00,0.00,'2025-11-06 13:26:51'),(31,516,'Traction Machine','2025-09-23','2025-09-25',2,'task',515,0,1,5,0,'M/R Equipment Setting','A','Traction Machine','1',5.00,100.00,0.00,'2025-11-06 13:26:51'),(32,517,'Support Beams','2025-09-25','2025-09-28',2,'task',515,0,1,5,0,'M/R Equipment Setting','B','Support Beams','1',5.00,100.00,0.00,'2025-11-06 13:26:51'),(33,518,'Governor','2025-09-28','2025-09-30',2,'task',515,0,1,2,0,'M/R Equipment Setting','C','Governor','1',2.00,100.00,0.00,'2025-11-06 13:26:51'),(34,519,'Installation of Control Panel','2025-09-30','2025-10-02',2,'task',500,0,1,3,0,'M/R Equipment Setting','D','Installation of Control Panel','1',3.00,100.00,0.00,'2025-11-06 13:26:51'),(35,520,'Car Assembly','2025-10-02','2025-10-06',3,'summary',500,0,1,0,0,'General',NULL,'Car Assembly','1',0.00,100.00,0.00,'2025-11-06 13:26:51'),(36,521,'All Accessories','2025-10-02','2025-10-05',2,'task',520,0,1,3,0,'Car Assembly','A','All Accessories','1',3.00,100.00,0.00,'2025-11-06 13:26:51'),(37,522,'Car Piping/Wiring','2025-10-05','2025-10-06',1,'task',520,0,1,3,0,'Car Assembly','B','Car Piping/Wiring','1',3.00,100.00,0.00,'2025-11-06 13:26:51'),(38,524,'Counterweight Assembly','2025-10-08','2025-10-10',2,'task',500,0,1,2,0,'Car Assembly','D','Counterweight Assembly','1',2.00,100.00,0.00,'2025-11-06 13:26:51'),(39,525,'Laying out of Ropes','2025-10-10','2025-10-16',5,'summary',500,0,1,0,0,'General',NULL,'Laying out of Ropes','1',0.00,100.00,0.00,'2025-11-06 13:26:51'),(40,526,'Hoisting','2025-10-10','2025-10-13',2,'task',525,0,1,2,0,'Laying out of ropes','A','Hoisting','1',2.00,100.00,0.00,'2025-11-06 13:26:51'),(41,527,'Governor','2025-10-13','2025-10-15',2,'task',525,0,1,3,0,'Compensating','B','Governor','1',3.00,100.00,0.00,'2025-11-06 13:26:51'),(42,528,'Compensating','2025-10-15','2025-10-16',1,'task',525,0,1,3,0,'Laying out of ropes','C','Compensating','1',3.00,100.00,0.00,'2025-11-06 13:26:51'),(43,529,'Wiring','2025-10-16','2025-10-19',2,'summary',500,0,1,0,0,'General',NULL,'Wiring','1',0.00,100.00,0.00,'2025-11-06 13:26:51'),(44,523,'Travelling Cable Layout','2025-10-06','2025-10-08',2,'task',500,0,1,2,0,'Car Assembly','C','Travelling Cable Layout','1',2.00,100.00,0.00,'2025-11-06 13:26:51'),(45,530,'Machine Room','2025-10-16','2025-10-17',1,'task',529,0,1,5,0,'Wiring','A','Machine Room','1',5.00,100.00,0.00,'2025-11-06 13:26:51'),(46,531,'Hoistway','2025-10-17','2025-10-19',1,'task',529,0,1,3,0,'Wiring','B','Hoistway','1',3.00,100.00,0.00,'2025-11-06 13:26:51'),(47,532,'Installation of Pit Ladder / Hoistway Lighting','2025-10-19','2025-10-21',2,'task',500,0,1,3,0,'Wiring','C','Installation of Pit Ladder / Hoistway Lighting','1',3.00,100.00,0.00,'2025-11-06 13:26:51'),(48,600,'Testing and Commissioning','2025-10-21','2025-11-07',15,'summary',NULL,0,1,0,0,'General',NULL,'Testing and Commissioning','1',0.00,100.00,0.00,'2025-11-06 13:26:51'),(49,601,'Initial testing','2025-10-21','2025-10-24',3,'task',600,0,1,3,0,'Testing and Commissioning (Passenger Elevator)','A','Initial testing','1',3.00,100.00,0.00,'2025-11-06 13:26:51'),(50,602,'Slow speed','2025-10-24','2025-10-27',2,'task',600,0,1,1,0,'Testing and Commissioning (Passenger Elevator)','B','Slow speed','1',1.00,100.00,0.00,'2025-11-06 13:26:51'),(51,603,'High speed and Mechanical Adjustment','2025-10-27','2025-10-29',2,'task',600,0,1,2,0,'Testing and Commissioning (Passenger Elevator)','C','High speed and Mechanical Adjustment','1',2.00,100.00,0.00,'2025-11-06 13:26:51'),(52,604,'Load Test','2025-10-29','2025-10-31',2,'task',600,0,1,1,0,'Testing and Commissioning (Passenger Elevator)','D','Load Test','1',1.00,100.00,0.00,'2025-11-06 13:26:51'),(53,605,'Final Adjust','2025-10-31','2025-11-03',2,'task',600,0,1,1,0,'Testing and Commissioning (Passenger Elevator)','E','Final Adjust','1',1.00,100.00,0.00,'2025-11-06 13:26:51'),(54,606,'Features Test / Correction of Defects','2025-11-03','2025-11-05',2,'task',600,0,1,1,0,'Testing and Commissioning (Passenger Elevator)','F','Features Test / Correction of Defects','1',1.00,100.00,0.00,'2025-11-06 13:26:51'),(55,607,'Final Cleaning / Hand over','2025-11-05','2025-11-07',2,'task',600,1,1,1,1,'Testing and Commissioning (Passenger Elevator)','G','Final Cleaning / Hand over','1',1.00,100.00,0.00,'2025-11-06 13:26:51');
/*!40000 ALTER TABLE `project_266_schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_267_schedule`
--

DROP TABLE IF EXISTS `project_267_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_267_schedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `task_id` int DEFAULT NULL,
  `task_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_start` date DEFAULT NULL,
  `task_end` date DEFAULT NULL,
  `task_duration` int DEFAULT NULL,
  `task_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_parent` int DEFAULT NULL,
  `task_approval` tinyint(1) DEFAULT '0',
  `task_done` tinyint(1) DEFAULT '0',
  `task_percent` int DEFAULT '0',
  `task_actual_current` tinyint DEFAULT '0',
  `section_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_code` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unit` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wt` decimal(5,2) DEFAULT '0.00',
  `pres_acc` decimal(5,2) DEFAULT '0.00',
  `prev_acc` decimal(5,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_267_schedule`
--

LOCK TABLES `project_267_schedule` WRITE;
/*!40000 ALTER TABLE `project_267_schedule` DISABLE KEYS */;
INSERT INTO `project_267_schedule` VALUES (1,100,'Preliminaries','2025-04-20','2025-05-07',15,'summary',NULL,0,1,0,0,NULL,NULL,'Preliminaries','1',0.00,100.00,0.00,'2025-11-03 06:20:04'),(2,102,'Layout of Drawing','2025-04-27','2025-04-30',3,'task',100,0,1,0,0,NULL,NULL,'Layout of Drawing','1',0.00,100.00,0.00,'2025-11-03 06:20:04'),(3,301,'Manufacturing and Importation','2025-05-07','2025-08-03',75,'task',300,0,1,0,0,NULL,NULL,'Manufacturing and Importation','1',0.00,100.00,0.00,'2025-11-03 06:20:04'),(4,200,'Structural/Civil Works','2025-05-07','2025-08-03',75,'summary',NULL,0,1,0,0,NULL,NULL,'Structural/Civil Works','1',0.00,100.00,0.00,'2025-11-03 06:20:04'),(5,101,'Pre-Inspection(Checkin of Shaft)','2025-04-20','2025-04-27',6,'task',100,0,1,0,0,NULL,NULL,'Pre-Inspection(Checkin of Shaft)','1',0.00,100.00,0.00,'2025-11-03 06:20:04'),(6,104,'Submission of PO to Factory','2025-05-06','2025-05-07',1,'task',100,0,1,0,0,NULL,NULL,'Submission of PO to Factory','1',0.00,100.00,0.00,'2025-11-03 06:20:04'),(7,201,'Shaft Construction','2025-05-07','2025-08-03',75,'task',200,0,1,0,0,NULL,NULL,'Shaft Construction','1',0.00,100.00,0.00,'2025-11-03 06:20:04'),(8,103,'Submission of Drawing and Finishes for Approval','2025-04-30','2025-05-06',5,'task',100,0,1,0,0,NULL,NULL,'Submission of Drawing and Finishes for Approval','1',0.00,100.00,0.00,'2025-11-03 06:20:04'),(9,300,'Manufacturing and Importation Process (Passenger Elevator)','2025-05-07','2025-08-03',75,'summary',NULL,0,1,0,0,NULL,NULL,'Manufacturing and Importation Process (Passenger Elevator)','1',0.00,100.00,0.00,'2025-11-03 06:20:04'),(10,400,'Planning For Mobilization And Execution','2025-08-03','2025-08-26',20,'summary',NULL,0,1,0,0,NULL,NULL,'Planning For Mobilization And Execution','1',0.00,100.00,0.00,'2025-11-03 06:20:04'),(11,401,'Preparation of tools and materials for elevator installation','2025-08-03','2025-08-19',14,'task',400,0,1,0,0,NULL,NULL,'Preparation of tools and materials for elevator installation','1',0.00,100.00,0.00,'2025-11-03 06:20:04'),(12,402,'Layout of boardup markings','2025-08-19','2025-08-22',3,'task',400,0,1,0,0,NULL,NULL,'Layout of boardup markings','1',0.00,100.00,0.00,'2025-11-03 06:20:04'),(13,403,'Partial delivery of tools and boardup materials','2025-08-22','2025-08-26',3,'task',400,0,1,0,0,NULL,NULL,'Partial delivery of tools and boardup materials','1',0.00,100.00,0.00,'2025-11-03 06:20:04'),(14,500,'Mechanical Installation (Passenger Elevator)','2025-08-26','2025-10-17',45,'summary',NULL,0,1,0,0,NULL,NULL,'Mechanical Installation (Passenger Elevator)','1',0.00,100.00,0.00,'2025-11-03 06:20:04'),(15,501,'Unloading of elevator equipments','2025-08-26','2025-08-27',1,'task',500,0,1,0,0,'General','1','Unloading of elevator equipments','1',0.00,100.00,0.00,'2025-11-03 06:20:04'),(16,502,'Scaffolding Installation','2025-08-27','2025-08-29',2,'task',500,0,1,7,0,'General','2','Scaffolding Installation','1',7.00,100.00,0.00,'2025-11-03 06:20:04'),(17,503,'Hauling Works','2025-08-29','2025-09-01',2,'task',500,0,1,7,0,'General','3','Hauling Works','1',7.00,100.00,0.00,'2025-11-03 06:20:04'),(18,504,'Template Setting','2025-09-01','2025-09-03',2,'task',500,0,1,7,0,'General','4','Template Setting','1',7.00,100.00,0.00,'2025-11-03 06:20:04'),(19,505,'Marking and Boring of Holes','2025-09-03','2025-09-04',1,'task',500,0,1,0,0,'General','5','Marking and Boring of Holes','1',0.00,100.00,0.00,'2025-11-03 06:20:04'),(20,506,'Rail Bracket Installation','2025-09-04','2025-09-07',2,'task',500,0,1,7,0,'General','6','Rail Bracket Installation','1',7.00,100.00,0.00,'2025-11-03 06:20:04'),(21,507,'Guide Rail Setting','2025-09-07','2025-09-12',5,'summary',500,0,1,0,0,NULL,NULL,'Guide Rail Setting','1',0.00,100.00,0.00,'2025-11-03 06:20:04'),(22,508,'Main/Car','2025-09-07','2025-09-09',2,'task',507,0,1,5,0,'Guide Rail Setting','A','Main/Car','1',5.00,100.00,0.00,'2025-11-03 06:20:04'),(23,509,'Counterweight (CWT)','2025-09-09','2025-09-11',2,'task',507,0,1,3,0,'Guide Rail Setting','B','Counterweight (CWT)','1',3.00,100.00,0.00,'2025-11-03 06:20:04'),(24,510,'Gauging','2025-09-11','2025-09-12',1,'task',507,0,1,3,0,'Guide Rail Setting','C','Gauging','1',3.00,100.00,0.00,'2025-11-03 06:20:04'),(25,511,'Landing Door Assembly','2025-09-12','2025-09-19',6,'summary',500,0,1,0,0,NULL,NULL,'Landing Door Assembly','1',0.00,100.00,0.00,'2025-11-03 06:20:04'),(26,512,'Sills and Supports','2025-09-12','2025-09-15',2,'task',511,0,1,2,0,'Landing Door Assembly','A','Sills and Supports','1',2.00,100.00,0.00,'2025-11-03 06:20:04'),(27,513,'Jamb and Supports','2025-09-15','2025-09-17',2,'task',511,0,1,2,0,'Landing Door Assembly','B','Jamb and Supports','1',2.00,100.00,0.00,'2025-11-03 06:20:04'),(28,514,'Frame and Doors','2025-09-17','2025-09-19',2,'task',511,0,1,3,0,'Landing Door Assembly','C','Frame and Doors','1',3.00,100.00,0.00,'2025-11-03 06:20:04'),(29,515,'M/R Equipment Setting','2025-09-19','2025-09-26',6,'summary',500,0,1,0,0,NULL,NULL,'M/R Equipment Setting','1',0.00,100.00,0.00,'2025-11-03 06:20:04'),(30,516,'Traction Machine','2025-09-19','2025-09-22',2,'task',515,0,1,5,0,'M/R Equipment Setting','A','Traction Machine','1',5.00,100.00,0.00,'2025-11-03 06:20:04'),(31,517,'Support Beams','2025-09-22','2025-09-24',2,'task',515,0,1,5,0,'M/R Equipment Setting','B','Support Beams','1',5.00,100.00,0.00,'2025-11-03 06:20:04'),(32,518,'Governor','2025-09-24','2025-09-26',2,'task',515,0,1,2,0,'M/R Equipment Setting','C','Governor','1',2.00,100.00,0.00,'2025-11-03 06:20:04'),(33,519,'Installation of Control Panel','2025-09-26','2025-09-29',2,'task',500,0,1,3,0,'M/R Equipment Setting','D','Installation of Control Panel','1',3.00,100.00,0.00,'2025-11-03 06:20:04'),(34,520,'Car Assembly','2025-09-29','2025-10-02',3,'summary',500,0,1,0,0,NULL,NULL,'Car Assembly','1',0.00,100.00,0.00,'2025-11-03 06:20:04'),(35,521,'All Accessories','2025-09-29','2025-10-01',2,'task',520,0,1,3,0,'Car Assembly','A','All Accessories','1',3.00,100.00,0.00,'2025-11-03 06:20:04'),(36,522,'Car Piping/Wiring','2025-10-01','2025-10-02',1,'task',520,0,1,3,0,'Car Assembly','B','Car Piping/Wiring','1',3.00,100.00,0.00,'2025-11-03 06:20:04'),(37,523,'Travelling Cable Layout','2025-10-02','2025-10-05',2,'task',500,0,1,2,0,'Car Assembly','C','Travelling Cable Layout','1',2.00,100.00,0.00,'2025-11-03 06:20:04'),(38,524,'Counterweight Assembly','2025-10-05','2025-10-07',2,'task',500,0,1,2,0,'Car Assembly','D','Counterweight Assembly','1',2.00,100.00,0.00,'2025-11-03 06:20:04'),(39,525,'Laying out of Ropes','2025-10-07','2025-10-13',5,'summary',500,0,1,0,0,NULL,NULL,'Laying out of Ropes','1',0.00,100.00,0.00,'2025-11-03 06:20:04'),(40,526,'Hoisting','2025-10-07','2025-10-09',2,'task',525,0,1,2,0,'Laying out of ropes','A','Hoisting','1',2.00,100.00,0.00,'2025-11-03 06:20:04'),(41,527,'Governor','2025-10-09','2025-10-12',2,'task',525,0,1,3,0,'Compensating','B','Governor','1',3.00,100.00,0.00,'2025-11-03 06:20:04'),(42,528,'Compensating','2025-10-12','2025-10-13',1,'task',525,0,1,3,0,'Laying out of ropes','C','Compensating','1',3.00,100.00,0.00,'2025-11-03 06:20:04'),(43,529,'Wiring','2025-10-13','2025-10-15',2,'summary',500,0,1,0,0,NULL,NULL,'Wiring','1',0.00,100.00,0.00,'2025-11-03 06:20:04'),(44,530,'Machine Room','2025-10-13','2025-10-14',1,'task',529,0,1,5,0,'Wiring','A','Machine Room','1',5.00,100.00,0.00,'2025-11-03 06:20:04'),(45,531,'Hoistway','2025-10-14','2025-10-15',1,'task',529,0,1,3,0,'Wiring','B','Hoistway','1',3.00,100.00,0.00,'2025-11-03 06:20:04'),(46,532,'Installation of Pit Ladder / Hoistway Lighting','2025-10-15','2025-10-17',2,'task',500,0,1,3,0,'Wiring','C','Installation of Pit Ladder / Hoistway Lighting','1',3.00,100.00,0.00,'2025-11-03 06:20:04'),(47,600,'Testing and Commissioning (Passenger Elevator)','2025-10-17','2025-11-04',15,'summary',NULL,0,1,0,0,NULL,NULL,'Testing and Commissioning (Passenger Elevator)','1',0.00,100.00,0.00,'2025-11-03 06:20:04'),(48,601,'Initial testing','2025-10-17','2025-10-21',3,'task',600,0,1,3,0,'Testing and Commissioning (Passenger Elevator)','A','Initial testing','1',3.00,100.00,0.00,'2025-11-03 06:20:04'),(49,602,'Slow speed','2025-10-21','2025-10-23',2,'task',600,0,1,1,0,'Testing and Commissioning (Passenger Elevator)','B','Slow speed','1',1.00,100.00,0.00,'2025-11-03 06:20:04'),(50,603,'High speed and Mechanical Adjustment','2025-10-23','2025-10-26',2,'task',600,0,1,2,0,'Testing and Commissioning (Passenger Elevator)','C','High speed and Mechanical Adjustment','1',2.00,100.00,0.00,'2025-11-03 06:20:04'),(51,604,'Load Test','2025-10-26','2025-10-28',2,'task',600,0,1,1,0,'Testing and Commissioning (Passenger Elevator)','D','Load Test','1',1.00,100.00,0.00,'2025-11-03 06:20:04'),(52,605,'Final Adjust','2025-10-28','2025-10-30',2,'task',600,0,1,1,0,'Testing and Commissioning (Passenger Elevator)','E','Final Adjust','1',1.00,100.00,0.00,'2025-11-03 06:20:04'),(53,606,'Features Test / Correction of Defects','2025-10-30','2025-11-02',2,'task',600,0,1,1,0,'Testing and Commissioning (Passenger Elevator)','F','Features Test / Correction of Defects','1',1.00,100.00,0.00,'2025-11-03 06:20:04'),(54,607,'Final Cleaning / Hand over','2025-11-02','2025-11-04',2,'task',600,1,1,1,1,'Testing and Commissioning (Passenger Elevator)','G','Final Cleaning / Hand over','1',1.00,100.00,0.00,'2025-11-03 06:20:04');
/*!40000 ALTER TABLE `project_267_schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_328_schedule`
--

DROP TABLE IF EXISTS `project_328_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_328_schedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `task_id` int DEFAULT NULL,
  `task_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_start` date DEFAULT NULL,
  `task_end` date DEFAULT NULL,
  `task_duration` int DEFAULT NULL,
  `task_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_parent` int DEFAULT NULL,
  `task_approval` tinyint(1) DEFAULT '0',
  `task_done` tinyint(1) DEFAULT '0',
  `task_percent` int DEFAULT '0',
  `task_actual_current` tinyint DEFAULT '0',
  `section_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_code` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unit` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wt` decimal(5,2) DEFAULT '0.00',
  `pres_acc` decimal(5,2) DEFAULT '0.00',
  `prev_acc` decimal(5,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_328_schedule`
--

LOCK TABLES `project_328_schedule` WRITE;
/*!40000 ALTER TABLE `project_328_schedule` DISABLE KEYS */;
INSERT INTO `project_328_schedule` VALUES (1,100,'Preliminaries','2025-11-05','2025-11-23',15,'summary',NULL,0,0,0,0,'General',NULL,'Preliminaries','1',0.00,0.00,0.00,'2025-11-06 11:57:42'),(2,300,'Manufacturing and Importation Process','2025-11-23','2026-01-16',47,'summary',NULL,0,0,0,0,'General',NULL,'Manufacturing and Importation Process','1',0.00,0.00,0.00,'2025-11-06 11:57:42'),(3,103,'Submission of Drawing and Finishes for Approval','2025-11-16','2025-11-21',5,'task',100,0,0,0,0,'General',NULL,'Submission of Drawing and Finishes for Approval','1',0.00,0.00,0.00,'2025-11-06 11:57:42'),(4,102,'Layout of Drawing','2025-11-12','2025-11-16',3,'task',100,0,0,0,0,'General',NULL,'Layout of Drawing','1',0.00,0.00,0.00,'2025-11-06 11:57:42'),(5,104,'Submission of PO to Factory','2025-11-21','2025-11-23',1,'task',100,0,0,0,0,'General',NULL,'Submission of PO to Factory','1',0.00,0.00,0.00,'2025-11-06 11:57:42'),(6,301,'Manufacturing and Importation','2025-11-23','2026-01-16',47,'task',300,0,0,0,0,'General',NULL,'Manufacturing and Importation','1',0.00,0.00,0.00,'2025-11-06 11:57:42'),(7,200,'Structural/Civil Works','2025-11-23','2026-01-16',47,'summary',NULL,0,0,0,0,'General',NULL,'Structural/Civil Works','1',0.00,0.00,0.00,'2025-11-06 11:57:42'),(8,101,'Pre-Inspection(Checkin of Shaft)','2025-11-05','2025-11-12',6,'task',100,0,0,0,1,'General',NULL,'Pre-Inspection(Checkin of Shaft)','1',0.00,0.00,0.00,'2025-11-06 11:57:42'),(9,400,'Planning For Mobilization And Execution','2026-01-16','2026-02-18',28,'summary',NULL,0,0,0,0,'General',NULL,'Planning For Mobilization And Execution','1',0.00,0.00,0.00,'2025-11-06 11:57:42'),(10,201,'Shaft Construction','2025-11-23','2026-01-16',47,'task',200,0,0,0,0,'General',NULL,'Shaft Construction','1',0.00,0.00,0.00,'2025-11-06 11:57:42'),(11,401,'Preparation of tools and materials for elevator installation','2026-01-16','2026-02-02',14,'task',400,0,0,0,0,'General',NULL,'Preparation of tools and materials for elevator installation','1',0.00,0.00,0.00,'2025-11-06 11:57:42'),(12,402,'Layout of boardup markings','2026-02-02','2026-02-05',3,'task',400,0,0,0,0,'General',NULL,'Layout of boardup markings','1',0.00,0.00,0.00,'2025-11-06 11:57:42'),(13,403,'Partial delivery of tools and boardup materials','2026-02-05','2026-02-09',3,'task',400,0,0,0,0,'General',NULL,'Partial delivery of tools and boardup materials','1',0.00,0.00,0.00,'2025-11-06 11:57:42'),(14,501,'Unloading of elevator equipments','2026-02-18','2026-02-19',1,'task',500,0,0,0,0,'General','1','Unloading of elevator equipments','1',0.00,0.00,0.00,'2025-11-06 11:57:42'),(15,502,'Scaffolding Installation','2026-02-19','2026-02-22',2,'task',500,0,0,7,0,'General','2','Scaffolding Installation','1',7.00,0.00,0.00,'2025-11-06 11:57:42'),(16,503,'Hauling Works','2026-02-22','2026-02-24',2,'task',500,0,0,7,0,'General','3','Hauling Works','1',7.00,0.00,0.00,'2025-11-06 11:57:42'),(17,506,'Rail Bracket Installation','2026-02-27','2026-03-02',2,'task',500,0,0,7,0,'General','6','Rail Bracket Installation','1',7.00,0.00,0.00,'2025-11-06 11:57:42'),(18,404,'Preperation for Installation/Manufacturing','2026-02-09','2026-02-18',8,'task',400,0,0,0,0,'General',NULL,'Preperation for Installation/Manufacturing','1',0.00,0.00,0.00,'2025-11-06 11:57:42'),(19,500,'Mechanical Installation','2026-02-18','2026-04-12',45,'summary',NULL,0,0,0,0,'General',NULL,'Mechanical Installation','1',0.00,0.00,0.00,'2025-11-06 11:57:42'),(20,504,'Template Setting','2026-02-24','2026-02-26',2,'task',500,0,0,7,0,'General','4','Template Setting','1',7.00,0.00,0.00,'2025-11-06 11:57:42'),(21,505,'Marking and Boring of Holes','2026-02-26','2026-02-27',1,'task',500,0,0,0,0,'General','5','Marking and Boring of Holes','1',0.00,0.00,0.00,'2025-11-06 11:57:42'),(22,507,'Guide Rail Setting','2026-03-02','2026-03-08',5,'summary',500,0,0,0,0,'General',NULL,'Guide Rail Setting','1',0.00,0.00,0.00,'2025-11-06 11:57:42'),(23,508,'Main/Car','2026-03-02','2026-03-04',2,'task',507,0,0,5,0,'Guide Rail Setting','A','Main/Car','1',5.00,0.00,0.00,'2025-11-06 11:57:42'),(24,509,'Counterweight (CWT)','2026-03-04','2026-03-06',2,'task',507,0,0,3,0,'Guide Rail Setting','B','Counterweight (CWT)','1',3.00,0.00,0.00,'2025-11-06 11:57:42'),(25,510,'Gauging','2026-03-06','2026-03-08',1,'task',507,0,0,3,0,'Guide Rail Setting','C','Gauging','1',3.00,0.00,0.00,'2025-11-06 11:57:42'),(26,511,'Landing Door Assembly','2026-03-08','2026-03-15',6,'summary',500,0,0,0,0,'General',NULL,'Landing Door Assembly','1',0.00,0.00,0.00,'2025-11-06 11:57:42'),(27,512,'Sills and Supports','2026-03-08','2026-03-10',2,'task',511,0,0,2,0,'Landing Door Assembly','A','Sills and Supports','1',2.00,0.00,0.00,'2025-11-06 11:57:42'),(28,513,'Jamb and Supports','2026-03-10','2026-03-12',2,'task',511,0,0,2,0,'Landing Door Assembly','B','Jamb and Supports','1',2.00,0.00,0.00,'2025-11-06 11:57:42'),(29,514,'Frame and Doors','2026-03-12','2026-03-15',2,'task',511,0,0,3,0,'Landing Door Assembly','C','Frame and Doors','1',3.00,0.00,0.00,'2025-11-06 11:57:42'),(30,515,'M/R Equipment Setting','2026-03-15','2026-03-22',6,'summary',500,0,0,0,0,'General',NULL,'M/R Equipment Setting','1',0.00,0.00,0.00,'2025-11-06 11:57:42'),(31,516,'Traction Machine','2026-03-15','2026-03-17',2,'task',515,0,0,5,0,'M/R Equipment Setting','A','Traction Machine','1',5.00,0.00,0.00,'2025-11-06 11:57:42'),(32,517,'Support Beams','2026-03-17','2026-03-19',2,'task',515,0,0,5,0,'M/R Equipment Setting','B','Support Beams','1',5.00,0.00,0.00,'2025-11-06 11:57:42'),(33,518,'Governor','2026-03-19','2026-03-22',2,'task',515,0,0,2,0,'M/R Equipment Setting','C','Governor','1',2.00,0.00,0.00,'2025-11-06 11:57:42'),(34,519,'Installation of Control Panel','2026-03-22','2026-03-24',2,'task',500,0,0,3,0,'M/R Equipment Setting','D','Installation of Control Panel','1',3.00,0.00,0.00,'2025-11-06 11:57:42'),(35,520,'Car Assembly','2026-03-24','2026-03-27',3,'summary',500,0,0,0,0,'General',NULL,'Car Assembly','1',0.00,0.00,0.00,'2025-11-06 11:57:42'),(36,521,'All Accessories','2026-03-24','2026-03-26',2,'task',520,0,0,3,0,'Car Assembly','A','All Accessories','1',3.00,0.00,0.00,'2025-11-06 11:57:42'),(37,522,'Car Piping/Wiring','2026-03-26','2026-03-27',1,'task',520,0,0,3,0,'Car Assembly','B','Car Piping/Wiring','1',3.00,0.00,0.00,'2025-11-06 11:57:42'),(38,523,'Travelling Cable Layout','2026-03-27','2026-03-30',2,'task',500,0,0,2,0,'Car Assembly','C','Travelling Cable Layout','1',2.00,0.00,0.00,'2025-11-06 11:57:42'),(39,524,'Counterweight Assembly','2026-03-30','2026-04-01',2,'task',500,0,0,2,0,'Car Assembly','D','Counterweight Assembly','1',2.00,0.00,0.00,'2025-11-06 11:57:42'),(40,525,'Laying out of Ropes','2026-04-01','2026-04-07',5,'summary',500,0,0,0,0,'General',NULL,'Laying out of Ropes','1',0.00,0.00,0.00,'2025-11-06 11:57:42'),(41,526,'Hoisting','2026-04-01','2026-04-03',2,'task',525,0,0,2,0,'Laying out of ropes','A','Hoisting','1',2.00,0.00,0.00,'2025-11-06 11:57:42'),(42,527,'Governor','2026-04-03','2026-04-06',2,'task',525,0,0,3,0,'Compensating','B','Governor','1',3.00,0.00,0.00,'2025-11-06 11:57:42'),(43,528,'Compensating','2026-04-06','2026-04-07',1,'task',525,0,0,3,0,'Laying out of ropes','C','Compensating','1',3.00,0.00,0.00,'2025-11-06 11:57:42'),(44,529,'Wiring','2026-04-07','2026-04-09',2,'summary',500,0,0,0,0,'General',NULL,'Wiring','1',0.00,0.00,0.00,'2025-11-06 11:57:42'),(45,530,'Machine Room','2026-04-07','2026-04-08',1,'task',529,0,0,5,0,'Wiring','A','Machine Room','1',5.00,0.00,0.00,'2025-11-06 11:57:42'),(46,531,'Hoistway','2026-04-08','2026-04-09',1,'task',529,0,0,3,0,'Wiring','B','Hoistway','1',3.00,0.00,0.00,'2025-11-06 11:57:42'),(47,532,'Installation of Pit Ladder / Hoistway Lighting','2026-04-09','2026-04-12',2,'task',500,0,0,3,0,'Wiring','C','Installation of Pit Ladder / Hoistway Lighting','1',3.00,0.00,0.00,'2025-11-06 11:57:42'),(48,600,'Testing and Commissioning','2026-04-12','2026-04-29',15,'summary',NULL,0,0,0,0,'General',NULL,'Testing and Commissioning','1',0.00,0.00,0.00,'2025-11-06 11:57:42'),(49,601,'Initial testing','2026-04-12','2026-04-15',3,'task',600,0,0,3,0,'Testing and Commissioning (Passenger Elevator)','A','Initial testing','1',3.00,0.00,0.00,'2025-11-06 11:57:42'),(50,602,'Slow speed','2026-04-15','2026-04-17',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','B','Slow speed','1',1.00,0.00,0.00,'2025-11-06 11:57:42'),(51,603,'High speed and Mechanical Adjustment','2026-04-17','2026-04-20',2,'task',600,0,0,2,0,'Testing and Commissioning (Passenger Elevator)','C','High speed and Mechanical Adjustment','1',2.00,0.00,0.00,'2025-11-06 11:57:42'),(52,604,'Load Test','2026-04-20','2026-04-22',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','D','Load Test','1',1.00,0.00,0.00,'2025-11-06 11:57:42'),(53,605,'Final Adjust','2026-04-22','2026-04-24',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','E','Final Adjust','1',1.00,0.00,0.00,'2025-11-06 11:57:42'),(54,606,'Features Test / Correction of Defects','2026-04-24','2026-04-27',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','F','Features Test / Correction of Defects','1',1.00,0.00,0.00,'2025-11-06 11:57:42'),(55,607,'Final Cleaning / Hand over','2026-04-27','2026-04-29',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','G','Final Cleaning / Hand over','1',1.00,0.00,0.00,'2025-11-06 11:57:42');
/*!40000 ALTER TABLE `project_328_schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_329_schedule`
--

DROP TABLE IF EXISTS `project_329_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_329_schedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `task_id` int DEFAULT NULL,
  `task_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_start` date DEFAULT NULL,
  `task_end` date DEFAULT NULL,
  `task_duration` int DEFAULT NULL,
  `task_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_parent` int DEFAULT NULL,
  `task_approval` tinyint(1) DEFAULT '0',
  `task_done` tinyint(1) DEFAULT '0',
  `task_percent` int DEFAULT '0',
  `task_actual_current` tinyint DEFAULT '0',
  `section_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_code` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unit` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wt` decimal(5,2) DEFAULT '0.00',
  `pres_acc` decimal(5,2) DEFAULT '0.00',
  `prev_acc` decimal(5,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_329_schedule`
--

LOCK TABLES `project_329_schedule` WRITE;
/*!40000 ALTER TABLE `project_329_schedule` DISABLE KEYS */;
INSERT INTO `project_329_schedule` VALUES (1,100,'Preliminaries','2025-11-09','2025-12-02',15,'summary',NULL,0,0,0,0,'General',NULL,'Preliminaries','1',0.00,0.00,0.00,'2025-11-10 13:42:27'),(2,200,'Structural/Civil Works','2025-12-02','2026-02-05',47,'summary',NULL,0,0,0,0,'General',NULL,'Structural/Civil Works','1',0.00,0.00,0.00,'2025-11-10 13:42:27'),(3,201,'Shaft Construction','2025-12-02','2026-02-05',47,'task',200,0,0,0,0,'General',NULL,'Shaft Construction','1',0.00,0.00,0.00,'2025-11-10 13:42:27'),(4,104,'Submission of PO to Factory','2025-12-01','2025-12-02',1,'task',100,0,0,0,0,'General',NULL,'Submission of PO to Factory','1',0.00,0.00,0.00,'2025-11-10 13:42:27'),(5,103,'Submission of Drawing and Finishes for Approval','2025-11-24','2025-12-01',5,'task',100,0,0,0,0,'General',NULL,'Submission of Drawing and Finishes for Approval','1',0.00,0.00,0.00,'2025-11-10 13:42:27'),(6,301,'Manufacturing and Importation','2025-12-02','2026-02-05',47,'task',300,0,0,0,0,'General',NULL,'Manufacturing and Importation','1',0.00,0.00,0.00,'2025-11-10 13:42:27'),(7,101,'Pre-Inspection(Checkin of Shaft)','2025-11-09','2025-11-19',6,'task',100,0,0,0,1,'General',NULL,'Pre-Inspection(Checkin of Shaft)','1',0.00,0.00,0.00,'2025-11-10 13:42:27'),(8,300,'Manufacturing and Importation Process','2025-12-02','2026-02-05',47,'summary',NULL,0,0,0,0,'General',NULL,'Manufacturing and Importation Process','1',0.00,0.00,0.00,'2025-11-10 13:42:27'),(9,102,'Layout of Drawing','2025-11-19','2025-11-24',3,'task',100,0,0,0,0,'General',NULL,'Layout of Drawing','1',0.00,0.00,0.00,'2025-11-10 13:42:27'),(10,400,'Planning For Mobilization And Execution','2026-02-05','2026-03-18',29,'summary',NULL,0,0,0,0,'General',NULL,'Planning For Mobilization And Execution','1',0.00,0.00,0.00,'2025-11-10 13:42:27'),(11,401,'Preparation of tools and materials for elevator installation','2026-02-05','2026-02-25',14,'task',400,0,0,0,0,'General',NULL,'Preparation of tools and materials for elevator installation','1',0.00,0.00,0.00,'2025-11-10 13:42:27'),(12,402,'Layout of boardup markings','2026-02-25','2026-03-02',3,'task',400,0,0,0,0,'General',NULL,'Layout of boardup markings','1',0.00,0.00,0.00,'2025-11-10 13:42:27'),(13,403,'Partial delivery of tools and boardup materials','2026-03-02','2026-03-05',3,'task',400,0,0,0,0,'General',NULL,'Partial delivery of tools and boardup materials','1',0.00,0.00,0.00,'2025-11-10 13:42:27'),(14,404,'Preperation for Installation/Manufacturing','2026-03-05','2026-03-18',9,'task',400,0,0,0,0,'General',NULL,'Preperation for Installation/Manufacturing','1',0.00,0.00,0.00,'2025-11-10 13:42:27'),(15,500,'Mechanical Installation','2026-03-18','2026-05-20',45,'summary',NULL,0,0,0,0,'General',NULL,'Mechanical Installation','1',0.00,0.00,0.00,'2025-11-10 13:42:27'),(16,501,'Unloading of elevator equipments','2026-03-18','2026-03-19',1,'task',500,0,0,0,0,'General','1','Unloading of elevator equipments','1',0.00,0.00,0.00,'2025-11-10 13:42:27'),(17,502,'Scaffolding Installation','2026-03-19','2026-03-23',2,'task',500,0,0,7,0,'General','2','Scaffolding Installation','1',7.00,0.00,0.00,'2025-11-10 13:42:27'),(18,503,'Hauling Works','2026-03-23','2026-03-25',2,'task',500,0,0,7,0,'General','3','Hauling Works','1',7.00,0.00,0.00,'2025-11-10 13:42:27'),(19,504,'Template Setting','2026-03-25','2026-03-27',2,'task',500,0,0,7,0,'General','4','Template Setting','1',7.00,0.00,0.00,'2025-11-10 13:42:27'),(20,505,'Marking and Boring of Holes','2026-03-27','2026-03-30',1,'task',500,0,0,0,0,'General','5','Marking and Boring of Holes','1',0.00,0.00,0.00,'2025-11-10 13:42:27'),(21,506,'Rail Bracket Installation','2026-03-30','2026-04-01',2,'task',500,0,0,7,0,'General','6','Rail Bracket Installation','1',7.00,0.00,0.00,'2025-11-10 13:42:27'),(22,507,'Guide Rail Setting','2026-04-01','2026-04-08',5,'summary',500,0,0,0,0,'General',NULL,'Guide Rail Setting','1',0.00,0.00,0.00,'2025-11-10 13:42:27'),(23,508,'Main/Car','2026-04-01','2026-04-03',2,'task',507,0,0,5,0,'Guide Rail Setting','A','Main/Car','1',5.00,0.00,0.00,'2025-11-10 13:42:27'),(24,509,'Counterweight (CWT)','2026-04-03','2026-04-07',2,'task',507,0,0,3,0,'Guide Rail Setting','B','Counterweight (CWT)','1',3.00,0.00,0.00,'2025-11-10 13:42:27'),(25,510,'Gauging','2026-04-07','2026-04-08',1,'task',507,0,0,3,0,'Guide Rail Setting','C','Gauging','1',3.00,0.00,0.00,'2025-11-10 13:42:27'),(26,511,'Landing Door Assembly','2026-04-08','2026-04-16',6,'summary',500,0,0,0,0,'General',NULL,'Landing Door Assembly','1',0.00,0.00,0.00,'2025-11-10 13:42:27'),(27,512,'Sills and Supports','2026-04-08','2026-04-10',2,'task',511,0,0,2,0,'Landing Door Assembly','A','Sills and Supports','1',2.00,0.00,0.00,'2025-11-10 13:42:27'),(28,513,'Jamb and Supports','2026-04-10','2026-04-14',2,'task',511,0,0,2,0,'Landing Door Assembly','B','Jamb and Supports','1',2.00,0.00,0.00,'2025-11-10 13:42:27'),(29,514,'Frame and Doors','2026-04-14','2026-04-16',2,'task',511,0,0,3,0,'Landing Door Assembly','C','Frame and Doors','1',3.00,0.00,0.00,'2025-11-10 13:42:27'),(30,515,'M/R Equipment Setting','2026-04-16','2026-04-24',6,'summary',500,0,0,0,0,'General',NULL,'M/R Equipment Setting','1',0.00,0.00,0.00,'2025-11-10 13:42:27'),(31,516,'Traction Machine','2026-04-16','2026-04-20',2,'task',515,0,0,5,0,'M/R Equipment Setting','A','Traction Machine','1',5.00,0.00,0.00,'2025-11-10 13:42:27'),(32,517,'Support Beams','2026-04-20','2026-04-22',2,'task',515,0,0,5,0,'M/R Equipment Setting','B','Support Beams','1',5.00,0.00,0.00,'2025-11-10 13:42:27'),(33,518,'Governor','2026-04-22','2026-04-24',2,'task',515,0,0,2,0,'M/R Equipment Setting','C','Governor','1',2.00,0.00,0.00,'2025-11-10 13:42:27'),(34,519,'Installation of Control Panel','2026-04-24','2026-04-28',2,'task',500,0,0,3,0,'M/R Equipment Setting','D','Installation of Control Panel','1',3.00,0.00,0.00,'2025-11-10 13:42:27'),(35,520,'Car Assembly','2026-04-28','2026-05-01',3,'summary',500,0,0,0,0,'General',NULL,'Car Assembly','1',0.00,0.00,0.00,'2025-11-10 13:42:27'),(36,521,'All Accessories','2026-04-28','2026-04-30',2,'task',520,0,0,3,0,'Car Assembly','A','All Accessories','1',3.00,0.00,0.00,'2025-11-10 13:42:27'),(37,522,'Car Piping/Wiring','2026-04-30','2026-05-01',1,'task',520,0,0,3,0,'Car Assembly','B','Car Piping/Wiring','1',3.00,0.00,0.00,'2025-11-10 13:42:27'),(38,523,'Travelling Cable Layout','2026-05-01','2026-05-05',2,'task',500,0,0,2,0,'Car Assembly','C','Travelling Cable Layout','1',2.00,0.00,0.00,'2025-11-10 13:42:27'),(39,524,'Counterweight Assembly','2026-05-05','2026-05-07',2,'task',500,0,0,2,0,'Car Assembly','D','Counterweight Assembly','1',2.00,0.00,0.00,'2025-11-10 13:42:27'),(40,525,'Laying out of Ropes','2026-05-07','2026-05-14',5,'summary',500,0,0,0,0,'General',NULL,'Laying out of Ropes','1',0.00,0.00,0.00,'2025-11-10 13:42:27'),(41,526,'Hoisting','2026-05-07','2026-05-11',2,'task',525,0,0,2,0,'Laying out of ropes','A','Hoisting','1',2.00,0.00,0.00,'2025-11-10 13:42:27'),(42,527,'Governor','2026-05-11','2026-05-13',2,'task',525,0,0,3,0,'Compensating','B','Governor','1',3.00,0.00,0.00,'2025-11-10 13:42:27'),(43,528,'Compensating','2026-05-13','2026-05-14',1,'task',525,0,0,3,0,'Laying out of ropes','C','Compensating','1',3.00,0.00,0.00,'2025-11-10 13:42:27'),(44,529,'Wiring','2026-05-14','2026-05-18',2,'summary',500,0,0,0,0,'General',NULL,'Wiring','1',0.00,0.00,0.00,'2025-11-10 13:42:27'),(45,530,'Machine Room','2026-05-14','2026-05-15',1,'task',529,0,0,5,0,'Wiring','A','Machine Room','1',5.00,0.00,0.00,'2025-11-10 13:42:27'),(46,531,'Hoistway','2026-05-15','2026-05-18',1,'task',529,0,0,3,0,'Wiring','B','Hoistway','1',3.00,0.00,0.00,'2025-11-10 13:42:27'),(47,532,'Installation of Pit Ladder / Hoistway Lighting','2026-05-18','2026-05-20',2,'task',500,0,0,3,0,'Wiring','C','Installation of Pit Ladder / Hoistway Lighting','1',3.00,0.00,0.00,'2025-11-10 13:42:27'),(48,600,'Testing and Commissioning','2026-05-20','2026-06-10',15,'summary',NULL,0,0,0,0,'General',NULL,'Testing and Commissioning','1',0.00,0.00,0.00,'2025-11-10 13:42:27'),(49,601,'Initial testing','2026-05-20','2026-05-25',3,'task',600,0,0,3,0,'Testing and Commissioning (Passenger Elevator)','A','Initial testing','1',3.00,0.00,0.00,'2025-11-10 13:42:27'),(50,602,'Slow speed','2026-05-25','2026-05-27',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','B','Slow speed','1',1.00,0.00,0.00,'2025-11-10 13:42:27'),(51,603,'High speed and Mechanical Adjustment','2026-05-27','2026-05-29',2,'task',600,0,0,2,0,'Testing and Commissioning (Passenger Elevator)','C','High speed and Mechanical Adjustment','1',2.00,0.00,0.00,'2025-11-10 13:42:27'),(52,604,'Load Test','2026-05-29','2026-06-02',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','D','Load Test','1',1.00,0.00,0.00,'2025-11-10 13:42:27'),(53,605,'Final Adjust','2026-06-02','2026-06-04',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','E','Final Adjust','1',1.00,0.00,0.00,'2025-11-10 13:42:27'),(54,606,'Features Test / Correction of Defects','2026-06-04','2026-06-08',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','F','Features Test / Correction of Defects','1',1.00,0.00,0.00,'2025-11-10 13:42:27'),(55,607,'Final Cleaning / Hand over','2026-06-08','2026-06-10',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','G','Final Cleaning / Hand over','1',1.00,0.00,0.00,'2025-11-10 13:42:27');
/*!40000 ALTER TABLE `project_329_schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_330_schedule`
--

DROP TABLE IF EXISTS `project_330_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_330_schedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `task_id` int DEFAULT NULL,
  `task_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_start` date DEFAULT NULL,
  `task_end` date DEFAULT NULL,
  `task_duration` int DEFAULT NULL,
  `task_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_parent` int DEFAULT NULL,
  `task_approval` tinyint(1) DEFAULT '0',
  `task_done` tinyint(1) DEFAULT '0',
  `task_percent` int DEFAULT '0',
  `task_actual_current` tinyint DEFAULT '0',
  `section_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_code` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unit` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wt` decimal(5,2) DEFAULT '0.00',
  `pres_acc` decimal(5,2) DEFAULT '0.00',
  `prev_acc` decimal(5,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_330_schedule`
--

LOCK TABLES `project_330_schedule` WRITE;
/*!40000 ALTER TABLE `project_330_schedule` DISABLE KEYS */;
INSERT INTO `project_330_schedule` VALUES (1,101,'Pre-Inspection(Checkin of Shaft)','2025-11-05','2025-11-12',6,'task',100,0,0,0,1,'General',NULL,'Pre-Inspection(Checkin of Shaft)','1',0.00,0.00,0.00,'2025-11-06 12:01:03'),(2,300,'Manufacturing and Importation Process','2025-11-23','2026-01-16',47,'summary',NULL,0,0,0,0,'General',NULL,'Manufacturing and Importation Process','1',0.00,0.00,0.00,'2025-11-06 12:01:03'),(3,104,'Submission of PO to Factory','2025-11-21','2025-11-23',1,'task',100,0,0,0,0,'General',NULL,'Submission of PO to Factory','1',0.00,0.00,0.00,'2025-11-06 12:01:03'),(4,102,'Layout of Drawing','2025-11-12','2025-11-16',3,'task',100,0,0,0,0,'General',NULL,'Layout of Drawing','1',0.00,0.00,0.00,'2025-11-06 12:01:03'),(5,301,'Manufacturing and Importation','2025-11-23','2026-01-16',47,'task',300,0,0,0,0,'General',NULL,'Manufacturing and Importation','1',0.00,0.00,0.00,'2025-11-06 12:01:03'),(6,201,'Shaft Construction','2025-11-23','2026-01-16',47,'task',200,0,0,0,0,'General',NULL,'Shaft Construction','1',0.00,0.00,0.00,'2025-11-06 12:01:03'),(7,400,'Planning For Mobilization And Execution','2026-01-16','2026-02-18',28,'summary',NULL,0,0,0,0,'General',NULL,'Planning For Mobilization And Execution','1',0.00,0.00,0.00,'2025-11-06 12:01:03'),(8,103,'Submission of Drawing and Finishes for Approval','2025-11-16','2025-11-21',5,'task',100,0,0,0,0,'General',NULL,'Submission of Drawing and Finishes for Approval','1',0.00,0.00,0.00,'2025-11-06 12:01:03'),(9,100,'Preliminaries','2025-11-05','2025-11-23',15,'summary',NULL,0,0,0,0,'General',NULL,'Preliminaries','1',0.00,0.00,0.00,'2025-11-06 12:01:03'),(10,200,'Structural/Civil Works','2025-11-23','2026-01-16',47,'summary',NULL,0,0,0,0,'General',NULL,'Structural/Civil Works','1',0.00,0.00,0.00,'2025-11-06 12:01:03'),(11,401,'Preparation of tools and materials for elevator installation','2026-01-16','2026-02-02',14,'task',400,0,0,0,0,'General',NULL,'Preparation of tools and materials for elevator installation','1',0.00,0.00,0.00,'2025-11-06 12:01:03'),(12,402,'Layout of boardup markings','2026-02-02','2026-02-05',3,'task',400,0,0,0,0,'General',NULL,'Layout of boardup markings','1',0.00,0.00,0.00,'2025-11-06 12:01:03'),(13,403,'Partial delivery of tools and boardup materials','2026-02-05','2026-02-09',3,'task',400,0,0,0,0,'General',NULL,'Partial delivery of tools and boardup materials','1',0.00,0.00,0.00,'2025-11-06 12:01:03'),(14,404,'Preperation for Installation/Manufacturing','2026-02-09','2026-02-18',8,'task',400,0,0,0,0,'General',NULL,'Preperation for Installation/Manufacturing','1',0.00,0.00,0.00,'2025-11-06 12:01:03'),(15,500,'Mechanical Installation','2026-02-18','2026-04-12',45,'summary',NULL,0,0,0,0,'General',NULL,'Mechanical Installation','1',0.00,0.00,0.00,'2025-11-06 12:01:03'),(16,501,'Unloading of elevator equipments','2026-02-18','2026-02-19',1,'task',500,0,0,0,0,'General','1','Unloading of elevator equipments','1',0.00,0.00,0.00,'2025-11-06 12:01:03'),(17,502,'Scaffolding Installation','2026-02-19','2026-02-22',2,'task',500,0,0,7,0,'General','2','Scaffolding Installation','1',7.00,0.00,0.00,'2025-11-06 12:01:03'),(18,503,'Hauling Works','2026-02-22','2026-02-24',2,'task',500,0,0,7,0,'General','3','Hauling Works','1',7.00,0.00,0.00,'2025-11-06 12:01:03'),(19,504,'Template Setting','2026-02-24','2026-02-26',2,'task',500,0,0,7,0,'General','4','Template Setting','1',7.00,0.00,0.00,'2025-11-06 12:01:03'),(20,505,'Marking and Boring of Holes','2026-02-26','2026-02-27',1,'task',500,0,0,0,0,'General','5','Marking and Boring of Holes','1',0.00,0.00,0.00,'2025-11-06 12:01:03'),(21,506,'Rail Bracket Installation','2026-02-27','2026-03-02',2,'task',500,0,0,7,0,'General','6','Rail Bracket Installation','1',7.00,0.00,0.00,'2025-11-06 12:01:03'),(22,507,'Guide Rail Setting','2026-03-02','2026-03-08',5,'summary',500,0,0,0,0,'General',NULL,'Guide Rail Setting','1',0.00,0.00,0.00,'2025-11-06 12:01:03'),(23,508,'Main/Car','2026-03-02','2026-03-04',2,'task',507,0,0,5,0,'Guide Rail Setting','A','Main/Car','1',5.00,0.00,0.00,'2025-11-06 12:01:03'),(24,509,'Counterweight (CWT)','2026-03-04','2026-03-06',2,'task',507,0,0,3,0,'Guide Rail Setting','B','Counterweight (CWT)','1',3.00,0.00,0.00,'2025-11-06 12:01:03'),(25,510,'Gauging','2026-03-06','2026-03-08',1,'task',507,0,0,3,0,'Guide Rail Setting','C','Gauging','1',3.00,0.00,0.00,'2025-11-06 12:01:03'),(26,511,'Landing Door Assembly','2026-03-08','2026-03-15',6,'summary',500,0,0,0,0,'General',NULL,'Landing Door Assembly','1',0.00,0.00,0.00,'2025-11-06 12:01:03'),(27,512,'Sills and Supports','2026-03-08','2026-03-10',2,'task',511,0,0,2,0,'Landing Door Assembly','A','Sills and Supports','1',2.00,0.00,0.00,'2025-11-06 12:01:03'),(28,513,'Jamb and Supports','2026-03-10','2026-03-12',2,'task',511,0,0,2,0,'Landing Door Assembly','B','Jamb and Supports','1',2.00,0.00,0.00,'2025-11-06 12:01:03'),(29,514,'Frame and Doors','2026-03-12','2026-03-15',2,'task',511,0,0,3,0,'Landing Door Assembly','C','Frame and Doors','1',3.00,0.00,0.00,'2025-11-06 12:01:03'),(30,515,'M/R Equipment Setting','2026-03-15','2026-03-22',6,'summary',500,0,0,0,0,'General',NULL,'M/R Equipment Setting','1',0.00,0.00,0.00,'2025-11-06 12:01:03'),(31,516,'Traction Machine','2026-03-15','2026-03-17',2,'task',515,0,0,5,0,'M/R Equipment Setting','A','Traction Machine','1',5.00,0.00,0.00,'2025-11-06 12:01:03'),(32,517,'Support Beams','2026-03-17','2026-03-19',2,'task',515,0,0,5,0,'M/R Equipment Setting','B','Support Beams','1',5.00,0.00,0.00,'2025-11-06 12:01:03'),(33,518,'Governor','2026-03-19','2026-03-22',2,'task',515,0,0,2,0,'M/R Equipment Setting','C','Governor','1',2.00,0.00,0.00,'2025-11-06 12:01:03'),(34,519,'Installation of Control Panel','2026-03-22','2026-03-24',2,'task',500,0,0,3,0,'M/R Equipment Setting','D','Installation of Control Panel','1',3.00,0.00,0.00,'2025-11-06 12:01:03'),(35,520,'Car Assembly','2026-03-24','2026-03-27',3,'summary',500,0,0,0,0,'General',NULL,'Car Assembly','1',0.00,0.00,0.00,'2025-11-06 12:01:03'),(36,521,'All Accessories','2026-03-24','2026-03-26',2,'task',520,0,0,3,0,'Car Assembly','A','All Accessories','1',3.00,0.00,0.00,'2025-11-06 12:01:03'),(37,522,'Car Piping/Wiring','2026-03-26','2026-03-27',1,'task',520,0,0,3,0,'Car Assembly','B','Car Piping/Wiring','1',3.00,0.00,0.00,'2025-11-06 12:01:03'),(38,523,'Travelling Cable Layout','2026-03-27','2026-03-30',2,'task',500,0,0,2,0,'Car Assembly','C','Travelling Cable Layout','1',2.00,0.00,0.00,'2025-11-06 12:01:03'),(39,524,'Counterweight Assembly','2026-03-30','2026-04-01',2,'task',500,0,0,2,0,'Car Assembly','D','Counterweight Assembly','1',2.00,0.00,0.00,'2025-11-06 12:01:03'),(40,525,'Laying out of Ropes','2026-04-01','2026-04-07',5,'summary',500,0,0,0,0,'General',NULL,'Laying out of Ropes','1',0.00,0.00,0.00,'2025-11-06 12:01:03'),(41,526,'Hoisting','2026-04-01','2026-04-03',2,'task',525,0,0,2,0,'Laying out of ropes','A','Hoisting','1',2.00,0.00,0.00,'2025-11-06 12:01:03'),(42,527,'Governor','2026-04-03','2026-04-06',2,'task',525,0,0,3,0,'Compensating','B','Governor','1',3.00,0.00,0.00,'2025-11-06 12:01:03'),(43,528,'Compensating','2026-04-06','2026-04-07',1,'task',525,0,0,3,0,'Laying out of ropes','C','Compensating','1',3.00,0.00,0.00,'2025-11-06 12:01:03'),(44,529,'Wiring','2026-04-07','2026-04-09',2,'summary',500,0,0,0,0,'General',NULL,'Wiring','1',0.00,0.00,0.00,'2025-11-06 12:01:03'),(45,530,'Machine Room','2026-04-07','2026-04-08',1,'task',529,0,0,5,0,'Wiring','A','Machine Room','1',5.00,0.00,0.00,'2025-11-06 12:01:03'),(46,531,'Hoistway','2026-04-08','2026-04-09',1,'task',529,0,0,3,0,'Wiring','B','Hoistway','1',3.00,0.00,0.00,'2025-11-06 12:01:03'),(47,532,'Installation of Pit Ladder / Hoistway Lighting','2026-04-09','2026-04-12',2,'task',500,0,0,3,0,'Wiring','C','Installation of Pit Ladder / Hoistway Lighting','1',3.00,0.00,0.00,'2025-11-06 12:01:03'),(48,600,'Testing and Commissioning','2026-04-12','2026-04-29',15,'summary',NULL,0,0,0,0,'General',NULL,'Testing and Commissioning','1',0.00,0.00,0.00,'2025-11-06 12:01:03'),(49,601,'Initial testing','2026-04-12','2026-04-15',3,'task',600,0,0,3,0,'Testing and Commissioning (Passenger Elevator)','A','Initial testing','1',3.00,0.00,0.00,'2025-11-06 12:01:03'),(50,602,'Slow speed','2026-04-15','2026-04-17',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','B','Slow speed','1',1.00,0.00,0.00,'2025-11-06 12:01:03'),(51,603,'High speed and Mechanical Adjustment','2026-04-17','2026-04-20',2,'task',600,0,0,2,0,'Testing and Commissioning (Passenger Elevator)','C','High speed and Mechanical Adjustment','1',2.00,0.00,0.00,'2025-11-06 12:01:03'),(52,604,'Load Test','2026-04-20','2026-04-22',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','D','Load Test','1',1.00,0.00,0.00,'2025-11-06 12:01:03'),(53,605,'Final Adjust','2026-04-22','2026-04-24',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','E','Final Adjust','1',1.00,0.00,0.00,'2025-11-06 12:01:03'),(54,606,'Features Test / Correction of Defects','2026-04-24','2026-04-27',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','F','Features Test / Correction of Defects','1',1.00,0.00,0.00,'2025-11-06 12:01:03'),(55,607,'Final Cleaning / Hand over','2026-04-27','2026-04-29',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','G','Final Cleaning / Hand over','1',1.00,0.00,0.00,'2025-11-06 12:01:03');
/*!40000 ALTER TABLE `project_330_schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_331_schedule`
--

DROP TABLE IF EXISTS `project_331_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_331_schedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `task_id` int DEFAULT NULL,
  `task_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_start` date DEFAULT NULL,
  `task_end` date DEFAULT NULL,
  `task_duration` int DEFAULT NULL,
  `task_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_parent` int DEFAULT NULL,
  `task_approval` tinyint(1) DEFAULT '0',
  `task_done` tinyint(1) DEFAULT '0',
  `task_percent` int DEFAULT '0',
  `task_actual_current` tinyint DEFAULT '0',
  `section_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_code` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unit` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wt` decimal(5,2) DEFAULT '0.00',
  `pres_acc` decimal(5,2) DEFAULT '0.00',
  `prev_acc` decimal(5,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_331_schedule`
--

LOCK TABLES `project_331_schedule` WRITE;
/*!40000 ALTER TABLE `project_331_schedule` DISABLE KEYS */;
INSERT INTO `project_331_schedule` VALUES (1,200,'Structural/Civil Works','2025-05-29','2025-08-04',47,'summary',NULL,0,1,0,0,'General',NULL,'Structural/Civil Works','1',0.00,0.00,0.00,'2025-11-13 16:10:02'),(2,100,'Preliminaries','2025-05-08','2025-05-29',15,'summary',NULL,0,1,0,0,'General',NULL,'Preliminaries','1',0.00,0.00,0.00,'2025-11-13 16:10:02'),(3,104,'Submission of PO to Factory','2025-05-28','2025-05-29',1,'task',100,0,1,0,0,'General',NULL,'Submission of PO to Factory','1',0.00,0.00,0.00,'2025-11-13 16:10:02'),(4,102,'Layout of Drawing','2025-05-18','2025-05-21',3,'task',100,0,1,0,0,'General',NULL,'Layout of Drawing','1',0.00,0.00,0.00,'2025-11-13 16:10:02'),(5,201,'Shaft Construction','2025-05-29','2025-08-04',47,'task',200,0,1,0,0,'General',NULL,'Shaft Construction','1',0.00,0.00,0.00,'2025-11-13 16:10:02'),(6,103,'Submission of Drawing and Finishes for Approval','2025-05-21','2025-05-28',5,'task',100,0,1,0,0,'General',NULL,'Submission of Drawing and Finishes for Approval','1',0.00,0.00,0.00,'2025-11-13 16:10:02'),(7,300,'Manufacturing and Importation Process','2025-05-29','2025-08-04',47,'summary',NULL,0,1,0,0,'General',NULL,'Manufacturing and Importation Process','1',0.00,0.00,0.00,'2025-11-13 16:10:02'),(8,400,'Planning For Mobilization And Execution','2025-08-04','2025-09-11',28,'summary',NULL,0,1,0,0,'General',NULL,'Planning For Mobilization And Execution','1',0.00,0.00,0.00,'2025-11-13 16:10:02'),(9,301,'Manufacturing and Importation','2025-05-29','2025-08-04',47,'task',300,0,1,0,0,'General',NULL,'Manufacturing and Importation','1',0.00,0.00,0.00,'2025-11-13 16:10:02'),(10,101,'Pre-Inspection(Checkin of Shaft)','2025-05-08','2025-05-18',6,'task',100,0,1,0,0,'General',NULL,'Pre-Inspection(Checkin of Shaft)','1',0.00,0.00,0.00,'2025-11-13 16:10:02'),(11,401,'Preparation of tools and materials for elevator installation','2025-08-04','2025-08-24',14,'task',400,0,1,0,0,'General',NULL,'Preparation of tools and materials for elevator installation','1',0.00,0.00,0.00,'2025-11-13 16:10:03'),(12,402,'Layout of boardup markings','2025-08-24','2025-08-27',3,'task',400,0,1,0,0,'General',NULL,'Layout of boardup markings','1',0.00,0.00,0.00,'2025-11-13 16:10:03'),(13,403,'Partial delivery of tools and boardup materials','2025-08-27','2025-09-01',3,'task',400,0,1,0,0,'General',NULL,'Partial delivery of tools and boardup materials','1',0.00,0.00,0.00,'2025-11-13 16:10:03'),(14,404,'Preperation for Installation/Manufacturing','2025-09-01','2025-09-11',8,'task',400,0,1,0,0,'General',NULL,'Preperation for Installation/Manufacturing','1',0.00,0.00,0.00,'2025-11-13 16:10:03'),(15,500,'Mechanical Installation','2025-09-11','2025-11-13',45,'summary',NULL,0,1,0,0,'General',NULL,'Mechanical Installation','1',0.00,0.00,0.00,'2025-11-13 16:10:03'),(16,501,'Unloading of elevator equipments','2025-09-11','2025-09-14',1,'task',500,0,1,0,0,'General','1','Unloading of elevator equipments','1',0.00,0.00,0.00,'2025-11-13 16:10:03'),(17,503,'Hauling Works','2025-09-16','2025-09-18',2,'task',500,0,1,7,0,'General','3','Hauling Works','1',7.00,0.00,0.00,'2025-11-13 16:10:03'),(18,502,'Scaffolding Installation','2025-09-14','2025-09-16',2,'task',500,0,1,7,0,'General','2','Scaffolding Installation','1',7.00,0.00,0.00,'2025-11-13 16:10:03'),(19,504,'Template Setting','2025-09-18','2025-09-22',2,'task',500,0,1,7,0,'General','4','Template Setting','1',7.00,0.00,0.00,'2025-11-13 16:10:03'),(20,505,'Marking and Boring of Holes','2025-09-22','2025-09-23',1,'task',500,0,1,0,0,'General','5','Marking and Boring of Holes','1',0.00,0.00,0.00,'2025-11-13 16:10:03'),(21,506,'Rail Bracket Installation','2025-09-23','2025-09-25',2,'task',500,0,1,7,0,'General','6','Rail Bracket Installation','1',7.00,0.00,0.00,'2025-11-13 16:10:03'),(22,507,'Guide Rail Setting','2025-09-25','2025-10-02',5,'summary',500,0,1,0,0,'General',NULL,'Guide Rail Setting','1',0.00,0.00,0.00,'2025-11-13 16:10:03'),(23,508,'Main/Car','2025-09-25','2025-09-29',2,'task',507,0,1,5,0,'Guide Rail Setting','A','Main/Car','1',5.00,0.00,0.00,'2025-11-13 16:10:03'),(24,509,'Counterweight (CWT)','2025-09-29','2025-10-01',2,'task',507,0,1,3,0,'Guide Rail Setting','B','Counterweight (CWT)','1',3.00,0.00,0.00,'2025-11-13 16:10:03'),(25,510,'Gauging','2025-10-01','2025-10-02',1,'task',507,0,1,3,0,'Guide Rail Setting','C','Gauging','1',3.00,0.00,0.00,'2025-11-13 16:10:03'),(26,511,'Landing Door Assembly','2025-10-02','2025-10-12',6,'summary',500,0,1,0,0,'General',NULL,'Landing Door Assembly','1',0.00,0.00,0.00,'2025-11-13 16:10:03'),(27,512,'Sills and Supports','2025-10-02','2025-10-06',2,'task',511,0,1,2,0,'Landing Door Assembly','A','Sills and Supports','1',2.00,0.00,0.00,'2025-11-13 16:10:03'),(28,513,'Jamb and Supports','2025-10-06','2025-10-08',2,'task',511,0,1,2,0,'Landing Door Assembly','B','Jamb and Supports','1',2.00,0.00,0.00,'2025-11-13 16:10:03'),(29,514,'Frame and Doors','2025-10-08','2025-10-12',2,'task',511,0,1,3,0,'Landing Door Assembly','C','Frame and Doors','1',3.00,0.00,0.00,'2025-11-13 16:10:03'),(30,515,'M/R Equipment Setting','2025-10-12','2025-10-20',6,'summary',500,0,1,0,0,'General',NULL,'M/R Equipment Setting','1',0.00,0.00,0.00,'2025-11-13 16:10:03'),(31,516,'Traction Machine','2025-10-12','2025-10-14',2,'task',515,0,1,5,0,'M/R Equipment Setting','A','Traction Machine','1',5.00,0.00,0.00,'2025-11-13 16:10:03'),(32,517,'Support Beams','2025-10-14','2025-10-16',2,'task',515,0,1,5,1,'M/R Equipment Setting','B','Support Beams','1',5.00,0.00,0.00,'2025-11-13 16:10:03'),(33,518,'Governor (M/R)','2025-10-16','2025-10-20',2,'task',515,0,1,2,0,'M/R Equipment Setting','C','Governor (M/R)','1',2.00,0.00,0.00,'2025-11-13 16:10:03'),(34,519,'Installation of Control Panel','2025-10-20','2025-10-22',2,'task',500,0,1,3,0,'M/R Equipment Setting','D','Installation of Control Panel','1',3.00,0.00,0.00,'2025-11-13 16:10:03'),(35,520,'Car Assembly','2025-10-22','2025-10-27',3,'summary',500,0,1,0,0,'General',NULL,'Car Assembly','1',0.00,0.00,0.00,'2025-11-13 16:10:03'),(36,521,'All Accessories','2025-10-22','2025-10-26',2,'task',520,0,1,3,0,'Car Assembly','A','All Accessories','1',3.00,0.00,0.00,'2025-11-13 16:10:03'),(37,522,'Car Piping/Wiring','2025-10-26','2025-10-27',1,'task',520,0,1,3,0,'Car Assembly','B','Car Piping/Wiring','1',3.00,0.00,0.00,'2025-11-13 16:10:03'),(38,523,'Travelling Cable Layout','2025-10-27','2025-10-29',2,'task',500,0,1,2,0,'Car Assembly','C','Travelling Cable Layout','1',2.00,0.00,0.00,'2025-11-13 16:10:03'),(39,524,'Counterweight Assembly','2025-10-29','2025-11-02',2,'task',500,0,1,2,0,'Car Assembly','D','Counterweight Assembly','1',2.00,0.00,0.00,'2025-11-13 16:10:03'),(40,525,'Laying out of Ropes','2025-11-02','2025-11-09',5,'summary',500,0,1,0,0,'General',NULL,'Laying out of Ropes','1',0.00,0.00,0.00,'2025-11-13 16:10:03'),(41,526,'Hoisting','2025-11-02','2025-11-04',2,'task',525,0,1,2,0,'Laying out of ropes','A','Hoisting','1',2.00,0.00,0.00,'2025-11-13 16:10:03'),(42,527,'Governor (Ropes)','2025-11-04','2025-11-06',2,'task',525,0,1,3,0,'Compensating','B','Governor (Ropes)','1',3.00,0.00,0.00,'2025-11-13 16:10:03'),(43,528,'Compensating','2025-11-06','2025-11-09',1,'task',525,0,1,3,0,'Laying out of ropes','C','Compensating','1',3.00,0.00,0.00,'2025-11-13 16:10:03'),(44,529,'Wiring','2025-11-09','2025-11-11',2,'summary',500,0,1,0,0,'General',NULL,'Wiring','1',0.00,0.00,0.00,'2025-11-13 16:10:03'),(45,530,'Machine Room','2025-11-09','2025-11-10',1,'task',529,0,1,5,0,'Wiring','A','Machine Room','1',5.00,0.00,0.00,'2025-11-13 16:10:03'),(46,531,'Hoistway','2025-11-10','2025-11-11',1,'task',529,0,1,3,0,'Wiring','B','Hoistway','1',3.00,0.00,0.00,'2025-11-13 16:10:03'),(47,532,'Installation of Pit Ladder / Hoistway Lighting','2025-11-11','2025-11-13',2,'task',500,0,1,3,0,'Wiring','C','Installation of Pit Ladder / Hoistway Lighting','1',3.00,0.00,0.00,'2025-11-13 16:10:03'),(48,600,'Testing and Commissioning','2025-11-15','2025-12-06',15,'summary',NULL,0,0,0,0,'General',NULL,'Testing and Commissioning','1',0.00,0.00,0.00,'2025-11-13 16:10:03'),(49,601,'Initial testing','2025-11-15','2025-11-20',3,'task',600,0,0,3,0,'Testing and Commissioning (Passenger Elevator)','A','Initial testing','1',3.00,0.00,0.00,'2025-11-13 16:10:03'),(50,602,'Slow speed','2025-11-20','2025-11-22',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','B','Slow speed','1',1.00,0.00,0.00,'2025-11-13 16:10:03'),(51,603,'High speed and Mechanical Adjustment','2025-11-22','2025-11-26',2,'task',600,0,0,2,0,'Testing and Commissioning (Passenger Elevator)','C','High speed and Mechanical Adjustment','1',2.00,0.00,0.00,'2025-11-13 16:10:03'),(52,604,'Load Test','2025-11-26','2025-11-28',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','D','Load Test','1',1.00,0.00,0.00,'2025-11-13 16:10:03'),(53,605,'Final Adjust','2025-11-28','2025-12-02',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','E','Final Adjust','1',1.00,0.00,0.00,'2025-11-13 16:10:03'),(54,606,'Features Test / Correction of Defects','2025-12-02','2025-12-04',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','F','Features Test / Correction of Defects','1',1.00,0.00,0.00,'2025-11-13 16:10:03'),(55,607,'Final Cleaning / Hand over','2025-12-04','2025-12-06',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','G','Final Cleaning / Hand over','1',1.00,0.00,0.00,'2025-11-13 16:10:03');
/*!40000 ALTER TABLE `project_331_schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_333_schedule`
--

DROP TABLE IF EXISTS `project_333_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_333_schedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `task_id` int DEFAULT NULL,
  `task_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_start` date DEFAULT NULL,
  `task_end` date DEFAULT NULL,
  `task_duration` int DEFAULT NULL,
  `task_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_parent` int DEFAULT NULL,
  `task_approval` tinyint(1) DEFAULT '0',
  `task_done` tinyint(1) DEFAULT '0',
  `task_percent` int DEFAULT '0',
  `task_actual_current` tinyint DEFAULT '0',
  `section_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_code` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unit` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wt` decimal(5,2) DEFAULT '0.00',
  `pres_acc` decimal(5,2) DEFAULT '0.00',
  `prev_acc` decimal(5,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_333_schedule`
--

LOCK TABLES `project_333_schedule` WRITE;
/*!40000 ALTER TABLE `project_333_schedule` DISABLE KEYS */;
INSERT INTO `project_333_schedule` VALUES (1,103,'Submission of Drawing and Finishes for Approval','2025-05-28','2025-06-04',5,'task',100,0,1,0,0,'General',NULL,'Submission of Drawing and Finishes for Approval','1',0.00,100.00,0.00,'2025-11-13 10:40:32'),(2,400,'Planning For Mobilization And Execution','2025-08-11','2025-09-18',28,'summary',NULL,0,1,0,0,'General',NULL,'Planning For Mobilization And Execution','1',0.00,100.00,0.00,'2025-11-13 10:40:32'),(3,300,'Manufacturing and Importation Process','2025-06-05','2025-08-11',47,'summary',NULL,0,1,0,0,'General',NULL,'Manufacturing and Importation Process','1',0.00,100.00,0.00,'2025-11-13 10:40:32'),(4,101,'Pre-Inspection(Checkin of Shaft)','2025-05-15','2025-05-25',6,'task',100,0,1,0,0,'General',NULL,'Pre-Inspection(Checkin of Shaft)','1',0.00,100.00,0.00,'2025-11-13 10:40:32'),(5,102,'Layout of Drawing','2025-05-25','2025-05-28',3,'task',100,0,1,0,0,'General',NULL,'Layout of Drawing','1',0.00,100.00,0.00,'2025-11-13 10:40:32'),(6,301,'Manufacturing and Importation','2025-06-05','2025-08-11',47,'task',300,0,1,0,0,'General',NULL,'Manufacturing and Importation','1',0.00,100.00,0.00,'2025-11-13 10:40:32'),(7,201,'Shaft Construction','2025-06-05','2025-08-11',47,'task',200,0,1,0,0,'General',NULL,'Shaft Construction','1',0.00,100.00,0.00,'2025-11-13 10:40:32'),(8,200,'Structural/Civil Works','2025-06-05','2025-08-11',47,'summary',NULL,0,1,0,0,'General',NULL,'Structural/Civil Works','1',0.00,100.00,0.00,'2025-11-13 10:40:32'),(9,100,'Preliminaries','2025-05-15','2025-06-05',15,'summary',NULL,0,1,0,0,'General',NULL,'Preliminaries','1',0.00,100.00,0.00,'2025-11-13 10:40:32'),(10,104,'Submission of PO to Factory','2025-06-04','2025-06-05',1,'task',100,0,1,0,0,'General',NULL,'Submission of PO to Factory','1',0.00,100.00,0.00,'2025-11-13 10:40:32'),(11,401,'Preparation of tools and materials for elevator installation','2025-08-11','2025-08-31',14,'task',400,0,1,0,0,'General',NULL,'Preparation of tools and materials for elevator installation','1',0.00,100.00,0.00,'2025-11-13 10:40:33'),(12,403,'Partial delivery of tools and boardup materials','2025-09-03','2025-09-08',3,'task',400,0,1,0,0,'General',NULL,'Partial delivery of tools and boardup materials','1',0.00,100.00,0.00,'2025-11-13 10:40:33'),(13,402,'Layout of boardup markings','2025-08-31','2025-09-03',3,'task',400,0,1,0,0,'General',NULL,'Layout of boardup markings','1',0.00,100.00,0.00,'2025-11-13 10:40:33'),(14,404,'Preperation for Installation/Manufacturing','2025-09-08','2025-09-18',8,'task',400,0,1,0,0,'General',NULL,'Preperation for Installation/Manufacturing','1',0.00,100.00,0.00,'2025-11-13 10:40:33'),(15,500,'Mechanical Installation','2025-09-18','2025-11-20',45,'summary',NULL,0,1,0,0,'General',NULL,'Mechanical Installation','1',0.00,100.00,0.00,'2025-11-13 10:40:33'),(16,502,'Scaffolding Installation','2025-09-21','2025-09-23',2,'task',500,1,1,7,0,'General','2','Scaffolding Installation','1',7.00,100.00,0.00,'2025-11-13 10:40:33'),(17,503,'Hauling Works','2025-09-23','2025-09-25',2,'task',500,1,1,7,0,'General','3','Hauling Works','1',7.00,100.00,0.00,'2025-11-13 10:40:33'),(18,504,'Template Setting','2025-09-25','2025-09-29',2,'task',500,1,1,7,0,'General','4','Template Setting','1',7.00,100.00,0.00,'2025-11-13 10:40:33'),(19,501,'Unloading of elevator equipments','2025-09-18','2025-09-21',1,'task',500,1,1,0,0,'General','1','Unloading of elevator equipments','1',0.00,100.00,0.00,'2025-11-13 10:40:33'),(20,505,'Marking and Boring of Holes','2025-09-29','2025-09-30',1,'task',500,1,1,0,0,'General','5','Marking and Boring of Holes','1',0.00,100.00,0.00,'2025-11-13 10:40:33'),(21,506,'Rail Bracket Installation','2025-09-30','2025-10-02',2,'task',500,1,1,7,0,'General','6','Rail Bracket Installation','1',7.00,100.00,0.00,'2025-11-13 10:40:33'),(22,507,'Guide Rail Setting','2025-10-02','2025-10-09',5,'summary',500,0,1,0,0,'General',NULL,'Guide Rail Setting','1',0.00,100.00,0.00,'2025-11-13 10:40:33'),(23,508,'Main/Car','2025-10-02','2025-10-06',2,'task',507,1,1,5,0,'Guide Rail Setting','A','Main/Car','1',5.00,100.00,0.00,'2025-11-13 10:40:33'),(24,509,'Counterweight (CWT)','2025-10-06','2025-10-08',2,'task',507,1,1,3,0,'Guide Rail Setting','B','Counterweight (CWT)','1',3.00,100.00,0.00,'2025-11-13 10:40:33'),(25,510,'Gauging','2025-10-08','2025-10-09',1,'task',507,1,1,3,0,'Guide Rail Setting','C','Gauging','1',3.00,100.00,0.00,'2025-11-13 10:40:33'),(26,511,'Landing Door Assembly','2025-10-09','2025-10-19',6,'summary',500,0,1,0,0,'General',NULL,'Landing Door Assembly','1',0.00,100.00,0.00,'2025-11-13 10:40:33'),(27,512,'Sills and Supports','2025-10-09','2025-10-13',2,'task',511,1,1,2,0,'Landing Door Assembly','A','Sills and Supports','1',2.00,100.00,0.00,'2025-11-13 10:40:33'),(28,513,'Jamb and Supports','2025-10-13','2025-10-15',2,'task',511,1,1,2,0,'Landing Door Assembly','B','Jamb and Supports','1',2.00,100.00,0.00,'2025-11-13 10:40:33'),(29,514,'Frame and Doors','2025-10-15','2025-10-19',2,'task',511,1,1,3,0,'Landing Door Assembly','C','Frame and Doors','1',3.00,100.00,0.00,'2025-11-13 10:40:33'),(30,515,'M/R Equipment Setting','2025-10-19','2025-10-27',6,'summary',500,0,1,0,0,'General',NULL,'M/R Equipment Setting','1',0.00,100.00,0.00,'2025-11-13 10:40:33'),(31,516,'Traction Machine','2025-10-19','2025-10-21',2,'task',515,1,1,5,0,'M/R Equipment Setting','A','Traction Machine','1',5.00,100.00,0.00,'2025-11-13 10:40:33'),(32,517,'Support Beams','2025-10-21','2025-10-23',2,'task',515,1,1,5,0,'M/R Equipment Setting','B','Support Beams','1',5.00,100.00,0.00,'2025-11-13 10:40:33'),(33,518,'Governor (M/R)','2025-10-23','2025-10-27',2,'task',515,1,1,2,0,'M/R Equipment Setting','C','Governor','1',2.00,100.00,0.00,'2025-11-13 10:40:33'),(34,519,'Installation of Control Panel','2025-10-27','2025-10-29',2,'task',500,1,1,3,0,'M/R Equipment Setting','D','Installation of Control Panel','1',3.00,100.00,0.00,'2025-11-13 10:40:33'),(35,520,'Car Assembly','2025-10-29','2025-11-03',3,'summary',500,0,1,0,0,'General',NULL,'Car Assembly','1',0.00,100.00,0.00,'2025-11-13 10:40:33'),(36,521,'All Accessories','2025-10-29','2025-11-02',2,'task',520,1,1,3,0,'Car Assembly','A','All Accessories','1',3.00,100.00,0.00,'2025-11-13 10:40:33'),(37,522,'Car Piping/Wiring','2025-11-02','2025-11-03',1,'task',520,1,1,3,0,'Car Assembly','B','Car Piping/Wiring','1',3.00,100.00,0.00,'2025-11-13 10:40:33'),(38,523,'Travelling Cable Layout','2025-11-03','2025-11-05',2,'task',500,1,1,2,0,'Car Assembly','C','Travelling Cable Layout','1',2.00,100.00,0.00,'2025-11-13 10:40:33'),(39,524,'Counterweight Assembly','2025-11-05','2025-11-09',2,'task',500,1,1,2,0,'Car Assembly','D','Counterweight Assembly','1',2.00,100.00,0.00,'2025-11-13 10:40:33'),(40,525,'Laying out of Ropes','2025-11-09','2025-11-16',5,'summary',500,0,1,0,0,'General',NULL,'Laying out of Ropes','1',0.00,100.00,0.00,'2025-11-13 10:40:33'),(41,526,'Hoisting','2025-11-09','2025-11-11',2,'task',525,1,1,2,0,'Laying out of ropes','A','Hoisting','1',2.00,100.00,0.00,'2025-11-13 10:40:33'),(42,527,'Governor (Ropes)','2025-11-11','2025-11-13',2,'task',525,1,1,3,0,'Compensating','B','Governor','1',3.00,100.00,0.00,'2025-11-13 10:40:33'),(43,528,'Compensating','2025-11-13','2025-11-16',1,'task',525,1,1,3,0,'Laying out of ropes','C','Compensating','1',3.00,100.00,0.00,'2025-11-13 10:40:33'),(44,529,'Wiring','2025-11-16','2025-11-18',2,'summary',500,0,0,0,0,'General',NULL,'Wiring','1',0.00,0.00,0.00,'2025-11-13 10:40:33'),(45,530,'Machine Room','2025-11-16','2025-11-17',1,'task',529,0,0,5,1,'Wiring','A','Machine Room','1',5.00,0.00,0.00,'2025-11-13 10:40:33'),(46,531,'Hoistway','2025-11-17','2025-11-18',1,'task',529,0,0,3,0,'Wiring','B','Hoistway','1',3.00,0.00,0.00,'2025-11-13 10:40:33'),(47,532,'Installation of Pit Ladder / Hoistway Lighting','2025-11-18','2025-11-20',2,'task',500,0,0,3,0,'Wiring','C','Installation of Pit Ladder / Hoistway Lighting','1',3.00,0.00,0.00,'2025-11-13 10:40:33'),(48,600,'Testing and Commissioning','2025-11-20','2025-12-11',15,'summary',NULL,0,0,0,0,'General',NULL,'Testing and Commissioning','1',0.00,0.00,0.00,'2025-11-13 10:40:33'),(49,601,'Initial testing','2025-11-20','2025-11-25',3,'task',600,0,0,3,0,'Testing and Commissioning (Passenger Elevator)','A','Initial testing','1',3.00,0.00,0.00,'2025-11-13 10:40:33'),(50,602,'Slow speed','2025-11-25','2025-11-27',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','B','Slow speed','1',1.00,0.00,0.00,'2025-11-13 10:40:33'),(51,603,'High speed and Mechanical Adjustment','2025-11-27','2025-12-01',2,'task',600,0,0,2,0,'Testing and Commissioning (Passenger Elevator)','C','High speed and Mechanical Adjustment','1',2.00,0.00,0.00,'2025-11-13 10:40:33'),(52,604,'Load Test','2025-12-01','2025-12-03',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','D','Load Test','1',1.00,0.00,0.00,'2025-11-13 10:40:33'),(53,605,'Final Adjust','2025-12-03','2025-12-07',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','E','Final Adjust','1',1.00,0.00,0.00,'2025-11-13 10:40:33'),(54,606,'Features Test / Correction of Defects','2025-12-07','2025-12-09',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','F','Features Test / Correction of Defects','1',1.00,0.00,0.00,'2025-11-13 10:40:33'),(55,607,'Final Cleaning / Hand over','2025-12-09','2025-12-11',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','G','Final Cleaning / Hand over','1',1.00,0.00,0.00,'2025-11-13 10:40:33');
/*!40000 ALTER TABLE `project_333_schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_339_schedule`
--

DROP TABLE IF EXISTS `project_339_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_339_schedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `task_id` int DEFAULT NULL,
  `task_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_start` date DEFAULT NULL,
  `task_end` date DEFAULT NULL,
  `task_duration` int DEFAULT NULL,
  `task_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_parent` int DEFAULT NULL,
  `task_approval` tinyint(1) DEFAULT '0',
  `task_done` tinyint(1) DEFAULT '0',
  `task_percent` int DEFAULT '0',
  `task_actual_current` tinyint DEFAULT '0',
  `section_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_code` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unit` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wt` decimal(5,2) DEFAULT '0.00',
  `pres_acc` decimal(5,2) DEFAULT '0.00',
  `prev_acc` decimal(5,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_339_schedule`
--

LOCK TABLES `project_339_schedule` WRITE;
/*!40000 ALTER TABLE `project_339_schedule` DISABLE KEYS */;
INSERT INTO `project_339_schedule` VALUES (1,101,'Pre-Inspection(Checkin of Shaft)','2025-05-21','2025-05-29',6,'task',100,0,1,0,0,'General',NULL,'Pre-Inspection(Checkin of Shaft)','1',0.00,100.00,0.00,'2025-11-09 12:59:58'),(2,104,'Submission of PO to Factory','2025-06-10','2025-06-11',1,'task',100,0,1,0,0,'General',NULL,'Submission of PO to Factory','1',0.00,100.00,0.00,'2025-11-09 12:59:58'),(3,400,'Planning For Mobilization And Execution','2025-08-17','2025-09-24',28,'summary',NULL,0,1,0,0,'General',NULL,'Planning For Mobilization And Execution','1',0.00,100.00,0.00,'2025-11-09 12:59:58'),(4,301,'Manufacturing and Importation','2025-06-11','2025-08-17',47,'task',300,0,1,0,0,'General',NULL,'Manufacturing and Importation','1',0.00,100.00,0.00,'2025-11-09 12:59:58'),(5,100,'Preliminaries','2025-05-21','2025-06-11',15,'summary',NULL,0,1,0,0,'General',NULL,'Preliminaries','1',0.00,100.00,0.00,'2025-11-09 12:59:58'),(6,201,'Shaft Construction','2025-06-11','2025-08-17',47,'task',200,0,1,0,0,'General',NULL,'Shaft Construction','1',0.00,100.00,0.00,'2025-11-09 12:59:58'),(7,102,'Layout of Drawing','2025-05-29','2025-06-03',3,'task',100,0,1,0,0,'General',NULL,'Layout of Drawing','1',0.00,100.00,0.00,'2025-11-09 12:59:58'),(8,300,'Manufacturing and Importation Process','2025-06-11','2025-08-17',47,'summary',NULL,0,1,0,0,'General',NULL,'Manufacturing and Importation Process','1',0.00,100.00,0.00,'2025-11-09 12:59:58'),(9,200,'Structural/Civil Works','2025-06-11','2025-08-17',47,'summary',NULL,0,1,0,0,'General',NULL,'Structural/Civil Works','1',0.00,100.00,0.00,'2025-11-09 12:59:58'),(10,103,'Submission of Drawing and Finishes for Approval','2025-06-03','2025-06-10',5,'task',100,0,1,0,0,'General',NULL,'Submission of Drawing and Finishes for Approval','1',0.00,100.00,0.00,'2025-11-09 12:59:58'),(11,401,'Preparation of tools and materials for elevator installation','2025-08-17','2025-09-04',14,'task',400,0,1,0,0,'General',NULL,'Preparation of tools and materials for elevator installation','1',0.00,100.00,0.00,'2025-11-09 12:59:58'),(12,402,'Layout of boardup markings','2025-09-04','2025-09-09',3,'task',400,0,1,0,0,'General',NULL,'Layout of boardup markings','1',0.00,100.00,0.00,'2025-11-09 12:59:58'),(13,403,'Partial delivery of tools and boardup materials','2025-09-09','2025-09-14',3,'task',400,0,1,0,0,'General',NULL,'Partial delivery of tools and boardup materials','1',0.00,100.00,0.00,'2025-11-09 12:59:58'),(14,404,'Preperation for Installation/Manufacturing','2025-09-14','2025-09-24',8,'task',400,0,1,0,0,'General',NULL,'Preperation for Installation/Manufacturing','1',0.00,100.00,0.00,'2025-11-09 12:59:58'),(15,500,'Mechanical Installation','2025-09-24','2025-11-26',45,'summary',NULL,0,1,0,0,'General',NULL,'Mechanical Installation','1',0.00,100.00,0.00,'2025-11-09 12:59:58'),(16,501,'Unloading of elevator equipments','2025-09-24','2025-09-25',1,'task',500,0,1,0,0,'General','1','Unloading of elevator equipments','1',0.00,100.00,0.00,'2025-11-09 12:59:58'),(17,502,'Scaffolding Installation','2025-09-25','2025-09-29',2,'task',500,0,1,7,0,'General','2','Scaffolding Installation','1',7.00,100.00,0.00,'2025-11-09 12:59:58'),(18,503,'Hauling Works','2025-09-29','2025-10-01',2,'task',500,0,1,7,0,'General','3','Hauling Works','1',7.00,100.00,0.00,'2025-11-09 12:59:58'),(19,504,'Template Setting','2025-10-01','2025-10-05',2,'task',500,0,1,7,0,'General','4','Template Setting','1',7.00,100.00,0.00,'2025-11-09 12:59:58'),(20,505,'Marking and Boring of Holes','2025-10-05','2025-10-06',1,'task',500,0,1,0,0,'General','5','Marking and Boring of Holes','1',0.00,100.00,0.00,'2025-11-09 12:59:58'),(21,506,'Rail Bracket Installation','2025-10-06','2025-10-08',2,'task',500,0,1,7,0,'General','6','Rail Bracket Installation','1',7.00,100.00,0.00,'2025-11-09 12:59:58'),(22,507,'Guide Rail Setting','2025-10-08','2025-10-15',5,'summary',500,0,1,0,0,'General',NULL,'Guide Rail Setting','1',0.00,100.00,0.00,'2025-11-09 12:59:58'),(23,508,'Main/Car','2025-10-08','2025-10-12',2,'task',507,0,1,5,0,'Guide Rail Setting','A','Main/Car','1',5.00,100.00,0.00,'2025-11-09 12:59:58'),(24,509,'Counterweight (CWT)','2025-10-12','2025-10-14',2,'task',507,0,1,3,0,'Guide Rail Setting','B','Counterweight (CWT)','1',3.00,100.00,0.00,'2025-11-09 12:59:58'),(25,510,'Gauging','2025-10-14','2025-10-15',1,'task',507,0,1,3,0,'Guide Rail Setting','C','Gauging','1',3.00,100.00,0.00,'2025-11-09 12:59:58'),(26,511,'Landing Door Assembly','2025-10-15','2025-10-23',6,'summary',500,0,1,0,0,'General',NULL,'Landing Door Assembly','1',0.00,100.00,0.00,'2025-11-09 12:59:58'),(27,512,'Sills and Supports','2025-10-15','2025-10-19',2,'task',511,0,1,2,0,'Landing Door Assembly','A','Sills and Supports','1',2.00,100.00,0.00,'2025-11-09 12:59:58'),(28,513,'Jamb and Supports','2025-10-19','2025-10-21',2,'task',511,0,1,2,0,'Landing Door Assembly','B','Jamb and Supports','1',2.00,100.00,0.00,'2025-11-09 12:59:58'),(29,514,'Frame and Doors','2025-10-21','2025-10-23',2,'task',511,0,1,3,0,'Landing Door Assembly','C','Frame and Doors','1',3.00,100.00,0.00,'2025-11-09 12:59:58'),(30,515,'M/R Equipment Setting','2025-10-23','2025-11-02',6,'summary',500,0,1,0,0,'General',NULL,'M/R Equipment Setting','1',0.00,100.00,0.00,'2025-11-09 12:59:58'),(31,516,'Traction Machine','2025-10-23','2025-10-27',2,'task',515,0,1,5,0,'M/R Equipment Setting','A','Traction Machine','1',5.00,100.00,0.00,'2025-11-09 12:59:58'),(32,517,'Support Beams','2025-10-27','2025-10-29',2,'task',515,0,1,5,0,'M/R Equipment Setting','B','Support Beams','1',5.00,100.00,0.00,'2025-11-09 12:59:58'),(33,518,'Governor','2025-10-29','2025-11-02',2,'task',515,0,1,2,0,'M/R Equipment Setting','C','Governor','1',2.00,100.00,0.00,'2025-11-09 12:59:58'),(34,519,'Installation of Control Panel','2025-11-02','2025-11-04',2,'task',500,0,1,3,0,'M/R Equipment Setting','D','Installation of Control Panel','1',3.00,100.00,0.00,'2025-11-09 12:59:58'),(35,520,'Car Assembly','2025-11-04','2025-11-09',3,'summary',500,0,1,0,0,'General',NULL,'Car Assembly','1',0.00,100.00,0.00,'2025-11-09 12:59:58'),(36,521,'All Accessories','2025-11-04','2025-11-06',2,'task',520,0,1,3,0,'Car Assembly','A','All Accessories','1',3.00,100.00,0.00,'2025-11-09 12:59:58'),(37,522,'Car Piping/Wiring','2025-11-06','2025-11-09',1,'task',520,0,1,3,0,'Car Assembly','B','Car Piping/Wiring','1',3.00,100.00,0.00,'2025-11-09 12:59:58'),(38,523,'Travelling Cable Layout','2025-11-09','2025-11-11',2,'task',500,1,1,2,0,'Car Assembly','C','Travelling Cable Layout','1',2.00,100.00,0.00,'2025-11-09 12:59:58'),(39,524,'Counterweight Assembly','2025-11-11','2025-11-13',2,'task',500,0,0,2,1,'Car Assembly','D','Counterweight Assembly','1',2.00,0.00,0.00,'2025-11-09 12:59:58'),(40,525,'Laying out of Ropes','2025-11-13','2025-11-20',5,'summary',500,0,0,0,0,'General',NULL,'Laying out of Ropes','1',0.00,0.00,0.00,'2025-11-09 12:59:58'),(41,526,'Hoisting','2025-11-13','2025-11-17',2,'task',525,0,0,2,0,'Laying out of ropes','A','Hoisting','1',2.00,0.00,0.00,'2025-11-09 12:59:58'),(42,527,'Governor','2025-11-17','2025-11-19',2,'task',525,0,0,3,0,'Compensating','B','Governor','1',3.00,0.00,0.00,'2025-11-09 12:59:58'),(43,528,'Compensating','2025-11-19','2025-11-20',1,'task',525,0,0,3,0,'Laying out of ropes','C','Compensating','1',3.00,0.00,0.00,'2025-11-09 12:59:58'),(44,529,'Wiring','2025-11-20','2025-11-24',2,'summary',500,0,0,0,0,'General',NULL,'Wiring','1',0.00,0.00,0.00,'2025-11-09 12:59:58'),(45,530,'Machine Room','2025-11-20','2025-11-23',1,'task',529,0,0,5,0,'Wiring','A','Machine Room','1',5.00,0.00,0.00,'2025-11-09 12:59:58'),(46,531,'Hoistway','2025-11-23','2025-11-24',1,'task',529,0,0,3,0,'Wiring','B','Hoistway','1',3.00,0.00,0.00,'2025-11-09 12:59:58'),(47,532,'Installation of Pit Ladder / Hoistway Lighting','2025-11-24','2025-11-26',2,'task',500,0,0,3,0,'Wiring','C','Installation of Pit Ladder / Hoistway Lighting','1',3.00,0.00,0.00,'2025-11-09 12:59:58'),(48,600,'Testing and Commissioning','2025-11-26','2025-12-17',15,'summary',NULL,0,0,0,0,'General',NULL,'Testing and Commissioning','1',0.00,0.00,0.00,'2025-11-09 12:59:58'),(49,601,'Initial testing','2025-11-26','2025-12-01',3,'task',600,0,0,3,0,'Testing and Commissioning (Passenger Elevator)','A','Initial testing','1',3.00,0.00,0.00,'2025-11-09 12:59:58'),(50,602,'Slow speed','2025-12-01','2025-12-03',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','B','Slow speed','1',1.00,0.00,0.00,'2025-11-09 12:59:58'),(51,603,'High speed and Mechanical Adjustment','2025-12-03','2025-12-07',2,'task',600,0,0,2,0,'Testing and Commissioning (Passenger Elevator)','C','High speed and Mechanical Adjustment','1',2.00,0.00,0.00,'2025-11-09 12:59:58'),(52,604,'Load Test','2025-12-07','2025-12-09',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','D','Load Test','1',1.00,0.00,0.00,'2025-11-09 12:59:58'),(53,605,'Final Adjust','2025-12-09','2025-12-11',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','E','Final Adjust','1',1.00,0.00,0.00,'2025-11-09 12:59:58'),(54,606,'Features Test / Correction of Defects','2025-12-11','2025-12-15',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','F','Features Test / Correction of Defects','1',1.00,0.00,0.00,'2025-11-09 12:59:58'),(55,607,'Final Cleaning / Hand over','2025-12-15','2025-12-17',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','G','Final Cleaning / Hand over','1',1.00,0.00,0.00,'2025-11-09 12:59:58');
/*!40000 ALTER TABLE `project_339_schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_340_schedule`
--

DROP TABLE IF EXISTS `project_340_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_340_schedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `task_id` int DEFAULT NULL,
  `task_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_start` date DEFAULT NULL,
  `task_end` date DEFAULT NULL,
  `task_duration` int DEFAULT NULL,
  `task_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_parent` int DEFAULT NULL,
  `task_approval` tinyint(1) DEFAULT '0',
  `task_done` tinyint(1) DEFAULT '0',
  `task_percent` int DEFAULT '0',
  `task_actual_current` tinyint DEFAULT '0',
  `section_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_code` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unit` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wt` decimal(5,2) DEFAULT '0.00',
  `pres_acc` decimal(5,2) DEFAULT '0.00',
  `prev_acc` decimal(5,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_340_schedule`
--

LOCK TABLES `project_340_schedule` WRITE;
/*!40000 ALTER TABLE `project_340_schedule` DISABLE KEYS */;
INSERT INTO `project_340_schedule` VALUES (1,201,'Shaft Construction','2025-07-06','2025-09-09',47,'task',200,0,1,0,0,'General',NULL,'Shaft Construction','1',0.00,100.00,0.00,'2025-11-13 16:03:49'),(2,103,'Submission of Drawing and Finishes for Approval','2025-06-26','2025-07-03',5,'task',100,0,1,0,0,'General',NULL,'Submission of Drawing and Finishes for Approval','1',0.00,100.00,0.00,'2025-11-13 16:03:49'),(3,102,'Layout of Drawing','2025-06-23','2025-06-26',3,'task',100,0,1,0,0,'General',NULL,'Layout of Drawing','1',0.00,100.00,0.00,'2025-11-13 16:03:49'),(4,300,'Manufacturing and Importation Process','2025-07-06','2025-09-09',47,'summary',NULL,0,1,0,0,'General',NULL,'Manufacturing and Importation Process','1',0.00,100.00,0.00,'2025-11-13 16:03:49'),(5,200,'Structural/Civil Works','2025-07-06','2025-09-09',47,'summary',NULL,0,1,0,0,'General',NULL,'Structural/Civil Works','1',0.00,100.00,0.00,'2025-11-13 16:03:49'),(6,100,'Preliminaries','2025-06-15','2025-07-06',15,'summary',NULL,0,1,0,0,'General',NULL,'Preliminaries','1',0.00,100.00,0.00,'2025-11-13 16:03:49'),(7,104,'Submission of PO to Factory','2025-07-03','2025-07-06',1,'task',100,0,1,0,0,'General',NULL,'Submission of PO to Factory','1',0.00,100.00,0.00,'2025-11-13 16:03:49'),(8,101,'Pre-Inspection(Checkin of Shaft)','2025-06-15','2025-06-23',6,'task',100,0,1,0,0,'General',NULL,'Pre-Inspection(Checkin of Shaft)','1',0.00,100.00,0.00,'2025-11-13 16:03:49'),(9,301,'Manufacturing and Importation','2025-07-06','2025-09-09',47,'task',300,0,1,0,0,'General',NULL,'Manufacturing and Importation','1',0.00,100.00,0.00,'2025-11-13 16:03:49'),(10,400,'Planning For Mobilization And Execution','2025-09-09','2025-10-19',28,'summary',NULL,0,1,0,0,'General',NULL,'Planning For Mobilization And Execution','1',0.00,100.00,0.00,'2025-11-13 16:03:49'),(11,401,'Preparation of tools and materials for elevator installation','2025-09-09','2025-09-29',14,'task',400,0,1,0,0,'General',NULL,'Preparation of tools and materials for elevator installation','1',0.00,100.00,0.00,'2025-11-13 16:03:49'),(12,402,'Layout of boardup markings','2025-09-29','2025-10-02',3,'task',400,0,1,0,0,'General',NULL,'Layout of boardup markings','1',0.00,100.00,0.00,'2025-11-13 16:03:49'),(13,403,'Partial delivery of tools and boardup materials','2025-10-02','2025-10-07',3,'task',400,0,1,0,0,'General',NULL,'Partial delivery of tools and boardup materials','1',0.00,100.00,0.00,'2025-11-13 16:03:49'),(14,404,'Preperation for Installation/Manufacturing','2025-10-07','2025-10-19',8,'task',400,0,1,0,0,'General',NULL,'Preperation for Installation/Manufacturing','1',0.00,100.00,0.00,'2025-11-13 16:03:49'),(15,500,'Mechanical Installation','2025-10-19','2025-12-21',45,'summary',NULL,0,1,0,0,'General',NULL,'Mechanical Installation','1',0.00,100.00,0.00,'2025-11-13 16:03:49'),(16,501,'Unloading of elevator equipments','2025-10-19','2025-10-20',1,'task',500,0,1,0,0,'General','1','Unloading of elevator equipments','1',0.00,100.00,0.00,'2025-11-13 16:03:49'),(17,502,'Scaffolding Installation','2025-10-20','2025-10-22',2,'task',500,0,1,7,0,'General','2','Scaffolding Installation','1',7.00,100.00,0.00,'2025-11-13 16:03:49'),(18,503,'Hauling Works','2025-10-22','2025-10-26',2,'task',500,0,1,7,0,'General','3','Hauling Works','1',7.00,100.00,0.00,'2025-11-13 16:03:49'),(19,504,'Template Setting','2025-10-26','2025-10-28',2,'task',500,0,1,7,0,'General','4','Template Setting','1',7.00,100.00,0.00,'2025-11-13 16:03:49'),(20,505,'Marking and Boring of Holes','2025-10-28','2025-10-29',1,'task',500,0,1,0,0,'General','5','Marking and Boring of Holes','1',0.00,100.00,0.00,'2025-11-13 16:03:49'),(21,506,'Rail Bracket Installation','2025-10-29','2025-11-02',2,'task',500,0,1,7,0,'General','6','Rail Bracket Installation','1',7.00,100.00,0.00,'2025-11-13 16:03:49'),(22,507,'Guide Rail Setting','2025-11-02','2025-11-09',5,'summary',500,0,1,0,0,'General',NULL,'Guide Rail Setting','1',0.00,100.00,0.00,'2025-11-13 16:03:49'),(23,508,'Main/Car','2025-11-02','2025-11-04',2,'task',507,0,1,5,0,'Guide Rail Setting','A','Main/Car','1',5.00,100.00,0.00,'2025-11-13 16:03:49'),(24,509,'Counterweight (CWT)','2025-11-04','2025-11-06',2,'task',507,0,1,3,0,'Guide Rail Setting','B','Counterweight (CWT)','1',3.00,100.00,0.00,'2025-11-13 16:03:49'),(25,510,'Gauging','2025-11-06','2025-11-09',1,'task',507,0,1,3,0,'Guide Rail Setting','C','Gauging','1',3.00,100.00,0.00,'2025-11-13 16:03:49'),(26,511,'Landing Door Assembly','2025-11-09','2025-11-17',6,'summary',500,0,1,0,0,'General',NULL,'Landing Door Assembly','1',0.00,100.00,0.00,'2025-11-13 16:03:49'),(27,512,'Sills and Supports','2025-11-09','2025-11-11',2,'task',511,0,1,2,0,'Landing Door Assembly','A','Sills and Supports','1',2.00,100.00,0.00,'2025-11-13 16:03:49'),(28,513,'Jamb and Supports','2025-11-11','2025-11-13',2,'task',511,0,1,2,0,'Landing Door Assembly','B','Jamb and Supports','1',2.00,100.00,0.00,'2025-11-13 16:03:49'),(29,514,'Frame and Doors','2025-11-13','2025-11-17',2,'task',511,1,1,3,1,'Landing Door Assembly','C','Frame and Doors','1',3.00,100.00,0.00,'2025-11-13 16:03:49'),(30,515,'M/R Equipment Setting','2025-11-17','2025-11-25',6,'summary',500,0,0,0,0,'General',NULL,'M/R Equipment Setting','1',0.00,0.00,0.00,'2025-11-13 16:03:49'),(31,516,'Traction Machine','2025-11-17','2025-11-19',2,'task',515,0,0,5,0,'M/R Equipment Setting','A','Traction Machine','1',5.00,0.00,0.00,'2025-11-13 16:03:49'),(32,517,'Support Beams','2025-11-19','2025-11-23',2,'task',515,0,0,5,0,'M/R Equipment Setting','B','Support Beams','1',5.00,0.00,0.00,'2025-11-13 16:03:49'),(33,518,'Governor (M/R)','2025-11-23','2025-11-25',2,'task',515,0,0,2,0,'M/R Equipment Setting','C','Governor (M/R)','1',2.00,0.00,0.00,'2025-11-13 16:03:49'),(34,519,'Installation of Control Panel','2025-11-25','2025-11-27',2,'task',500,0,0,3,0,'M/R Equipment Setting','D','Installation of Control Panel','1',3.00,0.00,0.00,'2025-11-13 16:03:49'),(35,520,'Car Assembly','2025-11-27','2025-12-02',3,'summary',500,0,0,0,0,'General',NULL,'Car Assembly','1',0.00,0.00,0.00,'2025-11-13 16:03:49'),(36,521,'All Accessories','2025-11-27','2025-12-01',2,'task',520,0,0,3,0,'Car Assembly','A','All Accessories','1',3.00,0.00,0.00,'2025-11-13 16:03:49'),(37,522,'Car Piping/Wiring','2025-12-01','2025-12-02',1,'task',520,0,0,3,0,'Car Assembly','B','Car Piping/Wiring','1',3.00,0.00,0.00,'2025-11-13 16:03:49'),(38,523,'Travelling Cable Layout','2025-12-02','2025-12-04',2,'task',500,0,0,2,0,'Car Assembly','C','Travelling Cable Layout','1',2.00,0.00,0.00,'2025-11-13 16:03:49'),(39,524,'Counterweight Assembly','2025-12-04','2025-12-08',2,'task',500,0,0,2,0,'Car Assembly','D','Counterweight Assembly','1',2.00,0.00,0.00,'2025-11-13 16:03:49'),(40,525,'Laying out of Ropes','2025-12-08','2025-12-15',5,'summary',500,0,0,0,0,'General',NULL,'Laying out of Ropes','1',0.00,0.00,0.00,'2025-11-13 16:03:49'),(41,526,'Hoisting','2025-12-08','2025-12-10',2,'task',525,0,0,2,0,'Laying out of ropes','A','Hoisting','1',2.00,0.00,0.00,'2025-11-13 16:03:49'),(42,527,'Governor (Ropes)','2025-12-10','2025-12-14',2,'task',525,0,0,3,0,'Compensating','B','Governor (Ropes)','1',3.00,0.00,0.00,'2025-11-13 16:03:49'),(43,528,'Compensating','2025-12-14','2025-12-15',1,'task',525,0,0,3,0,'Laying out of ropes','C','Compensating','1',3.00,0.00,0.00,'2025-11-13 16:03:49'),(44,529,'Wiring','2025-12-15','2025-12-17',2,'summary',500,0,0,0,0,'General',NULL,'Wiring','1',0.00,0.00,0.00,'2025-11-13 16:03:49'),(45,530,'Machine Room','2025-12-15','2025-12-16',1,'task',529,0,0,5,0,'Wiring','A','Machine Room','1',5.00,0.00,0.00,'2025-11-13 16:03:49'),(46,531,'Hoistway','2025-12-16','2025-12-17',1,'task',529,0,0,3,0,'Wiring','B','Hoistway','1',3.00,0.00,0.00,'2025-11-13 16:03:49'),(47,532,'Installation of Pit Ladder / Hoistway Lighting','2025-12-17','2025-12-21',2,'task',500,0,0,3,0,'Wiring','C','Installation of Pit Ladder / Hoistway Lighting','1',3.00,0.00,0.00,'2025-11-13 16:03:49'),(48,600,'Testing and Commissioning','2025-12-21','2026-01-11',15,'summary',NULL,0,0,0,0,'General',NULL,'Testing and Commissioning','1',0.00,0.00,0.00,'2025-11-13 16:03:49'),(49,601,'Initial testing','2025-12-21','2025-12-24',3,'task',600,0,0,3,0,'Testing and Commissioning (Passenger Elevator)','A','Initial testing','1',3.00,0.00,0.00,'2025-11-13 16:03:49'),(50,602,'Slow speed','2025-12-24','2025-12-28',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','B','Slow speed','1',1.00,0.00,0.00,'2025-11-13 16:03:49'),(51,603,'High speed and Mechanical Adjustment','2025-12-28','2025-12-30',2,'task',600,0,0,2,0,'Testing and Commissioning (Passenger Elevator)','C','High speed and Mechanical Adjustment','1',2.00,0.00,0.00,'2025-11-13 16:03:49'),(52,604,'Load Test','2025-12-30','2026-01-01',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','D','Load Test','1',1.00,0.00,0.00,'2025-11-13 16:03:49'),(53,605,'Final Adjust','2026-01-01','2026-01-05',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','E','Final Adjust','1',1.00,0.00,0.00,'2025-11-13 16:03:49'),(54,606,'Features Test / Correction of Defects','2026-01-05','2026-01-07',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','F','Features Test / Correction of Defects','1',1.00,0.00,0.00,'2025-11-13 16:03:49'),(55,607,'Final Cleaning / Hand over','2026-01-07','2026-01-11',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','G','Final Cleaning / Hand over','1',1.00,0.00,0.00,'2025-11-13 16:03:49');
/*!40000 ALTER TABLE `project_340_schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_341_schedule`
--

DROP TABLE IF EXISTS `project_341_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_341_schedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `task_id` int DEFAULT NULL,
  `task_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_start` date DEFAULT NULL,
  `task_end` date DEFAULT NULL,
  `task_duration` int DEFAULT NULL,
  `task_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_parent` int DEFAULT NULL,
  `task_approval` tinyint(1) DEFAULT '0',
  `task_done` tinyint(1) DEFAULT '0',
  `task_percent` int DEFAULT '0',
  `task_actual_current` tinyint DEFAULT '0',
  `section_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_code` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unit` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wt` decimal(5,2) DEFAULT '0.00',
  `pres_acc` decimal(5,2) DEFAULT '0.00',
  `prev_acc` decimal(5,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_341_schedule`
--

LOCK TABLES `project_341_schedule` WRITE;
/*!40000 ALTER TABLE `project_341_schedule` DISABLE KEYS */;
INSERT INTO `project_341_schedule` VALUES (1,100,'Preliminaries','2025-04-23','2025-05-14',15,'summary',NULL,0,1,0,0,'General',NULL,'Preliminaries','1',0.00,100.00,0.00,'2025-11-09 12:02:23'),(2,101,'Pre-Inspection(Checkin of Shaft)','2025-04-23','2025-05-01',6,'task',100,0,1,0,0,'General',NULL,'Pre-Inspection(Checkin of Shaft)','1',0.00,100.00,0.00,'2025-11-09 12:02:23'),(3,301,'Manufacturing and Importation','2025-05-14','2025-07-20',47,'task',300,0,1,0,0,'General',NULL,'Manufacturing and Importation','1',0.00,100.00,0.00,'2025-11-09 12:02:23'),(4,400,'Planning For Mobilization And Execution','2025-07-20','2025-08-27',28,'summary',NULL,0,1,0,0,'General',NULL,'Planning For Mobilization And Execution','1',0.00,100.00,0.00,'2025-11-09 12:02:23'),(5,103,'Submission of Drawing and Finishes for Approval','2025-05-06','2025-05-13',5,'task',100,0,1,0,0,'General',NULL,'Submission of Drawing and Finishes for Approval','1',0.00,100.00,0.00,'2025-11-09 12:02:23'),(6,201,'Shaft Construction','2025-05-14','2025-07-20',47,'task',200,0,1,0,0,'General',NULL,'Shaft Construction','1',0.00,100.00,0.00,'2025-11-09 12:02:23'),(7,102,'Layout of Drawing','2025-05-01','2025-05-06',3,'task',100,0,1,0,0,'General',NULL,'Layout of Drawing','1',0.00,100.00,0.00,'2025-11-09 12:02:23'),(8,300,'Manufacturing and Importation Process','2025-05-14','2025-07-20',47,'summary',NULL,0,1,0,0,'General',NULL,'Manufacturing and Importation Process','1',0.00,100.00,0.00,'2025-11-09 12:02:23'),(9,104,'Submission of PO to Factory','2025-05-13','2025-05-14',1,'task',100,0,1,0,0,'General',NULL,'Submission of PO to Factory','1',0.00,100.00,0.00,'2025-11-09 12:02:23'),(10,200,'Structural/Civil Works','2025-05-14','2025-07-20',47,'summary',NULL,0,1,0,0,'General',NULL,'Structural/Civil Works','1',0.00,100.00,0.00,'2025-11-09 12:02:23'),(11,401,'Preparation of tools and materials for elevator installation','2025-07-20','2025-08-07',14,'task',400,0,1,0,0,'General',NULL,'Preparation of tools and materials for elevator installation','1',0.00,100.00,0.00,'2025-11-09 12:02:24'),(12,402,'Layout of boardup markings','2025-08-07','2025-08-12',3,'task',400,0,1,0,0,'General',NULL,'Layout of boardup markings','1',0.00,100.00,0.00,'2025-11-09 12:02:24'),(13,403,'Partial delivery of tools and boardup materials','2025-08-12','2025-08-17',3,'task',400,0,1,0,0,'General',NULL,'Partial delivery of tools and boardup materials','1',0.00,100.00,0.00,'2025-11-09 12:02:24'),(14,404,'Preperation for Installation/Manufacturing','2025-08-17','2025-08-27',8,'task',400,0,1,0,0,'General',NULL,'Preperation for Installation/Manufacturing','1',0.00,100.00,0.00,'2025-11-09 12:02:24'),(15,500,'Mechanical Installation','2025-08-27','2025-10-29',45,'summary',NULL,0,1,0,0,'General',NULL,'Mechanical Installation','1',0.00,100.00,0.00,'2025-11-09 12:02:24'),(16,501,'Unloading of elevator equipments','2025-08-27','2025-08-28',1,'task',500,0,1,0,0,'General','1','Unloading of elevator equipments','1',0.00,100.00,0.00,'2025-11-09 12:02:24'),(17,502,'Scaffolding Installation','2025-08-28','2025-09-01',2,'task',500,0,1,7,0,'General','2','Scaffolding Installation','1',7.00,100.00,0.00,'2025-11-09 12:02:24'),(18,503,'Hauling Works','2025-09-01','2025-09-03',2,'task',500,0,1,7,0,'General','3','Hauling Works','1',7.00,100.00,0.00,'2025-11-09 12:02:24'),(19,504,'Template Setting','2025-09-03','2025-09-07',2,'task',500,0,1,7,0,'General','4','Template Setting','1',7.00,100.00,0.00,'2025-11-09 12:02:24'),(20,505,'Marking and Boring of Holes','2025-09-07','2025-09-08',1,'task',500,0,1,0,0,'General','5','Marking and Boring of Holes','1',0.00,100.00,0.00,'2025-11-09 12:02:24'),(21,506,'Rail Bracket Installation','2025-09-08','2025-09-10',2,'task',500,0,1,7,0,'General','6','Rail Bracket Installation','1',7.00,100.00,0.00,'2025-11-09 12:02:24'),(22,507,'Guide Rail Setting','2025-09-10','2025-09-17',5,'summary',500,0,1,0,0,'General',NULL,'Guide Rail Setting','1',0.00,100.00,0.00,'2025-11-09 12:02:24'),(23,509,'Counterweight (CWT)','2025-09-14','2025-09-16',2,'task',507,0,1,3,0,'Guide Rail Setting','B','Counterweight (CWT)','1',3.00,100.00,0.00,'2025-11-09 12:02:24'),(24,510,'Gauging','2025-09-16','2025-09-17',1,'task',507,0,1,3,0,'Guide Rail Setting','C','Gauging','1',3.00,100.00,0.00,'2025-11-09 12:02:24'),(25,508,'Main/Car','2025-09-10','2025-09-14',2,'task',507,0,1,5,0,'Guide Rail Setting','A','Main/Car','1',5.00,100.00,0.00,'2025-11-09 12:02:24'),(26,511,'Landing Door Assembly','2025-09-17','2025-09-25',6,'summary',500,0,1,0,0,'General',NULL,'Landing Door Assembly','1',0.00,100.00,0.00,'2025-11-09 12:02:24'),(27,512,'Sills and Supports','2025-09-17','2025-09-21',2,'task',511,0,1,2,0,'Landing Door Assembly','A','Sills and Supports','1',2.00,100.00,0.00,'2025-11-09 12:02:24'),(28,513,'Jamb and Supports','2025-09-21','2025-09-23',2,'task',511,0,1,2,0,'Landing Door Assembly','B','Jamb and Supports','1',2.00,100.00,0.00,'2025-11-09 12:02:24'),(29,514,'Frame and Doors','2025-09-23','2025-09-25',2,'task',511,0,1,3,0,'Landing Door Assembly','C','Frame and Doors','1',3.00,100.00,0.00,'2025-11-09 12:02:24'),(30,515,'M/R Equipment Setting','2025-09-25','2025-10-05',6,'summary',500,0,1,0,0,'General',NULL,'M/R Equipment Setting','1',0.00,100.00,0.00,'2025-11-09 12:02:24'),(31,516,'Traction Machine','2025-09-25','2025-09-29',2,'task',515,0,1,5,0,'M/R Equipment Setting','A','Traction Machine','1',5.00,100.00,0.00,'2025-11-09 12:02:24'),(32,517,'Support Beams','2025-09-29','2025-10-01',2,'task',515,0,1,5,0,'M/R Equipment Setting','B','Support Beams','1',5.00,100.00,0.00,'2025-11-09 12:02:24'),(33,518,'Governor','2025-10-01','2025-10-05',2,'task',515,0,1,2,0,'M/R Equipment Setting','C','Governor','1',2.00,100.00,0.00,'2025-11-09 12:02:24'),(34,519,'Installation of Control Panel','2025-10-05','2025-10-07',2,'task',500,0,1,3,0,'M/R Equipment Setting','D','Installation of Control Panel','1',3.00,100.00,0.00,'2025-11-09 12:02:24'),(35,520,'Car Assembly','2025-10-07','2025-10-12',3,'summary',500,0,1,0,0,'General',NULL,'Car Assembly','1',0.00,100.00,0.00,'2025-11-09 12:02:24'),(36,521,'All Accessories','2025-10-07','2025-10-09',2,'task',520,0,1,3,0,'Car Assembly','A','All Accessories','1',3.00,100.00,0.00,'2025-11-09 12:02:24'),(37,523,'Travelling Cable Layout','2025-10-12','2025-10-14',2,'task',500,0,1,2,0,'Car Assembly','C','Travelling Cable Layout','1',2.00,100.00,0.00,'2025-11-09 12:02:24'),(38,522,'Car Piping/Wiring','2025-10-09','2025-10-12',1,'task',520,0,1,3,0,'Car Assembly','B','Car Piping/Wiring','1',3.00,100.00,0.00,'2025-11-09 12:02:24'),(39,524,'Counterweight Assembly','2025-10-14','2025-10-16',2,'task',500,0,1,2,0,'Car Assembly','D','Counterweight Assembly','1',2.00,100.00,0.00,'2025-11-09 12:02:24'),(40,525,'Laying out of Ropes','2025-10-16','2025-10-23',5,'summary',500,0,1,0,0,'General',NULL,'Laying out of Ropes','1',0.00,100.00,0.00,'2025-11-09 12:02:24'),(41,526,'Hoisting','2025-10-16','2025-10-20',2,'task',525,0,1,2,0,'Laying out of ropes','A','Hoisting','1',2.00,100.00,0.00,'2025-11-09 12:02:24'),(42,527,'Governor','2025-10-20','2025-10-22',2,'task',525,0,1,3,0,'Compensating','B','Governor','1',3.00,100.00,0.00,'2025-11-09 12:02:24'),(43,528,'Compensating','2025-10-22','2025-10-23',1,'task',525,0,1,3,0,'Laying out of ropes','C','Compensating','1',3.00,100.00,0.00,'2025-11-09 12:02:24'),(44,529,'Wiring','2025-10-23','2025-10-27',2,'summary',500,0,1,0,0,'General',NULL,'Wiring','1',0.00,100.00,0.00,'2025-11-09 12:02:24'),(45,530,'Machine Room','2025-10-23','2025-10-26',1,'task',529,0,1,5,0,'Wiring','A','Machine Room','1',5.00,100.00,0.00,'2025-11-09 12:02:24'),(46,531,'Hoistway','2025-10-26','2025-10-27',1,'task',529,0,1,3,0,'Wiring','B','Hoistway','1',3.00,100.00,0.00,'2025-11-09 12:02:24'),(47,532,'Installation of Pit Ladder / Hoistway Lighting','2025-10-27','2025-10-29',2,'task',500,0,1,3,0,'Wiring','C','Installation of Pit Ladder / Hoistway Lighting','1',3.00,100.00,0.00,'2025-11-09 12:02:24'),(48,600,'Testing and Commissioning','2025-10-29','2025-11-19',15,'summary',NULL,0,1,0,0,'General',NULL,'Testing and Commissioning','1',0.00,100.00,0.00,'2025-11-09 12:02:24'),(49,602,'Slow speed','2025-11-03','2025-11-05',2,'task',600,0,1,1,0,'Testing and Commissioning (Passenger Elevator)','B','Slow speed','1',1.00,100.00,0.00,'2025-11-09 12:02:24'),(50,601,'Initial testing','2025-10-29','2025-11-03',3,'task',600,0,1,3,0,'Testing and Commissioning (Passenger Elevator)','A','Initial testing','1',3.00,100.00,0.00,'2025-11-09 12:02:24'),(51,603,'High speed and Mechanical Adjustment','2025-11-05','2025-11-09',2,'task',600,0,1,2,0,'Testing and Commissioning (Passenger Elevator)','C','High speed and Mechanical Adjustment','1',2.00,100.00,0.00,'2025-11-09 12:02:24'),(52,604,'Load Test','2025-11-09','2025-11-11',2,'task',600,1,1,1,0,'Testing and Commissioning (Passenger Elevator)','D','Load Test','1',1.00,100.00,0.00,'2025-11-09 12:02:24'),(53,605,'Final Adjust','2025-11-11','2025-11-13',2,'task',600,0,0,1,1,'Testing and Commissioning (Passenger Elevator)','E','Final Adjust','1',1.00,0.00,0.00,'2025-11-09 12:02:24'),(54,606,'Features Test / Correction of Defects','2025-11-13','2025-11-17',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','F','Features Test / Correction of Defects','1',1.00,0.00,0.00,'2025-11-09 12:02:24'),(55,607,'Final Cleaning / Hand over','2025-11-17','2025-11-19',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','G','Final Cleaning / Hand over','1',1.00,0.00,0.00,'2025-11-09 12:02:24');
/*!40000 ALTER TABLE `project_341_schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_342_schedule`
--

DROP TABLE IF EXISTS `project_342_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_342_schedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `task_id` int DEFAULT NULL,
  `task_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_start` date DEFAULT NULL,
  `task_end` date DEFAULT NULL,
  `task_duration` int DEFAULT NULL,
  `task_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_parent` int DEFAULT NULL,
  `task_approval` tinyint(1) DEFAULT '0',
  `task_done` tinyint(1) DEFAULT '0',
  `task_percent` int DEFAULT '0',
  `task_actual_current` tinyint DEFAULT '0',
  `section_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_code` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unit` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wt` decimal(5,2) DEFAULT '0.00',
  `pres_acc` decimal(5,2) DEFAULT '0.00',
  `prev_acc` decimal(5,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_342_schedule`
--

LOCK TABLES `project_342_schedule` WRITE;
/*!40000 ALTER TABLE `project_342_schedule` DISABLE KEYS */;
INSERT INTO `project_342_schedule` VALUES (1,100,'Preliminaries','2025-06-08','2025-06-29',15,'summary',NULL,0,1,0,0,'General',NULL,'Preliminaries','1',0.00,100.00,0.00,'2025-11-13 15:59:10'),(2,101,'Pre-Inspection(Checkin of Shaft)','2025-06-08','2025-06-16',6,'task',100,0,1,0,0,'General',NULL,'Pre-Inspection(Checkin of Shaft)','1',0.00,100.00,0.00,'2025-11-13 15:59:10'),(3,104,'Submission of PO to Factory','2025-06-26','2025-06-29',1,'task',100,0,1,0,0,'General',NULL,'Submission of PO to Factory','1',0.00,100.00,0.00,'2025-11-13 15:59:10'),(4,102,'Layout of Drawing','2025-06-16','2025-06-19',3,'task',100,0,1,0,0,'General',NULL,'Layout of Drawing','1',0.00,100.00,0.00,'2025-11-13 15:59:10'),(5,200,'Structural/Civil Works','2025-06-29','2025-09-02',47,'summary',NULL,0,1,0,0,'General',NULL,'Structural/Civil Works','1',0.00,100.00,0.00,'2025-11-13 15:59:10'),(6,103,'Submission of Drawing and Finishes for Approval','2025-06-19','2025-06-26',5,'task',100,0,1,0,0,'General',NULL,'Submission of Drawing and Finishes for Approval','1',0.00,100.00,0.00,'2025-11-13 15:59:10'),(7,201,'Shaft Construction','2025-06-29','2025-09-02',47,'task',200,0,1,0,0,'General',NULL,'Shaft Construction','1',0.00,100.00,0.00,'2025-11-13 15:59:10'),(8,401,'Preparation of tools and materials for elevator installation','2025-09-02','2025-09-22',14,'task',400,0,1,0,0,'General',NULL,'Preparation of tools and materials for elevator installation','1',0.00,100.00,0.00,'2025-11-13 15:59:10'),(9,301,'Manufacturing and Importation','2025-06-29','2025-09-02',47,'task',300,0,1,0,0,'General',NULL,'Manufacturing and Importation','1',0.00,100.00,0.00,'2025-11-13 15:59:10'),(10,300,'Manufacturing and Importation Process','2025-06-29','2025-09-02',47,'summary',NULL,0,1,0,0,'General',NULL,'Manufacturing and Importation Process','1',0.00,100.00,0.00,'2025-11-13 15:59:10'),(11,402,'Layout of boardup markings','2025-09-22','2025-09-25',3,'task',400,0,1,0,0,'General',NULL,'Layout of boardup markings','1',0.00,100.00,0.00,'2025-11-13 15:59:10'),(12,403,'Partial delivery of tools and boardup materials','2025-09-25','2025-09-30',3,'task',400,0,1,0,0,'General',NULL,'Partial delivery of tools and boardup materials','1',0.00,100.00,0.00,'2025-11-13 15:59:10'),(13,404,'Preperation for Installation/Manufacturing','2025-09-30','2025-10-12',8,'task',400,0,1,0,0,'General',NULL,'Preperation for Installation/Manufacturing','1',0.00,100.00,0.00,'2025-11-13 15:59:10'),(14,500,'Mechanical Installation','2025-10-12','2025-12-14',45,'summary',NULL,0,1,0,0,'General',NULL,'Mechanical Installation','1',0.00,100.00,0.00,'2025-11-13 15:59:10'),(15,501,'Unloading of elevator equipments','2025-10-12','2025-10-13',1,'task',500,0,1,0,0,'General','1','Unloading of elevator equipments','1',0.00,100.00,0.00,'2025-11-13 15:59:10'),(16,502,'Scaffolding Installation','2025-10-13','2025-10-15',2,'task',500,0,1,7,0,'General','2','Scaffolding Installation','1',7.00,100.00,0.00,'2025-11-13 15:59:10'),(17,503,'Hauling Works','2025-10-15','2025-10-19',2,'task',500,0,1,7,0,'General','3','Hauling Works','1',7.00,100.00,0.00,'2025-11-13 15:59:10'),(18,504,'Template Setting','2025-10-19','2025-10-21',2,'task',500,0,1,7,0,'General','4','Template Setting','1',7.00,100.00,0.00,'2025-11-13 15:59:10'),(19,505,'Marking and Boring of Holes','2025-10-21','2025-10-22',1,'task',500,0,1,0,0,'General','5','Marking and Boring of Holes','1',0.00,100.00,0.00,'2025-11-13 15:59:10'),(20,507,'Guide Rail Setting','2025-10-26','2025-11-02',5,'summary',500,0,1,0,0,'General',NULL,'Guide Rail Setting','1',0.00,100.00,0.00,'2025-11-13 15:59:10'),(21,506,'Rail Bracket Installation','2025-10-22','2025-10-26',2,'task',500,0,1,7,0,'General','6','Rail Bracket Installation','1',7.00,100.00,0.00,'2025-11-13 15:59:10'),(22,508,'Main/Car','2025-10-26','2025-10-28',2,'task',507,0,1,5,0,'Guide Rail Setting','A','Main/Car','1',5.00,100.00,0.00,'2025-11-13 15:59:10'),(23,509,'Counterweight (CWT)','2025-10-28','2025-10-30',2,'task',507,0,1,3,0,'Guide Rail Setting','B','Counterweight (CWT)','1',3.00,100.00,0.00,'2025-11-13 15:59:10'),(24,510,'Gauging','2025-10-30','2025-11-02',1,'task',507,0,1,3,0,'Guide Rail Setting','C','Gauging','1',3.00,100.00,0.00,'2025-11-13 15:59:10'),(25,511,'Landing Door Assembly','2025-11-02','2025-11-10',6,'summary',500,0,1,0,0,'General',NULL,'Landing Door Assembly','1',0.00,100.00,0.00,'2025-11-13 15:59:10'),(26,400,'Planning For Mobilization And Execution','2025-09-02','2025-10-12',28,'summary',NULL,0,1,0,0,'General',NULL,'Planning For Mobilization And Execution','1',0.00,100.00,0.00,'2025-11-13 15:59:10'),(27,513,'Jamb and Supports','2025-11-04','2025-11-06',2,'task',511,0,1,2,0,'Landing Door Assembly','B','Jamb and Supports','1',2.00,100.00,0.00,'2025-11-13 15:59:10'),(28,514,'Frame and Doors','2025-11-06','2025-11-10',2,'task',511,0,1,3,0,'Landing Door Assembly','C','Frame and Doors','1',3.00,100.00,0.00,'2025-11-13 15:59:10'),(29,516,'Traction Machine','2025-11-10','2025-11-12',2,'task',515,0,1,5,0,'M/R Equipment Setting','A','Traction Machine','1',5.00,100.00,0.00,'2025-11-13 15:59:10'),(30,515,'M/R Equipment Setting','2025-11-10','2025-11-18',6,'summary',500,0,1,0,0,'General',NULL,'M/R Equipment Setting','1',0.00,100.00,0.00,'2025-11-13 15:59:10'),(31,512,'Sills and Supports','2025-11-02','2025-11-04',2,'task',511,0,1,2,0,'Landing Door Assembly','A','Sills and Supports','1',2.00,100.00,0.00,'2025-11-13 15:59:10'),(32,517,'Support Beams','2025-11-12','2025-11-16',2,'task',515,1,1,5,1,'M/R Equipment Setting','B','Support Beams','1',5.00,100.00,0.00,'2025-11-13 15:59:10'),(33,518,'Governor (M/R)','2025-11-16','2025-11-18',2,'task',515,0,0,2,0,'M/R Equipment Setting','C','Governor (M/R)','1',2.00,0.00,0.00,'2025-11-13 15:59:10'),(34,519,'Installation of Control Panel','2025-11-18','2025-11-20',2,'task',500,0,0,3,0,'M/R Equipment Setting','D','Installation of Control Panel','1',3.00,0.00,0.00,'2025-11-13 15:59:10'),(35,520,'Car Assembly','2025-11-20','2025-11-25',3,'summary',500,0,0,0,0,'General',NULL,'Car Assembly','1',0.00,0.00,0.00,'2025-11-13 15:59:10'),(36,521,'All Accessories','2025-11-20','2025-11-24',2,'task',520,0,0,3,0,'Car Assembly','A','All Accessories','1',3.00,0.00,0.00,'2025-11-13 15:59:10'),(37,522,'Car Piping/Wiring','2025-11-24','2025-11-25',1,'task',520,0,0,3,0,'Car Assembly','B','Car Piping/Wiring','1',3.00,0.00,0.00,'2025-11-13 15:59:10'),(38,523,'Travelling Cable Layout','2025-11-25','2025-11-27',2,'task',500,0,0,2,0,'Car Assembly','C','Travelling Cable Layout','1',2.00,0.00,0.00,'2025-11-13 15:59:10'),(39,524,'Counterweight Assembly','2025-11-27','2025-12-01',2,'task',500,0,0,2,0,'Car Assembly','D','Counterweight Assembly','1',2.00,0.00,0.00,'2025-11-13 15:59:10'),(40,525,'Laying out of Ropes','2025-12-01','2025-12-08',5,'summary',500,0,0,0,0,'General',NULL,'Laying out of Ropes','1',0.00,0.00,0.00,'2025-11-13 15:59:10'),(41,526,'Hoisting','2025-12-01','2025-12-03',2,'task',525,0,0,2,0,'Laying out of ropes','A','Hoisting','1',2.00,0.00,0.00,'2025-11-13 15:59:10'),(42,527,'Governor (Ropes)','2025-12-03','2025-12-07',2,'task',525,0,0,3,0,'Compensating','B','Governor (Ropes)','1',3.00,0.00,0.00,'2025-11-13 15:59:10'),(43,528,'Compensating','2025-12-07','2025-12-08',1,'task',525,0,0,3,0,'Laying out of ropes','C','Compensating','1',3.00,0.00,0.00,'2025-11-13 15:59:10'),(44,529,'Wiring','2025-12-08','2025-12-10',2,'summary',500,0,0,0,0,'General',NULL,'Wiring','1',0.00,0.00,0.00,'2025-11-13 15:59:10'),(45,530,'Machine Room','2025-12-08','2025-12-09',1,'task',529,0,0,5,0,'Wiring','A','Machine Room','1',5.00,0.00,0.00,'2025-11-13 15:59:10'),(46,531,'Hoistway','2025-12-09','2025-12-10',1,'task',529,0,0,3,0,'Wiring','B','Hoistway','1',3.00,0.00,0.00,'2025-11-13 15:59:10'),(47,532,'Installation of Pit Ladder / Hoistway Lighting','2025-12-10','2025-12-14',2,'task',500,0,0,3,0,'Wiring','C','Installation of Pit Ladder / Hoistway Lighting','1',3.00,0.00,0.00,'2025-11-13 15:59:10'),(48,600,'Testing and Commissioning','2025-12-14','2026-01-04',15,'summary',NULL,0,0,0,0,'General',NULL,'Testing and Commissioning','1',0.00,0.00,0.00,'2025-11-13 15:59:10'),(49,601,'Initial testing','2025-12-14','2025-12-17',3,'task',600,0,0,3,0,'Testing and Commissioning (Passenger Elevator)','A','Initial testing','1',3.00,0.00,0.00,'2025-11-13 15:59:10'),(50,602,'Slow speed','2025-12-17','2025-12-21',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','B','Slow speed','1',1.00,0.00,0.00,'2025-11-13 15:59:10'),(51,603,'High speed and Mechanical Adjustment','2025-12-21','2025-12-23',2,'task',600,0,0,2,0,'Testing and Commissioning (Passenger Elevator)','C','High speed and Mechanical Adjustment','1',2.00,0.00,0.00,'2025-11-13 15:59:10'),(52,604,'Load Test','2025-12-23','2025-12-25',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','D','Load Test','1',1.00,0.00,0.00,'2025-11-13 15:59:10'),(53,605,'Final Adjust','2025-12-25','2025-12-29',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','E','Final Adjust','1',1.00,0.00,0.00,'2025-11-13 15:59:10'),(54,606,'Features Test / Correction of Defects','2025-12-29','2025-12-31',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','F','Features Test / Correction of Defects','1',1.00,0.00,0.00,'2025-11-13 15:59:10'),(55,607,'Final Cleaning / Hand over','2025-12-31','2026-01-04',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','G','Final Cleaning / Hand over','1',1.00,0.00,0.00,'2025-11-13 15:59:10');
/*!40000 ALTER TABLE `project_342_schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_343_schedule`
--

DROP TABLE IF EXISTS `project_343_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_343_schedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `task_id` int DEFAULT NULL,
  `task_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_start` date DEFAULT NULL,
  `task_end` date DEFAULT NULL,
  `task_duration` int DEFAULT NULL,
  `task_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_parent` int DEFAULT NULL,
  `task_approval` tinyint(1) DEFAULT '0',
  `task_done` tinyint(1) DEFAULT '0',
  `task_percent` int DEFAULT '0',
  `task_actual_current` tinyint DEFAULT '0',
  `section_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_code` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unit` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wt` decimal(5,2) DEFAULT '0.00',
  `pres_acc` decimal(5,2) DEFAULT '0.00',
  `prev_acc` decimal(5,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_343_schedule`
--

LOCK TABLES `project_343_schedule` WRITE;
/*!40000 ALTER TABLE `project_343_schedule` DISABLE KEYS */;
INSERT INTO `project_343_schedule` VALUES (1,200,'Structural/Civil Works','2025-05-01','2025-07-07',47,'summary',NULL,0,1,0,0,'General',NULL,'Structural/Civil Works','1',0.00,0.00,0.00,'2025-11-09 10:43:11'),(2,100,'Preliminaries','2025-04-12','2025-05-01',15,'summary',NULL,0,1,0,0,'General',NULL,'Preliminaries','1',0.00,0.00,0.00,'2025-11-09 10:43:11'),(3,301,'Manufacturing and Importation','2025-05-01','2025-07-07',47,'task',300,0,1,0,0,'General',NULL,'Manufacturing and Importation','1',0.00,0.00,0.00,'2025-11-09 10:43:11'),(4,104,'Submission of PO to Factory','2025-04-30','2025-05-01',1,'task',100,0,1,0,0,'General',NULL,'Submission of PO to Factory','1',0.00,0.00,0.00,'2025-11-09 10:43:11'),(5,101,'Pre-Inspection(Checkin of Shaft)','2025-04-12','2025-04-20',6,'task',100,0,1,0,0,'General',NULL,'Pre-Inspection(Checkin of Shaft)','1',0.00,0.00,0.00,'2025-11-09 10:43:11'),(6,201,'Shaft Construction','2025-05-01','2025-07-07',47,'task',200,0,1,0,0,'General',NULL,'Shaft Construction','1',0.00,0.00,0.00,'2025-11-09 10:43:11'),(7,300,'Manufacturing and Importation Process','2025-05-01','2025-07-07',47,'summary',NULL,0,1,0,0,'General',NULL,'Manufacturing and Importation Process','1',0.00,0.00,0.00,'2025-11-09 10:43:11'),(8,103,'Submission of Drawing and Finishes for Approval','2025-04-23','2025-04-30',5,'task',100,0,1,0,0,'General',NULL,'Submission of Drawing and Finishes for Approval','1',0.00,0.00,0.00,'2025-11-09 10:43:11'),(9,102,'Layout of Drawing','2025-04-20','2025-04-23',3,'task',100,0,1,0,0,'General',NULL,'Layout of Drawing','1',0.00,0.00,0.00,'2025-11-09 10:43:11'),(10,401,'Preparation of tools and materials for elevator installation','2025-07-07','2025-07-27',14,'task',400,0,1,0,0,'General',NULL,'Preparation of tools and materials for elevator installation','1',0.00,0.00,0.00,'2025-11-09 10:43:11'),(11,402,'Layout of boardup markings','2025-07-27','2025-07-30',3,'task',400,0,1,0,0,'General',NULL,'Layout of boardup markings','1',0.00,0.00,0.00,'2025-11-09 10:43:11'),(12,403,'Partial delivery of tools and boardup materials','2025-07-30','2025-08-04',3,'task',400,0,1,0,0,'General',NULL,'Partial delivery of tools and boardup materials','1',0.00,0.00,0.00,'2025-11-09 10:43:11'),(13,404,'Preperation for Installation/Manufacturing','2025-08-04','2025-08-14',8,'task',400,0,1,0,0,'General',NULL,'Preperation for Installation/Manufacturing','1',0.00,0.00,0.00,'2025-11-09 10:43:11'),(14,500,'Mechanical Installation','2025-08-14','2025-10-19',45,'summary',NULL,0,1,0,0,'General',NULL,'Mechanical Installation','1',0.00,0.00,0.00,'2025-11-09 10:43:11'),(15,501,'Unloading of elevator equipments','2025-08-14','2025-08-17',1,'task',500,0,1,0,0,'General','1','Unloading of elevator equipments','1',0.00,0.00,0.00,'2025-11-09 10:43:11'),(16,502,'Scaffolding Installation','2025-08-17','2025-08-19',2,'task',500,0,1,7,0,'General','2','Scaffolding Installation','1',7.00,0.00,0.00,'2025-11-09 10:43:11'),(17,503,'Hauling Works','2025-08-19','2025-08-21',2,'task',500,0,1,7,0,'General','3','Hauling Works','1',7.00,0.00,0.00,'2025-11-09 10:43:11'),(18,504,'Template Setting','2025-08-21','2025-08-25',2,'task',500,0,1,7,0,'General','4','Template Setting','1',7.00,0.00,0.00,'2025-11-09 10:43:11'),(19,505,'Marking and Boring of Holes','2025-08-25','2025-08-26',1,'task',500,0,1,0,0,'General','5','Marking and Boring of Holes','1',0.00,0.00,0.00,'2025-11-09 10:43:11'),(20,506,'Rail Bracket Installation','2025-08-26','2025-08-28',2,'task',500,0,1,7,0,'General','6','Rail Bracket Installation','1',7.00,0.00,0.00,'2025-11-09 10:43:11'),(21,507,'Guide Rail Setting','2025-08-28','2025-09-04',5,'summary',500,0,1,0,0,'General',NULL,'Guide Rail Setting','1',0.00,0.00,0.00,'2025-11-09 10:43:11'),(22,508,'Main/Car','2025-08-28','2025-09-01',2,'task',507,0,1,5,0,'Guide Rail Setting','A','Main/Car','1',5.00,0.00,0.00,'2025-11-09 10:43:11'),(23,509,'Counterweight (CWT)','2025-09-01','2025-09-03',2,'task',507,0,1,3,0,'Guide Rail Setting','B','Counterweight (CWT)','1',3.00,0.00,0.00,'2025-11-09 10:43:11'),(24,510,'Gauging','2025-09-03','2025-09-04',1,'task',507,0,1,3,0,'Guide Rail Setting','C','Gauging','1',3.00,0.00,0.00,'2025-11-09 10:43:11'),(25,511,'Landing Door Assembly','2025-09-04','2025-09-14',6,'summary',500,0,1,0,0,'General',NULL,'Landing Door Assembly','1',0.00,0.00,0.00,'2025-11-09 10:43:11'),(26,512,'Sills and Supports','2025-09-04','2025-09-08',2,'task',511,0,1,2,0,'Landing Door Assembly','A','Sills and Supports','1',2.00,0.00,0.00,'2025-11-09 10:43:11'),(27,513,'Jamb and Supports','2025-09-08','2025-09-10',2,'task',511,0,1,2,0,'Landing Door Assembly','B','Jamb and Supports','1',2.00,0.00,0.00,'2025-11-09 10:43:11'),(28,514,'Frame and Doors','2025-09-10','2025-09-14',2,'task',511,0,1,3,0,'Landing Door Assembly','C','Frame and Doors','1',3.00,0.00,0.00,'2025-11-09 10:43:11'),(29,515,'M/R Equipment Setting','2025-09-14','2025-09-22',6,'summary',500,0,1,0,0,'General',NULL,'M/R Equipment Setting','1',0.00,0.00,0.00,'2025-11-09 10:43:11'),(30,400,'Planning For Mobilization And Execution','2025-07-07','2025-08-14',28,'summary',NULL,0,1,0,0,'General',NULL,'Planning For Mobilization And Execution','1',0.00,0.00,0.00,'2025-11-09 10:43:11'),(31,516,'Traction Machine','2025-09-14','2025-09-16',2,'task',515,0,1,5,0,'M/R Equipment Setting','A','Traction Machine','1',5.00,0.00,0.00,'2025-11-09 10:43:11'),(32,517,'Support Beams','2025-09-16','2025-09-18',2,'task',515,0,1,5,0,'M/R Equipment Setting','B','Support Beams','1',5.00,0.00,0.00,'2025-11-09 10:43:11'),(33,518,'Governor','2025-09-18','2025-09-22',2,'task',515,0,1,2,0,'M/R Equipment Setting','C','Governor','1',2.00,0.00,0.00,'2025-11-09 10:43:11'),(34,519,'Installation of Control Panel','2025-09-22','2025-09-24',2,'task',500,0,1,3,0,'M/R Equipment Setting','D','Installation of Control Panel','1',3.00,0.00,0.00,'2025-11-09 10:43:11'),(35,520,'Car Assembly','2025-09-24','2025-09-29',3,'summary',500,0,1,0,0,'General',NULL,'Car Assembly','1',0.00,0.00,0.00,'2025-11-09 10:43:11'),(36,521,'All Accessories','2025-09-24','2025-09-28',2,'task',520,0,1,3,0,'Car Assembly','A','All Accessories','1',3.00,0.00,0.00,'2025-11-09 10:43:11'),(37,522,'Car Piping/Wiring','2025-09-28','2025-09-29',1,'task',520,0,1,3,0,'Car Assembly','B','Car Piping/Wiring','1',3.00,0.00,0.00,'2025-11-09 10:43:11'),(38,523,'Travelling Cable Layout','2025-09-29','2025-10-01',2,'task',500,0,1,2,0,'Car Assembly','C','Travelling Cable Layout','1',2.00,0.00,0.00,'2025-11-09 10:43:11'),(39,524,'Counterweight Assembly','2025-10-01','2025-10-05',2,'task',500,0,1,2,0,'Car Assembly','D','Counterweight Assembly','1',2.00,0.00,0.00,'2025-11-09 10:43:11'),(40,525,'Laying out of Ropes','2025-10-05','2025-10-12',5,'summary',500,0,1,0,0,'General',NULL,'Laying out of Ropes','1',0.00,0.00,0.00,'2025-11-09 10:43:11'),(41,526,'Hoisting','2025-10-05','2025-10-07',2,'task',525,0,1,2,0,'Laying out of ropes','A','Hoisting','1',2.00,0.00,0.00,'2025-11-09 10:43:11'),(42,527,'Governor','2025-10-07','2025-10-09',2,'task',525,0,1,3,0,'Compensating','B','Governor','1',3.00,0.00,0.00,'2025-11-09 10:43:11'),(43,528,'Compensating','2025-10-09','2025-10-12',1,'task',525,0,1,3,0,'Laying out of ropes','C','Compensating','1',3.00,0.00,0.00,'2025-11-09 10:43:11'),(44,529,'Wiring','2025-10-12','2025-10-15',2,'summary',500,0,1,0,0,'General',NULL,'Wiring','1',0.00,0.00,0.00,'2025-11-09 10:43:11'),(45,530,'Machine Room','2025-10-12','2025-10-14',1,'task',529,0,1,5,0,'Wiring','A','Machine Room','1',5.00,0.00,0.00,'2025-11-09 10:43:11'),(46,531,'Hoistway','2025-10-14','2025-10-15',1,'task',529,0,1,3,0,'Wiring','B','Hoistway','1',3.00,0.00,0.00,'2025-11-09 10:43:11'),(47,532,'Installation of Pit Ladder / Hoistway Lighting','2025-10-15','2025-10-19',2,'task',500,0,1,3,0,'Wiring','C','Installation of Pit Ladder / Hoistway Lighting','1',3.00,0.00,0.00,'2025-11-09 10:43:11'),(48,600,'Testing and Commissioning','2025-10-19','2025-11-10',15,'summary',NULL,0,1,0,0,'General',NULL,'Testing and Commissioning','1',0.00,0.00,0.00,'2025-11-09 10:43:11'),(49,601,'Initial testing','2025-10-19','2025-10-22',3,'task',600,0,1,3,0,'Testing and Commissioning (Passenger Elevator)','A','Initial testing','1',3.00,0.00,0.00,'2025-11-09 10:43:11'),(50,602,'Slow speed','2025-10-22','2025-10-26',2,'task',600,0,1,1,0,'Testing and Commissioning (Passenger Elevator)','B','Slow speed','1',1.00,0.00,0.00,'2025-11-09 10:43:11'),(51,603,'High speed and Mechanical Adjustment','2025-10-26','2025-10-28',2,'task',600,0,1,2,0,'Testing and Commissioning (Passenger Elevator)','C','High speed and Mechanical Adjustment','1',2.00,0.00,0.00,'2025-11-09 10:43:11'),(52,605,'Final Adjust','2025-10-30','2025-11-04',2,'task',600,0,1,1,0,'Testing and Commissioning (Passenger Elevator)','E','Final Adjust','1',1.00,0.00,0.00,'2025-11-09 10:43:11'),(53,606,'Features Test / Correction of Defects','2025-11-04','2025-11-06',2,'task',600,0,1,1,0,'Testing and Commissioning (Passenger Elevator)','F','Features Test / Correction of Defects','1',1.00,0.00,0.00,'2025-11-09 10:43:11'),(54,607,'Final Cleaning / Hand over','2025-11-06','2025-11-10',2,'task',600,0,0,1,1,'Testing and Commissioning (Passenger Elevator)','G','Final Cleaning / Hand over','1',1.00,0.00,0.00,'2025-11-09 10:43:11'),(55,604,'Load Test','2025-10-28','2025-10-30',2,'task',600,0,1,1,0,'Testing and Commissioning (Passenger Elevator)','D','Load Test','1',1.00,0.00,0.00,'2025-11-09 10:43:11');
/*!40000 ALTER TABLE `project_343_schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_344_schedule`
--

DROP TABLE IF EXISTS `project_344_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_344_schedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `task_id` int DEFAULT NULL,
  `task_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_start` date DEFAULT NULL,
  `task_end` date DEFAULT NULL,
  `task_duration` int DEFAULT NULL,
  `task_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_parent` int DEFAULT NULL,
  `task_approval` tinyint(1) DEFAULT '0',
  `task_done` tinyint(1) DEFAULT '0',
  `task_percent` int DEFAULT '0',
  `task_actual_current` tinyint DEFAULT '0',
  `section_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_code` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unit` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wt` decimal(5,2) DEFAULT '0.00',
  `pres_acc` decimal(5,2) DEFAULT '0.00',
  `prev_acc` decimal(5,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_344_schedule`
--

LOCK TABLES `project_344_schedule` WRITE;
/*!40000 ALTER TABLE `project_344_schedule` DISABLE KEYS */;
INSERT INTO `project_344_schedule` VALUES (1,104,'Submission of PO to Factory','2025-12-02','2025-12-03',1,'task',100,0,0,0,0,'General',NULL,'Submission of PO to Factory','1',0.00,0.00,0.00,'2025-11-13 15:11:28'),(2,103,'Submission of Drawing and Finishes for Approval','2025-11-25','2025-12-02',5,'task',100,0,0,0,0,'General',NULL,'Submission of Drawing and Finishes for Approval','1',0.00,0.00,0.00,'2025-11-13 15:11:28'),(3,100,'Preliminaries','2025-11-12','2025-12-03',15,'summary',NULL,0,0,0,0,'General',NULL,'Preliminaries','1',0.00,0.00,0.00,'2025-11-13 15:11:28'),(4,101,'Pre-Inspection(Checkin of Shaft)','2025-11-12','2025-11-20',6,'task',100,0,0,0,1,'General',NULL,'Pre-Inspection(Checkin of Shaft)','1',0.00,0.00,0.00,'2025-11-13 15:11:28'),(5,201,'Shaft Construction','2025-12-03','2026-02-08',47,'task',200,0,0,0,0,'General',NULL,'Shaft Construction','1',0.00,0.00,0.00,'2025-11-13 15:11:28'),(6,401,'Preparation of tools and materials for elevator installation','2026-02-08','2026-02-26',14,'task',400,0,0,0,0,'General',NULL,'Preparation of tools and materials for elevator installation','1',0.00,0.00,0.00,'2025-11-13 15:11:28'),(7,102,'Layout of Drawing','2025-11-20','2025-11-25',3,'task',100,0,0,0,0,'General',NULL,'Layout of Drawing','1',0.00,0.00,0.00,'2025-11-13 15:11:28'),(8,400,'Planning For Mobilization And Execution','2026-02-08','2026-03-18',28,'summary',NULL,0,0,0,0,'General',NULL,'Planning For Mobilization And Execution','1',0.00,0.00,0.00,'2025-11-13 15:11:28'),(9,402,'Layout of boardup markings','2026-02-26','2026-03-03',3,'task',400,0,0,0,0,'General',NULL,'Layout of boardup markings','1',0.00,0.00,0.00,'2025-11-13 15:11:28'),(10,200,'Structural/Civil Works','2025-12-03','2026-02-08',47,'summary',NULL,0,0,0,0,'General',NULL,'Structural/Civil Works','1',0.00,0.00,0.00,'2025-11-13 15:11:28'),(11,300,'Manufacturing and Importation Process','2025-12-03','2026-02-08',47,'summary',NULL,0,0,0,0,'General',NULL,'Manufacturing and Importation Process','1',0.00,0.00,0.00,'2025-11-13 15:11:28'),(12,403,'Partial delivery of tools and boardup materials','2026-03-03','2026-03-08',3,'task',400,0,0,0,0,'General',NULL,'Partial delivery of tools and boardup materials','1',0.00,0.00,0.00,'2025-11-13 15:11:28'),(13,404,'Preperation for Installation/Manufacturing','2026-03-08','2026-03-18',8,'task',400,0,0,0,0,'General',NULL,'Preperation for Installation/Manufacturing','1',0.00,0.00,0.00,'2025-11-13 15:11:28'),(14,500,'Mechanical Installation','2026-03-18','2026-05-20',45,'summary',NULL,0,0,0,0,'General',NULL,'Mechanical Installation','1',0.00,0.00,0.00,'2025-11-13 15:11:28'),(15,501,'Unloading of elevator equipments','2026-03-18','2026-03-19',1,'task',500,0,0,0,0,'General','1','Unloading of elevator equipments','1',0.00,0.00,0.00,'2025-11-13 15:11:28'),(16,504,'Template Setting','2026-03-25','2026-03-29',2,'task',500,0,0,7,0,'General','4','Template Setting','1',7.00,0.00,0.00,'2025-11-13 15:11:28'),(17,505,'Marking and Boring of Holes','2026-03-29','2026-03-30',1,'task',500,0,0,0,0,'General','5','Marking and Boring of Holes','1',0.00,0.00,0.00,'2025-11-13 15:11:28'),(18,502,'Scaffolding Installation','2026-03-19','2026-03-23',2,'task',500,0,0,7,0,'General','2','Scaffolding Installation','1',7.00,0.00,0.00,'2025-11-13 15:11:28'),(19,506,'Rail Bracket Installation','2026-03-30','2026-04-01',2,'task',500,0,0,7,0,'General','6','Rail Bracket Installation','1',7.00,0.00,0.00,'2025-11-13 15:11:28'),(20,507,'Guide Rail Setting','2026-04-01','2026-04-08',5,'summary',500,0,0,0,0,'General',NULL,'Guide Rail Setting','1',0.00,0.00,0.00,'2025-11-13 15:11:28'),(21,508,'Main/Car','2026-04-01','2026-04-05',2,'task',507,0,0,5,0,'Guide Rail Setting','A','Main/Car','1',5.00,0.00,0.00,'2025-11-13 15:11:28'),(22,509,'Counterweight (CWT)','2026-04-05','2026-04-07',2,'task',507,0,0,3,0,'Guide Rail Setting','B','Counterweight (CWT)','1',3.00,0.00,0.00,'2025-11-13 15:11:28'),(23,301,'Manufacturing and Importation','2025-12-03','2026-02-08',47,'task',300,0,0,0,0,'General',NULL,'Manufacturing and Importation','1',0.00,0.00,0.00,'2025-11-13 15:11:28'),(24,503,'Hauling Works','2026-03-23','2026-03-25',2,'task',500,0,0,7,0,'General','3','Hauling Works','1',7.00,0.00,0.00,'2025-11-13 15:11:28'),(25,510,'Gauging','2026-04-07','2026-04-08',1,'task',507,0,0,3,0,'Guide Rail Setting','C','Gauging','1',3.00,0.00,0.00,'2025-11-13 15:11:28'),(26,511,'Landing Door Assembly','2026-04-08','2026-04-16',6,'summary',500,0,0,0,0,'General',NULL,'Landing Door Assembly','1',0.00,0.00,0.00,'2025-11-13 15:11:28'),(27,512,'Sills and Supports','2026-04-08','2026-04-12',2,'task',511,0,0,2,0,'Landing Door Assembly','A','Sills and Supports','1',2.00,0.00,0.00,'2025-11-13 15:11:28'),(28,513,'Jamb and Supports','2026-04-12','2026-04-14',2,'task',511,0,0,2,0,'Landing Door Assembly','B','Jamb and Supports','1',2.00,0.00,0.00,'2025-11-13 15:11:28'),(29,516,'Traction Machine','2026-04-16','2026-04-20',2,'task',515,0,0,5,0,'M/R Equipment Setting','A','Traction Machine','1',5.00,0.00,0.00,'2025-11-13 15:11:28'),(30,517,'Support Beams','2026-04-20','2026-04-22',2,'task',515,0,0,5,0,'M/R Equipment Setting','B','Support Beams','1',5.00,0.00,0.00,'2025-11-13 15:11:28'),(31,518,'Governor (M/R)','2026-04-22','2026-04-26',2,'task',515,0,0,2,0,'M/R Equipment Setting','C','Governor (M/R)','1',2.00,0.00,0.00,'2025-11-13 15:11:28'),(32,514,'Frame and Doors','2026-04-14','2026-04-16',2,'task',511,0,0,3,0,'Landing Door Assembly','C','Frame and Doors','1',3.00,0.00,0.00,'2025-11-13 15:11:28'),(33,519,'Installation of Control Panel','2026-04-26','2026-04-28',2,'task',500,0,0,3,0,'M/R Equipment Setting','D','Installation of Control Panel','1',3.00,0.00,0.00,'2025-11-13 15:11:28'),(34,520,'Car Assembly','2026-04-28','2026-05-03',3,'summary',500,0,0,0,0,'General',NULL,'Car Assembly','1',0.00,0.00,0.00,'2025-11-13 15:11:28'),(35,515,'M/R Equipment Setting','2026-04-16','2026-04-26',6,'summary',500,0,0,0,0,'General',NULL,'M/R Equipment Setting','1',0.00,0.00,0.00,'2025-11-13 15:11:28'),(36,521,'All Accessories','2026-04-28','2026-04-30',2,'task',520,0,0,3,0,'Car Assembly','A','All Accessories','1',3.00,0.00,0.00,'2025-11-13 15:11:28'),(37,522,'Car Piping/Wiring','2026-04-30','2026-05-03',1,'task',520,0,0,3,0,'Car Assembly','B','Car Piping/Wiring','1',3.00,0.00,0.00,'2025-11-13 15:11:28'),(38,523,'Travelling Cable Layout','2026-05-03','2026-05-05',2,'task',500,0,0,2,0,'Car Assembly','C','Travelling Cable Layout','1',2.00,0.00,0.00,'2025-11-13 15:11:28'),(39,524,'Counterweight Assembly','2026-05-05','2026-05-07',2,'task',500,0,0,2,0,'Car Assembly','D','Counterweight Assembly','1',2.00,0.00,0.00,'2025-11-13 15:11:28'),(40,525,'Laying out of Ropes','2026-05-07','2026-05-14',5,'summary',500,0,0,0,0,'General',NULL,'Laying out of Ropes','1',0.00,0.00,0.00,'2025-11-13 15:11:28'),(41,526,'Hoisting','2026-05-07','2026-05-11',2,'task',525,0,0,2,0,'Laying out of ropes','A','Hoisting','1',2.00,0.00,0.00,'2025-11-13 15:11:28'),(42,527,'Governor (Ropes)','2026-05-11','2026-05-13',2,'task',525,0,0,3,0,'Compensating','B','Governor (Ropes)','1',3.00,0.00,0.00,'2025-11-13 15:11:28'),(43,528,'Compensating','2026-05-13','2026-05-14',1,'task',525,0,0,3,0,'Laying out of ropes','C','Compensating','1',3.00,0.00,0.00,'2025-11-13 15:11:28'),(44,529,'Wiring','2026-05-14','2026-05-18',2,'summary',500,0,0,0,0,'General',NULL,'Wiring','1',0.00,0.00,0.00,'2025-11-13 15:11:28'),(45,530,'Machine Room','2026-05-14','2026-05-17',1,'task',529,0,0,5,0,'Wiring','A','Machine Room','1',5.00,0.00,0.00,'2025-11-13 15:11:28'),(46,531,'Hoistway','2026-05-17','2026-05-18',1,'task',529,0,0,3,0,'Wiring','B','Hoistway','1',3.00,0.00,0.00,'2025-11-13 15:11:28'),(47,532,'Installation of Pit Ladder / Hoistway Lighting','2026-05-18','2026-05-20',2,'task',500,0,0,3,0,'Wiring','C','Installation of Pit Ladder / Hoistway Lighting','1',3.00,0.00,0.00,'2025-11-13 15:11:28'),(48,600,'Testing and Commissioning','2026-05-20','2026-06-10',15,'summary',NULL,0,0,0,0,'General',NULL,'Testing and Commissioning','1',0.00,0.00,0.00,'2025-11-13 15:11:28'),(49,601,'Initial testing','2026-05-20','2026-05-25',3,'task',600,0,0,3,0,'Testing and Commissioning (Passenger Elevator)','A','Initial testing','1',3.00,0.00,0.00,'2025-11-13 15:11:28'),(50,604,'Load Test','2026-05-31','2026-06-02',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','D','Load Test','1',1.00,0.00,0.00,'2025-11-13 15:11:28'),(51,605,'Final Adjust','2026-06-02','2026-06-04',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','E','Final Adjust','1',1.00,0.00,0.00,'2025-11-13 15:11:28'),(52,606,'Features Test / Correction of Defects','2026-06-04','2026-06-08',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','F','Features Test / Correction of Defects','1',1.00,0.00,0.00,'2025-11-13 15:11:28'),(53,602,'Slow speed','2026-05-25','2026-05-27',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','B','Slow speed','1',1.00,0.00,0.00,'2025-11-13 15:11:28'),(54,603,'High speed and Mechanical Adjustment','2026-05-27','2026-05-31',2,'task',600,0,0,2,0,'Testing and Commissioning (Passenger Elevator)','C','High speed and Mechanical Adjustment','1',2.00,0.00,0.00,'2025-11-13 15:11:28'),(55,607,'Final Cleaning / Hand over','2026-06-08','2026-06-10',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','G','Final Cleaning / Hand over','1',1.00,0.00,0.00,'2025-11-13 15:11:28');
/*!40000 ALTER TABLE `project_344_schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_44_schedule`
--

DROP TABLE IF EXISTS `project_44_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_44_schedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `task_id` int DEFAULT NULL,
  `task_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_start` date DEFAULT NULL,
  `task_end` date DEFAULT NULL,
  `task_duration` int DEFAULT NULL,
  `task_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_parent` int DEFAULT NULL,
  `task_approval` tinyint(1) DEFAULT '0',
  `task_done` tinyint(1) DEFAULT '0',
  `task_percent` int DEFAULT '0',
  `task_actual_current` tinyint DEFAULT '0',
  `section_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_code` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unit` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wt` decimal(5,2) DEFAULT '0.00',
  `pres_acc` decimal(5,2) DEFAULT '0.00',
  `prev_acc` decimal(5,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_44_schedule`
--

LOCK TABLES `project_44_schedule` WRITE;
/*!40000 ALTER TABLE `project_44_schedule` DISABLE KEYS */;
INSERT INTO `project_44_schedule` VALUES (1,100,'Preliminaries','2025-11-12','2025-12-03',15,'summary',NULL,0,0,0,0,'General',NULL,'Preliminaries','1',0.00,0.00,0.00,'2025-11-12 18:58:23'),(2,200,'Structural/Civil Works','2025-12-03','2026-02-08',47,'summary',NULL,0,0,0,0,'General',NULL,'Structural/Civil Works','1',0.00,0.00,0.00,'2025-11-12 18:58:23'),(3,102,'Layout of Drawing','2025-11-20','2025-11-25',3,'task',100,0,0,0,0,'General',NULL,'Layout of Drawing','1',0.00,0.00,0.00,'2025-11-12 18:58:23'),(4,201,'Shaft Construction','2025-12-03','2026-02-08',47,'task',200,0,0,0,0,'General',NULL,'Shaft Construction','1',0.00,0.00,0.00,'2025-11-12 18:58:23'),(5,101,'Pre-Inspection(Checkin of Shaft)','2025-11-12','2025-11-20',6,'task',100,0,0,0,1,'General',NULL,'Pre-Inspection(Checkin of Shaft)','1',0.00,0.00,0.00,'2025-11-12 18:58:23'),(6,301,'Manufacturing and Importation','2025-12-03','2026-02-08',47,'task',300,0,0,0,0,'General',NULL,'Manufacturing and Importation','1',0.00,0.00,0.00,'2025-11-12 18:58:23'),(7,300,'Manufacturing and Importation Process','2025-12-03','2026-02-08',47,'summary',NULL,0,0,0,0,'General',NULL,'Manufacturing and Importation Process','1',0.00,0.00,0.00,'2025-11-12 18:58:23'),(8,400,'Planning For Mobilization And Execution','2026-02-08','2026-03-18',28,'summary',NULL,0,0,0,0,'General',NULL,'Planning For Mobilization And Execution','1',0.00,0.00,0.00,'2025-11-12 18:58:23'),(9,104,'Submission of PO to Factory','2025-12-02','2025-12-03',1,'task',100,0,0,0,0,'General',NULL,'Submission of PO to Factory','1',0.00,0.00,0.00,'2025-11-12 18:58:23'),(10,401,'Preparation of tools and materials for elevator installation','2026-02-08','2026-02-26',14,'task',400,0,0,0,0,'General',NULL,'Preparation of tools and materials for elevator installation','1',0.00,0.00,0.00,'2025-11-12 18:58:23'),(11,103,'Submission of Drawing and Finishes for Approval','2025-11-25','2025-12-02',5,'task',100,0,0,0,0,'General',NULL,'Submission of Drawing and Finishes for Approval','1',0.00,0.00,0.00,'2025-11-12 18:58:23'),(12,402,'Layout of boardup markings','2026-02-26','2026-03-03',3,'task',400,0,0,0,0,'General',NULL,'Layout of boardup markings','1',0.00,0.00,0.00,'2025-11-12 18:58:23'),(13,403,'Partial delivery of tools and boardup materials','2026-03-03','2026-03-08',3,'task',400,0,0,0,0,'General',NULL,'Partial delivery of tools and boardup materials','1',0.00,0.00,0.00,'2025-11-12 18:58:23'),(14,404,'Preperation for Installation/Manufacturing','2026-03-08','2026-03-18',8,'task',400,0,0,0,0,'General',NULL,'Preperation for Installation/Manufacturing','1',0.00,0.00,0.00,'2025-11-12 18:58:23'),(15,500,'Mechanical Installation','2026-03-18','2026-05-20',45,'summary',NULL,0,0,0,0,'General',NULL,'Mechanical Installation','1',0.00,0.00,0.00,'2025-11-12 18:58:23'),(16,501,'Unloading of elevator equipments','2026-03-18','2026-03-19',1,'task',500,0,0,0,0,'General','1','Unloading of elevator equipments','1',0.00,0.00,0.00,'2025-11-12 18:58:23'),(17,502,'Scaffolding Installation','2026-03-19','2026-03-23',2,'task',500,0,0,7,0,'General','2','Scaffolding Installation','1',7.00,0.00,0.00,'2025-11-12 18:58:23'),(18,503,'Hauling Works','2026-03-23','2026-03-25',2,'task',500,0,0,7,0,'General','3','Hauling Works','1',7.00,0.00,0.00,'2025-11-12 18:58:23'),(19,504,'Template Setting','2026-03-25','2026-03-29',2,'task',500,0,0,7,0,'General','4','Template Setting','1',7.00,0.00,0.00,'2025-11-12 18:58:23'),(20,505,'Marking and Boring of Holes','2026-03-29','2026-03-30',1,'task',500,0,0,0,0,'General','5','Marking and Boring of Holes','1',0.00,0.00,0.00,'2025-11-12 18:58:23'),(21,506,'Rail Bracket Installation','2026-03-30','2026-04-01',2,'task',500,0,0,7,0,'General','6','Rail Bracket Installation','1',7.00,0.00,0.00,'2025-11-12 18:58:23'),(22,507,'Guide Rail Setting','2026-04-01','2026-04-08',5,'summary',500,0,0,0,0,'General',NULL,'Guide Rail Setting','1',0.00,0.00,0.00,'2025-11-12 18:58:23'),(23,508,'Main/Car','2026-04-01','2026-04-05',2,'task',507,0,0,5,0,'Guide Rail Setting','A','Main/Car','1',5.00,0.00,0.00,'2025-11-12 18:58:23'),(24,509,'Counterweight (CWT)','2026-04-05','2026-04-07',2,'task',507,0,0,3,0,'Guide Rail Setting','B','Counterweight (CWT)','1',3.00,0.00,0.00,'2025-11-12 18:58:23'),(25,510,'Gauging','2026-04-07','2026-04-08',1,'task',507,0,0,3,0,'Guide Rail Setting','C','Gauging','1',3.00,0.00,0.00,'2025-11-12 18:58:23'),(26,511,'Landing Door Assembly','2026-04-08','2026-04-16',6,'summary',500,0,0,0,0,'General',NULL,'Landing Door Assembly','1',0.00,0.00,0.00,'2025-11-12 18:58:23'),(27,512,'Sills and Supports','2026-04-08','2026-04-12',2,'task',511,0,0,2,0,'Landing Door Assembly','A','Sills and Supports','1',2.00,0.00,0.00,'2025-11-12 18:58:23'),(28,513,'Jamb and Supports','2026-04-12','2026-04-14',2,'task',511,0,0,2,0,'Landing Door Assembly','B','Jamb and Supports','1',2.00,0.00,0.00,'2025-11-12 18:58:23'),(29,514,'Frame and Doors','2026-04-14','2026-04-16',2,'task',511,0,0,3,0,'Landing Door Assembly','C','Frame and Doors','1',3.00,0.00,0.00,'2025-11-12 18:58:23'),(30,515,'M/R Equipment Setting','2026-04-16','2026-04-26',6,'summary',500,0,0,0,0,'General',NULL,'M/R Equipment Setting','1',0.00,0.00,0.00,'2025-11-12 18:58:23'),(31,516,'Traction Machine','2026-04-16','2026-04-20',2,'task',515,0,0,5,0,'M/R Equipment Setting','A','Traction Machine','1',5.00,0.00,0.00,'2025-11-12 18:58:23'),(32,517,'Support Beams','2026-04-20','2026-04-22',2,'task',515,0,0,5,0,'M/R Equipment Setting','B','Support Beams','1',5.00,0.00,0.00,'2025-11-12 18:58:23'),(33,518,'Governor','2026-04-22','2026-04-26',2,'task',515,0,0,2,0,'M/R Equipment Setting','C','Governor','1',2.00,0.00,0.00,'2025-11-12 18:58:23'),(34,519,'Installation of Control Panel','2026-04-26','2026-04-28',2,'task',500,0,0,3,0,'M/R Equipment Setting','D','Installation of Control Panel','1',3.00,0.00,0.00,'2025-11-12 18:58:23'),(35,520,'Car Assembly','2026-04-28','2026-05-03',3,'summary',500,0,0,0,0,'General',NULL,'Car Assembly','1',0.00,0.00,0.00,'2025-11-12 18:58:23'),(36,521,'All Accessories','2026-04-28','2026-04-30',2,'task',520,0,0,3,0,'Car Assembly','A','All Accessories','1',3.00,0.00,0.00,'2025-11-12 18:58:23'),(37,522,'Car Piping/Wiring','2026-04-30','2026-05-03',1,'task',520,0,0,3,0,'Car Assembly','B','Car Piping/Wiring','1',3.00,0.00,0.00,'2025-11-12 18:58:23'),(38,523,'Travelling Cable Layout','2026-05-03','2026-05-05',2,'task',500,0,0,2,0,'Car Assembly','C','Travelling Cable Layout','1',2.00,0.00,0.00,'2025-11-12 18:58:23'),(39,524,'Counterweight Assembly','2026-05-05','2026-05-07',2,'task',500,0,0,2,0,'Car Assembly','D','Counterweight Assembly','1',2.00,0.00,0.00,'2025-11-12 18:58:23'),(40,525,'Laying out of Ropes','2026-05-07','2026-05-14',5,'summary',500,0,0,0,0,'General',NULL,'Laying out of Ropes','1',0.00,0.00,0.00,'2025-11-12 18:58:23'),(41,526,'Hoisting','2026-05-07','2026-05-11',2,'task',525,0,0,2,0,'Laying out of ropes','A','Hoisting','1',2.00,0.00,0.00,'2025-11-12 18:58:23'),(42,527,'Governor','2026-05-11','2026-05-13',2,'task',525,0,0,3,0,'Compensating','B','Governor','1',3.00,0.00,0.00,'2025-11-12 18:58:23'),(43,528,'Compensating','2026-05-13','2026-05-14',1,'task',525,0,0,3,0,'Laying out of ropes','C','Compensating','1',3.00,0.00,0.00,'2025-11-12 18:58:23'),(44,529,'Wiring','2026-05-14','2026-05-18',2,'summary',500,0,0,0,0,'General',NULL,'Wiring','1',0.00,0.00,0.00,'2025-11-12 18:58:23'),(45,530,'Machine Room','2026-05-14','2026-05-17',1,'task',529,0,0,5,0,'Wiring','A','Machine Room','1',5.00,0.00,0.00,'2025-11-12 18:58:23'),(46,531,'Hoistway','2026-05-17','2026-05-18',1,'task',529,0,0,3,0,'Wiring','B','Hoistway','1',3.00,0.00,0.00,'2025-11-12 18:58:23'),(47,532,'Installation of Pit Ladder / Hoistway Lighting','2026-05-18','2026-05-20',2,'task',500,0,0,3,0,'Wiring','C','Installation of Pit Ladder / Hoistway Lighting','1',3.00,0.00,0.00,'2025-11-12 18:58:23'),(48,600,'Testing and Commissioning','2026-05-20','2026-06-10',15,'summary',NULL,0,0,0,0,'General',NULL,'Testing and Commissioning','1',0.00,0.00,0.00,'2025-11-12 18:58:23'),(49,601,'Initial testing','2026-05-20','2026-05-25',3,'task',600,0,0,3,0,'Testing and Commissioning (Passenger Elevator)','A','Initial testing','1',3.00,0.00,0.00,'2025-11-12 18:58:23'),(50,602,'Slow speed','2026-05-25','2026-05-27',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','B','Slow speed','1',1.00,0.00,0.00,'2025-11-12 18:58:23'),(51,604,'Load Test','2026-05-31','2026-06-02',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','D','Load Test','1',1.00,0.00,0.00,'2025-11-12 18:58:23'),(52,603,'High speed and Mechanical Adjustment','2026-05-27','2026-05-31',2,'task',600,0,0,2,0,'Testing and Commissioning (Passenger Elevator)','C','High speed and Mechanical Adjustment','1',2.00,0.00,0.00,'2025-11-12 18:58:23'),(53,605,'Final Adjust','2026-06-02','2026-06-04',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','E','Final Adjust','1',1.00,0.00,0.00,'2025-11-12 18:58:23'),(54,606,'Features Test / Correction of Defects','2026-06-04','2026-06-08',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','F','Features Test / Correction of Defects','1',1.00,0.00,0.00,'2025-11-12 18:58:23'),(55,607,'Final Cleaning / Hand over','2026-06-08','2026-06-10',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','G','Final Cleaning / Hand over','1',1.00,0.00,0.00,'2025-11-12 18:58:23');
/*!40000 ALTER TABLE `project_44_schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_45_schedule`
--

DROP TABLE IF EXISTS `project_45_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_45_schedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `task_id` int DEFAULT NULL,
  `task_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_start` date DEFAULT NULL,
  `task_end` date DEFAULT NULL,
  `task_duration` int DEFAULT NULL,
  `task_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_parent` int DEFAULT NULL,
  `task_approval` tinyint(1) DEFAULT '0',
  `task_done` tinyint(1) DEFAULT '0',
  `task_percent` int DEFAULT '0',
  `task_actual_current` tinyint DEFAULT '0',
  `section_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_code` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unit` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wt` decimal(5,2) DEFAULT '0.00',
  `pres_acc` decimal(5,2) DEFAULT '0.00',
  `prev_acc` decimal(5,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_45_schedule`
--

LOCK TABLES `project_45_schedule` WRITE;
/*!40000 ALTER TABLE `project_45_schedule` DISABLE KEYS */;
INSERT INTO `project_45_schedule` VALUES (1,103,'Submission of Drawing and Finishes for Approval','2025-04-28','2025-05-04',5,'task',100,0,1,0,0,NULL,NULL,'Submission of Drawing and Finishes for Approval','1',0.00,100.00,0.00,'2025-10-31 10:24:44'),(2,100,'Preliminaries','2025-04-17','2025-05-05',15,'summary',NULL,0,1,0,0,NULL,NULL,'Preliminaries','1',0.00,100.00,0.00,'2025-10-31 10:24:44'),(3,101,'Pre-Inspection(Checkin of Shaft)','2025-04-17','2025-04-24',6,'task',100,0,1,0,0,NULL,NULL,'Pre-Inspection(Checkin of Shaft)','1',0.00,100.00,0.00,'2025-10-31 10:24:44'),(4,300,'Manufacturing and Importation Process (Passenger Elevator)','2025-05-05','2025-07-31',75,'summary',NULL,0,1,0,0,NULL,NULL,'Manufacturing and Importation Process (Passenger Elevator)','1',0.00,100.00,0.00,'2025-10-31 10:24:44'),(5,200,'Structural/Civil Works','2025-05-05','2025-07-31',75,'summary',NULL,0,1,0,0,NULL,NULL,'Structural/Civil Works','1',0.00,100.00,0.00,'2025-10-31 10:24:44'),(6,102,'Layout of Drawing','2025-04-24','2025-04-28',3,'task',100,0,1,0,0,NULL,NULL,'Layout of Drawing','1',0.00,100.00,0.00,'2025-10-31 10:24:44'),(7,400,'Planning For Mobilization And Execution','2025-07-31','2025-08-24',20,'summary',NULL,0,1,0,0,NULL,NULL,'Planning For Mobilization And Execution','1',0.00,100.00,0.00,'2025-10-31 10:24:44'),(8,201,'Shaft Construction','2025-05-05','2025-07-31',75,'task',200,0,1,0,0,NULL,NULL,'Shaft Construction','1',0.00,100.00,0.00,'2025-10-31 10:24:44'),(9,301,'Manufacturing and Importation','2025-05-05','2025-07-31',75,'task',300,0,1,0,0,NULL,NULL,'Manufacturing and Importation','1',0.00,100.00,0.00,'2025-10-31 10:24:44'),(10,104,'Submission of PO to Factory','2025-05-04','2025-05-05',1,'task',100,0,1,0,0,NULL,NULL,'Submission of PO to Factory','1',0.00,100.00,0.00,'2025-10-31 10:24:44'),(11,401,'Preparation of tools and materials for elevator installation','2025-07-31','2025-08-17',14,'task',400,0,1,0,0,NULL,NULL,'Preparation of tools and materials for elevator installation','1',0.00,100.00,0.00,'2025-10-31 10:24:44'),(12,402,'Layout of boardup markings','2025-08-17','2025-08-20',3,'task',400,0,1,0,0,NULL,NULL,'Layout of boardup markings','1',0.00,100.00,0.00,'2025-10-31 10:24:44'),(13,403,'Partial delivery of tools and boardup materials','2025-08-20','2025-08-24',3,'task',400,0,1,0,0,NULL,NULL,'Partial delivery of tools and boardup materials','1',0.00,100.00,0.00,'2025-10-31 10:24:44'),(14,501,'Unloading of elevator equipments','2025-08-24','2025-08-25',1,'task',500,0,1,0,0,'General','1','Unloading of elevator equipments','1',0.00,100.00,0.00,'2025-10-31 10:24:44'),(15,502,'Scaffolding Installation','2025-08-25','2025-08-27',2,'task',500,0,1,7,0,'General','2','Scaffolding Installation','1',7.00,100.00,0.00,'2025-10-31 10:24:44'),(16,503,'Hauling Works','2025-08-27','2025-08-29',2,'task',500,0,1,7,0,'General','3','Hauling Works','1',7.00,100.00,0.00,'2025-10-31 10:24:44'),(17,504,'Template Setting','2025-08-29','2025-09-01',2,'task',500,0,1,7,0,'General','4','Template Setting','1',7.00,100.00,0.00,'2025-10-31 10:24:44'),(18,506,'Rail Bracket Installation','2025-09-02','2025-09-04',2,'task',500,0,1,7,0,'General','6','Rail Bracket Installation','1',7.00,100.00,0.00,'2025-10-31 10:24:44'),(19,500,'Mechanical Installation (Passenger Elevator)','2025-08-24','2025-10-15',45,'summary',NULL,0,1,0,0,NULL,NULL,'Mechanical Installation (Passenger Elevator)','1',0.00,100.00,0.00,'2025-10-31 10:24:44'),(20,505,'Marking and Boring of Holes','2025-09-01','2025-09-02',1,'task',500,0,1,0,0,'General','5','Marking and Boring of Holes','1',0.00,100.00,0.00,'2025-10-31 10:24:44'),(21,507,'Guide Rail Setting','2025-09-04','2025-09-10',5,'summary',500,0,1,0,0,NULL,NULL,'Guide Rail Setting','1',0.00,100.00,0.00,'2025-10-31 10:24:44'),(22,508,'Main/Car','2025-09-04','2025-09-07',2,'task',507,0,1,5,0,'Guide Rail Setting','A','Main/Car','1',5.00,100.00,0.00,'2025-10-31 10:24:44'),(23,509,'Counterweight (CWT)','2025-09-07','2025-09-09',2,'task',507,0,1,3,0,'Guide Rail Setting','B','Counterweight (CWT)','1',3.00,100.00,0.00,'2025-10-31 10:24:44'),(24,510,'Gauging','2025-09-09','2025-09-10',1,'task',507,0,1,3,0,'Guide Rail Setting','C','Gauging','1',3.00,100.00,0.00,'2025-10-31 10:24:44'),(25,511,'Landing Door Assembly','2025-09-10','2025-09-17',6,'summary',500,0,1,0,0,NULL,NULL,'Landing Door Assembly','1',0.00,100.00,0.00,'2025-10-31 10:24:44'),(26,512,'Sills and Supports','2025-09-10','2025-09-12',2,'task',511,0,1,2,0,'Landing Door Assembly','A','Sills and Supports','1',2.00,100.00,0.00,'2025-10-31 10:24:44'),(27,513,'Jamb and Supports','2025-09-12','2025-09-15',2,'task',511,0,1,2,0,'Landing Door Assembly','B','Jamb and Supports','1',2.00,100.00,0.00,'2025-10-31 10:24:44'),(28,514,'Frame and Doors','2025-09-15','2025-09-17',2,'task',511,0,1,3,0,'Landing Door Assembly','C','Frame and Doors','1',3.00,100.00,0.00,'2025-10-31 10:24:44'),(29,515,'M/R Equipment Setting','2025-09-17','2025-09-24',6,'summary',500,0,1,0,0,NULL,NULL,'M/R Equipment Setting','1',0.00,100.00,0.00,'2025-10-31 10:24:44'),(30,516,'Traction Machine','2025-09-17','2025-09-19',2,'task',515,0,1,5,0,'M/R Equipment Setting','A','Traction Machine','1',5.00,100.00,0.00,'2025-10-31 10:24:44'),(31,517,'Support Beams','2025-09-19','2025-09-22',2,'task',515,0,1,5,0,'M/R Equipment Setting','B','Support Beams','1',5.00,100.00,0.00,'2025-10-31 10:24:44'),(32,518,'Governor','2025-09-22','2025-09-24',2,'task',515,0,1,2,0,'M/R Equipment Setting','C','Governor','1',2.00,100.00,0.00,'2025-10-31 10:24:44'),(33,519,'Installation of Control Panel','2025-09-24','2025-09-26',2,'task',500,0,1,3,0,'M/R Equipment Setting','D','Installation of Control Panel','1',3.00,100.00,0.00,'2025-10-31 10:24:44'),(34,520,'Car Assembly','2025-09-26','2025-09-30',3,'summary',500,0,1,0,0,NULL,NULL,'Car Assembly','1',0.00,100.00,0.00,'2025-10-31 10:24:44'),(35,521,'All Accessories','2025-09-26','2025-09-29',2,'task',520,0,1,3,0,'Car Assembly','A','All Accessories','1',3.00,100.00,0.00,'2025-10-31 10:24:44'),(36,522,'Car Piping/Wiring','2025-09-29','2025-09-30',1,'task',520,0,1,3,0,'Car Assembly','B','Car Piping/Wiring','1',3.00,100.00,0.00,'2025-10-31 10:24:44'),(37,523,'Travelling Cable Layout','2025-09-30','2025-10-02',2,'task',500,0,1,2,0,'Car Assembly','C','Travelling Cable Layout','1',2.00,100.00,0.00,'2025-10-31 10:24:44'),(38,524,'Counterweight Assembly','2025-10-02','2025-10-05',2,'task',500,0,1,2,0,'Car Assembly','D','Counterweight Assembly','1',2.00,100.00,0.00,'2025-10-31 10:24:44'),(39,525,'Laying out of Ropes','2025-10-05','2025-10-10',5,'summary',500,0,1,0,0,NULL,NULL,'Laying out of Ropes','1',0.00,100.00,0.00,'2025-10-31 10:24:44'),(40,526,'Hoisting','2025-10-05','2025-10-07',2,'task',525,0,1,2,0,'Laying out of ropes','A','Hoisting','1',2.00,100.00,0.00,'2025-10-31 10:24:44'),(41,527,'Governor','2025-10-07','2025-10-09',2,'task',525,0,1,3,0,'Compensating','B','Governor','1',3.00,100.00,0.00,'2025-10-31 10:24:44'),(42,528,'Compensating','2025-10-09','2025-10-10',1,'task',525,0,1,3,0,'Laying out of ropes','C','Compensating','1',3.00,100.00,0.00,'2025-10-31 10:24:44'),(43,529,'Wiring','2025-10-10','2025-10-13',2,'summary',500,0,1,0,0,NULL,NULL,'Wiring','1',0.00,100.00,0.00,'2025-10-31 10:24:44'),(44,530,'Machine Room','2025-10-10','2025-10-12',1,'task',529,0,1,5,0,'Wiring','A','Machine Room','1',5.00,100.00,0.00,'2025-10-31 10:24:44'),(45,531,'Hoistway','2025-10-12','2025-10-13',1,'task',529,0,1,3,0,'Wiring','B','Hoistway','1',3.00,100.00,0.00,'2025-10-31 10:24:44'),(46,532,'Installation of Pit Ladder / Hoistway Lighting','2025-10-13','2025-10-15',2,'task',500,0,1,3,0,'Wiring','C','Installation of Pit Ladder / Hoistway Lighting','1',3.00,100.00,0.00,'2025-10-31 10:24:44'),(47,600,'Testing and Commissioning (Passenger Elevator)','2025-10-15','2025-11-02',15,'summary',NULL,0,1,0,0,NULL,NULL,'Testing and Commissioning (Passenger Elevator)','1',0.00,100.00,0.00,'2025-10-31 10:24:44'),(48,601,'Initial testing','2025-10-15','2025-10-19',3,'task',600,0,1,3,0,'Testing and Commissioning (Passenger Elevator)','A','Initial testing','1',3.00,100.00,0.00,'2025-10-31 10:24:44'),(49,602,'Slow speed','2025-10-19','2025-10-21',2,'task',600,0,1,1,0,'Testing and Commissioning (Passenger Elevator)','B','Slow speed','1',1.00,100.00,0.00,'2025-10-31 10:24:44'),(50,603,'High speed and Mechanical Adjustment','2025-10-21','2025-10-23',2,'task',600,0,1,2,0,'Testing and Commissioning (Passenger Elevator)','C','High speed and Mechanical Adjustment','1',2.00,100.00,0.00,'2025-10-31 10:24:44'),(51,604,'Load Test','2025-10-23','2025-10-26',2,'task',600,0,1,1,0,'Testing and Commissioning (Passenger Elevator)','D','Load Test','1',1.00,100.00,0.00,'2025-10-31 10:24:44'),(52,605,'Final Adjust','2025-10-26','2025-10-28',2,'task',600,0,1,1,0,'Testing and Commissioning (Passenger Elevator)','E','Final Adjust','1',1.00,100.00,0.00,'2025-10-31 10:24:44'),(53,606,'Features Test / Correction of Defects','2025-10-28','2025-10-30',2,'task',600,1,1,1,0,'Testing and Commissioning (Passenger Elevator)','F','Features Test / Correction of Defects','1',1.00,100.00,0.00,'2025-10-31 10:24:44'),(54,607,'Final Cleaning / Hand over','2025-10-30','2025-11-02',2,'task',600,1,1,1,1,'Testing and Commissioning (Passenger Elevator)','G','Final Cleaning / Hand over','1',1.00,100.00,0.00,'2025-10-31 10:24:44');
/*!40000 ALTER TABLE `project_45_schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_46_schedule`
--

DROP TABLE IF EXISTS `project_46_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_46_schedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `task_id` int DEFAULT NULL,
  `task_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_start` date DEFAULT NULL,
  `task_end` date DEFAULT NULL,
  `task_duration` int DEFAULT NULL,
  `task_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_parent` int DEFAULT NULL,
  `task_approval` tinyint(1) DEFAULT '0',
  `task_done` tinyint(1) DEFAULT '0',
  `task_percent` int DEFAULT '0',
  `task_actual_current` tinyint DEFAULT '0',
  `section_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_code` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unit` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wt` decimal(5,2) DEFAULT '0.00',
  `pres_acc` decimal(5,2) DEFAULT '0.00',
  `prev_acc` decimal(5,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_46_schedule`
--

LOCK TABLES `project_46_schedule` WRITE;
/*!40000 ALTER TABLE `project_46_schedule` DISABLE KEYS */;
INSERT INTO `project_46_schedule` VALUES (1,104,'Submission of PO to Factory','2025-07-31','2025-08-01',1,'task',100,0,0,0,0,NULL,NULL,'Submission of PO to Factory','1',0.00,0.00,0.00,'2025-11-08 07:57:04'),(2,300,'Manufacturing and Importation Process (Passenger Elevator)','2025-11-19','2026-03-04',75,'summary',NULL,0,0,0,0,NULL,NULL,'Manufacturing and Importation Process (Passenger Elevator)','1',0.00,0.00,0.00,'2025-11-08 07:57:04'),(3,103,'Submission of Drawing and Finishes for Approval','2025-07-24','2025-07-31',5,'task',100,0,0,0,0,NULL,NULL,'Submission of Drawing and Finishes for Approval','1',0.00,0.00,0.00,'2025-11-08 07:57:04'),(4,101,'Pre-Inspection(Checkin of Shaft)','2025-07-11','2025-07-21',6,'task',100,0,1,0,0,NULL,NULL,'Pre-Inspection(Checkin of Shaft)','1',0.00,100.00,0.00,'2025-11-08 07:57:04'),(5,100,'Preliminaries','2025-07-11','2025-08-01',15,'summary',NULL,0,1,0,0,NULL,NULL,'Preliminaries','1',0.00,100.00,0.00,'2025-11-08 07:57:04'),(6,400,'Planning For Mobilization And Execution','2026-03-04','2026-04-01',20,'summary',NULL,0,0,0,0,NULL,NULL,'Planning For Mobilization And Execution','1',0.00,0.00,0.00,'2025-11-08 07:57:04'),(7,102,'Layout of Drawing','2025-07-21','2025-07-24',3,'task',100,0,0,0,1,NULL,NULL,'Layout of Drawing','1',0.00,0.00,0.00,'2025-11-08 07:57:04'),(8,301,'Manufacturing and Importation','2025-11-19','2026-03-04',75,'task',300,0,0,0,0,NULL,NULL,'Manufacturing and Importation','1',0.00,0.00,0.00,'2025-11-08 07:57:04'),(9,201,'Shaft Construction','2025-08-06','2025-11-19',75,'task',200,0,0,0,0,NULL,NULL,'Shaft Construction','1',0.00,0.00,0.00,'2025-11-08 07:57:04'),(10,200,'Structural/Civil Works','2025-08-06','2025-11-19',75,'summary',NULL,0,0,0,0,NULL,NULL,'Structural/Civil Works','1',0.00,0.00,0.00,'2025-11-08 07:57:04'),(11,401,'Preparation of tools and materials for elevator installation','2026-03-04','2026-03-24',14,'task',400,0,0,0,0,NULL,NULL,'Preparation of tools and materials for elevator installation','1',0.00,0.00,0.00,'2025-11-08 07:57:04'),(12,402,'Layout of boardup markings','2026-03-24','2026-03-27',3,'task',400,0,0,0,0,NULL,NULL,'Layout of boardup markings','1',0.00,0.00,0.00,'2025-11-08 07:57:04'),(13,403,'Partial delivery of tools and boardup materials','2026-03-27','2026-04-01',3,'task',400,0,0,0,0,NULL,NULL,'Partial delivery of tools and boardup materials','1',0.00,0.00,0.00,'2025-11-08 07:57:04'),(14,500,'Mechanical Installation (Passenger Elevator)','2026-04-01','2026-06-03',45,'summary',NULL,0,0,0,0,NULL,NULL,'Mechanical Installation (Passenger Elevator)','1',0.00,0.00,0.00,'2025-11-08 07:57:04'),(15,501,'Unloading of elevator equipments','2026-04-01','2026-04-02',1,'task',500,0,0,0,0,'General','1','Unloading of elevator equipments','1',0.00,0.00,0.00,'2025-11-08 07:57:04'),(16,502,'Scaffolding Installation','2026-04-02','2026-04-06',2,'task',500,0,0,7,0,'General','2','Scaffolding Installation','1',7.00,0.00,0.00,'2025-11-08 07:57:04'),(17,503,'Hauling Works','2026-04-06','2026-04-08',2,'task',500,0,0,7,0,'General','3','Hauling Works','1',7.00,0.00,0.00,'2025-11-08 07:57:04'),(18,504,'Template Setting','2026-04-08','2026-04-10',2,'task',500,0,0,7,0,'General','4','Template Setting','1',7.00,0.00,0.00,'2025-11-08 07:57:04'),(19,505,'Marking and Boring of Holes','2026-04-10','2026-04-13',1,'task',500,0,0,0,0,'General','5','Marking and Boring of Holes','1',0.00,0.00,0.00,'2025-11-08 07:57:04'),(20,506,'Rail Bracket Installation','2026-04-13','2026-04-15',2,'task',500,0,0,7,0,'General','6','Rail Bracket Installation','1',7.00,0.00,0.00,'2025-11-08 07:57:04'),(21,507,'Guide Rail Setting','2026-04-15','2026-04-22',5,'summary',500,0,0,0,0,NULL,NULL,'Guide Rail Setting','1',0.00,0.00,0.00,'2025-11-08 07:57:04'),(22,508,'Main/Car','2026-04-15','2026-04-17',2,'task',507,0,0,5,0,'Guide Rail Setting','A','Main/Car','1',5.00,0.00,0.00,'2025-11-08 07:57:04'),(23,509,'Counterweight (CWT)','2026-04-17','2026-04-21',2,'task',507,0,0,3,0,'Guide Rail Setting','B','Counterweight (CWT)','1',3.00,0.00,0.00,'2025-11-08 07:57:04'),(24,510,'Gauging','2026-04-21','2026-04-22',1,'task',507,0,0,3,0,'Guide Rail Setting','C','Gauging','1',3.00,0.00,0.00,'2025-11-08 07:57:04'),(25,511,'Landing Door Assembly','2026-04-22','2026-04-30',6,'summary',500,0,0,0,0,NULL,NULL,'Landing Door Assembly','1',0.00,0.00,0.00,'2025-11-08 07:57:04'),(26,512,'Sills and Supports','2026-04-22','2026-04-24',2,'task',511,0,0,2,0,'Landing Door Assembly','A','Sills and Supports','1',2.00,0.00,0.00,'2025-11-08 07:57:04'),(27,513,'Jamb and Supports','2026-04-24','2026-04-28',2,'task',511,0,0,2,0,'Landing Door Assembly','B','Jamb and Supports','1',2.00,0.00,0.00,'2025-11-08 07:57:04'),(28,514,'Frame and Doors','2026-04-28','2026-04-30',2,'task',511,0,0,3,0,'Landing Door Assembly','C','Frame and Doors','1',3.00,0.00,0.00,'2025-11-08 07:57:04'),(29,515,'M/R Equipment Setting','2026-04-30','2026-05-08',6,'summary',500,0,0,0,0,NULL,NULL,'M/R Equipment Setting','1',0.00,0.00,0.00,'2025-11-08 07:57:04'),(30,516,'Traction Machine','2026-04-30','2026-05-04',2,'task',515,0,0,5,0,'M/R Equipment Setting','A','Traction Machine','1',5.00,0.00,0.00,'2025-11-08 07:57:04'),(31,517,'Support Beams','2026-05-04','2026-05-06',2,'task',515,0,0,5,0,'M/R Equipment Setting','B','Support Beams','1',5.00,0.00,0.00,'2025-11-08 07:57:04'),(32,518,'Governor','2026-05-06','2026-05-08',2,'task',515,0,0,2,0,'M/R Equipment Setting','C','Governor','1',2.00,0.00,0.00,'2025-11-08 07:57:04'),(33,519,'Installation of Control Panel','2026-05-08','2026-05-12',2,'task',500,0,0,3,0,'M/R Equipment Setting','D','Installation of Control Panel','1',3.00,0.00,0.00,'2025-11-08 07:57:04'),(34,520,'Car Assembly','2026-05-12','2026-05-15',3,'summary',500,0,0,0,0,NULL,NULL,'Car Assembly','1',0.00,0.00,0.00,'2025-11-08 07:57:04'),(35,521,'All Accessories','2026-05-12','2026-05-14',2,'task',520,0,0,3,0,'Car Assembly','A','All Accessories','1',3.00,0.00,0.00,'2025-11-08 07:57:04'),(36,522,'Car Piping/Wiring','2026-05-14','2026-05-15',1,'task',520,0,0,3,0,'Car Assembly','B','Car Piping/Wiring','1',3.00,0.00,0.00,'2025-11-08 07:57:04'),(37,523,'Travelling Cable Layout','2026-05-15','2026-05-19',2,'task',500,0,0,2,0,'Car Assembly','C','Travelling Cable Layout','1',2.00,0.00,0.00,'2025-11-08 07:57:04'),(38,524,'Counterweight Assembly','2026-05-19','2026-05-21',2,'task',500,0,0,2,0,'Car Assembly','D','Counterweight Assembly','1',2.00,0.00,0.00,'2025-11-08 07:57:04'),(39,525,'Laying out of Ropes','2026-05-21','2026-05-28',5,'summary',500,0,0,0,0,NULL,NULL,'Laying out of Ropes','1',0.00,0.00,0.00,'2025-11-08 07:57:04'),(40,526,'Hoisting','2026-05-21','2026-05-25',2,'task',525,0,0,2,0,'Laying out of ropes','A','Hoisting','1',2.00,0.00,0.00,'2025-11-08 07:57:04'),(41,527,'Governor','2026-05-25','2026-05-27',2,'task',525,0,0,3,0,'Compensating','B','Governor','1',3.00,0.00,0.00,'2025-11-08 07:57:04'),(42,528,'Compensating','2026-05-27','2026-05-28',1,'task',525,0,0,3,0,'Laying out of ropes','C','Compensating','1',3.00,0.00,0.00,'2025-11-08 07:57:04'),(43,529,'Wiring','2026-05-28','2026-06-01',2,'summary',500,0,0,0,0,NULL,NULL,'Wiring','1',0.00,0.00,0.00,'2025-11-08 07:57:04'),(44,530,'Machine Room','2026-05-28','2026-05-29',1,'task',529,0,0,5,0,'Wiring','A','Machine Room','1',5.00,0.00,0.00,'2025-11-08 07:57:04'),(45,531,'Hoistway','2026-05-29','2026-06-01',1,'task',529,0,0,3,0,'Wiring','B','Hoistway','1',3.00,0.00,0.00,'2025-11-08 07:57:04'),(46,532,'Installation of Pit Ladder / Hoistway Lighting','2026-06-01','2026-06-03',2,'task',500,0,0,3,0,'Wiring','C','Installation of Pit Ladder / Hoistway Lighting','1',3.00,0.00,0.00,'2025-11-08 07:57:04'),(47,600,'Testing and Commissioning (Passenger Elevator)','2026-06-03','2026-06-24',15,'summary',NULL,0,0,0,0,NULL,NULL,'Testing and Commissioning (Passenger Elevator)','1',0.00,0.00,0.00,'2025-11-08 07:57:04'),(48,601,'Initial testing','2026-06-03','2026-06-08',3,'task',600,0,0,3,0,'Testing and Commissioning (Passenger Elevator)','A','Initial testing','1',3.00,0.00,0.00,'2025-11-08 07:57:04'),(49,602,'Slow speed','2026-06-08','2026-06-10',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','B','Slow speed','1',1.00,0.00,0.00,'2025-11-08 07:57:04'),(50,603,'High speed and Mechanical Adjustment','2026-06-10','2026-06-12',2,'task',600,0,0,2,0,'Testing and Commissioning (Passenger Elevator)','C','High speed and Mechanical Adjustment','1',2.00,0.00,0.00,'2025-11-08 07:57:04'),(51,604,'Load Test','2026-06-12','2026-06-16',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','D','Load Test','1',1.00,0.00,0.00,'2025-11-08 07:57:04'),(52,605,'Final Adjust','2026-06-16','2026-06-18',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','E','Final Adjust','1',1.00,0.00,0.00,'2025-11-08 07:57:04'),(53,606,'Features Test / Correction of Defects','2026-06-18','2026-06-22',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','F','Features Test / Correction of Defects','1',1.00,0.00,0.00,'2025-11-08 07:57:04'),(54,607,'Final Cleaning / Hand over','2026-06-22','2026-06-24',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','G','Final Cleaning / Hand over','1',1.00,0.00,0.00,'2025-11-08 07:57:04');
/*!40000 ALTER TABLE `project_46_schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_47_schedule`
--

DROP TABLE IF EXISTS `project_47_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_47_schedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `task_id` int DEFAULT NULL,
  `task_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_start` date DEFAULT NULL,
  `task_end` date DEFAULT NULL,
  `task_duration` int DEFAULT NULL,
  `task_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_parent` int DEFAULT NULL,
  `task_approval` tinyint(1) DEFAULT '0',
  `task_done` tinyint(1) DEFAULT '0',
  `task_percent` int DEFAULT '0',
  `task_actual_current` tinyint DEFAULT '0',
  `section_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_code` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unit` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wt` decimal(5,2) DEFAULT '0.00',
  `pres_acc` decimal(5,2) DEFAULT '0.00',
  `prev_acc` decimal(5,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_47_schedule`
--

LOCK TABLES `project_47_schedule` WRITE;
/*!40000 ALTER TABLE `project_47_schedule` DISABLE KEYS */;
INSERT INTO `project_47_schedule` VALUES (1,100,'Preliminaries','2025-04-17','2025-05-05',15,'summary',NULL,0,1,0,0,NULL,NULL,'Preliminaries','1',0.00,100.00,0.00,'2025-10-31 06:56:15'),(2,201,'Shaft Construction','2025-05-05','2025-07-31',75,'task',200,0,1,0,0,NULL,NULL,'Shaft Construction','1',0.00,100.00,0.00,'2025-10-31 06:56:15'),(3,301,'Manufacturing and Importation','2025-05-05','2025-07-31',75,'task',300,0,1,0,0,NULL,NULL,'Manufacturing and Importation','1',0.00,100.00,0.00,'2025-10-31 06:56:15'),(4,104,'Submission of PO to Factory','2025-05-04','2025-05-05',1,'task',100,0,1,0,0,NULL,NULL,'Submission of PO to Factory','1',0.00,100.00,0.00,'2025-10-31 06:56:15'),(5,300,'Manufacturing and Importation Process (Passenger Elevator)','2025-05-05','2025-07-31',75,'summary',NULL,0,1,0,0,NULL,NULL,'Manufacturing and Importation Process (Passenger Elevator)','1',0.00,100.00,0.00,'2025-10-31 06:56:15'),(6,103,'Submission of Drawing and Finishes for Approval','2025-04-28','2025-05-04',5,'task',100,0,1,0,0,NULL,NULL,'Submission of Drawing and Finishes for Approval','1',0.00,100.00,0.00,'2025-10-31 06:56:15'),(7,200,'Structural/Civil Works','2025-05-05','2025-07-31',75,'summary',NULL,0,1,0,0,NULL,NULL,'Structural/Civil Works','1',0.00,100.00,0.00,'2025-10-31 06:56:15'),(8,102,'Layout of Drawing','2025-04-24','2025-04-28',3,'task',100,0,1,0,0,NULL,NULL,'Layout of Drawing','1',0.00,100.00,0.00,'2025-10-31 06:56:15'),(9,101,'Pre-Inspection(Checkin of Shaft)','2025-04-17','2025-04-24',6,'task',100,0,1,0,0,NULL,NULL,'Pre-Inspection(Checkin of Shaft)','1',0.00,100.00,0.00,'2025-10-31 06:56:15'),(10,401,'Preparation of tools and materials for elevator installation','2025-07-31','2025-08-17',14,'task',400,0,1,0,0,NULL,NULL,'Preparation of tools and materials for elevator installation','1',0.00,100.00,0.00,'2025-10-31 06:56:15'),(11,402,'Layout of boardup markings','2025-08-17','2025-08-20',3,'task',400,0,1,0,0,NULL,NULL,'Layout of boardup markings','1',0.00,100.00,0.00,'2025-10-31 06:56:15'),(12,403,'Partial delivery of tools and boardup materials','2025-08-20','2025-08-24',3,'task',400,0,1,0,0,NULL,NULL,'Partial delivery of tools and boardup materials','1',0.00,100.00,0.00,'2025-10-31 06:56:15'),(13,500,'Mechanical Installation (Passenger Elevator)','2025-08-24','2025-10-15',45,'summary',NULL,0,1,0,0,NULL,NULL,'Mechanical Installation (Passenger Elevator)','1',0.00,100.00,0.00,'2025-10-31 06:56:15'),(14,501,'Unloading of elevator equipments','2025-08-24','2025-08-25',1,'task',500,0,1,0,0,'General','1','Unloading of elevator equipments','1',0.00,100.00,0.00,'2025-10-31 06:56:15'),(15,502,'Scaffolding Installation','2025-08-25','2025-08-27',2,'task',500,0,1,7,0,'General','2','Scaffolding Installation','1',7.00,100.00,0.00,'2025-10-31 06:56:15'),(16,503,'Hauling Works','2025-08-27','2025-08-29',2,'task',500,0,1,7,0,'General','3','Hauling Works','1',7.00,100.00,0.00,'2025-10-31 06:56:15'),(17,504,'Template Setting','2025-08-29','2025-09-01',2,'task',500,0,1,7,0,'General','4','Template Setting','1',7.00,100.00,0.00,'2025-10-31 06:56:15'),(18,505,'Marking and Boring of Holes','2025-09-01','2025-09-02',1,'task',500,0,1,0,0,'General','5','Marking and Boring of Holes','1',0.00,100.00,0.00,'2025-10-31 06:56:15'),(19,506,'Rail Bracket Installation','2025-09-02','2025-09-04',2,'task',500,0,1,7,0,'General','6','Rail Bracket Installation','1',7.00,100.00,0.00,'2025-10-31 06:56:15'),(20,507,'Guide Rail Setting','2025-09-04','2025-09-10',5,'summary',500,0,1,0,0,NULL,NULL,'Guide Rail Setting','1',0.00,100.00,0.00,'2025-10-31 06:56:15'),(21,509,'Counterweight (CWT)','2025-09-07','2025-09-09',2,'task',507,0,1,3,0,'Guide Rail Setting','B','Counterweight (CWT)','1',3.00,100.00,0.00,'2025-10-31 06:56:15'),(22,510,'Gauging','2025-09-09','2025-09-10',1,'task',507,0,1,3,0,'Guide Rail Setting','C','Gauging','1',3.00,100.00,0.00,'2025-10-31 06:56:15'),(23,511,'Landing Door Assembly','2025-09-10','2025-09-17',6,'summary',500,0,1,0,0,NULL,NULL,'Landing Door Assembly','1',0.00,100.00,0.00,'2025-10-31 06:56:15'),(24,512,'Sills and Supports','2025-09-10','2025-09-12',2,'task',511,0,1,2,0,'Landing Door Assembly','A','Sills and Supports','1',2.00,100.00,0.00,'2025-10-31 06:56:15'),(25,513,'Jamb and Supports','2025-09-12','2025-09-15',2,'task',511,0,1,2,0,'Landing Door Assembly','B','Jamb and Supports','1',2.00,100.00,0.00,'2025-10-31 06:56:15'),(26,508,'Main/Car','2025-09-04','2025-09-07',2,'task',507,0,1,5,0,'Guide Rail Setting','A','Main/Car','1',5.00,100.00,0.00,'2025-10-31 06:56:15'),(27,514,'Frame and Doors','2025-09-15','2025-09-17',2,'task',511,0,1,3,0,'Landing Door Assembly','C','Frame and Doors','1',3.00,100.00,0.00,'2025-10-31 06:56:15'),(28,515,'M/R Equipment Setting','2025-09-17','2025-09-24',6,'summary',500,0,1,0,0,NULL,NULL,'M/R Equipment Setting','1',0.00,100.00,0.00,'2025-10-31 06:56:15'),(29,516,'Traction Machine','2025-09-17','2025-09-19',2,'task',515,0,1,5,0,'M/R Equipment Setting','A','Traction Machine','1',5.00,100.00,0.00,'2025-10-31 06:56:15'),(30,517,'Support Beams','2025-09-19','2025-09-22',2,'task',515,0,1,5,0,'M/R Equipment Setting','B','Support Beams','1',5.00,100.00,0.00,'2025-10-31 06:56:15'),(31,400,'Planning For Mobilization And Execution','2025-07-31','2025-08-24',20,'summary',NULL,0,1,0,0,NULL,NULL,'Planning For Mobilization And Execution','1',0.00,100.00,0.00,'2025-10-31 06:56:15'),(32,518,'Governor','2025-09-22','2025-09-24',2,'task',515,0,1,2,0,'M/R Equipment Setting','C','Governor','1',2.00,100.00,0.00,'2025-10-31 06:56:15'),(33,519,'Installation of Control Panel','2025-09-24','2025-09-26',2,'task',500,0,1,3,0,'M/R Equipment Setting','D','Installation of Control Panel','1',3.00,100.00,0.00,'2025-10-31 06:56:15'),(34,520,'Car Assembly','2025-09-26','2025-09-30',3,'summary',500,0,1,0,0,NULL,NULL,'Car Assembly','1',0.00,100.00,0.00,'2025-10-31 06:56:15'),(35,521,'All Accessories','2025-09-26','2025-09-29',2,'task',520,0,1,3,0,'Car Assembly','A','All Accessories','1',3.00,100.00,0.00,'2025-10-31 06:56:15'),(36,522,'Car Piping/Wiring','2025-09-29','2025-09-30',1,'task',520,0,1,3,0,'Car Assembly','B','Car Piping/Wiring','1',3.00,100.00,0.00,'2025-10-31 06:56:15'),(37,523,'Travelling Cable Layout','2025-09-30','2025-10-02',2,'task',500,0,1,2,0,'Car Assembly','C','Travelling Cable Layout','1',2.00,100.00,0.00,'2025-10-31 06:56:15'),(38,524,'Counterweight Assembly','2025-10-02','2025-10-05',2,'task',500,0,1,2,0,'Car Assembly','D','Counterweight Assembly','1',2.00,100.00,0.00,'2025-10-31 06:56:15'),(39,525,'Laying out of Ropes','2025-10-05','2025-10-10',5,'summary',500,0,1,0,0,NULL,NULL,'Laying out of Ropes','1',0.00,100.00,0.00,'2025-10-31 06:56:15'),(40,526,'Hoisting','2025-10-05','2025-10-07',2,'task',525,0,1,2,0,'Laying out of ropes','A','Hoisting','1',2.00,100.00,0.00,'2025-10-31 06:56:15'),(41,527,'Governor','2025-10-07','2025-10-09',2,'task',525,0,1,3,0,'Compensating','B','Governor','1',3.00,100.00,0.00,'2025-10-31 06:56:15'),(42,528,'Compensating','2025-10-09','2025-10-10',1,'task',525,0,1,3,0,'Laying out of ropes','C','Compensating','1',3.00,100.00,0.00,'2025-10-31 06:56:15'),(43,529,'Wiring','2025-10-10','2025-10-13',2,'summary',500,0,1,0,0,NULL,NULL,'Wiring','1',0.00,100.00,0.00,'2025-10-31 06:56:15'),(44,530,'Machine Room','2025-10-10','2025-10-12',1,'task',529,0,1,5,0,'Wiring','A','Machine Room','1',5.00,100.00,0.00,'2025-10-31 06:56:15'),(45,531,'Hoistway','2025-10-12','2025-10-13',1,'task',529,0,1,3,0,'Wiring','B','Hoistway','1',3.00,100.00,0.00,'2025-10-31 06:56:15'),(46,532,'Installation of Pit Ladder / Hoistway Lighting','2025-10-13','2025-10-15',2,'task',500,0,1,3,0,'Wiring','C','Installation of Pit Ladder / Hoistway Lighting','1',3.00,100.00,0.00,'2025-10-31 06:56:15'),(47,600,'Testing and Commissioning (Passenger Elevator)','2025-10-15','2025-11-02',15,'summary',NULL,0,1,0,0,NULL,NULL,'Testing and Commissioning (Passenger Elevator)','1',0.00,100.00,0.00,'2025-10-31 06:56:15'),(48,601,'Initial testing','2025-10-15','2025-10-19',3,'task',600,0,1,3,0,'Testing and Commissioning (Passenger Elevator)','A','Initial testing','1',3.00,100.00,0.00,'2025-10-31 06:56:15'),(49,602,'Slow speed','2025-10-19','2025-10-21',2,'task',600,0,1,1,0,'Testing and Commissioning (Passenger Elevator)','B','Slow speed','1',1.00,100.00,0.00,'2025-10-31 06:56:15'),(50,603,'High speed and Mechanical Adjustment','2025-10-21','2025-10-23',2,'task',600,0,1,2,0,'Testing and Commissioning (Passenger Elevator)','C','High speed and Mechanical Adjustment','1',2.00,100.00,0.00,'2025-10-31 06:56:15'),(51,604,'Load Test','2025-10-23','2025-10-26',2,'task',600,0,1,1,0,'Testing and Commissioning (Passenger Elevator)','D','Load Test','1',1.00,100.00,0.00,'2025-10-31 06:56:15'),(52,605,'Final Adjust','2025-10-26','2025-10-28',2,'task',600,0,1,1,0,'Testing and Commissioning (Passenger Elevator)','E','Final Adjust','1',1.00,100.00,0.00,'2025-10-31 06:56:15'),(53,606,'Features Test / Correction of Defects','2025-10-28','2025-10-30',2,'task',600,0,1,1,0,'Testing and Commissioning (Passenger Elevator)','F','Features Test / Correction of Defects','1',1.00,100.00,0.00,'2025-10-31 06:56:15'),(54,607,'Final Cleaning / Hand over','2025-10-30','2025-11-02',2,'task',600,1,1,1,1,'Testing and Commissioning (Passenger Elevator)','G','Final Cleaning / Hand over','1',1.00,100.00,0.00,'2025-10-31 06:56:15');
/*!40000 ALTER TABLE `project_47_schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_48_schedule`
--

DROP TABLE IF EXISTS `project_48_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_48_schedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `task_id` int DEFAULT NULL,
  `task_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_start` date DEFAULT NULL,
  `task_end` date DEFAULT NULL,
  `task_duration` int DEFAULT NULL,
  `task_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_parent` int DEFAULT NULL,
  `task_approval` tinyint(1) DEFAULT '0',
  `task_done` tinyint(1) DEFAULT '0',
  `task_percent` int DEFAULT '0',
  `task_actual_current` tinyint DEFAULT '0',
  `section_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_code` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unit` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wt` decimal(5,2) DEFAULT '0.00',
  `pres_acc` decimal(5,2) DEFAULT '0.00',
  `prev_acc` decimal(5,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_48_schedule`
--

LOCK TABLES `project_48_schedule` WRITE;
/*!40000 ALTER TABLE `project_48_schedule` DISABLE KEYS */;
INSERT INTO `project_48_schedule` VALUES (1,100,'Preliminaries','2025-05-08','2025-05-29',15,'summary',NULL,0,0,0,0,'General',NULL,'Preliminaries','1',0.00,0.00,0.00,'2025-11-13 14:37:12'),(2,101,'Pre-Inspection(Checkin of Shaft)','2025-05-08','2025-05-18',6,'task',100,0,0,0,1,'General',NULL,'Pre-Inspection(Checkin of Shaft)','1',0.00,0.00,0.00,'2025-11-13 14:37:12'),(3,301,'Manufacturing and Importation','2025-05-29','2025-08-04',47,'task',300,0,0,0,0,'General',NULL,'Manufacturing and Importation','1',0.00,0.00,0.00,'2025-11-13 14:37:12'),(4,103,'Submission of Drawing and Finishes for Approval','2025-05-21','2025-05-28',5,'task',100,0,0,0,0,'General',NULL,'Submission of Drawing and Finishes for Approval','1',0.00,0.00,0.00,'2025-11-13 14:37:12'),(5,102,'Layout of Drawing','2025-05-18','2025-05-21',3,'task',100,0,0,0,0,'General',NULL,'Layout of Drawing','1',0.00,0.00,0.00,'2025-11-13 14:37:12'),(6,104,'Submission of PO to Factory','2025-05-28','2025-05-29',1,'task',100,0,0,0,0,'General',NULL,'Submission of PO to Factory','1',0.00,0.00,0.00,'2025-11-13 14:37:12'),(7,200,'Structural/Civil Works','2025-05-29','2025-08-04',47,'summary',NULL,0,0,0,0,'General',NULL,'Structural/Civil Works','1',0.00,0.00,0.00,'2025-11-13 14:37:12'),(8,300,'Manufacturing and Importation Process','2025-05-29','2025-08-04',47,'summary',NULL,0,0,0,0,'General',NULL,'Manufacturing and Importation Process','1',0.00,0.00,0.00,'2025-11-13 14:37:12'),(9,201,'Shaft Construction','2025-05-29','2025-08-04',47,'task',200,0,0,0,0,'General',NULL,'Shaft Construction','1',0.00,0.00,0.00,'2025-11-13 14:37:12'),(10,401,'Preparation of tools and materials for elevator installation','2025-08-04','2025-08-24',14,'task',400,0,0,0,0,'General',NULL,'Preparation of tools and materials for elevator installation','1',0.00,0.00,0.00,'2025-11-13 14:37:12'),(11,402,'Layout of boardup markings','2025-08-24','2025-08-27',3,'task',400,0,0,0,0,'General',NULL,'Layout of boardup markings','1',0.00,0.00,0.00,'2025-11-13 14:37:12'),(12,403,'Partial delivery of tools and boardup materials','2025-08-27','2025-09-01',3,'task',400,0,0,0,0,'General',NULL,'Partial delivery of tools and boardup materials','1',0.00,0.00,0.00,'2025-11-13 14:37:12'),(13,404,'Preperation for Installation/Manufacturing','2025-09-01','2025-09-11',8,'task',400,0,0,0,0,'General',NULL,'Preperation for Installation/Manufacturing','1',0.00,0.00,0.00,'2025-11-13 14:37:12'),(14,500,'Mechanical Installation','2025-09-11','2025-11-13',45,'summary',NULL,0,0,0,0,'General',NULL,'Mechanical Installation','1',0.00,0.00,0.00,'2025-11-13 14:37:12'),(15,501,'Unloading of elevator equipments','2025-09-11','2025-09-14',1,'task',500,0,0,0,0,'General','1','Unloading of elevator equipments','1',0.00,0.00,0.00,'2025-11-13 14:37:12'),(16,503,'Hauling Works','2025-09-16','2025-09-18',2,'task',500,0,0,7,0,'General','3','Hauling Works','1',7.00,0.00,0.00,'2025-11-13 14:37:12'),(17,505,'Marking and Boring of Holes','2025-09-22','2025-09-23',1,'task',500,0,0,0,0,'General','5','Marking and Boring of Holes','1',0.00,0.00,0.00,'2025-11-13 14:37:12'),(18,504,'Template Setting','2025-09-18','2025-09-22',2,'task',500,0,0,7,0,'General','4','Template Setting','1',7.00,0.00,0.00,'2025-11-13 14:37:12'),(19,506,'Rail Bracket Installation','2025-09-23','2025-09-25',2,'task',500,0,0,7,0,'General','6','Rail Bracket Installation','1',7.00,0.00,0.00,'2025-11-13 14:37:12'),(20,502,'Scaffolding Installation','2025-09-14','2025-09-16',2,'task',500,0,0,7,0,'General','2','Scaffolding Installation','1',7.00,0.00,0.00,'2025-11-13 14:37:12'),(21,507,'Guide Rail Setting','2025-09-25','2025-10-02',5,'summary',500,0,0,0,0,'General',NULL,'Guide Rail Setting','1',0.00,0.00,0.00,'2025-11-13 14:37:12'),(22,508,'Main/Car','2025-09-25','2025-09-29',2,'task',507,0,0,5,0,'Guide Rail Setting','A','Main/Car','1',5.00,0.00,0.00,'2025-11-13 14:37:12'),(23,509,'Counterweight (CWT)','2025-09-29','2025-10-01',2,'task',507,0,0,3,0,'Guide Rail Setting','B','Counterweight (CWT)','1',3.00,0.00,0.00,'2025-11-13 14:37:12'),(24,510,'Gauging','2025-10-01','2025-10-02',1,'task',507,0,0,3,0,'Guide Rail Setting','C','Gauging','1',3.00,0.00,0.00,'2025-11-13 14:37:12'),(25,511,'Landing Door Assembly','2025-10-02','2025-10-12',6,'summary',500,0,0,0,0,'General',NULL,'Landing Door Assembly','1',0.00,0.00,0.00,'2025-11-13 14:37:12'),(26,512,'Sills and Supports','2025-10-02','2025-10-06',2,'task',511,0,0,2,0,'Landing Door Assembly','A','Sills and Supports','1',2.00,0.00,0.00,'2025-11-13 14:37:12'),(27,513,'Jamb and Supports','2025-10-06','2025-10-08',2,'task',511,0,0,2,0,'Landing Door Assembly','B','Jamb and Supports','1',2.00,0.00,0.00,'2025-11-13 14:37:12'),(28,514,'Frame and Doors','2025-10-08','2025-10-12',2,'task',511,0,0,3,0,'Landing Door Assembly','C','Frame and Doors','1',3.00,0.00,0.00,'2025-11-13 14:37:12'),(29,515,'M/R Equipment Setting','2025-10-12','2025-10-20',6,'summary',500,0,0,0,0,'General',NULL,'M/R Equipment Setting','1',0.00,0.00,0.00,'2025-11-13 14:37:12'),(30,516,'Traction Machine','2025-10-12','2025-10-14',2,'task',515,0,0,5,0,'M/R Equipment Setting','A','Traction Machine','1',5.00,0.00,0.00,'2025-11-13 14:37:12'),(31,517,'Support Beams','2025-10-14','2025-10-16',2,'task',515,0,0,5,0,'M/R Equipment Setting','B','Support Beams','1',5.00,0.00,0.00,'2025-11-13 14:37:12'),(32,518,'Governor (M/R)','2025-10-16','2025-10-20',2,'task',515,0,0,2,0,'M/R Equipment Setting','C','Governor (M/R)','1',2.00,0.00,0.00,'2025-11-13 14:37:12'),(33,519,'Installation of Control Panel','2025-10-20','2025-10-22',2,'task',500,0,0,3,0,'M/R Equipment Setting','D','Installation of Control Panel','1',3.00,0.00,0.00,'2025-11-13 14:37:12'),(34,520,'Car Assembly','2025-10-22','2025-10-27',3,'summary',500,0,0,0,0,'General',NULL,'Car Assembly','1',0.00,0.00,0.00,'2025-11-13 14:37:12'),(35,521,'All Accessories','2025-10-22','2025-10-26',2,'task',520,0,0,3,0,'Car Assembly','A','All Accessories','1',3.00,0.00,0.00,'2025-11-13 14:37:12'),(36,522,'Car Piping/Wiring','2025-10-26','2025-10-27',1,'task',520,0,0,3,0,'Car Assembly','B','Car Piping/Wiring','1',3.00,0.00,0.00,'2025-11-13 14:37:12'),(37,523,'Travelling Cable Layout','2025-10-27','2025-10-29',2,'task',500,0,0,2,0,'Car Assembly','C','Travelling Cable Layout','1',2.00,0.00,0.00,'2025-11-13 14:37:12'),(38,524,'Counterweight Assembly','2025-10-29','2025-11-02',2,'task',500,0,0,2,0,'Car Assembly','D','Counterweight Assembly','1',2.00,0.00,0.00,'2025-11-13 14:37:12'),(39,525,'Laying out of Ropes','2025-11-02','2025-11-09',5,'summary',500,0,0,0,0,'General',NULL,'Laying out of Ropes','1',0.00,0.00,0.00,'2025-11-13 14:37:12'),(40,526,'Hoisting','2025-11-02','2025-11-04',2,'task',525,0,0,2,0,'Laying out of ropes','A','Hoisting','1',2.00,0.00,0.00,'2025-11-13 14:37:12'),(41,527,'Governor (Ropes)','2025-11-04','2025-11-06',2,'task',525,0,0,3,0,'Compensating','B','Governor (Ropes)','1',3.00,0.00,0.00,'2025-11-13 14:37:12'),(42,528,'Compensating','2025-11-06','2025-11-09',1,'task',525,0,0,3,0,'Laying out of ropes','C','Compensating','1',3.00,0.00,0.00,'2025-11-13 14:37:12'),(43,529,'Wiring','2025-11-09','2025-11-11',2,'summary',500,0,0,0,0,'General',NULL,'Wiring','1',0.00,0.00,0.00,'2025-11-13 14:37:12'),(44,530,'Machine Room','2025-11-09','2025-11-10',1,'task',529,0,0,5,0,'Wiring','A','Machine Room','1',5.00,0.00,0.00,'2025-11-13 14:37:12'),(45,531,'Hoistway','2025-11-10','2025-11-11',1,'task',529,0,0,3,0,'Wiring','B','Hoistway','1',3.00,0.00,0.00,'2025-11-13 14:37:12'),(46,532,'Installation of Pit Ladder / Hoistway Lighting','2025-11-11','2025-11-13',2,'task',500,0,0,3,0,'Wiring','C','Installation of Pit Ladder / Hoistway Lighting','1',3.00,0.00,0.00,'2025-11-13 14:37:12'),(47,600,'Testing and Commissioning','2025-11-13','2025-12-04',15,'summary',NULL,0,0,0,0,'General',NULL,'Testing and Commissioning','1',0.00,0.00,0.00,'2025-11-13 14:37:12'),(48,601,'Initial testing','2025-11-13','2025-11-18',3,'task',600,0,0,3,0,'Testing and Commissioning (Passenger Elevator)','A','Initial testing','1',3.00,0.00,0.00,'2025-11-13 14:37:12'),(49,603,'High speed and Mechanical Adjustment','2025-11-20','2025-11-24',2,'task',600,0,0,2,0,'Testing and Commissioning (Passenger Elevator)','C','High speed and Mechanical Adjustment','1',2.00,0.00,0.00,'2025-11-13 14:37:12'),(50,602,'Slow speed','2025-11-18','2025-11-20',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','B','Slow speed','1',1.00,0.00,0.00,'2025-11-13 14:37:12'),(51,604,'Load Test','2025-11-24','2025-11-26',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','D','Load Test','1',1.00,0.00,0.00,'2025-11-13 14:37:12'),(52,605,'Final Adjust','2025-11-26','2025-11-30',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','E','Final Adjust','1',1.00,0.00,0.00,'2025-11-13 14:37:12'),(53,606,'Features Test / Correction of Defects','2025-11-30','2025-12-02',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','F','Features Test / Correction of Defects','1',1.00,0.00,0.00,'2025-11-13 14:37:12'),(54,607,'Final Cleaning / Hand over','2025-12-02','2025-12-04',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','G','Final Cleaning / Hand over','1',1.00,0.00,0.00,'2025-11-13 14:37:12'),(55,400,'Planning For Mobilization And Execution','2025-08-04','2025-09-11',28,'summary',NULL,0,0,0,0,'General',NULL,'Planning For Mobilization And Execution','1',0.00,0.00,0.00,'2025-11-13 14:37:12');
/*!40000 ALTER TABLE `project_48_schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_checklist_photos`
--

DROP TABLE IF EXISTS `project_checklist_photos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_checklist_photos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `checklist_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `photo_url` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_submission` date DEFAULT (curdate()),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_checklist_photos`
--

LOCK TABLES `project_checklist_photos` WRITE;
/*!40000 ALTER TABLE `project_checklist_photos` DISABLE KEYS */;
/*!40000 ALTER TABLE `project_checklist_photos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_contract_photos`
--

DROP TABLE IF EXISTS `project_contract_photos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_contract_photos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int DEFAULT NULL,
  `photo_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `project_contract_photos_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_contract_photos`
--

LOCK TABLES `project_contract_photos` WRITE;
/*!40000 ALTER TABLE `project_contract_photos` DISABLE KEYS */;
INSERT INTO `project_contract_photos` VALUES (8,328,'/uploads/1762153242109-mqdefault.jpg'),(9,329,'/uploads/1762318961736-2019-03-12-Example-Template-Project-Project-Handover-Checklist-1-page-001.jpg'),(10,330,'/uploads/1762424434864-2019-03-12-Example-Template-Project-Project-Handover-Checklist-1-page-001.jpg'),(11,331,'/uploads/1762432008013-project_contract_photo.jpg'),(13,333,'/uploads/1762593375471-QAQC Punchlisting.PNG'),(14,344,'/uploads/1762848087888-project_contract_photo.jpg');
/*!40000 ALTER TABLE `project_contract_photos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_daily_report`
--

DROP TABLE IF EXISTS `project_daily_report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_daily_report` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int DEFAULT NULL,
  `workCompleted` text COLLATE utf8mb4_unicode_ci,
  `workPlannedNextDay` text COLLATE utf8mb4_unicode_ci,
  `delaysIssues` text COLLATE utf8mb4_unicode_ci,
  `remarks` text COLLATE utf8mb4_unicode_ci,
  `report_date` date DEFAULT (curdate()),
  `author` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'Foreman',
  PRIMARY KEY (`id`),
  KEY `dr_project_id_fk` (`project_id`),
  CONSTRAINT `dr_project_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_daily_report`
--

LOCK TABLES `project_daily_report` WRITE;
/*!40000 ALTER TABLE `project_daily_report` DISABLE KEYS */;
INSERT INTO `project_daily_report` VALUES (8,44,'Work completed for project 44','work planned for the next day for project 44','Issues encountered at project 44','These are some notes for project 44','2025-10-01','Foreman'),(9,46,'Work completed for project 46','work planned for project 46','These are some of the issues encountered','Remarks and notes for project 46','2025-10-01','Foreman'),(15,44,'23','311','adsf','asfd','2025-10-09','Sandy Cheeks'),(16,47,'iu','iu','iu','iui','2025-10-09','Sheldon Plankton'),(25,1,'qrew','qre','reqw','afsda','2025-10-20','Nat Peterson'),(26,267,'template setting','N?A','n/A','n/a','2025-11-03','Chris Taylor'),(27,329,'Template Setting Done','Next Task','None','na','2025-11-06','Anthony Miller');
/*!40000 ALTER TABLE `project_daily_report` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_engineers`
--

DROP TABLE IF EXISTS `project_engineers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_engineers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `engineer_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `engineer_id` (`engineer_id`),
  CONSTRAINT `project_engineers_ibfk_1` FOREIGN KEY (`engineer_id`) REFERENCES `employees` (`employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_engineers`
--

LOCK TABLES `project_engineers` WRITE;
/*!40000 ALTER TABLE `project_engineers` DISABLE KEYS */;
INSERT INTO `project_engineers` VALUES (1,3,'Spongebob Squarepants'),(2,4,'Patrick Star'),(3,5,'Sandy Cheeks'),(4,6,'Sheldon Plankton'),(5,7,'Pearl Krabs'),(6,8,'Karen Plankton'),(7,9,'Larry Lobster');
/*!40000 ALTER TABLE `project_engineers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_holidays`
--

DROP TABLE IF EXISTS `project_holidays`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_holidays` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int DEFAULT NULL,
  `holiday` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `project_holidays_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_holidays`
--

LOCK TABLES `project_holidays` WRITE;
/*!40000 ALTER TABLE `project_holidays` DISABLE KEYS */;
INSERT INTO `project_holidays` VALUES (1,328,'2025-11-06'),(2,328,'2025-11-07'),(3,328,'2025-11-06'),(4,329,'2025-11-04'),(5,331,'2025-11-17'),(6,331,'2025-11-13'),(7,333,'2025-11-06'),(8,333,'2025-11-04'),(9,343,'2025-10-14'),(10,343,'2025-11-03'),(11,342,'2025-11-13'),(12,329,'2025-11-13'),(13,329,'2025-11-14'),(14,331,'2025-11-05');
/*!40000 ALTER TABLE `project_holidays` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_inspection_photos`
--

DROP TABLE IF EXISTS `project_inspection_photos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_inspection_photos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `inspection_id` int DEFAULT NULL,
  `photo_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `checklist` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `inspection_id` (`inspection_id`),
  CONSTRAINT `project_inspection_photos_ibfk_1` FOREIGN KEY (`inspection_id`) REFERENCES `qaqc_inspection_history` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_inspection_photos`
--

LOCK TABLES `project_inspection_photos` WRITE;
/*!40000 ALTER TABLE `project_inspection_photos` DISABLE KEYS */;
INSERT INTO `project_inspection_photos` VALUES (1,1,'/uploads/1761503689554-bba39480-0c0e-4123-a80d-6baf78b82643.jfif',NULL),(10,10,'/uploads/1761651442229-checklist_apple-touch-icon.png','Checklist Prior Testing and Commissioning'),(11,10,'/uploads/1761651442231-checklist_android-chrome-512x512.png','Checklist Prior Testing and Commissioning'),(12,10,'/uploads/1761651442233-checklist_android-chrome-192x192.png','Checklist Prior Testing and Commissioning'),(13,12,'/uploads/1761757729313-checklist_mqdefault.jpg','QAQC Checklist'),(14,13,'/uploads/1761833147801-checklist_2019-03-12-Example-Template-Project-Project-Handover-Checklist-1-page-001.jpg','Checklist Prior Template Setting'),(15,14,'/uploads/1761852250928-checklist_bba39480-0c0e-4123-a80d-6baf78b82643.jfif','Checklist Prior Template Setting'),(16,15,'/uploads/1761905326108-checklist_2019-03-12-Example-Template-Project-Project-Handover-Checklist-1-page-001.jpg','Checklist Prior Template Setting'),(17,16,'/uploads/1761909794370-checklist_IC-Project-Handover-Plan-Template.png','Checklist Prior Template Setting'),(18,16,'/uploads/1761909794379-checklist_2019-03-12-Example-Template-Project-Project-Handover-Checklist-1-page-001.jpg','Checklist Prior Template Setting'),(19,17,'/uploads/1761929093756-checklist_77e48e83af3f9881dc84e8d9d9cee061.jpg','Handover Checklist'),(20,18,'/uploads/1762143151797-checklist_Construction-Site-Handover-Letter-Template-edit-online.png','Checklist Prior Template Setting'),(21,20,'/uploads/1762144196183-checklist_mqdefault.jpg','Checklist Prior Template Setting'),(22,21,'/uploads/1762154229808-checklist_Construction-Site-Handover-Letter-Template-edit-online.png','Checklist Prior Template Setting'),(23,22,'/uploads/1762154774720-checklist_IC-Project-Handover-Plan-Template.png','Handover Checklist'),(24,24,'/uploads/1762423022066-checklist_construction_contract_agreement_template1.jpg','Checklist Prior Template Setting'),(25,23,'/uploads/1762425855259-checklist_construction_contract_agreement_template1.jpg','Checklist Prior Testing and Commissioning'),(26,25,'/uploads/1762427431356-checklist_construction-contract-template.jpg','Checklist Prior Testing and Commissioning'),(27,26,'/uploads/1762427532829-checklist_construction-contract-template.jpg','Checklist Prior Testing and Commissioning'),(28,27,'/uploads/1762434823157-checklist_qaqc inpsection checklist.PNG','Checklist Prior Template Setting'),(29,28,'/uploads/1762437713079-checklist_Checklist Prior Handover.PNG','Checklist Prior Template Setting'),(30,29,'/uploads/1762603027804-checklist_ITSM Seatwork 06 Quiz 1.pdf','Checklist Prior Template Setting'),(31,30,'/uploads/1762604533375-checklist_ITSM Seatwork 06 Quiz 1.pdf','Checklist Prior Template Setting'),(32,32,'/uploads/1762607720510-checklist_ITSM Seatwork 06 Quiz 1.pdf','Checklist Prior Template Setting'),(33,33,'/uploads/1762963804739-checklist_QAQC Punchlisting.PNG','Checklist Prior Template Setting'),(34,34,'/uploads/1763036309982-checklist_qaqc inpsection checklist.PNG','Checklist Prior Template Setting');
/*!40000 ALTER TABLE `project_inspection_photos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_manpower`
--

DROP TABLE IF EXISTS `project_manpower`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_manpower` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_engineer_id` int DEFAULT NULL,
  `tnc_tech_id` int DEFAULT NULL,
  `team_id` int DEFAULT NULL,
  `project_id` int DEFAULT NULL,
  `qaqc_id` int DEFAULT NULL,
  `pms_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_engineer_id` (`project_engineer_id`),
  KEY `tnc_tech_id` (`tnc_tech_id`),
  KEY `team_id` (`team_id`),
  KEY `project_manpower_ibfk_2` (`project_id`),
  KEY `qaqc_id` (`qaqc_id`),
  KEY `pms_id` (`pms_id`),
  CONSTRAINT `project_manpower_ibfk_1` FOREIGN KEY (`project_engineer_id`) REFERENCES `employees` (`employee_id`),
  CONSTRAINT `project_manpower_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `project_manpower_ibfk_4` FOREIGN KEY (`tnc_tech_id`) REFERENCES `employees` (`employee_id`),
  CONSTRAINT `project_manpower_ibfk_5` FOREIGN KEY (`team_id`) REFERENCES `teams` (`team_id`),
  CONSTRAINT `project_manpower_ibfk_6` FOREIGN KEY (`qaqc_id`) REFERENCES `employees` (`employee_id`),
  CONSTRAINT `project_manpower_ibfk_7` FOREIGN KEY (`pms_id`) REFERENCES `employees` (`employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_manpower`
--

LOCK TABLES `project_manpower` WRITE;
/*!40000 ALTER TABLE `project_manpower` DISABLE KEYS */;
INSERT INTO `project_manpower` VALUES (2,5,NULL,18,44,NULL,NULL),(4,7,NULL,52,46,NULL,NULL),(5,3,NULL,54,48,NULL,NULL),(6,4,NULL,NULL,265,NULL,NULL),(32,3,NULL,NULL,328,NULL,NULL),(33,5,88,10,329,NULL,NULL),(34,6,NULL,NULL,330,NULL,NULL),(35,3,NULL,NULL,331,NULL,NULL),(37,9,87,13,333,NULL,NULL),(38,4,NULL,55,339,NULL,NULL),(39,8,NULL,53,340,NULL,NULL),(40,4,86,NULL,341,NULL,NULL),(41,6,NULL,37,342,NULL,NULL),(43,NULL,NULL,NULL,344,NULL,NULL);
/*!40000 ALTER TABLE `project_manpower` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_reports`
--

DROP TABLE IF EXISTS `project_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_reports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `content` varchar(300) DEFAULT NULL,
  `report_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_fk` (`project_id`),
  CONSTRAINT `project_reports_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `project_reports_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_reports`
--

LOCK TABLES `project_reports` WRITE;
/*!40000 ALTER TABLE `project_reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `project_reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `lift_name` varchar(255) NOT NULL,
  `description` text,
  `status` varchar(255) DEFAULT (_utf8mb4'Incoming'),
  `cap` int DEFAULT NULL,
  `created_at` date DEFAULT (curdate()),
  `drive` varchar(255) NOT NULL,
  `door_operator` varchar(255) NOT NULL,
  `speed` decimal(10,2) DEFAULT NULL,
  `control` varchar(255) NOT NULL,
  `stops` varchar(50) DEFAULT NULL,
  `serving_floor` varchar(255) NOT NULL,
  `travel` varchar(255) NOT NULL,
  `power_supply` varchar(255) NOT NULL,
  `shaft` varchar(255) NOT NULL,
  `shaft_size` varchar(255) NOT NULL,
  `car_size` varchar(255) NOT NULL,
  `door_size` varchar(255) NOT NULL,
  `overhead_height` int NOT NULL,
  `pit_depth` int NOT NULL,
  `progress` int DEFAULT '0',
  `start_date` date DEFAULT NULL,
  `hold_date` date DEFAULT NULL,
  `days_since_hold` int DEFAULT '0',
  `manufacturing_end_date` date DEFAULT NULL,
  `installation_start` tinyint DEFAULT (0),
  `installation_start_date` date DEFAULT NULL,
  `tnc_start_date` date DEFAULT NULL,
  `project_end_date` date DEFAULT NULL,
  `client` varchar(255) DEFAULT NULL,
  `product_type` varchar(255) DEFAULT NULL,
  `task_phase` varchar(255) DEFAULT NULL,
  `schedule_created` tinyint DEFAULT (0),
  `contract_type` enum('Monthly','Quarterly') DEFAULT NULL,
  `island_group` enum('Luzon','Visayas','Mindanao') DEFAULT NULL,
  `region` varchar(255) DEFAULT NULL,
  `province` varchar(255) DEFAULT NULL,
  `city/municipality` varchar(255) DEFAULT NULL,
  `current_task` varchar(255) DEFAULT NULL,
  `current_task_id` int DEFAULT NULL,
  `has_team` tinyint DEFAULT (0),
  `project_PIC` int DEFAULT NULL,
  `contract_amount` decimal(13,2) DEFAULT (0),
  `qaqc_inspection_date` date DEFAULT NULL,
  `qaqc_inspection_reason` varchar(255) DEFAULT NULL,
  `qaqc_punchlist` tinyint DEFAULT '0',
  `current_qaqc_id` int DEFAULT NULL,
  `qaqc_pending` tinyint(1) DEFAULT (0),
  `qaqc_is_assigned` tinyint DEFAULT (0),
  `qaqc_ongoing` tinyint(1) DEFAULT (0),
  `tnc_assign_date` date DEFAULT NULL,
  `current_tnc_id` int DEFAULT NULL,
  `tnc_pending` tinyint DEFAULT (0),
  `tnc_is_assigned` tinyint DEFAULT (0),
  `tnc_ongoing` tinyint DEFAULT (0),
  `prep_tnc` tinyint DEFAULT (0),
  `qaqc_approval` tinyint DEFAULT (0),
  `tnc_approval` tinyint DEFAULT (0),
  `in_tnc` tinyint DEFAULT '0',
  `prepare_handover` tinyint DEFAULT '0',
  `handover_done` tinyint DEFAULT '0',
  `handover_date` date DEFAULT NULL,
  `pms_joint_inspection` date DEFAULT NULL,
  `pms_pending` tinyint DEFAULT '0',
  `pms_is_assigned` tinyint DEFAULT '0',
  `pms_ongoing` tinyint DEFAULT '0',
  `pms_approval` tinyint DEFAULT '0',
  `on_hold` tinyint DEFAULT '0',
  `request_hold` tinyint DEFAULT '0',
  `hold_reason` text,
  `request_resume` tinyint DEFAULT (0),
  `will_resume` tinyint DEFAULT (0),
  `resume_date` date DEFAULT NULL,
  `is_behind` tinyint DEFAULT '0',
  `days` varchar(50) DEFAULT (_utf8mb4'working'),
  `archived` tinyint DEFAULT (0),
  PRIMARY KEY (`id`),
  KEY `project_PIC` (`project_PIC`),
  CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`project_PIC`) REFERENCES `employees` (`employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=345 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (1,'SkyLift 1003','High-speed passenger lift for a commercial buildings.','Completed',600,'2025-04-19','Gearless Traction','Automatic Sliding',8.00,'Microprocessor','11','B1-F12','40m','3-Phase 415V','Concrete','2.5m x 2.5m','2.1m x 1.5m','1.2m x 2.1m',4500,1500,100,NULL,NULL,NULL,'2025-08-02',0,'2025-08-25','2025-10-16','2025-11-03','Grand Horizon Commercial Towers','Machine Room Passenger Elevator','Testing and Commissioning',1,NULL,'Luzon','NCR','Metro Manila','Caloocan','Final Cleaning / Hand over',607,1,NULL,233432.23,NULL,NULL,0,NULL,0,0,1,'2025-11-03',NULL,1,1,1,0,1,0,1,1,1,'2025-11-03','2025-11-03',0,1,1,0,0,0,NULL,0,0,NULL,0,'working',0),(44,'Office Tower Elevator A','High-speed passenger elevator for new office building','Preliminaries',700,'2025-07-12','Gearless Traction','Automatic Center Opening',4.00,'Microprocessor','10','1-10','45m','3-phase 415V','Concrete','2.5m x 2.5m','2.1m x 1.5m','1.2m x 2.1m',4500,1500,0,'2025-11-11','2025-11-03',10,'2026-02-07',0,'2026-03-17','2026-05-19','2026-06-09','MetroRise Developers Inc.',NULL,'Preliminaries',1,NULL,'Luzon','NCR','Metro Manila','Caloocan','Pre-Inspection(Checkin of Shaft)',101,1,NULL,0.00,NULL,NULL,0,NULL,0,0,0,NULL,NULL,0,0,0,0,0,0,0,0,0,NULL,NULL,0,0,0,0,0,0,NULL,0,0,NULL,0,'working',0),(45,'Residential Lift B','Medium-speed lift for apartment complex','Completed',900,'2025-04-16','Machine Room Less','Automatic Slide',7.00,'V3F','8','1-8','28m','3-phase 380V','Concrete','2.2m x 2.2m','2.0m x 1.5m','1.1m x 2.0m',4200,1300,100,NULL,NULL,0,'2025-07-30',0,'2025-08-23','2025-10-14','2025-11-01','Greenfield Residences','Machine Room Passenger Elevator','Testing and Commissioning',1,NULL,'Luzon','NCR','Metro Manila','Caloocan','Final Cleaning / Hand over',607,1,NULL,235612.43,NULL,NULL,0,NULL,0,0,1,'2025-10-31',NULL,0,1,1,0,0,0,1,1,1,'2025-10-31','2025-10-31',0,1,1,0,0,0,NULL,0,0,NULL,0,'working',0),(46,'Hospital Service Elevator 1','Heavy-duty service elevator for medical equipment transport','Structural/Manufacturing',100,'2025-07-12','Hydraulic','Automatic Side Opening',1.00,'PLC','6','B-5','25m','3-phase 400V','Steel Frame','3m x 3.5m','2.5m x 2.5m','2.0m x 2.5m',4000,1200,0,'2025-07-10','2025-11-08',5,NULL,0,NULL,NULL,'2026-06-23','St. Mary’s Medical Center',NULL,'Structural/Civil Works',1,NULL,'Luzon','NCR','Metro Manila','Caloocan','Layout of Drawing',102,1,NULL,0.00,NULL,NULL,0,NULL,0,0,0,NULL,NULL,0,0,0,0,0,0,0,0,0,NULL,NULL,0,0,0,0,0,0,NULL,0,0,NULL,1,'working',0),(47,'Shopping Mall Panoramic','Glass observation elevator for shopping center atrium','Completed',100,'2025-04-16','Gearless Traction','Automatic Glass',1.00,'MPC','5','G-4','20m','3-phase','Glass & Steel','2500x2500mm','1800x1600mm','1200x2200mm',3500,900,100,NULL,NULL,0,'2025-07-30',0,'2025-08-23','2025-10-14','2025-11-01','SunMall Group','Machine Room Panoramic Elevator','Testing and Commissioning',1,NULL,'Luzon','NCR','Metro Manila','Caloocan','Final Cleaning / Hand over',607,NULL,NULL,788804.00,NULL,NULL,0,NULL,0,0,1,'2025-10-31',NULL,0,1,1,0,1,0,1,1,1,'2025-11-01','2025-10-31',0,1,1,0,0,0,NULL,0,0,NULL,0,'working',0),(48,'Warehouse Freight Lift','Industrial cargo lift for warehouse operations','Test and Comm',100,'2025-11-01','Geared Traction','Manual Roller',1.00,'Relay','4','1-4','15m','3-phase','Structural Steel','3000x3000mm','2500x2200mm','2000x2500mm',2800,800,0,'2025-05-07','2025-11-13',0,'2025-08-03',0,'2025-09-10','2025-11-12','2025-12-03','Apex Logistics Corp.',NULL,'Testing and Commissioning',1,NULL,'Luzon','NCR','Metro Manila','Caloocan','Pre-Inspection(Checkin of Shaft)',101,NULL,NULL,0.00,NULL,NULL,0,NULL,0,0,0,NULL,NULL,0,0,0,0,0,0,0,0,0,NULL,NULL,0,0,0,0,0,0,'Billings are not settled',0,0,NULL,1,'working',0),(265,'Omega-XL Passenger Elevator','High-capacity elevator for commercial buildings with advanced safety features','Preliminaries',2000,'2025-07-08','Traction','Automatic Sliding',180.00,'Microprocessor V3F','15','B2 to L15','45m','380V 3Phase','Concrete','2000x2000mm','1600x1400mm','1100',3500,1200,0,'2025-11-04',NULL,NULL,'2026-01-15',0,'2026-02-17','2026-04-11','2026-04-28','Zenith Commercial Properties',NULL,'Preliminaries',1,NULL,'Luzon','NCR','Metro Manila','Caloocan','Pre-Inspection(Checkin of Shaft)',101,NULL,NULL,0.00,NULL,NULL,0,NULL,0,0,0,NULL,NULL,0,0,0,0,0,0,0,0,0,NULL,NULL,0,0,0,0,0,0,NULL,0,0,NULL,1,'working',0),(266,'Hydro-Lift Freight Elevator','Heavy duty freight elevator for industrial applications','Completed',5000,'2025-06-19','Hydraulic','Vertical Bi-Parting',60.00,'Relay Logic','8','G to L7','25m','415V 3Phase','Structural Steel','3000x3000mm','2800x2700mm','1400',4200,1500,100,'2025-05-15',NULL,0,'2025-07-27',0,'2025-08-28','2025-10-20','2025-11-06','Titan Manufacturing Co.','Machine Room Car Elevator','Testing and Commissioning',1,NULL,'Luzon','NCR','Metro Manila','Caloocan','Final Cleaning / Hand over',607,1,55,75753.00,NULL,NULL,0,NULL,0,0,0,'2025-11-05',NULL,1,1,1,0,0,0,1,1,1,'2025-11-06','2025-11-06',0,1,1,0,0,0,NULL,0,0,NULL,0,'working',0),(267,'Eco-Mini Residential Elevator','Space-saving elevator for residential buildings with energy-efficient operation','Completed',400,'2025-04-19','Machine-Room-Less','Swing',90.00,'Solid State','5','G to L4','15m','220V 1Phase','Pre-fabricated','1200x1200mm','900x900mm','800',2300,950,100,NULL,NULL,0,'2025-08-02',0,'2025-08-25','2025-10-16','2025-11-03','EcoHomes Development Corp.','Home/Residential Elevator','Testing and Commissioning',1,NULL,'Luzon','NCR','Metro Manila','Caloocan','Final Cleaning / Hand over',607,1,NULL,334082.00,NULL,NULL,0,NULL,0,0,0,'2025-11-03',NULL,1,1,1,0,0,0,1,1,1,'2025-11-03','2025-11-03',0,1,1,0,0,0,NULL,0,0,NULL,0,'working',0),(328,'K40 Residential Elevator','desc','Preliminaries',400,'2025-11-02','VVVF','Automatic VVF door operator',1.00,'Simplex','3/3/3','Gf, 2f, 3f','40m','220v / 3 Phase','Concrete','1600m x 1600mm','1000mm x 1200mm','750mm x 2100 mm',3000,1199,0,'2025-11-04',NULL,NULL,'2026-01-15',0,'2026-02-17','2026-04-11','2026-04-28','Saint Ireneus','Machine Room Passenger Elevator','Preliminaries',1,NULL,'Luzon','NCR','Metro Manila','Caloocan','Pre-Inspection(Checkin of Shaft)',101,0,NULL,0.00,NULL,NULL,0,NULL,0,0,0,NULL,NULL,0,0,0,0,0,0,0,0,0,NULL,NULL,0,0,0,0,0,0,NULL,0,0,NULL,1,'working',0),(329,' 3300/3300 XL','Large Elevator\n','Preliminaries',70,'2025-11-05','VVVF','Automatic VVF door operator',1.00,'Simplex','3/3/3','Gf, 2f, 3f','40','220v / 3 Phase','Concrete','1600m x 1600mm','1000mm x 1200mm','750mm x 2100 mm',3000,1200,0,'2025-11-08',NULL,NULL,'2026-02-04',0,'2026-03-17','2026-05-19','2026-06-09','Carmine Corp','Escalator 600K','Preliminaries',1,NULL,'Luzon','Region II','Batanes','Itbayat','Pre-Inspection(Checkin of Shaft)',101,1,NULL,433453.00,NULL,NULL,0,NULL,0,0,0,'2025-12-05',NULL,0,1,1,0,0,0,0,0,0,NULL,NULL,0,0,0,0,0,0,NULL,0,0,NULL,0,'working',0),(330,'K310 Passenger Elevator','Elevator For Saint Ireneus','Preliminaries',400,'2025-11-06','VVVF','Automatic VVF door operator',1.00,'Simplex','3/3/3','Gf, 2f, 3f','40m','220v / 3 Phase','Concrete','1600m x 1600mm','1000mm x 1200mm','750mm x 2100 mm',3000,1199,0,'2025-11-04',NULL,NULL,'2026-01-15',0,'2026-02-17','2026-04-11','2026-04-28','Saint Ireneus','Machine Room less Car Elevator','Preliminaries',1,NULL,'Luzon','Region I','Ilocos Sur','Banayoyo','Pre-Inspection(Checkin of Shaft)',101,0,NULL,0.00,NULL,NULL,0,NULL,0,0,0,NULL,NULL,0,0,0,0,0,0,0,0,0,NULL,NULL,0,0,0,0,0,0,NULL,0,0,NULL,1,'working',0),(331,'Apex Lift 310','Lift for Vandelay Client','Pending',400,'2025-11-06','VVVF','Automatic VVF door operator',1.00,'Simplex','3/3/3','Gf, 2f, 3f','40m','220v / 3 Phase','Concrete','1600m x 1600mm','1000mm x 1200mm','750mm x 2100 mm',3000,1199,90,'2025-05-07','2025-11-14',-1,'2025-08-03',0,'2025-09-10','2025-11-12','2025-12-03','Vandelay Industries','Machine Room Passenger Elevator','Testing and Commissioning',1,NULL,'Luzon','CAR','Apayao','Flora','Support Beams',517,1,15,0.00,NULL,NULL,0,NULL,0,0,0,'2025-11-13',NULL,0,0,0,0,0,0,1,0,0,NULL,NULL,0,0,0,0,1,0,'zz',1,1,'2025-11-15',1,'working',0),(333,'123','123','Installation',145,'2025-11-08','45','45',45.00,'45','45','45','45','45','4','545','45','54',5,243,79,'2025-05-14','2025-11-13',0,'2025-08-10',0,'2025-09-17','2025-11-19','2025-12-10','123','Machine Room less Car Elevator','Mechanical Installation',1,NULL,'Luzon','CAR','Abra','Bangued','Machine Room',530,0,NULL,0.00,NULL,NULL,0,NULL,0,0,0,'2025-11-08',NULL,1,1,1,0,0,0,1,0,0,NULL,NULL,0,0,0,0,0,0,NULL,0,0,NULL,1,'working',0),(339,'Lift-A-001','Passenger elevator for commercial building','Installation',8,'2025-11-09','Traction','Center Opening',1.00,'Collective','10','Ground to 10th Floor','30m','380V 3Phase','Concrete','1600x1400mm','1100x1400mm','800mm',3500,1200,69,'2025-05-20',NULL,NULL,'2025-08-16',0,'2025-09-23','2025-11-25','2025-12-16','ABC Corporation','Passenger Elevator','Mechanical Installation',1,'Monthly','Luzon','NCR','Metro Manila','Makati','Counterweight Assembly',524,0,NULL,0.00,NULL,NULL,0,NULL,0,0,0,NULL,NULL,0,0,0,0,0,0,0,0,0,NULL,NULL,0,0,0,0,0,0,NULL,0,0,NULL,1,'working',0),(340,'Lift-B-002','Service elevator for hospital use','Installation',13,'2025-11-09','Hydraulic','Two Speed',0.63,'Automatic','6','Basement to 5th Floor','18m','220V Single Phase','Masonry','2000x2000mm','1400x1500mm','900mm',3200,1500,46,'2025-06-14',NULL,NULL,'2025-09-08',0,'2025-10-18','2025-12-20','2026-01-10','General Hospital','Service Elevator','Mechanical Installation',1,'Quarterly','Visayas','Region VII','Cebu','Cebu','Frame and Doors',514,0,NULL,476537.00,NULL,NULL,0,NULL,0,0,0,NULL,NULL,0,0,0,0,0,0,0,0,0,NULL,NULL,0,0,0,0,0,0,NULL,0,0,NULL,0,'working',0),(341,'Lift-C-003','Residential elevator for condominium','Test and Comm',6,'2025-11-09','Machine Room Less','Side Opening',1.60,'VVVF','15','Lobby to Penthouse','45m','380V 3Phase','Concrete','1500x1500mm','1100x1350mm','800mm',4200,1100,97,'2025-04-22',NULL,NULL,'2025-07-19',0,'2025-08-26','2025-10-28','2025-11-18','Skyline Towers','Residential Elevator','Testing and Commissioning',1,'Monthly','Luzon','CALABARZON','Cavite','Dasmarinas','Final Adjust',605,0,NULL,0.00,NULL,NULL,0,NULL,0,0,0,'2025-11-09',NULL,1,1,1,0,0,0,1,0,0,NULL,NULL,0,0,0,0,0,0,NULL,0,0,NULL,1,'working',0),(342,'Lift-D-004','Freight elevator for warehouse','Installation',20,'2025-11-09','Traction','Vertical Bi-parting',0.50,'Manual','4','Ground to 3rd Floor','12m','380V 3Phase','Steel','2500x2500mm','1800x2400mm','1200mm',3800,1800,56,'2025-06-07',NULL,NULL,'2025-09-01',0,'2025-10-11','2025-12-13','2026-01-03','Logistics Inc','Freight Elevator','Mechanical Installation',1,'Quarterly','Mindanao','Region XI','Davao del Sur','Davao','Support Beams',517,0,NULL,0.00,NULL,NULL,0,NULL,0,0,0,NULL,NULL,0,0,0,0,0,0,0,0,0,NULL,NULL,0,0,0,0,0,0,NULL,0,0,NULL,0,'working',0),(343,'Lift-E-005','Panoramic elevator for shopping mall','Completed',10,'2025-11-09','Traction','Glass Doors',1.25,'Group Control','8','Ground to 7th Floor','24m','380V 3Phase','Glass/Steel','1800x1800mm','1300x1400mm','1000mm',3600,1300,99,'2025-04-11',NULL,0,'2025-07-06',0,'2025-08-13','2025-10-18','2025-11-09','Mall Group','Machine Room Car Elevator','Testing and Commissioning',1,'Monthly','Luzon','NCR','Metro Manila','Quezon','Final Cleaning / Hand over',607,0,NULL,345235.93,NULL,NULL,0,NULL,0,0,0,NULL,NULL,0,0,0,0,0,0,0,1,1,'2025-11-09','2025-11-09',0,1,1,1,0,0,NULL,0,0,NULL,0,'working',0),(344,'SkyRise v7','Some description','Preliminaries',600,'2025-11-11','VVVF','Automatic VVF door operator',1.00,'Simplex','3/3/3','Gf, 2f, 3f','40m','220v / 3 Phase','Concrete','1600m x 1600mm','1000mm x 1200mm','750mm x 2100 mm',3000,1200,0,'2025-11-11',NULL,NULL,'2026-02-07',0,'2026-03-17','2026-05-19','2026-06-09','Silverstone Properties','Machine Room less Passenger Elevator','Preliminaries',1,NULL,'Luzon','CAR','Apayao','Kabugao','Pre-Inspection(Checkin of Shaft)',101,0,NULL,0.00,NULL,NULL,0,NULL,0,0,0,NULL,NULL,0,0,0,0,0,0,0,0,0,NULL,NULL,0,0,0,0,0,0,NULL,0,0,NULL,0,'working',0);
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `qaqc_checklist`
--

DROP TABLE IF EXISTS `qaqc_checklist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `qaqc_checklist` (
  `project_id` int NOT NULL,
  `project_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `order_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lift_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `foreman` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `general_comments` text COLLATE utf8mb4_unicode_ci,
  `foreman_signature` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `inspector_signature` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `qaqc_signature` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date` date DEFAULT (curdate()),
  `items_json` json DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`project_id`),
  CONSTRAINT `fk_qaqc_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `qaqc_checklist`
--

LOCK TABLES `qaqc_checklist` WRITE;
/*!40000 ALTER TABLE `qaqc_checklist` DISABLE KEYS */;
INSERT INTO `qaqc_checklist` VALUES (1,'324','23434',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[{\"remarks\": \"\", \"accepted\": \"N\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}]','2025-10-07 18:15:40'),(44,'','','','','','','','','','2025-10-07','[{\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}]','2025-10-07 09:23:06'),(47,'','','','','','','','','','2025-10-09','[{\"remarks\": \"\", \"accepted\": \"N\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}]','2025-10-09 06:24:22'),(267,'','','','','','','','','','2025-10-07','[{\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}, {\"remarks\": \"\", \"accepted\": \"\"}]','2025-10-07 09:21:01');
/*!40000 ALTER TABLE `qaqc_checklist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `qaqc_inspection_history`
--

DROP TABLE IF EXISTS `qaqc_inspection_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `qaqc_inspection_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int DEFAULT NULL,
  `inspection_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `inspection_reason` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `inspection_date` date DEFAULT (curdate()),
  `inspection_complete` tinyint DEFAULT (0),
  `qaqc_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `qaqc_id` (`qaqc_id`),
  KEY `qaqc_inspection_history_ibfk_1` (`project_id`),
  CONSTRAINT `qaqc_inspection_history_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `qaqc_inspection_history_ibfk_2` FOREIGN KEY (`qaqc_id`) REFERENCES `employees` (`employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `qaqc_inspection_history`
--

LOCK TABLES `qaqc_inspection_history` WRITE;
/*!40000 ALTER TABLE `qaqc_inspection_history` DISABLE KEYS */;
INSERT INTO `qaqc_inspection_history` VALUES (1,1,'qaqc','Template Setting','2025-10-27',1,98),(2,44,'QAQC','Template Setting','2025-10-30',0,98),(3,44,'QAQC','Template Setting','2025-10-30',0,98),(4,1,'QAQC','Template Setting','2025-10-30',0,98),(5,1,'QAQC','Template Setting','2025-10-30',1,98),(6,1,'QAQC','Template Setting','2025-10-30',1,98),(9,1,'QAQC','Template Setting','2025-10-27',1,NULL),(10,1,'QAQC','Testing and Commissioning','2025-10-27',1,NULL),(11,1,'QAQC','Template Setting','2025-11-12',0,NULL),(12,1,'QAQC','Handover','2025-11-12',1,NULL),(13,1,'QAQC','Template Setting','2025-10-29',1,NULL),(14,45,'QAQC','Template Setting','2025-10-29',1,NULL),(15,45,'QAQC','Template Setting','2025-10-30',1,NULL),(16,45,'QAQC','Template Setting','2025-10-30',1,NULL),(17,47,'QAQC','Handover','2025-10-30',1,NULL),(18,1,'QAQC','Template Setting','2025-11-02',1,NULL),(19,1,'QAQC','Handover','2026-01-01',0,NULL),(20,1,'QAQC','Template Setting','2025-11-02',1,NULL),(21,266,'QAQC','Template Setting','2025-11-02',1,NULL),(22,267,'QAQC','Handover','2025-11-02',1,NULL),(23,266,'QAQC','Prior Testing and Commissioning','2025-11-04',1,NULL),(24,329,'QAQC','Template Setting','2025-11-06',1,NULL),(25,266,'QAQC','Prior Testing and Commissioning','2025-11-05',1,NULL),(26,266,'QAQC','Prior Testing and Commissioning','2025-11-05',1,NULL),(27,329,'QAQC','Template Setting','2025-11-05',1,NULL),(28,266,'QAQC','Template Setting','2025-11-05',1,NULL),(29,333,'QAQC','Template Setting','2025-11-07',1,NULL),(30,333,'QAQC','Template Setting','2025-11-07',1,NULL),(31,333,'QAQC','Template Setting','2025-11-09',0,NULL),(32,333,'QAQC','Template Setting','2025-11-07',1,NULL),(33,340,'QAQC','Template Setting','2025-11-12',1,NULL),(34,333,'QAQC','Template Setting','2025-11-13',1,NULL);
/*!40000 ALTER TABLE `qaqc_inspection_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `qaqc_punchlisting`
--

DROP TABLE IF EXISTS `qaqc_punchlisting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `qaqc_punchlisting` (
  `id` int NOT NULL AUTO_INCREMENT,
  `inspection_id` int DEFAULT NULL,
  `doc_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_added` date DEFAULT (curdate()),
  PRIMARY KEY (`id`),
  KEY `inspection_id` (`inspection_id`),
  CONSTRAINT `qaqc_punchlisting_ibfk_1` FOREIGN KEY (`inspection_id`) REFERENCES `qaqc_inspection_history` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `qaqc_punchlisting`
--

LOCK TABLES `qaqc_punchlisting` WRITE;
/*!40000 ALTER TABLE `qaqc_punchlisting` DISABLE KEYS */;
INSERT INTO `qaqc_punchlisting` VALUES (1,15,'/uploads/1761886316313-punchlist_mqdefault.jpg','2025-10-31'),(2,17,'/uploads/1761929032703-punchlist_mqdefault.jpg','2025-11-01'),(3,18,'/uploads/1762142633525-punchlist_mqdefault.jpg','2025-11-03'),(4,21,'/uploads/1762154157431-punchlist_mqdefault.jpg','2025-11-03'),(5,27,'/uploads/1762434497260-punchlist_QAQC Punchlisting.PNG','2025-11-06'),(6,27,'/uploads/1762434751971-punchlist_QAQC Punchlisting.PNG','2025-11-06');
/*!40000 ALTER TABLE `qaqc_punchlisting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schneider_service_report`
--

DROP TABLE IF EXISTS `schneider_service_report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schneider_service_report` (
  `project_id` int NOT NULL,
  `items_json` json DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`project_id`),
  CONSTRAINT `fk_sesr_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schneider_service_report`
--

LOCK TABLES `schneider_service_report` WRITE;
/*!40000 ALTER TABLE `schneider_service_report` DISABLE KEYS */;
/*!40000 ALTER TABLE `schneider_service_report` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `socket_io_test`
--

DROP TABLE IF EXISTS `socket_io_test`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `socket_io_test` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_true` tinyint DEFAULT (0),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `socket_io_test`
--

LOCK TABLES `socket_io_test` WRITE;
/*!40000 ALTER TABLE `socket_io_test` DISABLE KEYS */;
INSERT INTO `socket_io_test` VALUES (48,'jii',0),(49,'jii',0),(50,'jii',0),(51,'jii',0),(52,'jii',0),(53,'jii',0),(54,'jii',0),(55,'jii',0),(56,'jii',0),(57,'jii',0),(58,'jii',0),(59,'jii',0),(60,'jii',0),(61,'jii',0),(62,'jii',0),(63,'jii',0),(64,'jii',0),(65,'jii',0),(66,'jii',0),(67,'jii',0);
/*!40000 ALTER TABLE `socket_io_test` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task_photos`
--

DROP TABLE IF EXISTS `task_photos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_photos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int DEFAULT NULL,
  `task_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_id` int DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `photo_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_duration` int DEFAULT NULL,
  `task_percent` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `task_photos_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=123 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_photos`
--

LOCK TABLES `task_photos` WRITE;
/*!40000 ALTER TABLE `task_photos` DISABLE KEYS */;
INSERT INTO `task_photos` VALUES (23,45,'Template Setting',504,'2025-10-30','2025-11-02','/uploads/1761851928177-titan.jpg',2,7),(24,45,'Template Setting',504,'2025-10-30','2025-11-02','/uploads/1761852282439-mqdefault.jpg',2,7),(25,45,'Template Setting',504,'2025-10-30','2025-11-02','/uploads/1761903926940-bba39480-0c0e-4123-a80d-6baf78b82643.jfif',2,7),(26,45,'Features Test / Correction of Defects',606,'2025-10-27','2025-10-29','/uploads/1761906500581-mqdefault.jpg',2,1),(27,45,'Features Test / Correction of Defects',606,'2025-10-27','2025-10-29','/uploads/1761908162660-photo_mqdefault.jpg',2,1),(28,45,'Final Cleaning / Hand over',607,'2025-10-29','2025-11-01','/uploads/1761909820852-photo_IC-Project-Handover-Plan-Template.png',2,1),(29,45,'Final Cleaning / Hand over',607,'2025-10-29','2025-11-01','/uploads/1761909820855-photo_2019-03-12-Example-Template-Project-Project-Handover-Checklist-1-page-001.jpg',2,1),(30,45,'Final Cleaning / Hand over',607,'2025-10-29','2025-11-01','/uploads/1761909851834-completion_evidence_IC-Project-Handover-Plan-Template.png',2,1),(31,45,'Final Cleaning / Hand over',607,'2025-10-29','2025-11-01','/uploads/1761910375392-completion_evidence_2019-03-12-Example-Template-Project-Project-Handover-Checklist-1-page-001.jpg',2,1),(32,45,'Final Cleaning / Hand over',607,'2025-10-29','2025-11-01','/uploads/1761914144200-handover_document_2019-03-12-Example-Template-Project-Project-Handover-Checklist-1-page-001.jpg',2,1),(33,47,'Final Cleaning / Hand over',607,'2025-10-29','2025-11-01','/uploads/1761928644139-completion_evidence_mqdefault.jpg',2,1),(34,47,'Final Cleaning / Hand over',607,'2025-10-29','2025-11-01','/uploads/1761928944834-photo_Construction-Site-Handover-Letter-Template-edit-online.png',2,1),(35,47,'Final Cleaning / Hand over',607,'2025-10-29','2025-11-01','/uploads/1761930651080-handover_document_2019-03-12-Example-Template-Project-Project-Handover-Checklist-1-page-001.jpg',2,1),(36,1,'Unloading of elevator equipments',501,'2025-10-26','2025-10-27','/uploads/1762141879099-mqdefault.jpg',1,0),(37,1,'Scaffolding Installation',502,'2025-10-27','2025-10-29','/uploads/1762141922542-mqdefault.jpg',2,7),(38,1,'Hauling Works',503,'2025-10-29','2025-11-01','/uploads/1762142349257-mqdefault.jpg',2,7),(39,1,'Hauling Works',503,'2025-10-29','2025-11-01','/uploads/1762142554198-Construction-Site-Handover-Letter-Template-edit-online.png',2,7),(40,1,'Template Setting',504,'2025-11-01','2025-11-03','/uploads/1762142588114-IC-Project-Handover-Plan-Template.png',2,7),(41,1,'Template Setting',504,'2025-11-01','2025-11-03','/uploads/1762143160156-mqdefault.jpg',2,7),(42,1,'Final Cleaning / Hand over',607,'2025-11-01','2025-11-03','/uploads/1762144163928-photo_mqdefault.jpg',2,1),(43,1,'Final Cleaning / Hand over',607,'2025-11-01','2025-11-03','/uploads/1762144231970-completion_evidence_mqdefault.jpg',2,1),(44,1,'Final Cleaning / Hand over',607,'2025-11-01','2025-11-03','/uploads/1762144369951-handover_document_mqdefault.jpg',2,1),(45,266,'Template Setting',504,'2025-11-01','2025-11-03','/uploads/1762154106412-mqdefault.jpg',2,7),(46,267,'Final Cleaning / Hand over',607,'2025-11-01','2025-11-03','/uploads/1762154649915-completion_evidence_mqdefault.jpg',2,1),(47,267,'Final Cleaning / Hand over',607,'2025-11-01','2025-11-03','/uploads/1762155157431-photo_Construction-Site-Handover-Letter-Template-edit-online.png',2,1),(48,266,'Marking and Boring of Holes',505,'2025-11-03','2025-11-04','/uploads/1762317134090-IC-Project-Handover-Plan-Template.png',1,0),(49,329,'Unloading of elevator equipments',501,'2025-10-27','2025-10-28','/uploads/1762414297473-IC-Project-Handover-Plan-Template.png',1,0),(50,329,'Scaffolding Installation',502,'2025-10-28','2025-10-30','/uploads/1762414462124-IC-Project-Handover-Plan-Template.png',2,0),(52,329,'Unloading of elevator equipments',501,'2025-11-01','2025-11-02','/uploads/1762416688092-construction_contract_agreement_template1.jpg',1,0),(53,329,'Scaffolding Installation',502,'2025-11-02','2025-11-04','/uploads/1762416753883-construction-contract-template.jpg',2,0),(55,329,'Scaffolding Installation',502,'2025-11-05','2025-11-08','/uploads/1762417467468-construction_contract_agreement_template1.jpg',2,0),(61,329,'Template Setting',504,'2025-11-04','2025-11-06','/uploads/1762423044187-construction_contract_agreement_template1.jpg',2,7),(62,266,'Installation of Pit Ladder / Hoistway Lighting',532,'2025-11-02','2025-11-04','/uploads/1762425768441-construction-contract-template.jpg',2,0),(63,266,'Installation of Pit Ladder / Hoistway Lighting',532,'2025-11-03','2025-11-05','/uploads/1762427255463-photo_construction-contract-template.jpg',2,3),(64,329,'Hauling Works',503,'2025-11-01','2025-11-03','/uploads/1762434222699-istockphoto-479362384-612x612.jpg',2,7),(65,329,'Template Setting',504,'2025-11-03','2025-11-05','/uploads/1762434864743-istockphoto-479362384-612x612.jpg',2,7),(66,266,'Final Cleaning / Hand over',607,'2025-11-04','2025-11-06','/uploads/1762437672650-completion_evidence_Checklist Prior Handover.PNG',2,1),(67,266,'Final Cleaning / Hand over',607,'2025-11-04','2025-11-06','/uploads/1762437765250-photo_Checklist Prior Handover.PNG',2,1),(68,266,'Final Cleaning / Hand over',607,'2025-11-04','2025-11-06','/uploads/1762437806072-handover_document_istockphoto-479362384-612x612.jpg',2,1),(69,329,'Marking and Boring of Holes',505,'2025-11-05','2025-11-06','/uploads/1762510816073-istockphoto-479362384-612x612.jpg',1,0),(70,333,'Hoistway',531,'2025-11-01','2025-11-03','/uploads/1762609012340-QAQC Punchlisting.PNG',1,3),(71,333,'Installation of Pit Ladder / Hoistway Lighting',532,'2025-11-04','2025-11-06','/uploads/1762611060116-photo_istockphoto-479362384-612x612.jpg',2,3),(72,342,'Traction Machine',516,'2025-11-05','2025-11-09','/uploads/1762685854152-istockphoto-479362384-612x612.jpg',2,0),(73,342,'Traction Machine',516,'2025-11-04','2025-11-08','/uploads/1762688173514-project_contract_photo.jpg',2,5),(74,341,'Load Test',604,'2025-11-08','2025-11-10','/uploads/1762690187387-photo_homelogo.png',2,1),(75,340,'Main/Car',508,'2025-11-07','2025-11-09','/uploads/1762691714860-istockphoto-479362384-612x612.jpg',2,5),(76,342,'Support Beams',517,'2025-11-08','2025-11-10','/uploads/1762878026274-istockphoto-479362384-612x612.jpg',2,5),(77,342,'Support Beams',517,'2025-11-08','2025-11-10','/uploads/1762878252401-construction_contract_agreement_template1.jpg',2,5),(78,342,'Support Beams',517,'2025-11-08','2025-11-10','/uploads/1762878445444-qaqc inpsection checklist.PNG',2,5),(79,342,'Support Beams',517,'2025-11-08','2025-11-10','/uploads/1762878778265-istockphoto-479362384-612x612.jpg',2,5),(80,342,'Support Beams',517,'2025-11-08','2025-11-10','/uploads/1762878899227-istockphoto-479362384-612x612.jpg',2,5),(81,342,'Support Beams',517,'2025-11-08','2025-11-10','/uploads/1762878990842-istockphoto-479362384-612x612.jpg',2,5),(82,342,'Support Beams',517,'2025-11-08','2025-11-10','/uploads/1762879051470-istockphoto-479362384-612x612.jpg',2,5),(83,342,'Support Beams',517,'2025-11-08','2025-11-10','/uploads/1762879145105-project_contract_photo.jpg',2,5),(84,342,'Support Beams',517,'2025-11-08','2025-11-10','/uploads/1762879590261-project_contract_photo.jpg',2,5),(85,342,'Support Beams',517,'2025-11-08','2025-11-10','/uploads/1762879676760-istockphoto-479362384-612x612.jpg',2,5),(86,342,'Support Beams',517,'2025-11-08','2025-11-10','/uploads/1762879723921-construction-contract-template.jpg',2,5),(87,342,'Governor',518,'2025-11-10','2025-11-15','/uploads/1762879886597-77e48e83af3f9881dc84e8d9d9cee061.jpg',2,2),(88,333,'Unloading of elevator equipments',501,'2025-09-17','2025-09-20','/uploads/1763030646352-istockphoto-479362384-612x612.jpg',1,0),(89,333,'Scaffolding Installation',502,'2025-09-20','2025-09-22','/uploads/1763030940218-qaqc inpsection checklist.PNG',2,7),(90,333,'Hauling Works',503,'2025-09-22','2025-09-24','/uploads/1763031194512-project_contract_photo.jpg',2,7),(91,333,'Template Setting',504,'2025-09-24','2025-09-28','/uploads/1763031608921-project_contract_photo.jpg',2,7),(92,333,'Marking and Boring of Holes',505,'2025-09-28','2025-09-29','/uploads/1763031711150-istockphoto-479362384-612x612.jpg',1,0),(93,333,'Rail Bracket Installation',506,'2025-09-29','2025-10-01','/uploads/1763031905211-istockphoto-479362384-612x612.jpg',2,7),(94,333,'Main/Car',508,'2025-10-01','2025-10-05','/uploads/1763032001737-istockphoto-479362384-612x612.jpg',2,5),(95,333,'Counterweight (CWT)',509,'2025-10-05','2025-10-07','/uploads/1763032046600-construction-contract-template.jpg',2,3),(96,333,'Gauging',510,'2025-10-07','2025-10-08','/uploads/1763032178182-istockphoto-479362384-612x612.jpg',1,3),(97,333,'Sills and Supports',512,'2025-10-08','2025-10-12','/uploads/1763032687173-project_contract_photo.jpg',2,2),(98,333,'Jamb and Supports',513,'2025-10-12','2025-10-14','/uploads/1763033172819-istockphoto-479362384-612x612.jpg',2,2),(99,333,'Frame and Doors',514,'2025-10-14','2025-10-18','/uploads/1763033293038-istockphoto-479362384-612x612.jpg',2,3),(100,333,'Traction Machine',516,'2025-10-18','2025-10-20','/uploads/1763033420545-istockphoto-479362384-612x612.jpg',2,5),(101,333,'Support Beams',517,'2025-10-20','2025-10-22','/uploads/1763033566965-istockphoto-479362384-612x612.jpg',2,5),(102,333,'Governor',518,'2025-10-22','2025-10-26','/uploads/1763033584980-istockphoto-479362384-612x612.jpg',2,2),(103,333,'Governor',518,'2025-10-22','2025-10-26','/uploads/1763033584982-construction-contract-template.jpg',2,2),(104,333,'Installation of Control Panel',519,'2025-10-26','2025-10-28','/uploads/1763033628440-istockphoto-479362384-612x612.jpg',2,3),(105,333,'Installation of Control Panel',519,'2025-10-26','2025-10-28','/uploads/1763033628442-construction-contract-template.jpg',2,3),(106,333,'All Accessories',521,'2025-10-28','2025-11-01','/uploads/1763033680942-istockphoto-479362384-612x612.jpg',2,3),(107,333,'All Accessories',521,'2025-10-28','2025-11-01','/uploads/1763033681018-construction-contract-template.jpg',2,3),(108,333,'Car Piping/Wiring',522,'2025-11-01','2025-11-02','/uploads/1763033928844-istockphoto-479362384-612x612.jpg',1,3),(109,333,'Car Piping/Wiring',522,'2025-11-01','2025-11-02','/uploads/1763033928845-construction-contract-template.jpg',1,3),(110,333,'Travelling Cable Layout',523,'2025-11-02','2025-11-04','/uploads/1763033977332-istockphoto-479362384-612x612.jpg',2,2),(111,333,'Travelling Cable Layout',523,'2025-11-02','2025-11-04','/uploads/1763033977334-construction-contract-template.jpg',2,2),(112,333,'Counterweight Assembly',524,'2025-11-04','2025-11-08','/uploads/1763034003789-istockphoto-479362384-612x612.jpg',2,2),(113,333,'Counterweight Assembly',524,'2025-11-04','2025-11-08','/uploads/1763034003798-construction-contract-template.jpg',2,2),(114,333,'Hoisting',526,'2025-11-08','2025-11-10','/uploads/1763034050276-istockphoto-479362384-612x612.jpg',2,2),(115,333,'Hoisting',526,'2025-11-08','2025-11-10','/uploads/1763034050753-construction-contract-template.jpg',2,2),(116,333,'Governor',527,'2025-11-10','2025-11-12','/uploads/1763034072481-istockphoto-479362384-612x612.jpg',2,3),(117,333,'Governor',527,'2025-11-10','2025-11-12','/uploads/1763034072481-construction-contract-template.jpg',2,3),(118,333,'Compensating',528,'2025-11-12','2025-11-15','/uploads/1763036104462-qaqc inpsection checklist.PNG',1,3),(119,333,'Compensating',528,'2025-11-12','2025-11-15','/uploads/1763036329865-istockphoto-479362384-612x612.jpg',1,3),(120,331,'Installation of Pit Ladder / Hoistway Lighting',532,'2025-11-10','2025-11-12','/uploads/1763047597226-photo_construction-contract-template.jpg',2,3),(121,342,'Support Beams',517,'2025-11-11','2025-11-15','/uploads/1763049754852-istockphoto-479362384-612x612.jpg',2,5),(122,340,'Frame and Doors',514,'2025-11-12','2025-11-16','/uploads/1763049940285-istockphoto-479362384-612x612.jpg',2,3);
/*!40000 ALTER TABLE `task_photos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `team_members`
--

DROP TABLE IF EXISTS `team_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team_members` (
  `id` int NOT NULL AUTO_INCREMENT,
  `foreman_id` int DEFAULT NULL,
  `emp_id` int DEFAULT NULL,
  `is_forecasted` tinyint DEFAULT (0),
  `project_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `emp_id` (`emp_id`),
  KEY `team_members_ibfk_3` (`foreman_id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `team_members_ibfk_2` FOREIGN KEY (`emp_id`) REFERENCES `employees` (`employee_id`),
  CONSTRAINT `team_members_ibfk_3` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=223 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team_members`
--

LOCK TABLES `team_members` WRITE;
/*!40000 ALTER TABLE `team_members` DISABLE KEYS */;
INSERT INTO `team_members` VALUES (196,10,11,0,329),(197,10,20,0,329),(198,13,15,0,333),(199,13,21,0,333),(200,18,16,0,44),(201,18,38,0,44),(202,37,14,0,342),(203,37,39,0,342),(204,53,40,0,340),(205,53,102,0,340),(214,55,103,0,339),(215,55,46,0,339),(216,52,41,0,46),(217,52,105,0,46),(218,52,45,0,46),(221,54,104,0,48),(222,54,43,0,48);
/*!40000 ALTER TABLE `team_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teams`
--

DROP TABLE IF EXISTS `teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teams` (
  `team_id` int NOT NULL AUTO_INCREMENT,
  `Foreman` varchar(255) NOT NULL,
  `foreman_id` int DEFAULT NULL,
  `project_id` int DEFAULT (NULL),
  `project_engineer_id` int DEFAULT NULL,
  PRIMARY KEY (`team_id`),
  KEY `foremanForeignKey` (`foreman_id`),
  KEY `pe_fk` (`project_engineer_id`),
  KEY `teams_ibfk_1` (`project_id`),
  CONSTRAINT `teams_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `teams_ibfk_2` FOREIGN KEY (`foreman_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE,
  CONSTRAINT `teams_ibfk_3` FOREIGN KEY (`project_engineer_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=102 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teams`
--

LOCK TABLES `teams` WRITE;
/*!40000 ALTER TABLE `teams` DISABLE KEYS */;
INSERT INTO `teams` VALUES (10,'Nat Peterson',10,NULL,NULL),(13,'Nebby Star',13,NULL,NULL),(18,'Mermaid Man',18,NULL,NULL),(37,'John Doe',37,NULL,NULL),(52,'Ray Ban',52,NULL,NULL),(53,'Michael Brown',53,NULL,NULL),(54,'David Williams',54,NULL,NULL),(55,'Chris Taylor',55,NULL,NULL),(56,'Anthony Miller',56,NULL,NULL);
/*!40000 ALTER TABLE `teams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tnc_inspection_documents`
--

DROP TABLE IF EXISTS `tnc_inspection_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tnc_inspection_documents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `checklist_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `photo_url` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_submission` date DEFAULT (curdate()),
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `tnc_inspection_documents_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tnc_inspection_documents`
--

LOCK TABLES `tnc_inspection_documents` WRITE;
/*!40000 ALTER TABLE `tnc_inspection_documents` DISABLE KEYS */;
INSERT INTO `tnc_inspection_documents` VALUES (1,1,'TNC Checklist','/uploads/1761654515469-document_bba39480-0c0e-4123-a80d-6baf78b82643.jfif','2025-10-28'),(2,1,'TNC Checklist','/uploads/1761759335037-document_bba39480-0c0e-4123-a80d-6baf78b82643.jfif','2025-10-30'),(3,45,'TNC Checklist','/uploads/1761909820869-document_mqdefault.jpg','2025-10-31'),(4,1,'TNC Checklist','/uploads/1762144163929-document_Construction-Site-Handover-Letter-Template-edit-online.png','2025-11-03'),(5,267,'TNC Checklist','/uploads/1762155157443-document_IC-Project-Handover-Plan-Template.png','2025-11-03'),(6,266,'TNC Checklist','/uploads/1762437765300-document_qaqc inpsection checklist.PNG','2025-11-06');
/*!40000 ALTER TABLE `tnc_inspection_documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tnc_inspection_photos`
--

DROP TABLE IF EXISTS `tnc_inspection_photos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tnc_inspection_photos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int DEFAULT NULL,
  `document_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `photo_url` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tnc_inspection_photos_ibfk_1` (`project_id`),
  CONSTRAINT `tnc_inspection_photos_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tnc_inspection_photos`
--

LOCK TABLES `tnc_inspection_photos` WRITE;
/*!40000 ALTER TABLE `tnc_inspection_photos` DISABLE KEYS */;
INSERT INTO `tnc_inspection_photos` VALUES (7,1,'undefined','/data/uploads/1761620975235-photo_mqdefault.jpg');
/*!40000 ALTER TABLE `tnc_inspection_photos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tnc_technician_designation`
--

DROP TABLE IF EXISTS `tnc_technician_designation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tnc_technician_designation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `technician_id` int DEFAULT NULL,
  `project_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `technician_id` (`technician_id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `tnc_technician_designation_ibfk_1` FOREIGN KEY (`technician_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE,
  CONSTRAINT `tnc_technician_designation_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tnc_technician_designation`
--

LOCK TABLES `tnc_technician_designation` WRITE;
/*!40000 ALTER TABLE `tnc_technician_designation` DISABLE KEYS */;
/*!40000 ALTER TABLE `tnc_technician_designation` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-14  0:32:06
