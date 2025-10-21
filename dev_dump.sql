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
  KEY `report_id` (`report_id`),
  CONSTRAINT `daily_report_photos_ibfk_1` FOREIGN KEY (`report_id`) REFERENCES `project_daily_report` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `daily_report_photos`
--

LOCK TABLES `daily_report_photos` WRITE;
/*!40000 ALTER TABLE `daily_report_photos` DISABLE KEYS */;
INSERT INTO `daily_report_photos` VALUES (2,7,'/uploads/77ed9361bd04b1b00c56a5ed09071f7b'),(3,7,'/uploads/fae620c9d84e3a448537c4b0ac8136fa'),(4,7,'/uploads/60620bec94025b727f95830bc4a1167b');
/*!40000 ALTER TABLE `daily_report_photos` ENABLE KEYS */;
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
  `hire_date` date DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '0',
  `refresh_token` varchar(550) DEFAULT NULL,
  PRIMARY KEY (`employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=95 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES ('EugeneK','12345678',1,'Eugene','Krab','manager','2023-01-02',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkV1Z2VuZUsiLCJpYXQiOjE3NjA1MzQxMTcsImV4cCI6MTc2MDYyMDUxN30.P7mHP6rt5vLgpZ0mjXVL3j7RogWs3AUdxOj9y-kO1YQ'),('SquidwardT','12345678',2,'Squidward','Tentacles','Project Manager','2023-01-03',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNxdWlkd2FyZFQiLCJpYXQiOjE3NjA4NzgyNjAsImV4cCI6MTc2MDk2NDY2MH0.lY4f66P2wbP6fl9bNDoPi_4XbxImtq3lc2hqfoKBqDo'),('SpongebobS','12345678',3,'Spongebob','Squarepants','Project Engineer','2024-01-04',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNwb25nZWJvYlMiLCJpYXQiOjE3NjA1OTAzMjIsImV4cCI6MTc2MDY3NjcyMn0.9_HZP2dqUyYYAXfHcTXKqvQK-h-A4EQ6vmdRn2KTSkI'),('PatrickS','12345678',4,'Patrick','Star','Project Engineer','2023-01-05',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlBhdHJpY2tTIiwiaWF0IjoxNzU5MTQzOTU0LCJleHAiOjE3NTkyMzAzNTR9.HFciDtoVRNX0cVYTFA5Bp99yvXJSwuks2T2oo2MlBc0'),('SandyC','12345678',5,'Sandy','Cheeks','Project Engineer','2023-01-06',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNhbmR5QyIsImlhdCI6MTc2MDUzNTU2NiwiZXhwIjoxNzYwNjIxOTY2fQ._HWTgZn84mWpqYoVIMWXKl9azKCai72sU-USMkCBb6M'),('SheldonP','12345678',6,'Sheldon','Plankton','Project Engineer','2023-01-07',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNoZWxkb25QIiwiaWF0IjoxNzU5OTkwMzYxLCJleHAiOjE3NjAwNzY3NjF9.kSugW47qk3GW_tjdCfM_1n9SLXb4P74qskhVpMYbJ-0'),('PearlK','12345678',7,'Pearl','Krabs','Project Engineer','2023-02-01',0,NULL),('KarenP','12345678',8,'Karen','Plankton','Project Engineer','2022-11-15',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkthcmVuUCIsImlhdCI6MTc1OTgxOTI0NiwiZXhwIjoxNzU5OTA1NjQ2fQ.-qHnXKk8KANZXZBhjSFIVpaNLxRIxDfVriCJrRdYokY'),('LarryL','12345678',9,'Larry','Lobster','Project Engineer','2023-03-10',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkxhcnJ5TCIsImlhdCI6MTc2MDg4NDk4MCwiZXhwIjoxNzYwOTcxMzgwfQ.JoACveFaqzD0YMDeulvRcwTyq2gGgMCrZB7H1WYJPe0'),('NatP','12345678',10,'Nat','Peterson','Foreman','2023-04-05',1,NULL),('Tom','12345678',11,'Tom','Johnson','Skilled Installer','2023-05-12',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlRvbSIsImlhdCI6MTc2MDM0NTkxNywiZXhwIjoxNzYwNDMyMzE3fQ.hlUdb7efYU9zIhfVQLpjWw6HZ-aGKRGJps6LUlwqSus'),('Fred','12345678',12,'Fred','Fish','Skilled Installer','2023-05-15',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkZyZWQiLCJpYXQiOjE3NTc1ODUxODYsImV4cCI6MTc1NzY3MTU4Nn0.zpCYclwwmnS7aBWq6CZY1X2ZuRmGwpmwdky0XCoGphM'),('Nebby','12345678',13,'Nebby','Star','Foreman','2023-06-01',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik5lYmJ5IiwiaWF0IjoxNzYwNTQ1MDk2LCJleHAiOjE3NjA2MzE0OTZ9.H_fWYIxPcm23z-G3aOSWUoYU0iu6lXJoay_mjulj0b8'),('Barny','12345678',14,'Barny','Fish','Skilled Installer','2023-06-10',1,NULL),('Martha','12345678',15,'Marthanah','Starfish','Skilled Installer','2023-07-01',1,NULL),('Betsy','12345678',16,'Betsy','Krabs','Skilled Installer','2023-07-15',1,NULL),('Gary','12345678',17,'Gary','Snail','Skilled Installer','2023-08-01',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkdhcnkiLCJpYXQiOjE3NTc0MTU5NTMsImV4cCI6MTc1NzUwMjM1M30.597DoSWVcHz-29ZG_J1vW5QmzLaP17MPJKQaDODM710'),('MermaidMan','12345678',18,'Mermaid','Man','Foreman','2023-08-10',1,NULL),('BarnacleBoy','12345678',19,'Barnacle','Boy','Skilled Installer','2023-09-01',0,NULL),('KingNeptune','12345678',20,'King','Neptune','Installer','2023-09-15',1,NULL),('DirtyBubble','12345678',21,'Dirty','Bubble','Installer','2023-10-01',0,NULL),('JohnDoe','password123',37,'John','Doe','Foreman','2023-07-01',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkpvaG5Eb2UiLCJpYXQiOjE3NjA1NDY4NTksImV4cCI6MTc2MDYzMzI1OX0.ZDCrUugoXYvoxc_sPPJb9hvBrpg2dYTiTBsHde7DJgE'),('JaneSmith','securepass',38,'Jane','Smith','Installer','2023-07-05',1,NULL),('MikeJohnson','mikepass',39,'Mike','Johnson','Installer','2023-07-10',1,NULL),('SarahWilson','sarah123',40,'Sarah','Wilson','Installer','2023-07-15',1,NULL),('DavidBrown','davidpass',41,'David','Brown','Installer','2023-07-20',1,NULL),('EmilyDavis','emily456',42,'Emily','Davis','Installer','2023-08-01',1,NULL),('RobertLee','robertpass',43,'Robert','Lee','Installer','2023-08-05',1,NULL),('LisaTaylor','lisa789',44,'Lisa','Taylor','Installer','2023-08-10',0,NULL),('ChrisMartin','chrispass',45,'Chris','Martin','Installer','2023-08-15',0,NULL),('AmyClark','amypass',46,'Amy','Clark','Installer','2023-08-20',0,NULL),('KevinWhite','kevin123',47,'Kevin','White','Installer','2023-09-01',0,NULL),('MichelleHall','michellepass',48,'Michelle','Hall','Installer','2023-09-05',0,NULL),('BrianScott','brian456',49,'Brian','Scott','Installer','2023-09-10',0,NULL),('JessicaKing','jessicapass',50,'Jessica','King','Installer','2023-09-15',0,NULL),('DanielYoung','daniel789',51,'Daniel','Young','Installer','2023-09-20',0,NULL),('JohnD','12345678',52,'Ray','Ban','Foreman','2023-04-10',1,NULL),('MichaelB','12345678',53,'Michael','Brown','Foreman','2023-04-12',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik1pY2hhZWxCIiwiaWF0IjoxNzU3NjAwNjU4LCJleHAiOjE3NTc2ODcwNTh9.flx3Hne12HIOIY0SEcgqM6h9s4UIj9o5iVStnN9ESa0'),('DavidW','12345678',54,'David','Williams','Foreman','2023-04-15',1,NULL),('ChrisT','12345678',55,'Chris','Taylor','Foreman','2023-04-18',1,NULL),('AnthonyM','12345678',56,'Anthony','Miller','Foreman','2023-04-20',1,NULL),('RyanLee','ryanpass123',57,'Ryan','Lee','Installer','2023-10-01',0,NULL),('SarahBrown','sarah456',58,'Sarah','Brown','Installer','2023-10-05',0,NULL),('JasonChen','jasonpass',59,'Jason','Chen','Installer','2023-10-10',0,NULL),('EmilyWright','emily789',60,'Emily','Wright','Installer','2023-10-15',0,NULL),('MichaelTurner','mike123',61,'Michael','Turner','Installer','2023-10-20',0,NULL),('OliviaParker','olivia456',62,'Olivia','Parker','Installer','2023-10-25',0,NULL),('DavidMiller','davidpass',63,'David','Miller','Installer','2023-11-01',0,NULL),('SophiaGarcia','sophia789',64,'Sophia','Garcia','Installer','2023-11-05',0,NULL),('AndrewHill','andrew123',65,'Andrew','Hill','Installer','2023-11-10',0,NULL),('GraceLewis','grace456',66,'Grace','Lewis','Installer','2023-11-15',0,NULL),('JoshuaWalker','joshua789',67,'Joshua','Walker','Installer','2023-11-20',0,NULL),('ChloeRobinson','chloe123',68,'Chloe','Robinson','Installer','2023-11-25',0,NULL),('NicholasHall','nick456',69,'Nicholas','Hall','Installer','2023-12-01',0,NULL),('LilyAllen','lily789',70,'Lily','Allen','Installer','2023-12-05',0,NULL),('TylerYoung','tyler123',71,'Tyler','Young','Installer','2023-12-10',0,NULL),('HannahKing','hannah456',72,'Hannah','King','Installer','2023-12-15',0,NULL),('BrandonScott','brandon789',73,'Brandon','Scott','Installer','2023-12-20',0,NULL),('AvaGreen','avapass123',74,'Ava','Green','Installer','2023-12-25',0,NULL),('JustinAdams','justin456',75,'Justin','Adams','Installer','2023-12-30',0,NULL),('MiaNelson','mia789',76,'Mia','Nelson','Installer','2024-01-04',0,NULL),('KordianM','12345678',77,'Mawunyo','Kordian','PMS Coordinator',NULL,0,NULL),('ArcheD','12345678',78,'Denitsa','Arche','PMS Technician',NULL,0,NULL),('YusufK','12345678',79,'Kassia','Yusuf','PMS Technician',NULL,0,NULL),('KalpanaK','12345678',80,'Kamran','Kalpana','PMS Technician',NULL,0,NULL),('DipakaT','12345678',81,'Toshiko','Dipaka','PMS Technician',NULL,0,NULL),('YuuriI','12345678',82,'Ipek','Yuri','PMS Technician',NULL,0,NULL),('KeanK','12345678',83,'Kiuk','Kean','PMS Technician',NULL,0,NULL),('GallaF','12345678',86,'Faiza','Galla','TNC Technician',NULL,0,NULL),('LoganP','12345678',87,'Pepcan','Logan','TNC Technician',NULL,0,NULL),('IgnaasM','12345678',88,'Machlain','Ignaas','TNC Technician',NULL,0,NULL),('RoosN','12345678',89,'Nelle','Roos','TNC Technician',NULL,0,NULL),('RajaD','12345678',90,'Declan','Raja','TNC Technician',NULL,0,NULL),('Humphry','12345678',91,'Vincenzo','Humphry','QAQC',NULL,0,NULL),('TomWilson','tomqapass',92,'Tom','Wilson','QAQC','2024-01-15',1,NULL),('JessicaBrown','jessicaqa',93,'Jessica','Brown','QAQC','2024-01-20',1,NULL),('MichaelChen','mikeqaqc',94,'Michael','Chen','QAQC','2024-01-25',1,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=223 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `forecast_team_members`
--

LOCK TABLES `forecast_team_members` WRITE;
/*!40000 ALTER TABLE `forecast_team_members` DISABLE KEYS */;
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
  PRIMARY KEY (`notification_id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `notification_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=122 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
INSERT INTO `notification` VALUES (121,'Project Created','Project 307 Lobster Larry at 2025-10-19','2025-10-20',NULL,NULL);
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
  PRIMARY KEY (`id`),
  KEY `employee_id` (`employee_id`),
  KEY `notification_recipients_ibfk_1` (`notification_id`),
  CONSTRAINT `notification_recipients_ibfk_1` FOREIGN KEY (`notification_id`) REFERENCES `notification` (`notification_id`) ON DELETE CASCADE,
  CONSTRAINT `notification_recipients_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=461 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification_recipients`
--

LOCK TABLES `notification_recipients` WRITE;
/*!40000 ALTER TABLE `notification_recipients` DISABLE KEYS */;
INSERT INTO `notification_recipients` VALUES (460,121,9);
/*!40000 ALTER TABLE `notification_recipients` ENABLE KEYS */;
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
  `task_done` tinyint(1) DEFAULT '0',
  `task_percent` int DEFAULT '0',
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
INSERT INTO `project_1_schedule` VALUES (1,100,'Preliminaries','2025-05-31','2025-06-15',15,'summary',NULL,1,0,NULL,NULL,'Preliminaries','1',0.00,100.00,0.00,'2025-10-04 10:37:52'),(2,103,'Submission of Drawing and Finishes for Approval','2025-06-09','2025-06-14',5,'task',100,1,0,NULL,NULL,'Submission of Drawing and Finishes for Approval','1',0.00,100.00,0.00,'2025-10-04 10:37:52'),(3,102,'Layout of Drawing','2025-06-06','2025-06-09',3,'task',100,1,0,NULL,NULL,'Layout of Drawing','1',0.00,100.00,0.00,'2025-10-04 10:37:52'),(4,300,'Manufacturing and Importation Process (Passenger Elevator)','2025-06-15','2025-08-29',75,'summary',NULL,1,0,NULL,NULL,'Manufacturing and Importation Process (Passenger Elevator)','1',0.00,100.00,0.00,'2025-10-04 10:37:52'),(5,201,'Shaft Construction','2025-06-15','2025-08-29',75,'task',200,1,0,NULL,NULL,'Shaft Construction','1',0.00,100.00,0.00,'2025-10-04 10:37:52'),(6,400,'Planning For Mobilization And Execution','2025-08-29','2025-09-18',20,'summary',NULL,1,0,NULL,NULL,'Planning For Mobilization And Execution','1',0.00,100.00,0.00,'2025-10-04 10:37:52'),(7,104,'Submission of PO to Factory','2025-06-14','2025-06-15',1,'task',100,1,0,NULL,NULL,'Submission of PO to Factory','1',0.00,100.00,0.00,'2025-10-04 10:37:52'),(8,301,'Manufacturing and Importation','2025-06-15','2025-08-29',75,'task',300,1,0,NULL,NULL,'Manufacturing and Importation','1',0.00,100.00,0.00,'2025-10-04 10:37:52'),(9,101,'Pre-Inspection(Checkin of Shaft)','2025-05-31','2025-06-06',6,'task',100,1,0,NULL,NULL,'Pre-Inspection(Checkin of Shaft)','1',0.00,100.00,0.00,'2025-10-04 10:37:52'),(10,200,'Structural/Civil Works','2025-06-15','2025-08-29',75,'summary',NULL,1,0,NULL,NULL,'Structural/Civil Works','1',0.00,100.00,0.00,'2025-10-04 10:37:52'),(11,401,'Preparation of tools and materials for elevator installation','2025-08-29','2025-09-12',14,'task',400,1,0,NULL,NULL,'Preparation of tools and materials for elevator installation','1',0.00,100.00,0.00,'2025-10-04 10:37:52'),(12,402,'Layout of boardup markings','2025-09-12','2025-09-15',3,'task',400,1,0,NULL,NULL,'Layout of boardup markings','1',0.00,100.00,0.00,'2025-10-04 10:37:52'),(13,500,'Mechanical Installation (Passenger Elevator)','2025-09-18','2025-11-02',45,'summary',NULL,1,0,NULL,NULL,'Mechanical Installation (Passenger Elevator)','1',0.00,100.00,0.00,'2025-10-04 10:37:53'),(14,403,'Partial delivery of tools and boardup materials','2025-09-15','2025-09-18',3,'task',400,1,0,NULL,NULL,'Partial delivery of tools and boardup materials','1',0.00,100.00,0.00,'2025-10-04 10:37:53'),(15,501,'Unloading of elevator equipments','2025-09-18','2025-09-19',1,'task',500,1,0,'General','1','Unloading of elevator equipments','1',0.00,100.00,0.00,'2025-10-04 10:37:53'),(16,502,'Scaffolding Installation','2025-09-19','2025-09-21',2,'task',500,1,7,'General','2','Scaffolding Installation','1',7.00,100.00,0.00,'2025-10-04 10:37:53'),(17,503,'Hauling Works','2025-09-21','2025-09-23',2,'task',500,1,7,'General','3','Hauling Works','1',7.00,100.00,0.00,'2025-10-04 10:37:53'),(18,504,'Template Setting','2025-09-23','2025-09-25',2,'task',500,1,7,'General','4','Template Setting','1',7.00,100.00,0.00,'2025-10-04 10:37:53'),(19,506,'Rail Bracket Installation','2025-09-26','2025-09-28',2,'task',500,1,7,'General','6','Rail Bracket Installation','1',7.00,100.00,0.00,'2025-10-04 10:37:53'),(20,507,'Guide Rail Setting','2025-09-28','2025-10-03',5,'summary',500,1,0,NULL,NULL,'Guide Rail Setting','1',0.00,100.00,0.00,'2025-10-04 10:37:53'),(21,510,'Gauging','2025-10-02','2025-10-03',1,'task',507,1,3,'Guide Rail Setting','C','Gauging','1',3.00,100.00,0.00,'2025-10-04 10:37:53'),(22,505,'Marking and Boring of Holes','2025-09-25','2025-09-26',1,'task',500,1,0,'General','5','Marking and Boring of Holes','1',0.00,100.00,0.00,'2025-10-04 10:37:53'),(23,508,'Main/Car','2025-09-28','2025-09-30',2,'task',507,1,5,'Guide Rail Setting','A','Main/Car','1',5.00,100.00,0.00,'2025-10-04 10:37:53'),(24,509,'Counterweight (CWT)','2025-09-30','2025-10-02',2,'task',507,1,3,'Guide Rail Setting','B','Counterweight (CWT)','1',3.00,100.00,0.00,'2025-10-04 10:37:53'),(25,511,'Landing Door Assembly','2025-10-03','2025-10-09',6,'summary',500,1,0,NULL,NULL,'Landing Door Assembly','1',0.00,100.00,0.00,'2025-10-04 10:37:53'),(26,512,'Sills and Supports','2025-10-03','2025-10-05',2,'task',511,1,2,'Landing Door Assembly','A','Sills and Supports','1',2.00,100.00,0.00,'2025-10-04 10:37:53'),(27,513,'Jamb and Supports','2025-10-05','2025-10-07',2,'task',511,1,2,'Landing Door Assembly','B','Jamb and Supports','1',2.00,100.00,0.00,'2025-10-04 10:37:53'),(28,514,'Frame and Doors','2025-10-07','2025-10-09',2,'task',511,1,3,'Landing Door Assembly','C','Frame and Doors','1',3.00,100.00,0.00,'2025-10-04 10:37:53'),(29,515,'M/R Equipment Setting','2025-10-09','2025-10-15',6,'summary',500,1,0,NULL,NULL,'M/R Equipment Setting','1',0.00,100.00,0.00,'2025-10-04 10:37:53'),(30,516,'Traction Machine','2025-10-09','2025-10-11',2,'task',515,1,5,'M/R Equipment Setting','A','Traction Machine','1',5.00,100.00,0.00,'2025-10-04 10:37:53'),(31,518,'Governor','2025-10-13','2025-10-15',2,'task',515,1,2,'M/R Equipment Setting','C','Governor','1',2.00,100.00,0.00,'2025-10-04 10:37:53'),(32,519,'Installation of Control Panel','2025-10-15','2025-10-17',2,'task',500,1,3,'M/R Equipment Setting','D','Installation of Control Panel','1',3.00,100.00,0.00,'2025-10-04 10:37:53'),(33,520,'Car Assembly','2025-10-17','2025-10-20',3,'summary',500,0,0,NULL,NULL,'Car Assembly','1',0.00,0.00,0.00,'2025-10-04 10:37:53'),(34,517,'Support Beams','2025-10-11','2025-10-13',2,'task',515,1,5,'M/R Equipment Setting','B','Support Beams','1',5.00,100.00,0.00,'2025-10-04 10:37:53'),(35,521,'All Accessories','2025-10-17','2025-10-19',2,'task',520,0,3,'Car Assembly','A','All Accessories','1',3.00,0.00,0.00,'2025-10-04 10:37:53'),(36,522,'Car Piping/Wiring','2025-10-19','2025-10-20',1,'task',520,0,3,'Car Assembly','B','Car Piping/Wiring','1',3.00,0.00,0.00,'2025-10-04 10:37:53'),(37,523,'Travelling Cable Layout','2025-10-20','2025-10-22',2,'task',500,0,2,'Car Assembly','C','Travelling Cable Layout','1',2.00,0.00,0.00,'2025-10-04 10:37:53'),(38,524,'Counterweight Assembly','2025-10-22','2025-10-24',2,'task',500,0,2,'Car Assembly','D','Counterweight Assembly','1',2.00,0.00,0.00,'2025-10-04 10:37:53'),(39,525,'Laying out of Ropes','2025-10-24','2025-10-29',5,'summary',500,0,0,NULL,NULL,'Laying out of Ropes','1',0.00,0.00,0.00,'2025-10-04 10:37:53'),(40,526,'Hoisting','2025-10-24','2025-10-26',2,'task',525,0,2,'Laying out of ropes','A','Hoisting','1',2.00,0.00,0.00,'2025-10-04 10:37:53'),(41,527,'Governor','2025-10-26','2025-10-28',2,'task',525,0,3,'Compensating','B','Governor','1',3.00,0.00,0.00,'2025-10-04 10:37:53'),(42,528,'Compensating','2025-10-28','2025-10-29',1,'task',525,0,3,'Laying out of ropes','C','Compensating','1',3.00,0.00,0.00,'2025-10-04 10:37:53'),(43,529,'Wiring','2025-10-29','2025-10-31',2,'summary',500,0,0,NULL,NULL,'Wiring','1',0.00,0.00,0.00,'2025-10-04 10:37:53'),(44,530,'Machine Room','2025-10-29','2025-10-30',1,'task',529,0,5,'Wiring','A','Machine Room','1',5.00,0.00,0.00,'2025-10-04 10:37:53'),(45,531,'Hoistway','2025-10-30','2025-10-31',1,'task',529,0,3,'Wiring','B','Hoistway','1',3.00,0.00,0.00,'2025-10-04 10:37:53'),(46,532,'Installation of Pit Ladder / Hoistway Lighting','2025-10-31','2025-11-02',2,'task',500,0,3,'Wiring','C','Installation of Pit Ladder / Hoistway Lighting','1',3.00,0.00,0.00,'2025-10-04 10:37:53'),(47,600,'Testing and Commissioning (Passenger Elevator)','2025-11-02','2025-11-17',15,'summary',NULL,0,0,NULL,NULL,'Testing and Commissioning (Passenger Elevator)','1',0.00,0.00,0.00,'2025-10-04 10:37:53'),(48,601,'Initial testing','2025-11-02','2025-11-05',3,'task',600,0,3,'Testing and Commissioning (Passenger Elevator)','A','Initial testing','1',3.00,0.00,0.00,'2025-10-04 10:37:53'),(49,602,'Slow speed','2025-11-05','2025-11-07',2,'task',600,0,1,'Testing and Commissioning (Passenger Elevator)','B','Slow speed','1',1.00,0.00,0.00,'2025-10-04 10:37:53'),(50,603,'High speed and Mechanical Adjustment','2025-11-07','2025-11-09',2,'task',600,0,2,'Testing and Commissioning (Passenger Elevator)','C','High speed and Mechanical Adjustment','1',2.00,0.00,0.00,'2025-10-04 10:37:53'),(51,604,'Load Test','2025-11-09','2025-11-11',2,'task',600,0,1,'Testing and Commissioning (Passenger Elevator)','D','Load Test','1',1.00,0.00,0.00,'2025-10-04 10:37:53'),(52,605,'Final Adjust','2025-11-11','2025-11-13',2,'task',600,0,1,'Testing and Commissioning (Passenger Elevator)','E','Final Adjust','1',1.00,0.00,0.00,'2025-10-04 10:37:53'),(53,606,'Features Test / Correction of Defects','2025-11-13','2025-11-15',2,'task',600,0,1,'Testing and Commissioning (Passenger Elevator)','F','Features Test / Correction of Defects','1',1.00,0.00,0.00,'2025-10-04 10:37:53'),(54,607,'Final Cleaning / Hand over','2025-11-15','2025-11-17',2,'task',600,0,1,'Testing and Commissioning (Passenger Elevator)','G','Final Cleaning / Hand over','1',1.00,0.00,0.00,'2025-10-04 10:37:53');
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
  `task_done` tinyint(1) DEFAULT '0',
  `task_percent` int DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_265_schedule`
--

LOCK TABLES `project_265_schedule` WRITE;
/*!40000 ALTER TABLE `project_265_schedule` DISABLE KEYS */;
INSERT INTO `project_265_schedule` VALUES (1,301,'Manufacturing and Importation','2025-10-14','2025-12-28',75,'task',300,0,0),(2,400,'Planning For Mobilization And Execution','2025-12-28','2026-01-17',20,'summary',NULL,0,0),(3,300,'Manufacturing and Importation Process (Passenger Elevator)','2025-10-14','2025-12-28',75,'summary',NULL,0,0),(4,401,'Preparation of tools and materials for elevator installation','2025-12-28','2026-01-11',14,'task',400,0,0),(5,402,'Layout of boardup markings','2026-01-11','2026-01-14',3,'task',400,0,0),(6,101,'Pre-Inspection(Checkin of Shaft)','2025-09-29','2025-10-05',6,'task',100,0,0),(7,100,'Preliminaries','2025-09-29','2025-10-14',15,'summary',NULL,0,0),(8,104,'Submission of PO to Factory','2025-10-13','2025-10-14',1,'task',100,0,0),(9,103,'Submission of Drawing and Finishes for Approval','2025-10-08','2025-10-13',5,'task',100,0,0),(10,200,'Structural/Civil Works','2025-10-14','2025-12-28',75,'summary',NULL,0,0),(11,102,'Layout of Drawing','2025-10-05','2025-10-08',3,'task',100,0,0),(12,201,'Shaft Construction','2025-10-14','2025-12-28',75,'task',200,0,0),(13,403,'Partial delivery of tools and boardup materials','2026-01-14','2026-01-17',3,'task',400,0,0),(14,500,'Mechanical Installation (Passenger Elevator)','2026-01-17','2026-03-03',45,'summary',NULL,0,0),(15,502,'Scaffolding Installation','2026-01-18','2026-01-20',2,'task',500,0,7),(16,503,'Hauling Works','2026-01-20','2026-01-22',2,'task',500,0,7),(17,501,'Unloading of elevator equipments','2026-01-17','2026-01-18',1,'task',500,0,0),(18,504,'Template Setting','2026-01-22','2026-01-24',2,'task',500,0,7),(19,505,'Marking and Boring of Holes','2026-01-24','2026-01-25',1,'task',500,0,0),(20,506,'Rail Bracket Installation','2026-01-25','2026-01-27',2,'task',500,0,7),(21,507,'Guide Rail Setting','2026-01-27','2026-02-01',5,'summary',500,0,0),(22,508,'Main/Car','2026-01-27','2026-01-29',2,'task',507,0,5),(23,509,'Counterweight (CWT)','2026-01-29','2026-01-31',2,'task',507,0,3),(24,510,'Gauging','2026-01-31','2026-02-01',1,'task',507,0,3),(25,511,'Landing Door Assembly','2026-02-01','2026-02-07',6,'summary',500,0,0),(26,512,'Sills and Supports','2026-02-01','2026-02-03',2,'task',511,0,2),(27,513,'Jamb and Supports','2026-02-03','2026-02-05',2,'task',511,0,2),(28,514,'Frame and Doors','2026-02-05','2026-02-07',2,'task',511,0,3),(29,515,'M/R Equipment Setting','2026-02-07','2026-02-13',6,'summary',500,0,0),(30,517,'Support Beams','2026-02-09','2026-02-11',2,'task',515,0,5),(31,516,'Traction Machine','2026-02-07','2026-02-09',2,'task',515,0,5),(32,518,'Governor','2026-02-11','2026-02-13',2,'task',515,0,2),(33,519,'Installation of Control Panel','2026-02-13','2026-02-15',2,'task',500,0,3),(34,520,'Car Assembly','2026-02-15','2026-02-18',3,'summary',500,0,0),(35,521,'All Accessories','2026-02-15','2026-02-17',2,'task',520,0,3),(36,522,'Car Piping/Wiring','2026-02-17','2026-02-18',1,'task',520,0,3),(37,523,'Travelling Cable Layout','2026-02-18','2026-02-20',2,'task',500,0,2),(38,524,'Counterweight Assembly','2026-02-20','2026-02-22',2,'task',500,0,2),(39,525,'Laying out of Ropes','2026-02-22','2026-02-27',5,'summary',500,0,0),(40,526,'Hoisting','2026-02-22','2026-02-24',2,'task',525,0,2),(41,527,'Governor','2026-02-24','2026-02-26',2,'task',525,0,3),(42,528,'Compensating','2026-02-26','2026-02-27',1,'task',525,0,3),(43,529,'Wiring','2026-02-27','2026-03-01',2,'summary',500,0,0),(44,530,'Machine Room','2026-02-27','2026-02-28',1,'task',529,0,5),(45,531,'Hoistway','2026-02-28','2026-03-01',1,'task',529,0,3),(46,532,'Installation of Pit Ladder / Hoistway Lighting','2026-03-01','2026-03-03',2,'task',500,0,3),(47,600,'Testing and Commissioning (Passenger Elevator)','2026-03-03','2026-03-18',15,'summary',NULL,0,0),(48,601,'Initial testing','2026-03-03','2026-03-06',3,'task',600,0,3),(49,602,'Slow speed','2026-03-06','2026-03-08',2,'task',600,0,1),(50,603,'High speed and Mechanical Adjustment','2026-03-08','2026-03-10',2,'task',600,0,2),(51,604,'Load Test','2026-03-10','2026-03-12',2,'task',600,0,1),(52,605,'Final Adjust','2026-03-12','2026-03-14',2,'task',600,0,1),(53,606,'Features Test / Correction of Defects','2026-03-14','2026-03-16',2,'task',600,0,1),(54,607,'Final Cleaning / Hand over','2026-03-16','2026-03-18',2,'task',600,0,1);
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
  `task_done` tinyint(1) DEFAULT '0',
  `task_percent` int DEFAULT '0',
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
-- Dumping data for table `project_266_schedule`
--

LOCK TABLES `project_266_schedule` WRITE;
/*!40000 ALTER TABLE `project_266_schedule` DISABLE KEYS */;
INSERT INTO `project_266_schedule` VALUES (1,103,'Submission of Drawing and Finishes for Approval','2025-07-02','2025-07-08',5,'task',100,0,0,NULL,NULL,'Submission of Drawing and Finishes for Approval','1',0.00,0.00,0.00,'2025-10-12 19:30:10'),(2,300,'Manufacturing and Importation Process (Passenger Elevator)','2025-07-09','2025-10-05',75,'summary',NULL,0,0,NULL,NULL,'Manufacturing and Importation Process (Passenger Elevator)','1',0.00,0.00,0.00,'2025-10-12 19:30:10'),(3,200,'Structural/Civil Works','2025-07-09','2025-10-05',75,'summary',NULL,0,0,NULL,NULL,'Structural/Civil Works','1',0.00,0.00,0.00,'2025-10-12 19:30:10'),(4,104,'Submission of PO to Factory','2025-07-08','2025-07-09',1,'task',100,0,0,NULL,NULL,'Submission of PO to Factory','1',0.00,0.00,0.00,'2025-10-12 19:30:10'),(5,101,'Pre-Inspection(Checkin of Shaft)','2025-06-22','2025-06-29',6,'task',100,0,0,NULL,NULL,'Pre-Inspection(Checkin of Shaft)','1',0.00,0.00,0.00,'2025-10-12 19:30:10'),(6,201,'Shaft Construction','2025-07-09','2025-10-05',75,'task',200,0,0,NULL,NULL,'Shaft Construction','1',0.00,0.00,0.00,'2025-10-12 19:30:10'),(7,400,'Planning For Mobilization And Execution','2025-10-05','2025-10-28',20,'summary',NULL,0,0,NULL,NULL,'Planning For Mobilization And Execution','1',0.00,0.00,0.00,'2025-10-12 19:30:10'),(8,100,'Preliminaries','2025-06-22','2025-07-09',15,'summary',NULL,0,0,NULL,NULL,'Preliminaries','1',0.00,0.00,0.00,'2025-10-12 19:30:10'),(9,301,'Manufacturing and Importation','2025-07-09','2025-10-05',75,'task',300,0,0,NULL,NULL,'Manufacturing and Importation','1',0.00,0.00,0.00,'2025-10-12 19:30:10'),(10,102,'Layout of Drawing','2025-06-29','2025-07-02',3,'task',100,0,0,NULL,NULL,'Layout of Drawing','1',0.00,0.00,0.00,'2025-10-12 19:30:10'),(11,401,'Preparation of tools and materials for elevator installation','2025-10-05','2025-10-21',14,'task',400,0,0,NULL,NULL,'Preparation of tools and materials for elevator installation','1',0.00,0.00,0.00,'2025-10-12 19:30:10'),(12,402,'Layout of boardup markings','2025-10-21','2025-10-24',3,'task',400,0,0,NULL,NULL,'Layout of boardup markings','1',0.00,0.00,0.00,'2025-10-12 19:30:10'),(13,403,'Partial delivery of tools and boardup materials','2025-10-24','2025-10-28',3,'task',400,0,0,NULL,NULL,'Partial delivery of tools and boardup materials','1',0.00,0.00,0.00,'2025-10-12 19:30:10'),(14,500,'Mechanical Installation (Passenger Elevator)','2025-10-28','2025-12-19',45,'summary',NULL,0,0,NULL,NULL,'Mechanical Installation (Passenger Elevator)','1',0.00,0.00,0.00,'2025-10-12 19:30:10'),(15,501,'Unloading of elevator equipments','2025-10-28','2025-10-29',1,'task',500,0,0,'General','1','Unloading of elevator equipments','1',0.00,0.00,0.00,'2025-10-12 19:30:10'),(16,502,'Scaffolding Installation','2025-10-29','2025-10-31',2,'task',500,0,7,'General','2','Scaffolding Installation','1',7.00,0.00,0.00,'2025-10-12 19:30:10'),(17,503,'Hauling Works','2025-10-31','2025-11-03',2,'task',500,0,7,'General','3','Hauling Works','1',7.00,0.00,0.00,'2025-10-12 19:30:10'),(18,504,'Template Setting','2025-11-03','2025-11-05',2,'task',500,0,7,'General','4','Template Setting','1',7.00,0.00,0.00,'2025-10-12 19:30:10'),(19,505,'Marking and Boring of Holes','2025-11-05','2025-11-06',1,'task',500,0,0,'General','5','Marking and Boring of Holes','1',0.00,0.00,0.00,'2025-10-12 19:30:10'),(20,506,'Rail Bracket Installation','2025-11-06','2025-11-09',2,'task',500,0,7,'General','6','Rail Bracket Installation','1',7.00,0.00,0.00,'2025-10-12 19:30:10'),(21,507,'Guide Rail Setting','2025-11-09','2025-11-14',5,'summary',500,0,0,NULL,NULL,'Guide Rail Setting','1',0.00,0.00,0.00,'2025-10-12 19:30:10'),(22,508,'Main/Car','2025-11-09','2025-11-11',2,'task',507,0,5,'Guide Rail Setting','A','Main/Car','1',5.00,0.00,0.00,'2025-10-12 19:30:10'),(23,509,'Counterweight (CWT)','2025-11-11','2025-11-13',2,'task',507,0,3,'Guide Rail Setting','B','Counterweight (CWT)','1',3.00,0.00,0.00,'2025-10-12 19:30:10'),(24,510,'Gauging','2025-11-13','2025-11-14',1,'task',507,0,3,'Guide Rail Setting','C','Gauging','1',3.00,0.00,0.00,'2025-10-12 19:30:10'),(25,511,'Landing Door Assembly','2025-11-14','2025-11-21',6,'summary',500,0,0,NULL,NULL,'Landing Door Assembly','1',0.00,0.00,0.00,'2025-10-12 19:30:10'),(26,512,'Sills and Supports','2025-11-14','2025-11-17',2,'task',511,0,2,'Landing Door Assembly','A','Sills and Supports','1',2.00,0.00,0.00,'2025-10-12 19:30:10'),(27,513,'Jamb and Supports','2025-11-17','2025-11-19',2,'task',511,0,2,'Landing Door Assembly','B','Jamb and Supports','1',2.00,0.00,0.00,'2025-10-12 19:30:10'),(28,514,'Frame and Doors','2025-11-19','2025-11-21',2,'task',511,0,3,'Landing Door Assembly','C','Frame and Doors','1',3.00,0.00,0.00,'2025-10-12 19:30:10'),(29,515,'M/R Equipment Setting','2025-11-21','2025-11-28',6,'summary',500,0,0,NULL,NULL,'M/R Equipment Setting','1',0.00,0.00,0.00,'2025-10-12 19:30:10'),(30,516,'Traction Machine','2025-11-21','2025-11-24',2,'task',515,0,5,'M/R Equipment Setting','A','Traction Machine','1',5.00,0.00,0.00,'2025-10-12 19:30:10'),(31,517,'Support Beams','2025-11-24','2025-11-26',2,'task',515,0,5,'M/R Equipment Setting','B','Support Beams','1',5.00,0.00,0.00,'2025-10-12 19:30:10'),(32,518,'Governor','2025-11-26','2025-11-28',2,'task',515,0,2,'M/R Equipment Setting','C','Governor','1',2.00,0.00,0.00,'2025-10-12 19:30:10'),(33,519,'Installation of Control Panel','2025-11-28','2025-12-01',2,'task',500,0,3,'M/R Equipment Setting','D','Installation of Control Panel','1',3.00,0.00,0.00,'2025-10-12 19:30:10'),(34,520,'Car Assembly','2025-12-01','2025-12-04',3,'summary',500,0,0,NULL,NULL,'Car Assembly','1',0.00,0.00,0.00,'2025-10-12 19:30:10'),(35,521,'All Accessories','2025-12-01','2025-12-03',2,'task',520,0,3,'Car Assembly','A','All Accessories','1',3.00,0.00,0.00,'2025-10-12 19:30:10'),(36,522,'Car Piping/Wiring','2025-12-03','2025-12-04',1,'task',520,0,3,'Car Assembly','B','Car Piping/Wiring','1',3.00,0.00,0.00,'2025-10-12 19:30:10'),(37,523,'Travelling Cable Layout','2025-12-04','2025-12-07',2,'task',500,0,2,'Car Assembly','C','Travelling Cable Layout','1',2.00,0.00,0.00,'2025-10-12 19:30:10'),(38,524,'Counterweight Assembly','2025-12-07','2025-12-09',2,'task',500,0,2,'Car Assembly','D','Counterweight Assembly','1',2.00,0.00,0.00,'2025-10-12 19:30:10'),(39,525,'Laying out of Ropes','2025-12-09','2025-12-15',5,'summary',500,0,0,NULL,NULL,'Laying out of Ropes','1',0.00,0.00,0.00,'2025-10-12 19:30:10'),(40,526,'Hoisting','2025-12-09','2025-12-11',2,'task',525,0,2,'Laying out of ropes','A','Hoisting','1',2.00,0.00,0.00,'2025-10-12 19:30:10'),(41,527,'Governor','2025-12-11','2025-12-14',2,'task',525,0,3,'Compensating','B','Governor','1',3.00,0.00,0.00,'2025-10-12 19:30:10'),(42,528,'Compensating','2025-12-14','2025-12-15',1,'task',525,0,3,'Laying out of ropes','C','Compensating','1',3.00,0.00,0.00,'2025-10-12 19:30:10'),(43,529,'Wiring','2025-12-15','2025-12-17',2,'summary',500,0,0,NULL,NULL,'Wiring','1',0.00,0.00,0.00,'2025-10-12 19:30:10'),(44,530,'Machine Room','2025-12-15','2025-12-16',1,'task',529,0,5,'Wiring','A','Machine Room','1',5.00,0.00,0.00,'2025-10-12 19:30:10'),(45,531,'Hoistway','2025-12-16','2025-12-17',1,'task',529,0,3,'Wiring','B','Hoistway','1',3.00,0.00,0.00,'2025-10-12 19:30:10'),(46,532,'Installation of Pit Ladder / Hoistway Lighting','2025-12-17','2025-12-19',2,'task',500,0,3,'Wiring','C','Installation of Pit Ladder / Hoistway Lighting','1',3.00,0.00,0.00,'2025-10-12 19:30:10'),(47,600,'Testing and Commissioning (Passenger Elevator)','2025-12-19','2026-01-06',15,'summary',NULL,0,0,NULL,NULL,'Testing and Commissioning (Passenger Elevator)','1',0.00,0.00,0.00,'2025-10-12 19:30:10'),(48,601,'Initial testing','2025-12-19','2025-12-23',3,'task',600,0,3,'Testing and Commissioning (Passenger Elevator)','A','Initial testing','1',3.00,0.00,0.00,'2025-10-12 19:30:10'),(49,602,'Slow speed','2025-12-23','2025-12-25',2,'task',600,0,1,'Testing and Commissioning (Passenger Elevator)','B','Slow speed','1',1.00,0.00,0.00,'2025-10-12 19:30:10'),(50,603,'High speed and Mechanical Adjustment','2025-12-25','2025-12-28',2,'task',600,0,2,'Testing and Commissioning (Passenger Elevator)','C','High speed and Mechanical Adjustment','1',2.00,0.00,0.00,'2025-10-12 19:30:10'),(51,605,'Final Adjust','2025-12-30','2026-01-01',2,'task',600,0,1,'Testing and Commissioning (Passenger Elevator)','E','Final Adjust','1',1.00,0.00,0.00,'2025-10-12 19:30:10'),(52,606,'Features Test / Correction of Defects','2026-01-01','2026-01-04',2,'task',600,0,1,'Testing and Commissioning (Passenger Elevator)','F','Features Test / Correction of Defects','1',1.00,0.00,0.00,'2025-10-12 19:30:10'),(53,604,'Load Test','2025-12-28','2025-12-30',2,'task',600,0,1,'Testing and Commissioning (Passenger Elevator)','D','Load Test','1',1.00,0.00,0.00,'2025-10-12 19:30:10'),(54,607,'Final Cleaning / Hand over','2026-01-04','2026-01-06',2,'task',600,0,1,'Testing and Commissioning (Passenger Elevator)','G','Final Cleaning / Hand over','1',1.00,0.00,0.00,'2025-10-12 19:30:10');
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
  `task_done` tinyint(1) DEFAULT '0',
  `task_percent` int DEFAULT '0',
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
INSERT INTO `project_267_schedule` VALUES (1,201,'Shaft Construction','2025-09-23','2025-12-07',75,'task',200,0,0,NULL,NULL,'Shaft Construction','1',0.00,0.00,0.00,'2025-10-07 06:25:24'),(2,100,'Preliminaries','2025-09-08','2025-09-23',15,'summary',NULL,0,0,NULL,NULL,'Preliminaries','1',0.00,0.00,0.00,'2025-10-07 06:25:24'),(3,103,'Submission of Drawing and Finishes for Approval','2025-09-17','2025-09-22',5,'task',100,0,0,NULL,NULL,'Submission of Drawing and Finishes for Approval','1',0.00,0.00,0.00,'2025-10-07 06:25:24'),(4,301,'Manufacturing and Importation','2025-09-23','2025-12-07',75,'task',300,0,0,NULL,NULL,'Manufacturing and Importation','1',0.00,0.00,0.00,'2025-10-07 06:25:24'),(5,400,'Planning For Mobilization And Execution','2025-12-07','2025-12-27',20,'summary',NULL,0,0,NULL,NULL,'Planning For Mobilization And Execution','1',0.00,0.00,0.00,'2025-10-07 06:25:24'),(6,104,'Submission of PO to Factory','2025-09-22','2025-09-23',1,'task',100,0,0,NULL,NULL,'Submission of PO to Factory','1',0.00,0.00,0.00,'2025-10-07 06:25:24'),(7,101,'Pre-Inspection(Checkin of Shaft)','2025-09-08','2025-09-14',6,'task',100,0,0,NULL,NULL,'Pre-Inspection(Checkin of Shaft)','1',0.00,0.00,0.00,'2025-10-07 06:25:24'),(8,300,'Manufacturing and Importation Process (Passenger Elevator)','2025-09-23','2025-12-07',75,'summary',NULL,0,0,NULL,NULL,'Manufacturing and Importation Process (Passenger Elevator)','1',0.00,0.00,0.00,'2025-10-07 06:25:24'),(9,102,'Layout of Drawing','2025-09-14','2025-09-17',3,'task',100,0,0,NULL,NULL,'Layout of Drawing','1',0.00,0.00,0.00,'2025-10-07 06:25:24'),(10,200,'Structural/Civil Works','2025-09-23','2025-12-07',75,'summary',NULL,0,0,NULL,NULL,'Structural/Civil Works','1',0.00,0.00,0.00,'2025-10-07 06:25:24'),(11,401,'Preparation of tools and materials for elevator installation','2025-12-07','2025-12-21',14,'task',400,0,0,NULL,NULL,'Preparation of tools and materials for elevator installation','1',0.00,0.00,0.00,'2025-10-07 06:25:24'),(12,402,'Layout of boardup markings','2025-12-21','2025-12-24',3,'task',400,0,0,NULL,NULL,'Layout of boardup markings','1',0.00,0.00,0.00,'2025-10-07 06:25:24'),(13,403,'Partial delivery of tools and boardup materials','2025-12-24','2025-12-27',3,'task',400,0,0,NULL,NULL,'Partial delivery of tools and boardup materials','1',0.00,0.00,0.00,'2025-10-07 06:25:24'),(14,500,'Mechanical Installation (Passenger Elevator)','2025-12-27','2026-02-10',45,'summary',NULL,0,0,NULL,NULL,'Mechanical Installation (Passenger Elevator)','1',0.00,0.00,0.00,'2025-10-07 06:25:24'),(15,501,'Unloading of elevator equipments','2025-12-27','2025-12-28',1,'task',500,0,0,'General','1','Unloading of elevator equipments','1',0.00,0.00,0.00,'2025-10-07 06:25:24'),(16,502,'Scaffolding Installation','2025-12-28','2025-12-30',2,'task',500,0,7,'General','2','Scaffolding Installation','1',7.00,0.00,0.00,'2025-10-07 06:25:24'),(17,503,'Hauling Works','2025-12-30','2026-01-01',2,'task',500,0,7,'General','3','Hauling Works','1',7.00,0.00,0.00,'2025-10-07 06:25:24'),(18,504,'Template Setting','2026-01-01','2026-01-03',2,'task',500,0,7,'General','4','Template Setting','1',7.00,0.00,0.00,'2025-10-07 06:25:24'),(19,505,'Marking and Boring of Holes','2026-01-03','2026-01-04',1,'task',500,0,0,'General','5','Marking and Boring of Holes','1',0.00,0.00,0.00,'2025-10-07 06:25:24'),(20,506,'Rail Bracket Installation','2026-01-04','2026-01-06',2,'task',500,0,7,'General','6','Rail Bracket Installation','1',7.00,0.00,0.00,'2025-10-07 06:25:24'),(21,507,'Guide Rail Setting','2026-01-06','2026-01-11',5,'summary',500,0,0,NULL,NULL,'Guide Rail Setting','1',0.00,0.00,0.00,'2025-10-07 06:25:24'),(22,508,'Main/Car','2026-01-06','2026-01-08',2,'task',507,0,5,'Guide Rail Setting','A','Main/Car','1',5.00,0.00,0.00,'2025-10-07 06:25:24'),(23,509,'Counterweight (CWT)','2026-01-08','2026-01-10',2,'task',507,0,3,'Guide Rail Setting','B','Counterweight (CWT)','1',3.00,0.00,0.00,'2025-10-07 06:25:24'),(24,510,'Gauging','2026-01-10','2026-01-11',1,'task',507,0,3,'Guide Rail Setting','C','Gauging','1',3.00,0.00,0.00,'2025-10-07 06:25:24'),(25,511,'Landing Door Assembly','2026-01-11','2026-01-17',6,'summary',500,0,0,NULL,NULL,'Landing Door Assembly','1',0.00,0.00,0.00,'2025-10-07 06:25:24'),(26,512,'Sills and Supports','2026-01-11','2026-01-13',2,'task',511,0,2,'Landing Door Assembly','A','Sills and Supports','1',2.00,0.00,0.00,'2025-10-07 06:25:24'),(27,513,'Jamb and Supports','2026-01-13','2026-01-15',2,'task',511,0,2,'Landing Door Assembly','B','Jamb and Supports','1',2.00,0.00,0.00,'2025-10-07 06:25:24'),(28,514,'Frame and Doors','2026-01-15','2026-01-17',2,'task',511,0,3,'Landing Door Assembly','C','Frame and Doors','1',3.00,0.00,0.00,'2025-10-07 06:25:24'),(29,515,'M/R Equipment Setting','2026-01-17','2026-01-23',6,'summary',500,0,0,NULL,NULL,'M/R Equipment Setting','1',0.00,0.00,0.00,'2025-10-07 06:25:24'),(30,516,'Traction Machine','2026-01-17','2026-01-19',2,'task',515,0,5,'M/R Equipment Setting','A','Traction Machine','1',5.00,0.00,0.00,'2025-10-07 06:25:24'),(31,517,'Support Beams','2026-01-19','2026-01-21',2,'task',515,0,5,'M/R Equipment Setting','B','Support Beams','1',5.00,0.00,0.00,'2025-10-07 06:25:24'),(32,518,'Governor','2026-01-21','2026-01-23',2,'task',515,0,2,'M/R Equipment Setting','C','Governor','1',2.00,0.00,0.00,'2025-10-07 06:25:24'),(33,519,'Installation of Control Panel','2026-01-23','2026-01-25',2,'task',500,0,3,'M/R Equipment Setting','D','Installation of Control Panel','1',3.00,0.00,0.00,'2025-10-07 06:25:24'),(34,520,'Car Assembly','2026-01-25','2026-01-28',3,'summary',500,0,0,NULL,NULL,'Car Assembly','1',0.00,0.00,0.00,'2025-10-07 06:25:24'),(35,521,'All Accessories','2026-01-25','2026-01-27',2,'task',520,0,3,'Car Assembly','A','All Accessories','1',3.00,0.00,0.00,'2025-10-07 06:25:24'),(36,522,'Car Piping/Wiring','2026-01-27','2026-01-28',1,'task',520,0,3,'Car Assembly','B','Car Piping/Wiring','1',3.00,0.00,0.00,'2025-10-07 06:25:24'),(37,523,'Travelling Cable Layout','2026-01-28','2026-01-30',2,'task',500,0,2,'Car Assembly','C','Travelling Cable Layout','1',2.00,0.00,0.00,'2025-10-07 06:25:24'),(38,524,'Counterweight Assembly','2026-01-30','2026-02-01',2,'task',500,0,2,'Car Assembly','D','Counterweight Assembly','1',2.00,0.00,0.00,'2025-10-07 06:25:24'),(39,525,'Laying out of Ropes','2026-02-01','2026-02-06',5,'summary',500,0,0,NULL,NULL,'Laying out of Ropes','1',0.00,0.00,0.00,'2025-10-07 06:25:24'),(40,526,'Hoisting','2026-02-01','2026-02-03',2,'task',525,0,2,'Laying out of ropes','A','Hoisting','1',2.00,0.00,0.00,'2025-10-07 06:25:24'),(41,527,'Governor','2026-02-03','2026-02-05',2,'task',525,0,3,'Compensating','B','Governor','1',3.00,0.00,0.00,'2025-10-07 06:25:24'),(42,528,'Compensating','2026-02-05','2026-02-06',1,'task',525,0,3,'Laying out of ropes','C','Compensating','1',3.00,0.00,0.00,'2025-10-07 06:25:24'),(43,529,'Wiring','2026-02-06','2026-02-08',2,'summary',500,0,0,NULL,NULL,'Wiring','1',0.00,0.00,0.00,'2025-10-07 06:25:24'),(44,530,'Machine Room','2026-02-06','2026-02-07',1,'task',529,0,5,'Wiring','A','Machine Room','1',5.00,0.00,0.00,'2025-10-07 06:25:24'),(45,531,'Hoistway','2026-02-07','2026-02-08',1,'task',529,0,3,'Wiring','B','Hoistway','1',3.00,0.00,0.00,'2025-10-07 06:25:24'),(46,532,'Installation of Pit Ladder / Hoistway Lighting','2026-02-08','2026-02-10',2,'task',500,0,3,'Wiring','C','Installation of Pit Ladder / Hoistway Lighting','1',3.00,0.00,0.00,'2025-10-07 06:25:24'),(47,600,'Testing and Commissioning (Passenger Elevator)','2026-02-10','2026-02-25',15,'summary',NULL,0,0,NULL,NULL,'Testing and Commissioning (Passenger Elevator)','1',0.00,0.00,0.00,'2025-10-07 06:25:24'),(48,601,'Initial testing','2026-02-10','2026-02-13',3,'task',600,0,3,'Testing and Commissioning (Passenger Elevator)','A','Initial testing','1',3.00,0.00,0.00,'2025-10-07 06:25:24'),(49,602,'Slow speed','2026-02-13','2026-02-15',2,'task',600,0,1,'Testing and Commissioning (Passenger Elevator)','B','Slow speed','1',1.00,0.00,0.00,'2025-10-07 06:25:24'),(50,603,'High speed and Mechanical Adjustment','2026-02-15','2026-02-17',2,'task',600,0,2,'Testing and Commissioning (Passenger Elevator)','C','High speed and Mechanical Adjustment','1',2.00,0.00,0.00,'2025-10-07 06:25:24'),(51,604,'Load Test','2026-02-17','2026-02-19',2,'task',600,0,1,'Testing and Commissioning (Passenger Elevator)','D','Load Test','1',1.00,0.00,0.00,'2025-10-07 06:25:24'),(52,605,'Final Adjust','2026-02-19','2026-02-21',2,'task',600,0,1,'Testing and Commissioning (Passenger Elevator)','E','Final Adjust','1',1.00,0.00,0.00,'2025-10-07 06:25:24'),(53,606,'Features Test / Correction of Defects','2026-02-21','2026-02-23',2,'task',600,0,1,'Testing and Commissioning (Passenger Elevator)','F','Features Test / Correction of Defects','1',1.00,0.00,0.00,'2025-10-07 06:25:24'),(54,607,'Final Cleaning / Hand over','2026-02-23','2026-02-25',2,'task',600,0,1,'Testing and Commissioning (Passenger Elevator)','G','Final Cleaning / Hand over','1',1.00,0.00,0.00,'2025-10-07 06:25:24');
/*!40000 ALTER TABLE `project_267_schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_294_schedule`
--

DROP TABLE IF EXISTS `project_294_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_294_schedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `task_id` int DEFAULT NULL,
  `task_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_start` date DEFAULT NULL,
  `task_end` date DEFAULT NULL,
  `task_duration` int DEFAULT NULL,
  `task_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_parent` int DEFAULT NULL,
  `task_done` tinyint(1) DEFAULT '0',
  `task_percent` int DEFAULT '0',
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
-- Dumping data for table `project_294_schedule`
--

LOCK TABLES `project_294_schedule` WRITE;
/*!40000 ALTER TABLE `project_294_schedule` DISABLE KEYS */;
INSERT INTO `project_294_schedule` VALUES (1,100,'Preliminaries','2025-04-22','2025-05-07',15,'summary',NULL,1,0,NULL,NULL,'Preliminaries','1',0.00,100.00,0.00,'2025-10-09 02:42:51'),(2,101,'Pre-Inspection(Checkin of Shaft)','2025-04-22','2025-04-28',6,'task',100,1,0,NULL,NULL,'Pre-Inspection(Checkin of Shaft)','1',0.00,100.00,0.00,'2025-10-09 02:42:51'),(3,102,'Layout of Drawing','2025-04-28','2025-05-01',3,'task',100,1,0,NULL,NULL,'Layout of Drawing','1',0.00,100.00,0.00,'2025-10-09 02:42:51'),(4,104,'Submission of PO to Factory','2025-05-06','2025-05-07',1,'task',100,1,0,NULL,NULL,'Submission of PO to Factory','1',0.00,100.00,0.00,'2025-10-09 02:42:51'),(5,201,'Shaft Construction','2025-05-07','2025-07-21',75,'task',200,1,0,NULL,NULL,'Shaft Construction','1',0.00,100.00,0.00,'2025-10-09 02:42:51'),(6,401,'Preparation of tools and materials for elevator installation','2025-07-21','2025-08-04',14,'task',400,1,0,NULL,NULL,'Preparation of tools and materials for elevator installation','1',0.00,100.00,0.00,'2025-10-09 02:42:51'),(7,301,'Manufacturing and Importation','2025-05-07','2025-07-21',75,'task',300,1,0,NULL,NULL,'Manufacturing and Importation','1',0.00,100.00,0.00,'2025-10-09 02:42:51'),(8,300,'Manufacturing and Importation Process (Passenger Elevator)','2025-05-07','2025-07-21',75,'summary',NULL,1,0,NULL,NULL,'Manufacturing and Importation Process (Passenger Elevator)','1',0.00,100.00,0.00,'2025-10-09 02:42:51'),(9,103,'Submission of Drawing and Finishes for Approval','2025-05-01','2025-05-06',5,'task',100,1,0,NULL,NULL,'Submission of Drawing and Finishes for Approval','1',0.00,100.00,0.00,'2025-10-09 02:42:51'),(10,200,'Structural/Civil Works','2025-05-07','2025-07-21',75,'summary',NULL,1,0,NULL,NULL,'Structural/Civil Works','1',0.00,100.00,0.00,'2025-10-09 02:42:51'),(11,402,'Layout of boardup markings','2025-08-04','2025-08-07',3,'task',400,1,0,NULL,NULL,'Layout of boardup markings','1',0.00,100.00,0.00,'2025-10-09 02:42:51'),(12,400,'Planning For Mobilization And Execution','2025-07-21','2025-08-10',20,'summary',NULL,1,0,NULL,NULL,'Planning For Mobilization And Execution','1',0.00,100.00,0.00,'2025-10-09 02:42:51'),(13,403,'Partial delivery of tools and boardup materials','2025-08-07','2025-08-10',3,'task',400,1,0,NULL,NULL,'Partial delivery of tools and boardup materials','1',0.00,100.00,0.00,'2025-10-09 02:42:52'),(14,501,'Unloading of elevator equipments','2025-08-10','2025-08-11',1,'task',500,1,0,'General','1','Unloading of elevator equipments','1',0.00,100.00,0.00,'2025-10-09 02:42:52'),(15,502,'Scaffolding Installation','2025-08-11','2025-08-13',2,'task',500,1,7,'General','2','Scaffolding Installation','1',7.00,100.00,0.00,'2025-10-09 02:42:52'),(16,503,'Hauling Works','2025-08-13','2025-08-15',2,'task',500,1,7,'General','3','Hauling Works','1',7.00,100.00,0.00,'2025-10-09 02:42:52'),(17,504,'Template Setting','2025-08-15','2025-08-17',2,'task',500,1,7,'General','4','Template Setting','1',7.00,100.00,0.00,'2025-10-09 02:42:52'),(18,506,'Rail Bracket Installation','2025-08-18','2025-08-20',2,'task',500,1,7,'General','6','Rail Bracket Installation','1',7.00,100.00,0.00,'2025-10-09 02:42:52'),(19,505,'Marking and Boring of Holes','2025-08-17','2025-08-18',1,'task',500,1,0,'General','5','Marking and Boring of Holes','1',0.00,100.00,0.00,'2025-10-09 02:42:52'),(20,500,'Mechanical Installation (Passenger Elevator)','2025-08-10','2025-09-24',45,'summary',NULL,1,0,NULL,NULL,'Mechanical Installation (Passenger Elevator)','1',0.00,100.00,0.00,'2025-10-09 02:42:52'),(21,507,'Guide Rail Setting','2025-08-20','2025-08-25',5,'summary',500,1,0,NULL,NULL,'Guide Rail Setting','1',0.00,100.00,0.00,'2025-10-09 02:42:52'),(22,508,'Main/Car','2025-08-20','2025-08-22',2,'task',507,1,5,'Guide Rail Setting','A','Main/Car','1',5.00,100.00,0.00,'2025-10-09 02:42:52'),(23,509,'Counterweight (CWT)','2025-08-22','2025-08-24',2,'task',507,1,3,'Guide Rail Setting','B','Counterweight (CWT)','1',3.00,100.00,0.00,'2025-10-09 02:42:52'),(24,510,'Gauging','2025-08-24','2025-08-25',1,'task',507,1,3,'Guide Rail Setting','C','Gauging','1',3.00,100.00,0.00,'2025-10-09 02:42:52'),(25,511,'Landing Door Assembly','2025-08-25','2025-08-31',6,'summary',500,1,0,NULL,NULL,'Landing Door Assembly','1',0.00,100.00,0.00,'2025-10-09 02:42:52'),(26,512,'Sills and Supports','2025-08-25','2025-08-27',2,'task',511,1,2,'Landing Door Assembly','A','Sills and Supports','1',2.00,100.00,0.00,'2025-10-09 02:42:52'),(27,513,'Jamb and Supports','2025-08-27','2025-08-29',2,'task',511,1,2,'Landing Door Assembly','B','Jamb and Supports','1',2.00,100.00,0.00,'2025-10-09 02:42:52'),(28,514,'Frame and Doors','2025-08-29','2025-08-31',2,'task',511,1,3,'Landing Door Assembly','C','Frame and Doors','1',3.00,100.00,0.00,'2025-10-09 02:42:52'),(29,515,'M/R Equipment Setting','2025-08-31','2025-09-06',6,'summary',500,1,0,NULL,NULL,'M/R Equipment Setting','1',0.00,100.00,0.00,'2025-10-09 02:42:52'),(30,516,'Traction Machine','2025-08-31','2025-09-02',2,'task',515,1,5,'M/R Equipment Setting','A','Traction Machine','1',5.00,100.00,0.00,'2025-10-09 02:42:52'),(31,517,'Support Beams','2025-09-02','2025-09-04',2,'task',515,1,5,'M/R Equipment Setting','B','Support Beams','1',5.00,100.00,0.00,'2025-10-09 02:42:52'),(32,518,'Governor','2025-09-04','2025-09-06',2,'task',515,1,2,'M/R Equipment Setting','C','Governor','1',2.00,100.00,0.00,'2025-10-09 02:42:52'),(33,519,'Installation of Control Panel','2025-09-06','2025-09-08',2,'task',500,1,3,'M/R Equipment Setting','D','Installation of Control Panel','1',3.00,100.00,0.00,'2025-10-09 02:42:52'),(34,520,'Car Assembly','2025-09-08','2025-09-11',3,'summary',500,1,0,NULL,NULL,'Car Assembly','1',0.00,100.00,0.00,'2025-10-09 02:42:52'),(35,521,'All Accessories','2025-09-08','2025-09-10',2,'task',520,1,3,'Car Assembly','A','All Accessories','1',3.00,100.00,0.00,'2025-10-09 02:42:52'),(36,522,'Car Piping/Wiring','2025-09-10','2025-09-11',1,'task',520,1,3,'Car Assembly','B','Car Piping/Wiring','1',3.00,100.00,0.00,'2025-10-09 02:42:52'),(37,523,'Travelling Cable Layout','2025-09-11','2025-09-13',2,'task',500,1,2,'Car Assembly','C','Travelling Cable Layout','1',2.00,100.00,0.00,'2025-10-09 02:42:52'),(38,524,'Counterweight Assembly','2025-09-13','2025-09-15',2,'task',500,1,2,'Car Assembly','D','Counterweight Assembly','1',2.00,100.00,0.00,'2025-10-09 02:42:52'),(39,525,'Laying out of Ropes','2025-09-15','2025-09-20',5,'summary',500,1,0,NULL,NULL,'Laying out of Ropes','1',0.00,100.00,0.00,'2025-10-09 02:42:52'),(40,526,'Hoisting','2025-09-15','2025-09-17',2,'task',525,1,2,'Laying out of ropes','A','Hoisting','1',2.00,100.00,0.00,'2025-10-09 02:42:52'),(41,527,'Governor','2025-09-17','2025-09-19',2,'task',525,1,3,'Compensating','B','Governor','1',3.00,100.00,0.00,'2025-10-09 02:42:52'),(42,528,'Compensating','2025-09-19','2025-09-20',1,'task',525,1,3,'Laying out of ropes','C','Compensating','1',3.00,100.00,0.00,'2025-10-09 02:42:52'),(43,529,'Wiring','2025-09-20','2025-09-22',2,'summary',500,1,0,NULL,NULL,'Wiring','1',0.00,100.00,0.00,'2025-10-09 02:42:52'),(44,530,'Machine Room','2025-09-20','2025-09-21',1,'task',529,1,5,'Wiring','A','Machine Room','1',5.00,100.00,0.00,'2025-10-09 02:42:52'),(45,531,'Hoistway','2025-09-21','2025-09-22',1,'task',529,1,3,'Wiring','B','Hoistway','1',3.00,100.00,0.00,'2025-10-09 02:42:52'),(46,532,'Installation of Pit Ladder / Hoistway Lighting','2025-09-22','2025-09-24',2,'task',500,1,3,'Wiring','C','Installation of Pit Ladder / Hoistway Lighting','1',3.00,100.00,0.00,'2025-10-09 02:42:52'),(47,600,'Testing and Commissioning (Passenger Elevator)','2025-09-24','2025-10-09',15,'summary',NULL,1,0,NULL,NULL,'Testing and Commissioning (Passenger Elevator)','1',0.00,100.00,0.00,'2025-10-09 02:42:52'),(48,601,'Initial testing','2025-09-24','2025-09-27',3,'task',600,1,3,'Testing and Commissioning (Passenger Elevator)','A','Initial testing','1',3.00,100.00,0.00,'2025-10-09 02:42:52'),(49,603,'High speed and Mechanical Adjustment','2025-09-29','2025-10-01',2,'task',600,1,2,'Testing and Commissioning (Passenger Elevator)','C','High speed and Mechanical Adjustment','1',2.00,100.00,0.00,'2025-10-09 02:42:52'),(50,602,'Slow speed','2025-09-27','2025-09-29',2,'task',600,1,1,'Testing and Commissioning (Passenger Elevator)','B','Slow speed','1',1.00,100.00,0.00,'2025-10-09 02:42:52'),(51,604,'Load Test','2025-10-01','2025-10-03',2,'task',600,1,1,'Testing and Commissioning (Passenger Elevator)','D','Load Test','1',1.00,100.00,0.00,'2025-10-09 02:42:52'),(52,605,'Final Adjust','2025-10-03','2025-10-05',2,'task',600,1,1,'Testing and Commissioning (Passenger Elevator)','E','Final Adjust','1',1.00,100.00,0.00,'2025-10-09 02:42:52'),(53,606,'Features Test / Correction of Defects','2025-10-05','2025-10-07',2,'task',600,1,1,'Testing and Commissioning (Passenger Elevator)','F','Features Test / Correction of Defects','1',1.00,100.00,0.00,'2025-10-09 02:42:52'),(54,607,'Final Cleaning / Hand over','2025-10-07','2025-10-09',2,'task',600,1,1,'Testing and Commissioning (Passenger Elevator)','G','Final Cleaning / Hand over','1',1.00,100.00,0.00,'2025-10-09 02:42:52');
/*!40000 ALTER TABLE `project_294_schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_297_schedule`
--

DROP TABLE IF EXISTS `project_297_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_297_schedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `task_id` int DEFAULT NULL,
  `task_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_start` date DEFAULT NULL,
  `task_end` date DEFAULT NULL,
  `task_duration` int DEFAULT NULL,
  `task_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_parent` int DEFAULT NULL,
  `task_done` tinyint(1) DEFAULT '0',
  `task_percent` int DEFAULT '0',
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
-- Dumping data for table `project_297_schedule`
--

LOCK TABLES `project_297_schedule` WRITE;
/*!40000 ALTER TABLE `project_297_schedule` DISABLE KEYS */;
INSERT INTO `project_297_schedule` VALUES (1,102,'Layout of Drawing','2025-04-28','2025-05-01',3,'task',100,0,0,NULL,NULL,'Layout of Drawing','1',0.00,0.00,0.00,'2025-10-09 06:20:31'),(2,101,'Pre-Inspection(Checkin of Shaft)','2025-04-22','2025-04-28',6,'task',100,0,0,NULL,NULL,'Pre-Inspection(Checkin of Shaft)','1',0.00,0.00,0.00,'2025-10-09 06:20:31'),(3,103,'Submission of Drawing and Finishes for Approval','2025-05-01','2025-05-06',5,'task',100,0,0,NULL,NULL,'Submission of Drawing and Finishes for Approval','1',0.00,0.00,0.00,'2025-10-09 06:20:31'),(4,100,'Preliminaries','2025-04-22','2025-05-07',15,'summary',NULL,0,0,NULL,NULL,'Preliminaries','1',0.00,0.00,0.00,'2025-10-09 06:20:31'),(5,200,'Structural/Civil Works','2025-05-07','2025-07-21',75,'summary',NULL,0,0,NULL,NULL,'Structural/Civil Works','1',0.00,0.00,0.00,'2025-10-09 06:20:31'),(6,300,'Manufacturing and Importation Process (Passenger Elevator)','2025-05-07','2025-07-21',75,'summary',NULL,0,0,NULL,NULL,'Manufacturing and Importation Process (Passenger Elevator)','1',0.00,0.00,0.00,'2025-10-09 06:20:31'),(7,301,'Manufacturing and Importation','2025-05-07','2025-07-21',75,'task',300,0,0,NULL,NULL,'Manufacturing and Importation','1',0.00,0.00,0.00,'2025-10-09 06:20:31'),(8,401,'Preparation of tools and materials for elevator installation','2025-07-21','2025-08-04',14,'task',400,0,0,NULL,NULL,'Preparation of tools and materials for elevator installation','1',0.00,0.00,0.00,'2025-10-09 06:20:31'),(9,104,'Submission of PO to Factory','2025-05-06','2025-05-07',1,'task',100,0,0,NULL,NULL,'Submission of PO to Factory','1',0.00,0.00,0.00,'2025-10-09 06:20:31'),(10,402,'Layout of boardup markings','2025-08-04','2025-08-07',3,'task',400,0,0,NULL,NULL,'Layout of boardup markings','1',0.00,0.00,0.00,'2025-10-09 06:20:31'),(11,201,'Shaft Construction','2025-05-07','2025-07-21',75,'task',200,0,0,NULL,NULL,'Shaft Construction','1',0.00,0.00,0.00,'2025-10-09 06:20:31'),(12,400,'Planning For Mobilization And Execution','2025-07-21','2025-08-10',20,'summary',NULL,0,0,NULL,NULL,'Planning For Mobilization And Execution','1',0.00,0.00,0.00,'2025-10-09 06:20:31'),(13,403,'Partial delivery of tools and boardup materials','2025-08-07','2025-08-10',3,'task',400,0,0,NULL,NULL,'Partial delivery of tools and boardup materials','1',0.00,0.00,0.00,'2025-10-09 06:20:31'),(14,500,'Mechanical Installation (Passenger Elevator)','2025-08-10','2025-09-24',45,'summary',NULL,0,0,NULL,NULL,'Mechanical Installation (Passenger Elevator)','1',0.00,0.00,0.00,'2025-10-09 06:20:31'),(15,501,'Unloading of elevator equipments','2025-08-10','2025-08-11',1,'task',500,0,0,'General','1','Unloading of elevator equipments','1',0.00,0.00,0.00,'2025-10-09 06:20:31'),(16,503,'Hauling Works','2025-08-13','2025-08-15',2,'task',500,0,7,'General','3','Hauling Works','1',7.00,0.00,0.00,'2025-10-09 06:20:31'),(17,504,'Template Setting','2025-08-15','2025-08-17',2,'task',500,0,7,'General','4','Template Setting','1',7.00,0.00,0.00,'2025-10-09 06:20:31'),(18,505,'Marking and Boring of Holes','2025-08-17','2025-08-18',1,'task',500,0,0,'General','5','Marking and Boring of Holes','1',0.00,0.00,0.00,'2025-10-09 06:20:31'),(19,502,'Scaffolding Installation','2025-08-11','2025-08-13',2,'task',500,0,7,'General','2','Scaffolding Installation','1',7.00,0.00,0.00,'2025-10-09 06:20:31'),(20,506,'Rail Bracket Installation','2025-08-18','2025-08-20',2,'task',500,0,7,'General','6','Rail Bracket Installation','1',7.00,0.00,0.00,'2025-10-09 06:20:31'),(21,507,'Guide Rail Setting','2025-08-20','2025-08-25',5,'summary',500,0,0,NULL,NULL,'Guide Rail Setting','1',0.00,0.00,0.00,'2025-10-09 06:20:31'),(22,508,'Main/Car','2025-08-20','2025-08-22',2,'task',507,0,5,'Guide Rail Setting','A','Main/Car','1',5.00,0.00,0.00,'2025-10-09 06:20:32'),(23,510,'Gauging','2025-08-24','2025-08-25',1,'task',507,0,3,'Guide Rail Setting','C','Gauging','1',3.00,0.00,0.00,'2025-10-09 06:20:32'),(24,511,'Landing Door Assembly','2025-08-25','2025-08-31',6,'summary',500,0,0,NULL,NULL,'Landing Door Assembly','1',0.00,0.00,0.00,'2025-10-09 06:20:32'),(25,512,'Sills and Supports','2025-08-25','2025-08-27',2,'task',511,0,2,'Landing Door Assembly','A','Sills and Supports','1',2.00,0.00,0.00,'2025-10-09 06:20:32'),(26,513,'Jamb and Supports','2025-08-27','2025-08-29',2,'task',511,0,2,'Landing Door Assembly','B','Jamb and Supports','1',2.00,0.00,0.00,'2025-10-09 06:20:32'),(27,509,'Counterweight (CWT)','2025-08-22','2025-08-24',2,'task',507,0,3,'Guide Rail Setting','B','Counterweight (CWT)','1',3.00,0.00,0.00,'2025-10-09 06:20:32'),(28,514,'Frame and Doors','2025-08-29','2025-08-31',2,'task',511,0,3,'Landing Door Assembly','C','Frame and Doors','1',3.00,0.00,0.00,'2025-10-09 06:20:32'),(29,515,'M/R Equipment Setting','2025-08-31','2025-09-06',6,'summary',500,0,0,NULL,NULL,'M/R Equipment Setting','1',0.00,0.00,0.00,'2025-10-09 06:20:32'),(30,516,'Traction Machine','2025-08-31','2025-09-02',2,'task',515,0,5,'M/R Equipment Setting','A','Traction Machine','1',5.00,0.00,0.00,'2025-10-09 06:20:32'),(31,517,'Support Beams','2025-09-02','2025-09-04',2,'task',515,0,5,'M/R Equipment Setting','B','Support Beams','1',5.00,0.00,0.00,'2025-10-09 06:20:32'),(32,518,'Governor','2025-09-04','2025-09-06',2,'task',515,0,2,'M/R Equipment Setting','C','Governor','1',2.00,0.00,0.00,'2025-10-09 06:20:32'),(33,519,'Installation of Control Panel','2025-09-06','2025-09-08',2,'task',500,0,3,'M/R Equipment Setting','D','Installation of Control Panel','1',3.00,0.00,0.00,'2025-10-09 06:20:32'),(34,520,'Car Assembly','2025-09-08','2025-09-11',3,'summary',500,0,0,NULL,NULL,'Car Assembly','1',0.00,0.00,0.00,'2025-10-09 06:20:32'),(35,521,'All Accessories','2025-09-08','2025-09-10',2,'task',520,0,3,'Car Assembly','A','All Accessories','1',3.00,0.00,0.00,'2025-10-09 06:20:32'),(36,522,'Car Piping/Wiring','2025-09-10','2025-09-11',1,'task',520,0,3,'Car Assembly','B','Car Piping/Wiring','1',3.00,0.00,0.00,'2025-10-09 06:20:32'),(37,523,'Travelling Cable Layout','2025-09-11','2025-09-13',2,'task',500,0,2,'Car Assembly','C','Travelling Cable Layout','1',2.00,0.00,0.00,'2025-10-09 06:20:32'),(38,524,'Counterweight Assembly','2025-09-13','2025-09-15',2,'task',500,0,2,'Car Assembly','D','Counterweight Assembly','1',2.00,0.00,0.00,'2025-10-09 06:20:32'),(39,525,'Laying out of Ropes','2025-09-15','2025-09-20',5,'summary',500,0,0,NULL,NULL,'Laying out of Ropes','1',0.00,0.00,0.00,'2025-10-09 06:20:32'),(40,526,'Hoisting','2025-09-15','2025-09-17',2,'task',525,0,2,'Laying out of ropes','A','Hoisting','1',2.00,0.00,0.00,'2025-10-09 06:20:32'),(41,527,'Governor','2025-09-17','2025-09-19',2,'task',525,0,3,'Compensating','B','Governor','1',3.00,0.00,0.00,'2025-10-09 06:20:32'),(42,528,'Compensating','2025-09-19','2025-09-20',1,'task',525,0,3,'Laying out of ropes','C','Compensating','1',3.00,0.00,0.00,'2025-10-09 06:20:32'),(43,529,'Wiring','2025-09-20','2025-09-22',2,'summary',500,0,0,NULL,NULL,'Wiring','1',0.00,0.00,0.00,'2025-10-09 06:20:32'),(44,530,'Machine Room','2025-09-20','2025-09-21',1,'task',529,0,5,'Wiring','A','Machine Room','1',5.00,0.00,0.00,'2025-10-09 06:20:32'),(45,531,'Hoistway','2025-09-21','2025-09-22',1,'task',529,0,3,'Wiring','B','Hoistway','1',3.00,0.00,0.00,'2025-10-09 06:20:32'),(46,532,'Installation of Pit Ladder / Hoistway Lighting','2025-09-22','2025-09-24',2,'task',500,0,3,'Wiring','C','Installation of Pit Ladder / Hoistway Lighting','1',3.00,0.00,0.00,'2025-10-09 06:20:32'),(47,600,'Testing and Commissioning (Passenger Elevator)','2025-09-24','2025-10-09',15,'summary',NULL,0,0,NULL,NULL,'Testing and Commissioning (Passenger Elevator)','1',0.00,0.00,0.00,'2025-10-09 06:20:32'),(48,601,'Initial testing','2025-09-24','2025-09-27',3,'task',600,0,3,'Testing and Commissioning (Passenger Elevator)','A','Initial testing','1',3.00,0.00,0.00,'2025-10-09 06:20:32'),(49,602,'Slow speed','2025-09-27','2025-09-29',2,'task',600,0,1,'Testing and Commissioning (Passenger Elevator)','B','Slow speed','1',1.00,0.00,0.00,'2025-10-09 06:20:32'),(50,603,'High speed and Mechanical Adjustment','2025-09-29','2025-10-01',2,'task',600,0,2,'Testing and Commissioning (Passenger Elevator)','C','High speed and Mechanical Adjustment','1',2.00,0.00,0.00,'2025-10-09 06:20:32'),(51,604,'Load Test','2025-10-01','2025-10-03',2,'task',600,0,1,'Testing and Commissioning (Passenger Elevator)','D','Load Test','1',1.00,0.00,0.00,'2025-10-09 06:20:32'),(52,605,'Final Adjust','2025-10-03','2025-10-05',2,'task',600,0,1,'Testing and Commissioning (Passenger Elevator)','E','Final Adjust','1',1.00,0.00,0.00,'2025-10-09 06:20:32'),(53,606,'Features Test / Correction of Defects','2025-10-05','2025-10-07',2,'task',600,0,1,'Testing and Commissioning (Passenger Elevator)','F','Features Test / Correction of Defects','1',1.00,0.00,0.00,'2025-10-09 06:20:32'),(54,607,'Final Cleaning / Hand over','2025-10-07','2025-10-09',2,'task',600,0,1,'Testing and Commissioning (Passenger Elevator)','G','Final Cleaning / Hand over','1',1.00,0.00,0.00,'2025-10-09 06:20:32');
/*!40000 ALTER TABLE `project_297_schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_299_schedule`
--

DROP TABLE IF EXISTS `project_299_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_299_schedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `task_id` int DEFAULT NULL,
  `task_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_start` date DEFAULT NULL,
  `task_end` date DEFAULT NULL,
  `task_duration` int DEFAULT NULL,
  `task_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_parent` int DEFAULT NULL,
  `task_done` tinyint(1) DEFAULT '0',
  `task_percent` int DEFAULT '0',
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
-- Dumping data for table `project_299_schedule`
--

LOCK TABLES `project_299_schedule` WRITE;
/*!40000 ALTER TABLE `project_299_schedule` DISABLE KEYS */;
INSERT INTO `project_299_schedule` VALUES (1,200,'Structural/Civil Works','2025-07-09','2025-10-05',75,'summary',NULL,0,0,NULL,NULL,'Structural/Civil Works','1',0.00,0.00,0.00,'2025-10-13 17:17:42'),(2,101,'Pre-Inspection(Checkin of Shaft)','2025-06-22','2025-06-29',6,'task',100,0,0,NULL,NULL,'Pre-Inspection(Checkin of Shaft)','1',0.00,0.00,0.00,'2025-10-13 17:17:42'),(3,102,'Layout of Drawing','2025-06-29','2025-07-02',3,'task',100,0,0,NULL,NULL,'Layout of Drawing','1',0.00,0.00,0.00,'2025-10-13 17:17:42'),(4,400,'Planning For Mobilization And Execution','2025-10-05','2025-10-28',20,'summary',NULL,0,0,NULL,NULL,'Planning For Mobilization And Execution','1',0.00,0.00,0.00,'2025-10-13 17:17:42'),(5,300,'Manufacturing and Importation Process (Passenger Elevator)','2025-07-09','2025-10-05',75,'summary',NULL,0,0,NULL,NULL,'Manufacturing and Importation Process (Passenger Elevator)','1',0.00,0.00,0.00,'2025-10-13 17:17:42'),(6,100,'Preliminaries','2025-06-22','2025-07-09',15,'summary',NULL,0,0,NULL,NULL,'Preliminaries','1',0.00,0.00,0.00,'2025-10-13 17:17:42'),(7,104,'Submission of PO to Factory','2025-07-08','2025-07-09',1,'task',100,0,0,NULL,NULL,'Submission of PO to Factory','1',0.00,0.00,0.00,'2025-10-13 17:17:42'),(8,201,'Shaft Construction','2025-07-09','2025-10-05',75,'task',200,0,0,NULL,NULL,'Shaft Construction','1',0.00,0.00,0.00,'2025-10-13 17:17:42'),(9,301,'Manufacturing and Importation','2025-07-09','2025-10-05',75,'task',300,0,0,NULL,NULL,'Manufacturing and Importation','1',0.00,0.00,0.00,'2025-10-13 17:17:42'),(10,103,'Submission of Drawing and Finishes for Approval','2025-07-02','2025-07-08',5,'task',100,0,0,NULL,NULL,'Submission of Drawing and Finishes for Approval','1',0.00,0.00,0.00,'2025-10-13 17:17:42'),(11,401,'Preparation of tools and materials for elevator installation','2025-10-05','2025-10-21',14,'task',400,0,0,NULL,NULL,'Preparation of tools and materials for elevator installation','1',0.00,0.00,0.00,'2025-10-13 17:17:42'),(12,402,'Layout of boardup markings','2025-10-21','2025-10-24',3,'task',400,0,0,NULL,NULL,'Layout of boardup markings','1',0.00,0.00,0.00,'2025-10-13 17:17:42'),(13,403,'Partial delivery of tools and boardup materials','2025-10-24','2025-10-28',3,'task',400,0,0,NULL,NULL,'Partial delivery of tools and boardup materials','1',0.00,0.00,0.00,'2025-10-13 17:17:42'),(14,501,'Unloading of elevator equipments','2025-10-28','2025-10-29',1,'task',500,0,0,'General','1','Unloading of elevator equipments','1',0.00,0.00,0.00,'2025-10-13 17:17:42'),(15,500,'Mechanical Installation (Passenger Elevator)','2025-10-28','2025-12-19',45,'summary',NULL,0,0,NULL,NULL,'Mechanical Installation (Passenger Elevator)','1',0.00,0.00,0.00,'2025-10-13 17:17:42'),(16,502,'Scaffolding Installation','2025-10-29','2025-10-31',2,'task',500,0,7,'General','2','Scaffolding Installation','1',7.00,0.00,0.00,'2025-10-13 17:17:42'),(17,503,'Hauling Works','2025-10-31','2025-11-03',2,'task',500,0,7,'General','3','Hauling Works','1',7.00,0.00,0.00,'2025-10-13 17:17:42'),(18,504,'Template Setting','2025-11-03','2025-11-05',2,'task',500,0,7,'General','4','Template Setting','1',7.00,0.00,0.00,'2025-10-13 17:17:42'),(19,505,'Marking and Boring of Holes','2025-11-05','2025-11-06',1,'task',500,0,0,'General','5','Marking and Boring of Holes','1',0.00,0.00,0.00,'2025-10-13 17:17:42'),(20,506,'Rail Bracket Installation','2025-11-06','2025-11-09',2,'task',500,0,7,'General','6','Rail Bracket Installation','1',7.00,0.00,0.00,'2025-10-13 17:17:43'),(21,507,'Guide Rail Setting','2025-11-09','2025-11-14',5,'summary',500,0,0,NULL,NULL,'Guide Rail Setting','1',0.00,0.00,0.00,'2025-10-13 17:17:43'),(22,508,'Main/Car','2025-11-09','2025-11-11',2,'task',507,0,5,'Guide Rail Setting','A','Main/Car','1',5.00,0.00,0.00,'2025-10-13 17:17:43'),(23,509,'Counterweight (CWT)','2025-11-11','2025-11-13',2,'task',507,0,3,'Guide Rail Setting','B','Counterweight (CWT)','1',3.00,0.00,0.00,'2025-10-13 17:17:43'),(24,510,'Gauging','2025-11-13','2025-11-14',1,'task',507,0,3,'Guide Rail Setting','C','Gauging','1',3.00,0.00,0.00,'2025-10-13 17:17:43'),(25,511,'Landing Door Assembly','2025-11-14','2025-11-21',6,'summary',500,0,0,NULL,NULL,'Landing Door Assembly','1',0.00,0.00,0.00,'2025-10-13 17:17:43'),(26,513,'Jamb and Supports','2025-11-17','2025-11-19',2,'task',511,0,2,'Landing Door Assembly','B','Jamb and Supports','1',2.00,0.00,0.00,'2025-10-13 17:17:43'),(27,514,'Frame and Doors','2025-11-19','2025-11-21',2,'task',511,0,3,'Landing Door Assembly','C','Frame and Doors','1',3.00,0.00,0.00,'2025-10-13 17:17:43'),(28,515,'M/R Equipment Setting','2025-11-21','2025-11-28',6,'summary',500,0,0,NULL,NULL,'M/R Equipment Setting','1',0.00,0.00,0.00,'2025-10-13 17:17:43'),(29,516,'Traction Machine','2025-11-21','2025-11-24',2,'task',515,0,5,'M/R Equipment Setting','A','Traction Machine','1',5.00,0.00,0.00,'2025-10-13 17:17:43'),(30,517,'Support Beams','2025-11-24','2025-11-26',2,'task',515,0,5,'M/R Equipment Setting','B','Support Beams','1',5.00,0.00,0.00,'2025-10-13 17:17:43'),(31,512,'Sills and Supports','2025-11-14','2025-11-17',2,'task',511,0,2,'Landing Door Assembly','A','Sills and Supports','1',2.00,0.00,0.00,'2025-10-13 17:17:43'),(32,519,'Installation of Control Panel','2025-11-28','2025-12-01',2,'task',500,0,3,'M/R Equipment Setting','D','Installation of Control Panel','1',3.00,0.00,0.00,'2025-10-13 17:17:43'),(33,518,'Governor','2025-11-26','2025-11-28',2,'task',515,0,2,'M/R Equipment Setting','C','Governor','1',2.00,0.00,0.00,'2025-10-13 17:17:43'),(34,520,'Car Assembly','2025-12-01','2025-12-04',3,'summary',500,0,0,NULL,NULL,'Car Assembly','1',0.00,0.00,0.00,'2025-10-13 17:17:43'),(35,521,'All Accessories','2025-12-01','2025-12-03',2,'task',520,0,3,'Car Assembly','A','All Accessories','1',3.00,0.00,0.00,'2025-10-13 17:17:43'),(36,522,'Car Piping/Wiring','2025-12-03','2025-12-04',1,'task',520,0,3,'Car Assembly','B','Car Piping/Wiring','1',3.00,0.00,0.00,'2025-10-13 17:17:43'),(37,524,'Counterweight Assembly','2025-12-07','2025-12-09',2,'task',500,0,2,'Car Assembly','D','Counterweight Assembly','1',2.00,0.00,0.00,'2025-10-13 17:17:43'),(38,525,'Laying out of Ropes','2025-12-09','2025-12-15',5,'summary',500,0,0,NULL,NULL,'Laying out of Ropes','1',0.00,0.00,0.00,'2025-10-13 17:17:43'),(39,526,'Hoisting','2025-12-09','2025-12-11',2,'task',525,0,2,'Laying out of ropes','A','Hoisting','1',2.00,0.00,0.00,'2025-10-13 17:17:43'),(40,523,'Travelling Cable Layout','2025-12-04','2025-12-07',2,'task',500,0,2,'Car Assembly','C','Travelling Cable Layout','1',2.00,0.00,0.00,'2025-10-13 17:17:43'),(41,527,'Governor','2025-12-11','2025-12-14',2,'task',525,0,3,'Compensating','B','Governor','1',3.00,0.00,0.00,'2025-10-13 17:17:43'),(42,528,'Compensating','2025-12-14','2025-12-15',1,'task',525,0,3,'Laying out of ropes','C','Compensating','1',3.00,0.00,0.00,'2025-10-13 17:17:43'),(43,529,'Wiring','2025-12-15','2025-12-17',2,'summary',500,0,0,NULL,NULL,'Wiring','1',0.00,0.00,0.00,'2025-10-13 17:17:43'),(44,530,'Machine Room','2025-12-15','2025-12-16',1,'task',529,0,5,'Wiring','A','Machine Room','1',5.00,0.00,0.00,'2025-10-13 17:17:43'),(45,531,'Hoistway','2025-12-16','2025-12-17',1,'task',529,0,3,'Wiring','B','Hoistway','1',3.00,0.00,0.00,'2025-10-13 17:17:43'),(46,532,'Installation of Pit Ladder / Hoistway Lighting','2025-12-17','2025-12-19',2,'task',500,0,3,'Wiring','C','Installation of Pit Ladder / Hoistway Lighting','1',3.00,0.00,0.00,'2025-10-13 17:17:43'),(47,600,'Testing and Commissioning (Passenger Elevator)','2025-12-19','2026-01-06',15,'summary',NULL,0,0,NULL,NULL,'Testing and Commissioning (Passenger Elevator)','1',0.00,0.00,0.00,'2025-10-13 17:17:43'),(48,601,'Initial testing','2025-12-19','2025-12-23',3,'task',600,0,3,'Testing and Commissioning (Passenger Elevator)','A','Initial testing','1',3.00,0.00,0.00,'2025-10-13 17:17:43'),(49,602,'Slow speed','2025-12-23','2025-12-25',2,'task',600,0,1,'Testing and Commissioning (Passenger Elevator)','B','Slow speed','1',1.00,0.00,0.00,'2025-10-13 17:17:43'),(50,603,'High speed and Mechanical Adjustment','2025-12-25','2025-12-28',2,'task',600,0,2,'Testing and Commissioning (Passenger Elevator)','C','High speed and Mechanical Adjustment','1',2.00,0.00,0.00,'2025-10-13 17:17:43'),(51,604,'Load Test','2025-12-28','2025-12-30',2,'task',600,0,1,'Testing and Commissioning (Passenger Elevator)','D','Load Test','1',1.00,0.00,0.00,'2025-10-13 17:17:43'),(52,605,'Final Adjust','2025-12-30','2026-01-01',2,'task',600,0,1,'Testing and Commissioning (Passenger Elevator)','E','Final Adjust','1',1.00,0.00,0.00,'2025-10-13 17:17:43'),(53,606,'Features Test / Correction of Defects','2026-01-01','2026-01-04',2,'task',600,0,1,'Testing and Commissioning (Passenger Elevator)','F','Features Test / Correction of Defects','1',1.00,0.00,0.00,'2025-10-13 17:17:43'),(54,607,'Final Cleaning / Hand over','2026-01-04','2026-01-06',2,'task',600,0,1,'Testing and Commissioning (Passenger Elevator)','G','Final Cleaning / Hand over','1',1.00,0.00,0.00,'2025-10-13 17:17:43');
/*!40000 ALTER TABLE `project_299_schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_300_schedule`
--

DROP TABLE IF EXISTS `project_300_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_300_schedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `task_id` int DEFAULT NULL,
  `task_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_start` date DEFAULT NULL,
  `task_end` date DEFAULT NULL,
  `task_duration` int DEFAULT NULL,
  `task_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_parent` int DEFAULT NULL,
  `task_done` tinyint(1) DEFAULT '0',
  `task_percent` int DEFAULT '0',
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
-- Dumping data for table `project_300_schedule`
--

LOCK TABLES `project_300_schedule` WRITE;
/*!40000 ALTER TABLE `project_300_schedule` DISABLE KEYS */;
INSERT INTO `project_300_schedule` VALUES (1,400,'Planning For Mobilization And Execution','2025-10-05','2025-10-30',22,'summary',NULL,0,0,NULL,NULL,'Planning For Mobilization And Execution','1',0.00,0.00,0.00,'2025-10-15 14:48:02'),(2,101,'Pre-Inspection(Checkin of Shaft)','2025-06-22','2025-06-29',6,'task',100,0,0,NULL,NULL,'Pre-Inspection(Checkin of Shaft)','1',0.00,0.00,0.00,'2025-10-15 14:48:02'),(3,102,'Layout of Drawing','2025-06-29','2025-07-02',3,'task',100,0,0,NULL,NULL,'Layout of Drawing','1',0.00,0.00,0.00,'2025-10-15 14:48:02'),(4,300,'Manufacturing and Importation Process (Passenger Elevator)','2025-07-09','2025-10-05',75,'summary',NULL,0,0,NULL,NULL,'Manufacturing and Importation Process (Passenger Elevator)','1',0.00,0.00,0.00,'2025-10-15 14:48:02'),(5,100,'Preliminaries','2025-06-22','2025-07-09',15,'summary',NULL,0,0,NULL,NULL,'Preliminaries','1',0.00,0.00,0.00,'2025-10-15 14:48:02'),(6,301,'Manufacturing and Importation','2025-07-09','2025-10-05',75,'task',300,0,0,NULL,NULL,'Manufacturing and Importation','1',0.00,0.00,0.00,'2025-10-15 14:48:02'),(7,103,'Submission of Drawing and Finishes for Approval','2025-07-02','2025-07-08',5,'task',100,0,0,NULL,NULL,'Submission of Drawing and Finishes for Approval','1',0.00,0.00,0.00,'2025-10-15 14:48:02'),(8,200,'Structural/Civil Works','2025-07-09','2025-10-05',75,'summary',NULL,0,0,NULL,NULL,'Structural/Civil Works','1',0.00,0.00,0.00,'2025-10-15 14:48:02'),(9,104,'Submission of PO to Factory','2025-07-08','2025-07-09',1,'task',100,0,0,NULL,NULL,'Submission of PO to Factory','1',0.00,0.00,0.00,'2025-10-15 14:48:02'),(10,201,'Shaft Construction','2025-07-09','2025-10-05',75,'task',200,0,0,NULL,NULL,'Shaft Construction','1',0.00,0.00,0.00,'2025-10-15 14:48:02'),(11,401,'Preparation of tools and materials for elevator installation','2025-10-05','2025-10-21',14,'task',400,0,0,NULL,NULL,'Preparation of tools and materials for elevator installation','1',0.00,0.00,0.00,'2025-10-15 14:48:02'),(12,402,'Layout of boardup markings','2025-10-21','2025-10-24',3,'task',400,0,0,NULL,NULL,'Layout of boardup markings','1',0.00,0.00,0.00,'2025-10-15 14:48:02'),(13,403,'Partial delivery of tools and boardup materials','2025-10-24','2025-10-30',5,'task',400,0,0,NULL,NULL,'Partial delivery of tools and boardup materials','1',0.00,0.00,0.00,'2025-10-15 14:48:02'),(14,501,'Unloading of elevator equipments','2025-10-30','2025-10-31',1,'task',500,0,0,'General','1','Unloading of elevator equipments','1',0.00,0.00,0.00,'2025-10-15 14:48:02'),(15,500,'Mechanical Installation (Passenger Elevator)','2025-10-30','2025-12-22',45,'summary',NULL,0,0,NULL,NULL,'Mechanical Installation (Passenger Elevator)','1',0.00,0.00,0.00,'2025-10-15 14:48:02'),(16,502,'Scaffolding Installation','2025-10-31','2025-11-03',2,'task',500,0,7,'General','2','Scaffolding Installation','1',7.00,0.00,0.00,'2025-10-15 14:48:02'),(17,503,'Hauling Works','2025-11-03','2025-11-05',2,'task',500,0,7,'General','3','Hauling Works','1',7.00,0.00,0.00,'2025-10-15 14:48:02'),(18,504,'Template Setting','2025-11-05','2025-11-07',2,'task',500,0,7,'General','4','Template Setting','1',7.00,0.00,0.00,'2025-10-15 14:48:02'),(19,506,'Rail Bracket Installation','2025-11-09','2025-11-11',2,'task',500,0,7,'General','6','Rail Bracket Installation','1',7.00,0.00,0.00,'2025-10-15 14:48:02'),(20,505,'Marking and Boring of Holes','2025-11-07','2025-11-09',1,'task',500,0,0,'General','5','Marking and Boring of Holes','1',0.00,0.00,0.00,'2025-10-15 14:48:02'),(21,507,'Guide Rail Setting','2025-11-11','2025-11-17',5,'summary',500,0,0,NULL,NULL,'Guide Rail Setting','1',0.00,0.00,0.00,'2025-10-15 14:48:02'),(22,508,'Main/Car','2025-11-11','2025-11-13',2,'task',507,0,5,'Guide Rail Setting','A','Main/Car','1',5.00,0.00,0.00,'2025-10-15 14:48:02'),(23,509,'Counterweight (CWT)','2025-11-13','2025-11-16',2,'task',507,0,3,'Guide Rail Setting','B','Counterweight (CWT)','1',3.00,0.00,0.00,'2025-10-15 14:48:02'),(24,510,'Gauging','2025-11-16','2025-11-17',1,'task',507,0,3,'Guide Rail Setting','C','Gauging','1',3.00,0.00,0.00,'2025-10-15 14:48:02'),(25,511,'Landing Door Assembly','2025-11-17','2025-11-24',6,'summary',500,0,0,NULL,NULL,'Landing Door Assembly','1',0.00,0.00,0.00,'2025-10-15 14:48:02'),(26,512,'Sills and Supports','2025-11-17','2025-11-19',2,'task',511,0,2,'Landing Door Assembly','A','Sills and Supports','1',2.00,0.00,0.00,'2025-10-15 14:48:02'),(27,513,'Jamb and Supports','2025-11-19','2025-11-21',2,'task',511,0,2,'Landing Door Assembly','B','Jamb and Supports','1',2.00,0.00,0.00,'2025-10-15 14:48:02'),(28,514,'Frame and Doors','2025-11-21','2025-11-24',2,'task',511,0,3,'Landing Door Assembly','C','Frame and Doors','1',3.00,0.00,0.00,'2025-10-15 14:48:02'),(29,515,'M/R Equipment Setting','2025-11-24','2025-12-01',6,'summary',500,0,0,NULL,NULL,'M/R Equipment Setting','1',0.00,0.00,0.00,'2025-10-15 14:48:02'),(30,516,'Traction Machine','2025-11-24','2025-11-26',2,'task',515,0,5,'M/R Equipment Setting','A','Traction Machine','1',5.00,0.00,0.00,'2025-10-15 14:48:02'),(31,517,'Support Beams','2025-11-26','2025-11-28',2,'task',515,0,5,'M/R Equipment Setting','B','Support Beams','1',5.00,0.00,0.00,'2025-10-15 14:48:02'),(32,518,'Governor','2025-11-28','2025-12-01',2,'task',515,0,2,'M/R Equipment Setting','C','Governor','1',2.00,0.00,0.00,'2025-10-15 14:48:02'),(33,519,'Installation of Control Panel','2025-12-01','2025-12-03',2,'task',500,0,3,'M/R Equipment Setting','D','Installation of Control Panel','1',3.00,0.00,0.00,'2025-10-15 14:48:02'),(34,520,'Car Assembly','2025-12-03','2025-12-07',3,'summary',500,0,0,NULL,NULL,'Car Assembly','1',0.00,0.00,0.00,'2025-10-15 14:48:02'),(35,521,'All Accessories','2025-12-03','2025-12-05',2,'task',520,0,3,'Car Assembly','A','All Accessories','1',3.00,0.00,0.00,'2025-10-15 14:48:02'),(36,522,'Car Piping/Wiring','2025-12-05','2025-12-07',1,'task',520,0,3,'Car Assembly','B','Car Piping/Wiring','1',3.00,0.00,0.00,'2025-10-15 14:48:02'),(37,523,'Travelling Cable Layout','2025-12-07','2025-12-09',2,'task',500,0,2,'Car Assembly','C','Travelling Cable Layout','1',2.00,0.00,0.00,'2025-10-15 14:48:02'),(38,524,'Counterweight Assembly','2025-12-09','2025-12-11',2,'task',500,0,2,'Car Assembly','D','Counterweight Assembly','1',2.00,0.00,0.00,'2025-10-15 14:48:02'),(39,525,'Laying out of Ropes','2025-12-11','2025-12-17',5,'summary',500,0,0,NULL,NULL,'Laying out of Ropes','1',0.00,0.00,0.00,'2025-10-15 14:48:02'),(40,527,'Governor','2025-12-14','2025-12-16',2,'task',525,0,3,'Compensating','B','Governor','1',3.00,0.00,0.00,'2025-10-15 14:48:02'),(41,526,'Hoisting','2025-12-11','2025-12-14',2,'task',525,0,2,'Laying out of ropes','A','Hoisting','1',2.00,0.00,0.00,'2025-10-15 14:48:02'),(42,528,'Compensating','2025-12-16','2025-12-17',1,'task',525,0,3,'Laying out of ropes','C','Compensating','1',3.00,0.00,0.00,'2025-10-15 14:48:02'),(43,529,'Wiring','2025-12-17','2025-12-19',2,'summary',500,0,0,NULL,NULL,'Wiring','1',0.00,0.00,0.00,'2025-10-15 14:48:02'),(44,530,'Machine Room','2025-12-17','2025-12-18',1,'task',529,0,5,'Wiring','A','Machine Room','1',5.00,0.00,0.00,'2025-10-15 14:48:02'),(45,531,'Hoistway','2025-12-18','2025-12-19',1,'task',529,0,3,'Wiring','B','Hoistway','1',3.00,0.00,0.00,'2025-10-15 14:48:02'),(46,532,'Installation of Pit Ladder / Hoistway Lighting','2025-12-19','2025-12-22',2,'task',500,0,3,'Wiring','C','Installation of Pit Ladder / Hoistway Lighting','1',3.00,0.00,0.00,'2025-10-15 14:48:02'),(47,600,'Testing and Commissioning (Passenger Elevator)','2025-12-22','2026-01-08',15,'summary',NULL,0,0,NULL,NULL,'Testing and Commissioning (Passenger Elevator)','1',0.00,0.00,0.00,'2025-10-15 14:48:02'),(48,601,'Initial testing','2025-12-22','2025-12-25',3,'task',600,0,3,'Testing and Commissioning (Passenger Elevator)','A','Initial testing','1',3.00,0.00,0.00,'2025-10-15 14:48:02'),(49,602,'Slow speed','2025-12-25','2025-12-28',2,'task',600,0,1,'Testing and Commissioning (Passenger Elevator)','B','Slow speed','1',1.00,0.00,0.00,'2025-10-15 14:48:02'),(50,603,'High speed and Mechanical Adjustment','2025-12-28','2025-12-30',2,'task',600,0,2,'Testing and Commissioning (Passenger Elevator)','C','High speed and Mechanical Adjustment','1',2.00,0.00,0.00,'2025-10-15 14:48:02'),(51,604,'Load Test','2025-12-30','2026-01-01',2,'task',600,0,1,'Testing and Commissioning (Passenger Elevator)','D','Load Test','1',1.00,0.00,0.00,'2025-10-15 14:48:02'),(52,605,'Final Adjust','2026-01-01','2026-01-04',2,'task',600,0,1,'Testing and Commissioning (Passenger Elevator)','E','Final Adjust','1',1.00,0.00,0.00,'2025-10-15 14:48:02'),(53,606,'Features Test / Correction of Defects','2026-01-04','2026-01-06',2,'task',600,0,1,'Testing and Commissioning (Passenger Elevator)','F','Features Test / Correction of Defects','1',1.00,0.00,0.00,'2025-10-15 14:48:02'),(54,607,'Final Cleaning / Hand over','2026-01-06','2026-01-08',2,'task',600,0,1,'Testing and Commissioning (Passenger Elevator)','G','Final Cleaning / Hand over','1',1.00,0.00,0.00,'2025-10-15 14:48:02');
/*!40000 ALTER TABLE `project_300_schedule` ENABLE KEYS */;
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
  `task_done` tinyint(1) DEFAULT '0',
  `task_percent` int DEFAULT '0',
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
INSERT INTO `project_44_schedule` VALUES (1,201,'Shaft Construction','2025-06-29','2025-09-12',75,'task',200,1,0,NULL,NULL,'Shaft Construction','1',0.00,100.00,0.00,'2025-10-07 06:18:07'),(2,103,'Submission of Drawing and Finishes for Approval','2025-06-23','2025-06-28',5,'task',100,1,0,NULL,NULL,'Submission of Drawing and Finishes for Approval','1',0.00,100.00,0.00,'2025-10-07 06:18:07'),(3,301,'Manufacturing and Importation','2025-06-29','2025-09-12',75,'task',300,1,0,NULL,NULL,'Manufacturing and Importation','1',0.00,100.00,0.00,'2025-10-07 06:18:07'),(4,102,'Layout of Drawing','2025-06-20','2025-06-23',3,'task',100,1,0,NULL,NULL,'Layout of Drawing','1',0.00,100.00,0.00,'2025-10-07 06:18:07'),(5,101,'Pre-Inspection(Checkin of Shaft)','2025-06-14','2025-06-20',6,'task',100,1,0,NULL,NULL,'Pre-Inspection(Checkin of Shaft)','1',0.00,100.00,0.00,'2025-10-07 06:18:07'),(6,200,'Structural/Civil Works','2025-06-29','2025-09-12',75,'summary',NULL,1,0,NULL,NULL,'Structural/Civil Works','1',0.00,100.00,0.00,'2025-10-07 06:18:07'),(7,400,'Planning For Mobilization And Execution','2025-09-12','2025-10-02',20,'summary',NULL,1,0,NULL,NULL,'Planning For Mobilization And Execution','1',0.00,100.00,0.00,'2025-10-07 06:18:07'),(8,100,'Preliminaries','2025-06-14','2025-06-29',15,'summary',NULL,1,0,NULL,NULL,'Preliminaries','1',0.00,100.00,0.00,'2025-10-07 06:18:07'),(9,401,'Preparation of tools and materials for elevator installation','2025-09-12','2025-09-26',14,'task',400,1,0,NULL,NULL,'Preparation of tools and materials for elevator installation','1',0.00,100.00,0.00,'2025-10-07 06:18:07'),(10,402,'Layout of boardup markings','2025-09-26','2025-09-29',3,'task',400,1,0,NULL,NULL,'Layout of boardup markings','1',0.00,100.00,0.00,'2025-10-07 06:18:07'),(11,300,'Manufacturing and Importation Process (Passenger Elevator)','2025-06-29','2025-09-12',75,'summary',NULL,1,0,NULL,NULL,'Manufacturing and Importation Process (Passenger Elevator)','1',0.00,100.00,0.00,'2025-10-07 06:18:07'),(12,104,'Submission of PO to Factory','2025-06-28','2025-06-29',1,'task',100,1,0,NULL,NULL,'Submission of PO to Factory','1',0.00,100.00,0.00,'2025-10-07 06:18:07'),(13,403,'Partial delivery of tools and boardup materials','2025-09-29','2025-10-02',3,'task',400,1,0,NULL,NULL,'Partial delivery of tools and boardup materials','1',0.00,100.00,0.00,'2025-10-07 06:18:07'),(14,500,'Mechanical Installation (Passenger Elevator)','2025-10-02','2025-11-16',45,'summary',NULL,1,0,NULL,NULL,'Mechanical Installation (Passenger Elevator)','1',0.00,100.00,0.00,'2025-10-07 06:18:07'),(15,501,'Unloading of elevator equipments','2025-10-02','2025-10-03',1,'task',500,1,0,'General','1','Unloading of elevator equipments','1',0.00,100.00,0.00,'2025-10-07 06:18:07'),(16,502,'Scaffolding Installation','2025-10-03','2025-10-05',2,'task',500,1,7,'General','2','Scaffolding Installation','1',7.00,100.00,0.00,'2025-10-07 06:18:07'),(17,503,'Hauling Works','2025-10-05','2025-10-07',2,'task',500,1,7,'General','3','Hauling Works','1',7.00,100.00,0.00,'2025-10-07 06:18:07'),(18,504,'Template Setting','2025-10-07','2025-10-09',2,'task',500,1,7,'General','4','Template Setting','1',7.00,100.00,0.00,'2025-10-07 06:18:07'),(19,505,'Marking and Boring of Holes','2025-10-09','2025-10-10',1,'task',500,0,0,'General','5','Marking and Boring of Holes','1',0.00,0.00,0.00,'2025-10-07 06:18:07'),(20,506,'Rail Bracket Installation','2025-10-10','2025-10-12',2,'task',500,0,7,'General','6','Rail Bracket Installation','1',7.00,0.00,0.00,'2025-10-07 06:18:07'),(21,507,'Guide Rail Setting','2025-10-12','2025-10-17',5,'summary',500,0,0,NULL,NULL,'Guide Rail Setting','1',0.00,0.00,0.00,'2025-10-07 06:18:07'),(22,508,'Main/Car','2025-10-12','2025-10-14',2,'task',507,0,5,'Guide Rail Setting','A','Main/Car','1',5.00,0.00,0.00,'2025-10-07 06:18:07'),(23,509,'Counterweight (CWT)','2025-10-14','2025-10-16',2,'task',507,0,3,'Guide Rail Setting','B','Counterweight (CWT)','1',3.00,0.00,0.00,'2025-10-07 06:18:07'),(24,511,'Landing Door Assembly','2025-10-17','2025-10-23',6,'summary',500,0,0,NULL,NULL,'Landing Door Assembly','1',0.00,0.00,0.00,'2025-10-07 06:18:07'),(25,512,'Sills and Supports','2025-10-17','2025-10-19',2,'task',511,0,2,'Landing Door Assembly','A','Sills and Supports','1',2.00,0.00,0.00,'2025-10-07 06:18:07'),(26,515,'Test Task','2025-10-19','2025-10-21',2,'task',511,0,0,'General',NULL,'Test Task','1',0.00,0.00,0.00,'2025-10-07 06:18:07'),(27,513,'Jamb and Supports','2025-10-21','2025-10-23',2,'task',511,0,2,'Landing Door Assembly','B','Jamb and Supports','1',2.00,0.00,0.00,'2025-10-07 06:18:07'),(28,514,'Frame and Doors','2025-10-23','2025-10-25',2,'task',511,0,3,'Landing Door Assembly','C','Frame and Doors','1',3.00,0.00,0.00,'2025-10-07 06:18:07'),(29,515,'M/R Equipment Setting','2025-10-25','2025-10-31',6,'summary',500,0,0,NULL,NULL,'M/R Equipment Setting','1',0.00,0.00,0.00,'2025-10-07 06:18:07'),(30,510,'Gauging','2025-10-16','2025-10-17',1,'task',507,0,3,'Guide Rail Setting','C','Gauging','1',3.00,0.00,0.00,'2025-10-07 06:18:07'),(31,516,'Traction Machine','2025-10-25','2025-10-27',2,'task',515,0,5,'M/R Equipment Setting','A','Traction Machine','1',5.00,0.00,0.00,'2025-10-07 06:18:07'),(32,517,'Support Beams','2025-10-27','2025-10-29',2,'task',515,0,5,'M/R Equipment Setting','B','Support Beams','1',5.00,0.00,0.00,'2025-10-07 06:18:07'),(33,518,'Governor','2025-10-29','2025-10-31',2,'task',515,0,2,'M/R Equipment Setting','C','Governor','1',2.00,0.00,0.00,'2025-10-07 06:18:07'),(34,519,'Installation of Control Panel','2025-10-31','2025-11-02',2,'task',500,0,3,'M/R Equipment Setting','D','Installation of Control Panel','1',3.00,0.00,0.00,'2025-10-07 06:18:07'),(35,520,'Car Assembly','2025-11-02','2025-11-05',3,'summary',500,0,0,NULL,NULL,'Car Assembly','1',0.00,0.00,0.00,'2025-10-07 06:18:07'),(36,521,'All Accessories','2025-11-02','2025-11-04',2,'task',520,0,3,'Car Assembly','A','All Accessories','1',3.00,0.00,0.00,'2025-10-07 06:18:07'),(37,522,'Car Piping/Wiring','2025-11-04','2025-11-05',1,'task',520,0,3,'Car Assembly','B','Car Piping/Wiring','1',3.00,0.00,0.00,'2025-10-07 06:18:07'),(38,523,'Travelling Cable Layout','2025-11-05','2025-11-07',2,'task',500,0,2,'Car Assembly','C','Travelling Cable Layout','1',2.00,0.00,0.00,'2025-10-07 06:18:07'),(39,524,'Counterweight Assembly','2025-11-07','2025-11-09',2,'task',500,0,2,'Car Assembly','D','Counterweight Assembly','1',2.00,0.00,0.00,'2025-10-07 06:18:07'),(40,525,'Laying out of Ropes','2025-11-09','2025-11-14',5,'summary',500,0,0,NULL,NULL,'Laying out of Ropes','1',0.00,0.00,0.00,'2025-10-07 06:18:07'),(41,526,'Hoisting','2025-11-09','2025-11-11',2,'task',525,0,2,'Laying out of ropes','A','Hoisting','1',2.00,0.00,0.00,'2025-10-07 06:18:07'),(42,527,'Governor','2025-11-11','2025-11-13',2,'task',525,0,3,'Compensating','B','Governor','1',3.00,0.00,0.00,'2025-10-07 06:18:07'),(43,528,'Compensating','2025-11-13','2025-11-14',1,'task',525,0,3,'Laying out of ropes','C','Compensating','1',3.00,0.00,0.00,'2025-10-07 06:18:07'),(44,529,'Wiring','2025-11-14','2025-11-16',2,'summary',500,0,0,NULL,NULL,'Wiring','1',0.00,0.00,0.00,'2025-10-07 06:18:07'),(45,530,'Machine Room','2025-11-14','2025-11-15',1,'task',529,0,5,'Wiring','A','Machine Room','1',5.00,0.00,0.00,'2025-10-07 06:18:07'),(46,531,'Hoistway','2025-11-15','2025-11-16',1,'task',529,0,3,'Wiring','B','Hoistway','1',3.00,0.00,0.00,'2025-10-07 06:18:07'),(47,532,'Installation of Pit Ladder / Hoistway Lighting','2025-11-16','2025-11-18',2,'task',500,0,3,'Wiring','C','Installation of Pit Ladder / Hoistway Lighting','1',3.00,0.00,0.00,'2025-10-07 06:18:07'),(48,600,'Testing and Commissioning (Passenger Elevator)','2025-11-18','2025-12-03',15,'summary',NULL,0,0,NULL,NULL,'Testing and Commissioning (Passenger Elevator)','1',0.00,0.00,0.00,'2025-10-07 06:18:07'),(49,601,'Initial testing','2025-11-18','2025-11-21',3,'task',600,0,3,'Testing and Commissioning (Passenger Elevator)','A','Initial testing','1',3.00,0.00,0.00,'2025-10-07 06:18:07'),(50,602,'Slow speed','2025-11-21','2025-11-23',2,'task',600,0,1,'Testing and Commissioning (Passenger Elevator)','B','Slow speed','1',1.00,0.00,0.00,'2025-10-07 06:18:07'),(51,603,'High speed and Mechanical Adjustment','2025-11-23','2025-11-25',2,'task',600,0,2,'Testing and Commissioning (Passenger Elevator)','C','High speed and Mechanical Adjustment','1',2.00,0.00,0.00,'2025-10-07 06:18:07'),(52,604,'Load Test','2025-11-25','2025-11-27',2,'task',600,0,1,'Testing and Commissioning (Passenger Elevator)','D','Load Test','1',1.00,0.00,0.00,'2025-10-07 06:18:07'),(53,605,'Final Adjust','2025-11-27','2025-11-29',2,'task',600,0,1,'Testing and Commissioning (Passenger Elevator)','E','Final Adjust','1',1.00,0.00,0.00,'2025-10-07 06:18:07'),(54,606,'Features Test / Correction of Defects','2025-11-29','2025-12-01',2,'task',600,0,1,'Testing and Commissioning (Passenger Elevator)','F','Features Test / Correction of Defects','1',1.00,0.00,0.00,'2025-10-07 06:18:07'),(55,607,'Final Cleaning / Hand over','2025-12-01','2025-12-03',2,'task',600,0,1,'Testing and Commissioning (Passenger Elevator)','G','Final Cleaning / Hand over','1',1.00,0.00,0.00,'2025-10-07 06:18:07');
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
  `task_done` tinyint(1) DEFAULT '0',
  `task_percent` int DEFAULT '0',
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
INSERT INTO `project_45_schedule` VALUES (1,400,'Planning For Mobilization And Execution','2025-12-25','2026-01-14',20,'summary',NULL,0,0,NULL,NULL,'Planning For Mobilization And Execution','1',0.00,0.00,0.00,'2025-10-07 06:28:14'),(2,104,'Submission of PO to Factory','2025-10-10','2025-10-11',1,'task',100,0,0,NULL,NULL,'Submission of PO to Factory','1',0.00,0.00,0.00,'2025-10-07 06:28:14'),(3,200,'Structural/Civil Works','2025-10-11','2025-12-25',75,'summary',NULL,0,0,NULL,NULL,'Structural/Civil Works','1',0.00,0.00,0.00,'2025-10-07 06:28:14'),(4,101,'Pre-Inspection(Checkin of Shaft)','2025-09-26','2025-10-02',6,'task',100,0,0,NULL,NULL,'Pre-Inspection(Checkin of Shaft)','1',0.00,0.00,0.00,'2025-10-07 06:28:14'),(5,301,'Manufacturing and Importation','2025-10-11','2025-12-25',75,'task',300,0,0,NULL,NULL,'Manufacturing and Importation','1',0.00,0.00,0.00,'2025-10-07 06:28:14'),(6,201,'Shaft Construction','2025-10-11','2025-12-25',75,'task',200,0,0,NULL,NULL,'Shaft Construction','1',0.00,0.00,0.00,'2025-10-07 06:28:14'),(7,300,'Manufacturing and Importation Process (Passenger Elevator)','2025-10-11','2025-12-25',75,'summary',NULL,0,0,NULL,NULL,'Manufacturing and Importation Process (Passenger Elevator)','1',0.00,0.00,0.00,'2025-10-07 06:28:14'),(8,102,'Layout of Drawing','2025-10-02','2025-10-05',3,'task',100,0,0,NULL,NULL,'Layout of Drawing','1',0.00,0.00,0.00,'2025-10-07 06:28:14'),(9,103,'Submission of Drawing and Finishes for Approval','2025-10-05','2025-10-10',5,'task',100,0,0,NULL,NULL,'Submission of Drawing and Finishes for Approval','1',0.00,0.00,0.00,'2025-10-07 06:28:14'),(10,100,'Preliminaries','2025-09-26','2025-10-11',15,'summary',NULL,0,0,NULL,NULL,'Preliminaries','1',0.00,0.00,0.00,'2025-10-07 06:28:14'),(11,401,'Preparation of tools and materials for elevator installation','2025-12-25','2026-01-08',14,'task',400,0,0,NULL,NULL,'Preparation of tools and materials for elevator installation','1',0.00,0.00,0.00,'2025-10-07 06:28:15'),(12,403,'Partial delivery of tools and boardup materials','2026-01-11','2026-01-14',3,'task',400,0,0,NULL,NULL,'Partial delivery of tools and boardup materials','1',0.00,0.00,0.00,'2025-10-07 06:28:15'),(13,402,'Layout of boardup markings','2026-01-08','2026-01-11',3,'task',400,0,0,NULL,NULL,'Layout of boardup markings','1',0.00,0.00,0.00,'2025-10-07 06:28:15'),(14,500,'Mechanical Installation (Passenger Elevator)','2026-01-14','2026-02-28',45,'summary',NULL,0,0,NULL,NULL,'Mechanical Installation (Passenger Elevator)','1',0.00,0.00,0.00,'2025-10-07 06:28:15'),(15,501,'Unloading of elevator equipments','2026-01-14','2026-01-15',1,'task',500,0,0,'General','1','Unloading of elevator equipments','1',0.00,0.00,0.00,'2025-10-07 06:28:15'),(16,502,'Scaffolding Installation','2026-01-15','2026-01-17',2,'task',500,0,7,'General','2','Scaffolding Installation','1',7.00,0.00,0.00,'2025-10-07 06:28:15'),(17,503,'Hauling Works','2026-01-17','2026-01-19',2,'task',500,0,7,'General','3','Hauling Works','1',7.00,0.00,0.00,'2025-10-07 06:28:15'),(18,504,'Template Setting','2026-01-19','2026-01-21',2,'task',500,0,7,'General','4','Template Setting','1',7.00,0.00,0.00,'2025-10-07 06:28:15'),(19,505,'Marking and Boring of Holes','2026-01-21','2026-01-22',1,'task',500,0,0,'General','5','Marking and Boring of Holes','1',0.00,0.00,0.00,'2025-10-07 06:28:15'),(20,506,'Rail Bracket Installation','2026-01-22','2026-01-24',2,'task',500,0,7,'General','6','Rail Bracket Installation','1',7.00,0.00,0.00,'2025-10-07 06:28:15'),(21,507,'Guide Rail Setting','2026-01-24','2026-01-29',5,'summary',500,0,0,NULL,NULL,'Guide Rail Setting','1',0.00,0.00,0.00,'2025-10-07 06:28:15'),(22,508,'Main/Car','2026-01-24','2026-01-26',2,'task',507,0,5,'Guide Rail Setting','A','Main/Car','1',5.00,0.00,0.00,'2025-10-07 06:28:15'),(23,509,'Counterweight (CWT)','2026-01-26','2026-01-28',2,'task',507,0,3,'Guide Rail Setting','B','Counterweight (CWT)','1',3.00,0.00,0.00,'2025-10-07 06:28:15'),(24,510,'Gauging','2026-01-28','2026-01-29',1,'task',507,0,3,'Guide Rail Setting','C','Gauging','1',3.00,0.00,0.00,'2025-10-07 06:28:15'),(25,511,'Landing Door Assembly','2026-01-29','2026-02-04',6,'summary',500,0,0,NULL,NULL,'Landing Door Assembly','1',0.00,0.00,0.00,'2025-10-07 06:28:15'),(26,512,'Sills and Supports','2026-01-29','2026-01-31',2,'task',511,0,2,'Landing Door Assembly','A','Sills and Supports','1',2.00,0.00,0.00,'2025-10-07 06:28:15'),(27,513,'Jamb and Supports','2026-01-31','2026-02-02',2,'task',511,0,2,'Landing Door Assembly','B','Jamb and Supports','1',2.00,0.00,0.00,'2025-10-07 06:28:15'),(28,514,'Frame and Doors','2026-02-02','2026-02-04',2,'task',511,0,3,'Landing Door Assembly','C','Frame and Doors','1',3.00,0.00,0.00,'2025-10-07 06:28:15'),(29,515,'M/R Equipment Setting','2026-02-04','2026-02-10',6,'summary',500,0,0,NULL,NULL,'M/R Equipment Setting','1',0.00,0.00,0.00,'2025-10-07 06:28:15'),(30,516,'Traction Machine','2026-02-04','2026-02-06',2,'task',515,0,5,'M/R Equipment Setting','A','Traction Machine','1',5.00,0.00,0.00,'2025-10-07 06:28:15'),(31,517,'Support Beams','2026-02-06','2026-02-08',2,'task',515,0,5,'M/R Equipment Setting','B','Support Beams','1',5.00,0.00,0.00,'2025-10-07 06:28:15'),(32,518,'Governor','2026-02-08','2026-02-10',2,'task',515,0,2,'M/R Equipment Setting','C','Governor','1',2.00,0.00,0.00,'2025-10-07 06:28:15'),(33,519,'Installation of Control Panel','2026-02-10','2026-02-12',2,'task',500,0,3,'M/R Equipment Setting','D','Installation of Control Panel','1',3.00,0.00,0.00,'2025-10-07 06:28:15'),(34,520,'Car Assembly','2026-02-12','2026-02-15',3,'summary',500,0,0,NULL,NULL,'Car Assembly','1',0.00,0.00,0.00,'2025-10-07 06:28:15'),(35,521,'All Accessories','2026-02-12','2026-02-14',2,'task',520,0,3,'Car Assembly','A','All Accessories','1',3.00,0.00,0.00,'2025-10-07 06:28:15'),(36,522,'Car Piping/Wiring','2026-02-14','2026-02-15',1,'task',520,0,3,'Car Assembly','B','Car Piping/Wiring','1',3.00,0.00,0.00,'2025-10-07 06:28:15'),(37,523,'Travelling Cable Layout','2026-02-15','2026-02-17',2,'task',500,0,2,'Car Assembly','C','Travelling Cable Layout','1',2.00,0.00,0.00,'2025-10-07 06:28:15'),(38,524,'Counterweight Assembly','2026-02-17','2026-02-19',2,'task',500,0,2,'Car Assembly','D','Counterweight Assembly','1',2.00,0.00,0.00,'2025-10-07 06:28:15'),(39,525,'Laying out of Ropes','2026-02-19','2026-02-24',5,'summary',500,0,0,NULL,NULL,'Laying out of Ropes','1',0.00,0.00,0.00,'2025-10-07 06:28:15'),(40,526,'Hoisting','2026-02-19','2026-02-21',2,'task',525,0,2,'Laying out of ropes','A','Hoisting','1',2.00,0.00,0.00,'2025-10-07 06:28:15'),(41,527,'Governor','2026-02-21','2026-02-23',2,'task',525,0,3,'Compensating','B','Governor','1',3.00,0.00,0.00,'2025-10-07 06:28:15'),(42,528,'Compensating','2026-02-23','2026-02-24',1,'task',525,0,3,'Laying out of ropes','C','Compensating','1',3.00,0.00,0.00,'2025-10-07 06:28:15'),(43,529,'Wiring','2026-02-24','2026-02-26',2,'summary',500,0,0,NULL,NULL,'Wiring','1',0.00,0.00,0.00,'2025-10-07 06:28:15'),(44,530,'Machine Room','2026-02-24','2026-02-25',1,'task',529,0,5,'Wiring','A','Machine Room','1',5.00,0.00,0.00,'2025-10-07 06:28:15'),(45,531,'Hoistway','2026-02-25','2026-02-26',1,'task',529,0,3,'Wiring','B','Hoistway','1',3.00,0.00,0.00,'2025-10-07 06:28:15'),(46,532,'Installation of Pit Ladder / Hoistway Lighting','2026-02-26','2026-02-28',2,'task',500,0,3,'Wiring','C','Installation of Pit Ladder / Hoistway Lighting','1',3.00,0.00,0.00,'2025-10-07 06:28:15'),(47,600,'Testing and Commissioning (Passenger Elevator)','2026-02-28','2026-03-15',15,'summary',NULL,0,0,NULL,NULL,'Testing and Commissioning (Passenger Elevator)','1',0.00,0.00,0.00,'2025-10-07 06:28:15'),(48,601,'Initial testing','2026-02-28','2026-03-03',3,'task',600,0,3,'Testing and Commissioning (Passenger Elevator)','A','Initial testing','1',3.00,0.00,0.00,'2025-10-07 06:28:15'),(49,602,'Slow speed','2026-03-03','2026-03-05',2,'task',600,0,1,'Testing and Commissioning (Passenger Elevator)','B','Slow speed','1',1.00,0.00,0.00,'2025-10-07 06:28:15'),(50,603,'High speed and Mechanical Adjustment','2026-03-05','2026-03-07',2,'task',600,0,2,'Testing and Commissioning (Passenger Elevator)','C','High speed and Mechanical Adjustment','1',2.00,0.00,0.00,'2025-10-07 06:28:15'),(51,604,'Load Test','2026-03-07','2026-03-09',2,'task',600,0,1,'Testing and Commissioning (Passenger Elevator)','D','Load Test','1',1.00,0.00,0.00,'2025-10-07 06:28:15'),(52,605,'Final Adjust','2026-03-09','2026-03-11',2,'task',600,0,1,'Testing and Commissioning (Passenger Elevator)','E','Final Adjust','1',1.00,0.00,0.00,'2025-10-07 06:28:15'),(53,606,'Features Test / Correction of Defects','2026-03-11','2026-03-13',2,'task',600,0,1,'Testing and Commissioning (Passenger Elevator)','F','Features Test / Correction of Defects','1',1.00,0.00,0.00,'2025-10-07 06:28:15'),(54,607,'Final Cleaning / Hand over','2026-03-13','2026-03-15',2,'task',600,0,1,'Testing and Commissioning (Passenger Elevator)','G','Final Cleaning / Hand over','1',1.00,0.00,0.00,'2025-10-07 06:28:15');
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
  `task_done` tinyint(1) DEFAULT '0',
  `task_percent` int DEFAULT '0',
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
INSERT INTO `project_46_schedule` VALUES (1,300,'Manufacturing and Importation Process (Passenger Elevator)','2025-05-24','2025-08-07',75,'summary',NULL,1,0,NULL,NULL,'Manufacturing and Importation Process (Passenger Elevator)','1',0.00,100.00,0.00,'2025-10-07 06:30:55'),(2,200,'Structural/Civil Works','2025-05-24','2025-08-07',75,'summary',NULL,1,0,NULL,NULL,'Structural/Civil Works','1',0.00,100.00,0.00,'2025-10-07 06:30:55'),(3,101,'Pre-Inspection(Checkin of Shaft)','2025-05-09','2025-05-15',6,'task',100,1,0,NULL,NULL,'Pre-Inspection(Checkin of Shaft)','1',0.00,100.00,0.00,'2025-10-07 06:30:55'),(4,104,'Submission of PO to Factory','2025-05-23','2025-05-24',1,'task',100,1,0,NULL,NULL,'Submission of PO to Factory','1',0.00,100.00,0.00,'2025-10-07 06:30:55'),(5,103,'Submission of Drawing and Finishes for Approval','2025-05-18','2025-05-23',5,'task',100,1,0,NULL,NULL,'Submission of Drawing and Finishes for Approval','1',0.00,100.00,0.00,'2025-10-07 06:30:55'),(6,201,'Shaft Construction','2025-05-24','2025-08-07',75,'task',200,1,0,NULL,NULL,'Shaft Construction','1',0.00,100.00,0.00,'2025-10-07 06:30:55'),(7,102,'Layout of Drawing','2025-05-15','2025-05-18',3,'task',100,1,0,NULL,NULL,'Layout of Drawing','1',0.00,100.00,0.00,'2025-10-07 06:30:55'),(8,301,'Manufacturing and Importation','2025-05-24','2025-08-07',75,'task',300,1,0,NULL,NULL,'Manufacturing and Importation','1',0.00,100.00,0.00,'2025-10-07 06:30:55'),(9,100,'Preliminaries','2025-05-09','2025-05-24',15,'summary',NULL,1,0,NULL,NULL,'Preliminaries','1',0.00,100.00,0.00,'2025-10-07 06:30:55'),(10,400,'Planning For Mobilization And Execution','2025-08-07','2025-08-27',20,'summary',NULL,1,0,NULL,NULL,'Planning For Mobilization And Execution','1',0.00,100.00,0.00,'2025-10-07 06:30:55'),(11,401,'Preparation of tools and materials for elevator installation','2025-08-07','2025-08-21',14,'task',400,1,0,NULL,NULL,'Preparation of tools and materials for elevator installation','1',0.00,100.00,0.00,'2025-10-07 06:30:56'),(12,402,'Layout of boardup markings','2025-08-21','2025-08-24',3,'task',400,1,0,NULL,NULL,'Layout of boardup markings','1',0.00,100.00,0.00,'2025-10-07 06:30:56'),(13,403,'Partial delivery of tools and boardup materials','2025-08-24','2025-08-27',3,'task',400,1,0,NULL,NULL,'Partial delivery of tools and boardup materials','1',0.00,100.00,0.00,'2025-10-07 06:30:56'),(14,500,'Mechanical Installation (Passenger Elevator)','2025-08-27','2025-10-11',45,'summary',NULL,1,0,NULL,NULL,'Mechanical Installation (Passenger Elevator)','1',0.00,100.00,0.00,'2025-10-07 06:30:56'),(15,501,'Unloading of elevator equipments','2025-08-27','2025-08-28',1,'task',500,1,0,'General','1','Unloading of elevator equipments','1',0.00,100.00,0.00,'2025-10-07 06:30:56'),(16,502,'Scaffolding Installation','2025-08-28','2025-08-30',2,'task',500,1,7,'General','2','Scaffolding Installation','1',7.00,100.00,0.00,'2025-10-07 06:30:56'),(17,503,'Hauling Works','2025-08-30','2025-09-01',2,'task',500,1,7,'General','3','Hauling Works','1',7.00,100.00,0.00,'2025-10-07 06:30:56'),(18,504,'Template Setting','2025-09-01','2025-09-03',2,'task',500,1,7,'General','4','Template Setting','1',7.00,100.00,0.00,'2025-10-07 06:30:56'),(19,505,'Marking and Boring of Holes','2025-09-03','2025-09-04',1,'task',500,1,0,'General','5','Marking and Boring of Holes','1',0.00,100.00,0.00,'2025-10-07 06:30:56'),(20,506,'Rail Bracket Installation','2025-09-04','2025-09-06',2,'task',500,1,7,'General','6','Rail Bracket Installation','1',7.00,100.00,0.00,'2025-10-07 06:30:56'),(21,507,'Guide Rail Setting','2025-09-06','2025-09-11',5,'summary',500,1,0,NULL,NULL,'Guide Rail Setting','1',0.00,100.00,0.00,'2025-10-07 06:30:56'),(22,508,'Main/Car','2025-09-06','2025-09-08',2,'task',507,1,5,'Guide Rail Setting','A','Main/Car','1',5.00,100.00,0.00,'2025-10-07 06:30:56'),(23,509,'Counterweight (CWT)','2025-09-08','2025-09-10',2,'task',507,1,3,'Guide Rail Setting','B','Counterweight (CWT)','1',3.00,100.00,0.00,'2025-10-07 06:30:56'),(24,510,'Gauging','2025-09-10','2025-09-11',1,'task',507,1,3,'Guide Rail Setting','C','Gauging','1',3.00,100.00,0.00,'2025-10-07 06:30:56'),(25,511,'Landing Door Assembly','2025-09-11','2025-09-17',6,'summary',500,1,0,NULL,NULL,'Landing Door Assembly','1',0.00,100.00,0.00,'2025-10-07 06:30:56'),(26,512,'Sills and Supports','2025-09-11','2025-09-13',2,'task',511,1,2,'Landing Door Assembly','A','Sills and Supports','1',2.00,100.00,0.00,'2025-10-07 06:30:56'),(27,513,'Jamb and Supports','2025-09-13','2025-09-15',2,'task',511,1,2,'Landing Door Assembly','B','Jamb and Supports','1',2.00,100.00,0.00,'2025-10-07 06:30:56'),(28,514,'Frame and Doors','2025-09-15','2025-09-17',2,'task',511,1,3,'Landing Door Assembly','C','Frame and Doors','1',3.00,100.00,0.00,'2025-10-07 06:30:56'),(29,515,'M/R Equipment Setting','2025-09-17','2025-09-23',6,'summary',500,1,0,NULL,NULL,'M/R Equipment Setting','1',0.00,100.00,0.00,'2025-10-07 06:30:56'),(30,516,'Traction Machine','2025-09-17','2025-09-19',2,'task',515,1,5,'M/R Equipment Setting','A','Traction Machine','1',5.00,100.00,0.00,'2025-10-07 06:30:56'),(31,517,'Support Beams','2025-09-19','2025-09-21',2,'task',515,1,5,'M/R Equipment Setting','B','Support Beams','1',5.00,100.00,0.00,'2025-10-07 06:30:56'),(32,518,'Governor','2025-09-21','2025-09-23',2,'task',515,1,2,'M/R Equipment Setting','C','Governor','1',2.00,100.00,0.00,'2025-10-07 06:30:56'),(33,519,'Installation of Control Panel','2025-09-23','2025-09-25',2,'task',500,1,3,'M/R Equipment Setting','D','Installation of Control Panel','1',3.00,100.00,0.00,'2025-10-07 06:30:56'),(34,520,'Car Assembly','2025-09-25','2025-09-28',3,'summary',500,1,0,NULL,NULL,'Car Assembly','1',0.00,100.00,0.00,'2025-10-07 06:30:56'),(35,521,'All Accessories','2025-09-25','2025-09-27',2,'task',520,1,3,'Car Assembly','A','All Accessories','1',3.00,100.00,0.00,'2025-10-07 06:30:56'),(36,522,'Car Piping/Wiring','2025-09-27','2025-09-28',1,'task',520,1,3,'Car Assembly','B','Car Piping/Wiring','1',3.00,100.00,0.00,'2025-10-07 06:30:56'),(37,523,'Travelling Cable Layout','2025-09-28','2025-09-30',2,'task',500,1,2,'Car Assembly','C','Travelling Cable Layout','1',2.00,100.00,0.00,'2025-10-07 06:30:56'),(38,524,'Counterweight Assembly','2025-09-30','2025-10-02',2,'task',500,1,2,'Car Assembly','D','Counterweight Assembly','1',2.00,100.00,0.00,'2025-10-07 06:30:56'),(39,525,'Laying out of Ropes','2025-10-02','2025-10-07',5,'summary',500,1,0,NULL,NULL,'Laying out of Ropes','1',0.00,100.00,0.00,'2025-10-07 06:30:56'),(40,526,'Hoisting','2025-10-02','2025-10-04',2,'task',525,1,2,'Laying out of ropes','A','Hoisting','1',2.00,100.00,0.00,'2025-10-07 06:30:56'),(41,527,'Governor','2025-10-04','2025-10-06',2,'task',525,1,3,'Compensating','B','Governor','1',3.00,100.00,0.00,'2025-10-07 06:30:56'),(42,528,'Compensating','2025-10-06','2025-10-07',1,'task',525,1,3,'Laying out of ropes','C','Compensating','1',3.00,100.00,0.00,'2025-10-07 06:30:56'),(43,529,'Wiring','2025-10-07','2025-10-09',2,'summary',500,1,0,NULL,NULL,'Wiring','1',0.00,100.00,0.00,'2025-10-07 06:30:56'),(44,530,'Machine Room','2025-10-07','2025-10-08',1,'task',529,1,5,'Wiring','A','Machine Room','1',5.00,100.00,0.00,'2025-10-07 06:30:56'),(45,531,'Hoistway','2025-10-08','2025-10-09',1,'task',529,0,3,'Wiring','B','Hoistway','1',3.00,0.00,0.00,'2025-10-07 06:30:56'),(46,532,'Installation of Pit Ladder / Hoistway Lighting','2025-10-09','2025-10-11',2,'task',500,0,3,'Wiring','C','Installation of Pit Ladder / Hoistway Lighting','1',3.00,0.00,0.00,'2025-10-07 06:30:56'),(47,600,'Testing and Commissioning (Passenger Elevator)','2025-10-11','2025-10-26',15,'summary',NULL,0,0,NULL,NULL,'Testing and Commissioning (Passenger Elevator)','1',0.00,0.00,0.00,'2025-10-07 06:30:56'),(48,601,'Initial testing','2025-10-11','2025-10-14',3,'task',600,0,3,'Testing and Commissioning (Passenger Elevator)','A','Initial testing','1',3.00,0.00,0.00,'2025-10-07 06:30:56'),(49,602,'Slow speed','2025-10-14','2025-10-16',2,'task',600,0,1,'Testing and Commissioning (Passenger Elevator)','B','Slow speed','1',1.00,0.00,0.00,'2025-10-07 06:30:56'),(50,603,'High speed and Mechanical Adjustment','2025-10-16','2025-10-18',2,'task',600,0,2,'Testing and Commissioning (Passenger Elevator)','C','High speed and Mechanical Adjustment','1',2.00,0.00,0.00,'2025-10-07 06:30:56'),(51,604,'Load Test','2025-10-18','2025-10-20',2,'task',600,0,1,'Testing and Commissioning (Passenger Elevator)','D','Load Test','1',1.00,0.00,0.00,'2025-10-07 06:30:56'),(52,605,'Final Adjust','2025-10-20','2025-10-22',2,'task',600,0,1,'Testing and Commissioning (Passenger Elevator)','E','Final Adjust','1',1.00,0.00,0.00,'2025-10-07 06:30:56'),(53,606,'Features Test / Correction of Defects','2025-10-22','2025-10-24',2,'task',600,0,1,'Testing and Commissioning (Passenger Elevator)','F','Features Test / Correction of Defects','1',1.00,0.00,0.00,'2025-10-07 06:30:56'),(54,607,'Final Cleaning / Hand over','2025-10-24','2025-10-26',2,'task',600,0,1,'Testing and Commissioning (Passenger Elevator)','G','Final Cleaning / Hand over','1',1.00,0.00,0.00,'2025-10-07 06:30:56');
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
  `task_done` tinyint(1) DEFAULT '0',
  `task_percent` int DEFAULT '0',
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
INSERT INTO `project_47_schedule` VALUES (1,101,'Pre-Inspection(Checkin of Shaft)','2025-05-26','2025-06-01',6,'task',100,1,0,NULL,NULL,'Pre-Inspection(Checkin of Shaft)','1',0.00,100.00,0.00,'2025-10-07 06:39:53'),(2,400,'Planning For Mobilization And Execution','2025-08-24','2025-09-13',20,'summary',NULL,1,0,NULL,NULL,'Planning For Mobilization And Execution','1',0.00,100.00,0.00,'2025-10-07 06:39:53'),(3,301,'Manufacturing and Importation','2025-06-10','2025-08-24',75,'task',300,1,0,NULL,NULL,'Manufacturing and Importation','1',0.00,100.00,0.00,'2025-10-07 06:39:53'),(4,201,'Shaft Construction','2025-06-10','2025-08-24',75,'task',200,1,0,NULL,NULL,'Shaft Construction','1',0.00,100.00,0.00,'2025-10-07 06:39:53'),(5,200,'Structural/Civil Works','2025-06-10','2025-08-24',75,'summary',NULL,1,0,NULL,NULL,'Structural/Civil Works','1',0.00,100.00,0.00,'2025-10-07 06:39:53'),(6,104,'Submission of PO to Factory','2025-06-09','2025-06-10',1,'task',100,1,0,NULL,NULL,'Submission of PO to Factory','1',0.00,100.00,0.00,'2025-10-07 06:39:53'),(7,100,'Preliminaries','2025-05-26','2025-06-10',15,'summary',NULL,1,0,NULL,NULL,'Preliminaries','1',0.00,100.00,0.00,'2025-10-07 06:39:53'),(8,103,'Submission of Drawing and Finishes for Approval','2025-06-04','2025-06-09',5,'task',100,1,0,NULL,NULL,'Submission of Drawing and Finishes for Approval','1',0.00,100.00,0.00,'2025-10-07 06:39:53'),(9,401,'Preparation of tools and materials for elevator installation','2025-08-24','2025-09-07',14,'task',400,1,0,NULL,NULL,'Preparation of tools and materials for elevator installation','1',0.00,100.00,0.00,'2025-10-07 06:39:54'),(10,300,'Manufacturing and Importation Process (Passenger Elevator)','2025-06-10','2025-08-24',75,'summary',NULL,1,0,NULL,NULL,'Manufacturing and Importation Process (Passenger Elevator)','1',0.00,100.00,0.00,'2025-10-07 06:39:53'),(11,102,'Layout of Drawing','2025-06-01','2025-06-04',3,'task',100,1,0,NULL,NULL,'Layout of Drawing','1',0.00,100.00,0.00,'2025-10-07 06:39:53'),(12,402,'Layout of boardup markings','2025-09-07','2025-09-10',3,'task',400,1,0,NULL,NULL,'Layout of boardup markings','1',0.00,100.00,0.00,'2025-10-07 06:39:54'),(13,403,'Partial delivery of tools and boardup materials','2025-09-10','2025-09-13',3,'task',400,1,0,NULL,NULL,'Partial delivery of tools and boardup materials','1',0.00,100.00,0.00,'2025-10-07 06:39:54'),(14,500,'Mechanical Installation (Passenger Elevator)','2025-09-13','2025-10-28',45,'summary',NULL,1,0,NULL,NULL,'Mechanical Installation (Passenger Elevator)','1',0.00,100.00,0.00,'2025-10-07 06:39:54'),(15,501,'Unloading of elevator equipments','2025-09-13','2025-09-14',1,'task',500,1,0,'General','1','Unloading of elevator equipments','1',0.00,100.00,0.00,'2025-10-07 06:39:54'),(16,503,'Hauling Works','2025-09-16','2025-09-18',2,'task',500,1,7,'General','3','Hauling Works','1',7.00,100.00,0.00,'2025-10-07 06:39:54'),(17,502,'Scaffolding Installation','2025-09-14','2025-09-16',2,'task',500,1,7,'General','2','Scaffolding Installation','1',7.00,100.00,0.00,'2025-10-07 06:39:54'),(18,504,'Template Setting','2025-09-18','2025-09-20',2,'task',500,1,7,'General','4','Template Setting','1',7.00,100.00,0.00,'2025-10-07 06:39:54'),(19,505,'Marking and Boring of Holes','2025-09-20','2025-09-21',1,'task',500,1,0,'General','5','Marking and Boring of Holes','1',0.00,100.00,0.00,'2025-10-07 06:39:54'),(20,506,'Rail Bracket Installation','2025-09-21','2025-09-23',2,'task',500,1,7,'General','6','Rail Bracket Installation','1',7.00,100.00,0.00,'2025-10-07 06:39:54'),(21,507,'Guide Rail Setting','2025-09-23','2025-09-28',5,'summary',500,1,0,NULL,NULL,'Guide Rail Setting','1',0.00,100.00,0.00,'2025-10-07 06:39:54'),(22,508,'Main/Car','2025-09-23','2025-09-25',2,'task',507,1,5,'Guide Rail Setting','A','Main/Car','1',5.00,100.00,0.00,'2025-10-07 06:39:54'),(23,509,'Counterweight (CWT)','2025-09-25','2025-09-27',2,'task',507,1,3,'Guide Rail Setting','B','Counterweight (CWT)','1',3.00,100.00,0.00,'2025-10-07 06:39:54'),(24,510,'Gauging','2025-09-27','2025-09-28',1,'task',507,1,3,'Guide Rail Setting','C','Gauging','1',3.00,100.00,0.00,'2025-10-07 06:39:54'),(25,511,'Landing Door Assembly','2025-09-28','2025-10-04',6,'summary',500,1,0,NULL,NULL,'Landing Door Assembly','1',0.00,100.00,0.00,'2025-10-07 06:39:54'),(26,512,'Sills and Supports','2025-09-28','2025-09-30',2,'task',511,1,2,'Landing Door Assembly','A','Sills and Supports','1',2.00,100.00,0.00,'2025-10-07 06:39:54'),(27,513,'Jamb and Supports','2025-09-30','2025-10-02',2,'task',511,1,2,'Landing Door Assembly','B','Jamb and Supports','1',2.00,100.00,0.00,'2025-10-07 06:39:54'),(28,514,'Frame and Doors','2025-10-02','2025-10-04',2,'task',511,1,3,'Landing Door Assembly','C','Frame and Doors','1',3.00,100.00,0.00,'2025-10-07 06:39:54'),(29,515,'M/R Equipment Setting','2025-10-04','2025-10-10',6,'summary',500,1,0,NULL,NULL,'M/R Equipment Setting','1',0.00,100.00,0.00,'2025-10-07 06:39:54'),(30,516,'Traction Machine','2025-10-04','2025-10-06',2,'task',515,1,5,'M/R Equipment Setting','A','Traction Machine','1',5.00,100.00,0.00,'2025-10-07 06:39:54'),(31,517,'Support Beams','2025-10-06','2025-10-08',2,'task',515,1,5,'M/R Equipment Setting','B','Support Beams','1',5.00,100.00,0.00,'2025-10-07 06:39:54'),(32,518,'Governor','2025-10-08','2025-10-10',2,'task',515,1,2,'M/R Equipment Setting','C','Governor','1',2.00,100.00,0.00,'2025-10-07 06:39:54'),(33,519,'Installation of Control Panel','2025-10-10','2025-10-12',2,'task',500,1,3,'M/R Equipment Setting','D','Installation of Control Panel','1',3.00,100.00,0.00,'2025-10-07 06:39:54'),(34,520,'Car Assembly','2025-10-12','2025-10-15',3,'summary',500,1,0,NULL,NULL,'Car Assembly','1',0.00,100.00,0.00,'2025-10-07 06:39:54'),(35,521,'All Accessories','2025-10-12','2025-10-14',2,'task',520,1,3,'Car Assembly','A','All Accessories','1',3.00,100.00,0.00,'2025-10-07 06:39:54'),(36,522,'Car Piping/Wiring','2025-10-14','2025-10-15',1,'task',520,1,3,'Car Assembly','B','Car Piping/Wiring','1',3.00,100.00,0.00,'2025-10-07 06:39:54'),(37,523,'Travelling Cable Layout','2025-10-15','2025-10-17',2,'task',500,1,2,'Car Assembly','C','Travelling Cable Layout','1',2.00,100.00,0.00,'2025-10-07 06:39:54'),(38,524,'Counterweight Assembly','2025-10-17','2025-10-19',2,'task',500,0,2,'Car Assembly','D','Counterweight Assembly','1',2.00,0.00,0.00,'2025-10-07 06:39:54'),(39,525,'Laying out of Ropes','2025-10-19','2025-10-24',5,'summary',500,0,0,NULL,NULL,'Laying out of Ropes','1',0.00,0.00,0.00,'2025-10-07 06:39:54'),(40,526,'Hoisting','2025-10-19','2025-10-21',2,'task',525,0,2,'Laying out of ropes','A','Hoisting','1',2.00,0.00,0.00,'2025-10-07 06:39:54'),(41,527,'Governor','2025-10-21','2025-10-23',2,'task',525,0,3,'Compensating','B','Governor','1',3.00,0.00,0.00,'2025-10-07 06:39:54'),(42,528,'Compensating','2025-10-23','2025-10-24',1,'task',525,0,3,'Laying out of ropes','C','Compensating','1',3.00,0.00,0.00,'2025-10-07 06:39:54'),(43,529,'Wiring','2025-10-24','2025-10-26',2,'summary',500,0,0,NULL,NULL,'Wiring','1',0.00,0.00,0.00,'2025-10-07 06:39:54'),(44,530,'Machine Room','2025-10-24','2025-10-25',1,'task',529,0,5,'Wiring','A','Machine Room','1',5.00,0.00,0.00,'2025-10-07 06:39:54'),(45,531,'Hoistway','2025-10-25','2025-10-26',1,'task',529,0,3,'Wiring','B','Hoistway','1',3.00,0.00,0.00,'2025-10-07 06:39:54'),(46,532,'Installation of Pit Ladder / Hoistway Lighting','2025-10-26','2025-10-28',2,'task',500,0,3,'Wiring','C','Installation of Pit Ladder / Hoistway Lighting','1',3.00,0.00,0.00,'2025-10-07 06:39:54'),(47,600,'Testing and Commissioning (Passenger Elevator)','2025-10-28','2025-11-12',15,'summary',NULL,0,0,NULL,NULL,'Testing and Commissioning (Passenger Elevator)','1',0.00,0.00,0.00,'2025-10-07 06:39:54'),(48,601,'Initial testing','2025-10-28','2025-10-31',3,'task',600,0,3,'Testing and Commissioning (Passenger Elevator)','A','Initial testing','1',3.00,0.00,0.00,'2025-10-07 06:39:54'),(49,602,'Slow speed','2025-10-31','2025-11-02',2,'task',600,0,1,'Testing and Commissioning (Passenger Elevator)','B','Slow speed','1',1.00,0.00,0.00,'2025-10-07 06:39:54'),(50,603,'High speed and Mechanical Adjustment','2025-11-02','2025-11-04',2,'task',600,0,2,'Testing and Commissioning (Passenger Elevator)','C','High speed and Mechanical Adjustment','1',2.00,0.00,0.00,'2025-10-07 06:39:54'),(51,604,'Load Test','2025-11-04','2025-11-06',2,'task',600,0,1,'Testing and Commissioning (Passenger Elevator)','D','Load Test','1',1.00,0.00,0.00,'2025-10-07 06:39:54'),(52,605,'Final Adjust','2025-11-06','2025-11-08',2,'task',600,0,1,'Testing and Commissioning (Passenger Elevator)','E','Final Adjust','1',1.00,0.00,0.00,'2025-10-07 06:39:54'),(53,606,'Features Test / Correction of Defects','2025-11-08','2025-11-10',2,'task',600,0,1,'Testing and Commissioning (Passenger Elevator)','F','Features Test / Correction of Defects','1',1.00,0.00,0.00,'2025-10-07 06:39:54'),(54,607,'Final Cleaning / Hand over','2025-11-10','2025-11-12',2,'task',600,0,1,'Testing and Commissioning (Passenger Elevator)','G','Final Cleaning / Hand over','1',1.00,0.00,0.00,'2025-10-07 06:39:54');
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
  `task_done` tinyint(1) DEFAULT '0',
  `task_percent` int DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_48_schedule`
--

LOCK TABLES `project_48_schedule` WRITE;
/*!40000 ALTER TABLE `project_48_schedule` DISABLE KEYS */;
INSERT INTO `project_48_schedule` VALUES (1,102,'Layout of Drawing','2025-10-05','2025-10-08',3,'task',100,0,0),(2,101,'Pre-Inspection(Checkin of Shaft)','2025-09-29','2025-10-05',6,'task',100,0,0),(3,104,'Submission of PO to Factory','2025-10-13','2025-10-14',1,'task',100,0,0),(4,100,'Preliminaries','2025-09-29','2025-10-14',15,'summary',NULL,0,0),(5,103,'Submission of Drawing and Finishes for Approval','2025-10-08','2025-10-13',5,'task',100,0,0),(6,200,'Structural/Civil Works','2025-10-14','2025-12-28',75,'summary',NULL,0,0),(7,401,'Preparation of tools and materials for elevator installation','2025-12-28','2026-01-11',14,'task',400,0,0),(8,402,'Layout of boardup markings','2026-01-11','2026-01-14',3,'task',400,0,0),(9,201,'Shaft Construction','2025-10-14','2025-12-28',75,'task',200,0,0),(10,300,'Manufacturing and Importation Process (Passenger Elevator)','2025-10-14','2025-12-28',75,'summary',NULL,0,0),(11,301,'Manufacturing and Importation','2025-10-14','2025-12-28',75,'task',300,0,0),(12,403,'Partial delivery of tools and boardup materials','2026-01-14','2026-01-17',3,'task',400,0,0),(13,500,'Mechanical Installation (Passenger Elevator)','2026-01-17','2026-03-03',45,'summary',NULL,0,0),(14,501,'Unloading of elevator equipments','2026-01-17','2026-01-18',1,'task',500,0,0),(15,502,'Scaffolding Installation','2026-01-18','2026-01-20',2,'task',500,0,7),(16,504,'Template Setting','2026-01-22','2026-01-24',2,'task',500,0,7),(17,503,'Hauling Works','2026-01-20','2026-01-22',2,'task',500,0,7),(18,505,'Marking and Boring of Holes','2026-01-24','2026-01-25',1,'task',500,0,0),(19,506,'Rail Bracket Installation','2026-01-25','2026-01-27',2,'task',500,0,7),(20,507,'Guide Rail Setting','2026-01-27','2026-02-01',5,'summary',500,0,0),(21,508,'Main/Car','2026-01-27','2026-01-29',2,'task',507,0,5),(22,509,'Counterweight (CWT)','2026-01-29','2026-01-31',2,'task',507,0,3),(23,510,'Gauging','2026-01-31','2026-02-01',1,'task',507,0,3),(24,511,'Landing Door Assembly','2026-02-01','2026-02-07',6,'summary',500,0,0),(25,512,'Sills and Supports','2026-02-01','2026-02-03',2,'task',511,0,2),(26,513,'Jamb and Supports','2026-02-03','2026-02-05',2,'task',511,0,2),(27,514,'Frame and Doors','2026-02-05','2026-02-07',2,'task',511,0,3),(28,515,'M/R Equipment Setting','2026-02-07','2026-02-13',6,'summary',500,0,0),(29,400,'Planning For Mobilization And Execution','2025-12-28','2026-01-17',20,'summary',NULL,0,0),(30,516,'Traction Machine','2026-02-07','2026-02-09',2,'task',515,0,5),(31,517,'Support Beams','2026-02-09','2026-02-11',2,'task',515,0,5),(32,518,'Governor','2026-02-11','2026-02-13',2,'task',515,0,2),(33,519,'Installation of Control Panel','2026-02-13','2026-02-15',2,'task',500,0,3),(34,521,'All Accessories','2026-02-15','2026-02-17',2,'task',520,0,3),(35,522,'Car Piping/Wiring','2026-02-17','2026-02-18',1,'task',520,0,3),(36,523,'Travelling Cable Layout','2026-02-18','2026-02-20',2,'task',500,0,2),(37,525,'Laying out of Ropes','2026-02-22','2026-02-27',5,'summary',500,0,0),(38,524,'Counterweight Assembly','2026-02-20','2026-02-22',2,'task',500,0,2),(39,520,'Car Assembly','2026-02-15','2026-02-18',3,'summary',500,0,0),(40,526,'Hoisting','2026-02-22','2026-02-24',2,'task',525,0,2),(41,527,'Governor','2026-02-24','2026-02-26',2,'task',525,0,3),(42,528,'Compensating','2026-02-26','2026-02-27',1,'task',525,0,3),(43,530,'Machine Room','2026-02-27','2026-02-28',1,'task',529,0,5),(44,529,'Wiring','2026-02-27','2026-03-01',2,'summary',500,0,0),(45,531,'Hoistway','2026-02-28','2026-03-01',1,'task',529,0,3),(46,532,'Installation of Pit Ladder / Hoistway Lighting','2026-03-01','2026-03-03',2,'task',500,0,3),(47,600,'Testing and Commissioning (Passenger Elevator)','2026-03-03','2026-03-18',15,'summary',NULL,0,0),(48,601,'Initial testing','2026-03-03','2026-03-06',3,'task',600,0,3),(49,602,'Slow speed','2026-03-06','2026-03-08',2,'task',600,0,1),(50,603,'High speed and Mechanical Adjustment','2026-03-08','2026-03-10',2,'task',600,0,2),(51,604,'Load Test','2026-03-10','2026-03-12',2,'task',600,0,1),(52,605,'Final Adjust','2026-03-12','2026-03-14',2,'task',600,0,1),(53,606,'Features Test / Correction of Defects','2026-03-14','2026-03-16',2,'task',600,0,1),(54,607,'Final Cleaning / Hand over','2026-03-16','2026-03-18',2,'task',600,0,1);
/*!40000 ALTER TABLE `project_48_schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_799_schedule`
--

DROP TABLE IF EXISTS `project_799_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_799_schedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `task_id` int DEFAULT NULL,
  `task_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_start` date DEFAULT NULL,
  `task_end` date DEFAULT NULL,
  `task_duration` int DEFAULT NULL,
  `task_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_parent` int DEFAULT NULL,
  `task_done` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_799_schedule`
--

LOCK TABLES `project_799_schedule` WRITE;
/*!40000 ALTER TABLE `project_799_schedule` DISABLE KEYS */;
INSERT INTO `project_799_schedule` VALUES (1,500,'Mechanical Installation (Passenger Elevator)','2025-09-06','2025-10-21',45,'summary',NULL,0),(2,533,'IshowSpeednigga','2025-09-06','2025-09-07',1,'task',500,0),(3,503,'Hauling Works','2025-09-10','2025-09-12',2,'task',500,0),(4,504,'Template Setting','2025-09-12','2025-09-14',2,'task',500,0),(5,509,'Counterweight (CWT)','2025-09-19','2025-09-21',2,'task',507,0),(6,508,'Main/Car','2025-09-17','2025-09-19',2,'task',507,0),(7,501,'Unloading of elevator equipments','2025-09-07','2025-09-08',1,'task',500,0),(8,502,'Scaffolding Installation','2025-09-08','2025-09-10',2,'task',500,0),(9,505,'Marking and Boring of Holes','2025-09-14','2025-09-15',1,'task',500,0),(10,506,'Rail Bracket Installation','2025-09-15','2025-09-17',2,'task',500,0),(11,507,'Guide Rail Setting','2025-09-17','2025-09-22',5,'summary',500,0),(12,510,'Gauging','2025-09-21','2025-09-22',1,'task',507,0),(13,511,'Landing Door Assembly','2025-09-22','2025-09-28',6,'summary',500,0),(14,512,'Sills and Supports','2025-09-22','2025-09-24',2,'task',511,0),(15,513,'Jamb and Supports','2025-09-24','2025-09-26',2,'task',511,0),(16,514,'Frame and Doors','2025-09-26','2025-09-28',2,'task',511,0),(17,515,'M/R Equipment Setting','2025-09-28','2025-10-04',6,'summary',500,0),(18,516,'Traction Machine','2025-09-28','2025-09-30',2,'task',515,0),(19,517,'Support Beams','2025-09-30','2025-10-02',2,'task',515,0),(20,518,'Governor','2025-10-02','2025-10-04',2,'task',515,0),(21,519,'Installation of Control Panel','2025-10-04','2025-10-06',2,'task',500,0),(22,521,'All Accessories','2025-10-06','2025-10-08',2,'task',520,0),(23,522,'Car Piping/Wiring','2025-10-08','2025-10-09',1,'task',520,0),(24,523,'Travelling Cable Layout','2025-10-09','2025-10-11',2,'task',500,0),(25,524,'Counterweight Assembly','2025-10-11','2025-10-13',2,'task',500,0),(26,520,'Car Assembly','2025-10-06','2025-10-09',3,'summary',500,0),(27,525,'Laying out of Ropes','2025-10-13','2025-10-18',5,'summary',500,0),(28,526,'Hoisting','2025-10-13','2025-10-15',2,'task',525,0),(29,527,'Governor','2025-10-15','2025-10-17',2,'task',525,0),(30,528,'Compensating','2025-10-17','2025-10-18',1,'task',525,0),(31,529,'Wiring','2025-10-18','2025-10-20',2,'summary',500,0),(32,530,'Machine Room','2025-10-18','2025-10-19',1,'task',529,0),(33,531,'Hoistway','2025-10-19','2025-10-20',1,'task',529,0),(34,532,'Installation of Pit Ladder / Hoistway Lighting','2025-10-20','2025-10-22',2,'task',500,0),(35,600,'Testing and Commissioning (Passenger Elevator)','2025-10-22','2025-11-06',15,'summary',NULL,0),(36,601,'Initial testing','2025-10-22','2025-10-25',3,'task',600,0),(37,602,'Slow speed','2025-10-25','2025-10-27',2,'task',600,0),(38,603,'High speed and Mechanical Adjustment','2025-10-27','2025-10-29',2,'task',600,0),(39,605,'Final Adjust','2025-10-31','2025-11-02',2,'task',600,0),(40,606,'Features Test / Correction of Defects','2025-11-02','2025-11-04',2,'task',600,0),(41,607,'Final Cleaning / Hand over','2025-11-04','2025-11-06',2,'task',600,0),(42,604,'Load Test','2025-10-29','2025-10-31',2,'task',600,0);
/*!40000 ALTER TABLE `project_799_schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_800_schedule`
--

DROP TABLE IF EXISTS `project_800_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_800_schedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `task_id` int DEFAULT NULL,
  `task_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_start` date DEFAULT NULL,
  `task_end` date DEFAULT NULL,
  `task_duration` int DEFAULT NULL,
  `task_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_parent` int DEFAULT NULL,
  `task_done` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_800_schedule`
--

LOCK TABLES `project_800_schedule` WRITE;
/*!40000 ALTER TABLE `project_800_schedule` DISABLE KEYS */;
INSERT INTO `project_800_schedule` VALUES (1,500,'Mechanical Installation (Passenger Elevator)','2025-09-06','2025-10-21',45,'summary',NULL,0),(2,533,'IshowSpeednigga','2025-09-06','2025-09-07',1,'task',500,0),(3,501,'Unloading of elevator equipments','2025-09-07','2025-09-08',1,'task',500,0),(4,503,'Hauling Works','2025-09-10','2025-09-12',2,'task',500,0),(5,502,'Scaffolding Installation','2025-09-08','2025-09-10',2,'task',500,0),(6,505,'Marking and Boring of Holes','2025-09-14','2025-09-15',1,'task',500,0),(7,504,'Template Setting','2025-09-12','2025-09-14',2,'task',500,0),(8,506,'Rail Bracket Installation','2025-09-15','2025-09-17',2,'task',500,0),(9,507,'Guide Rail Setting','2025-09-17','2025-09-22',5,'summary',500,0),(10,508,'Main/Car','2025-09-17','2025-09-19',2,'task',507,0),(11,509,'Counterweight (CWT)','2025-09-19','2025-09-21',2,'task',507,0),(12,512,'Sills and Supports','2025-09-22','2025-09-24',2,'task',511,0),(13,515,'M/R Equipment Setting','2025-09-28','2025-10-04',6,'summary',500,0),(14,517,'Support Beams','2025-09-30','2025-10-02',2,'task',515,0),(15,518,'Governor','2025-10-02','2025-10-04',2,'task',515,0),(16,519,'Installation of Control Panel','2025-10-04','2025-10-06',2,'task',500,0),(17,510,'Gauging','2025-09-21','2025-09-22',1,'task',507,0),(18,514,'Frame and Doors','2025-09-26','2025-09-28',2,'task',511,0),(19,516,'Traction Machine','2025-09-28','2025-09-30',2,'task',515,0),(20,513,'Jamb and Supports','2025-09-24','2025-09-26',2,'task',511,0),(21,511,'Landing Door Assembly','2025-09-22','2025-09-28',6,'summary',500,0),(22,520,'Car Assembly','2025-10-06','2025-10-09',3,'summary',500,0),(23,521,'All Accessories','2025-10-06','2025-10-08',2,'task',520,0),(24,522,'Car Piping/Wiring','2025-10-08','2025-10-09',1,'task',520,0),(25,523,'Travelling Cable Layout','2025-10-09','2025-10-11',2,'task',500,0),(26,524,'Counterweight Assembly','2025-10-11','2025-10-13',2,'task',500,0),(27,525,'Laying out of Ropes','2025-10-13','2025-10-18',5,'summary',500,0),(28,526,'Hoisting','2025-10-13','2025-10-15',2,'task',525,0),(29,527,'Governor','2025-10-15','2025-10-17',2,'task',525,0),(30,528,'Compensating','2025-10-17','2025-10-18',1,'task',525,0),(31,529,'Wiring','2025-10-18','2025-10-20',2,'summary',500,0),(32,530,'Machine Room','2025-10-18','2025-10-19',1,'task',529,0),(33,531,'Hoistway','2025-10-19','2025-10-20',1,'task',529,0),(34,532,'Installation of Pit Ladder / Hoistway Lighting','2025-10-20','2025-10-22',2,'task',500,0),(35,600,'Testing and Commissioning (Passenger Elevator)','2025-10-22','2025-11-06',15,'summary',NULL,0),(36,605,'Final Adjust','2025-10-31','2025-11-02',2,'task',600,0),(37,606,'Features Test / Correction of Defects','2025-11-02','2025-11-04',2,'task',600,0),(38,607,'Final Cleaning / Hand over','2025-11-04','2025-11-06',2,'task',600,0),(39,601,'Initial testing','2025-10-22','2025-10-25',3,'task',600,0),(40,602,'Slow speed','2025-10-25','2025-10-27',2,'task',600,0),(41,603,'High speed and Mechanical Adjustment','2025-10-27','2025-10-29',2,'task',600,0),(42,604,'Load Test','2025-10-29','2025-10-31',2,'task',600,0);
/*!40000 ALTER TABLE `project_800_schedule` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_daily_report`
--

LOCK TABLES `project_daily_report` WRITE;
/*!40000 ALTER TABLE `project_daily_report` DISABLE KEYS */;
INSERT INTO `project_daily_report` VALUES (7,1,'Work completed for today','work planned for the next day','describe any delays, issues','Any additional remarks or notes','2025-10-01','Foreman'),(8,44,'Work completed for project 44','work planned for the next day for project 44','Issues encountered at project 44','These are some notes for project 44','2025-10-01','Foreman'),(9,46,'Work completed for project 46','work planned for project 46','These are some of the issues encountered','Remarks and notes for project 46','2025-10-01','Foreman'),(13,1,'Set work completed','set planned work for next day','Here are some issues and delays','nah no additional notes','2025-10-02','Spongebob Squarepants'),(14,1,'Sills and support done team was highly organized','Further optimizations to elevator before next task','Quality issues on outer hull, nothing to major just need minor adjustments','N/A','2025-10-04','Spongebob Squarepants'),(15,44,'23','311','adsf','asfd','2025-10-09','Sandy Cheeks'),(16,47,'iu','iu','iu','iui','2025-10-09','Sheldon Plankton');
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
  PRIMARY KEY (`id`),
  KEY `project_engineer_id` (`project_engineer_id`),
  KEY `tnc_tech_id` (`tnc_tech_id`),
  KEY `team_id` (`team_id`),
  KEY `project_manpower_ibfk_2` (`project_id`),
  CONSTRAINT `project_manpower_ibfk_1` FOREIGN KEY (`project_engineer_id`) REFERENCES `employees` (`employee_id`),
  CONSTRAINT `project_manpower_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `project_manpower_ibfk_4` FOREIGN KEY (`tnc_tech_id`) REFERENCES `employees` (`employee_id`),
  CONSTRAINT `project_manpower_ibfk_5` FOREIGN KEY (`team_id`) REFERENCES `teams` (`team_id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_manpower`
--

LOCK TABLES `project_manpower` WRITE;
/*!40000 ALTER TABLE `project_manpower` DISABLE KEYS */;
INSERT INTO `project_manpower` VALUES (1,3,NULL,10,1),(2,4,NULL,13,44),(3,5,NULL,18,47),(4,6,NULL,37,46),(5,7,NULL,NULL,48),(6,3,NULL,NULL,265),(7,9,NULL,NULL,266),(18,7,NULL,NULL,305),(22,5,NULL,NULL,45),(23,6,NULL,NULL,267),(24,8,NULL,NULL,294),(25,6,NULL,NULL,306),(26,9,NULL,NULL,307);
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
  `cap` int DEFAULT NULL,
  `created_at` date DEFAULT (curdate()),
  `drive` varchar(255) NOT NULL,
  `door_operator` varchar(255) NOT NULL,
  `speed` int NOT NULL,
  `control` varchar(255) NOT NULL,
  `stops` int DEFAULT NULL,
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
  `manufacturing_end_date` date DEFAULT NULL,
  `installation_start_date` date DEFAULT NULL,
  `tnc_start_date` date DEFAULT NULL,
  `project_end_date` date DEFAULT NULL,
  `client` varchar(255) DEFAULT NULL,
  `product_type` varchar(255) DEFAULT NULL,
  `status` enum('Preliminaries','Structural/Manufacturing','Planning','Installation','Test and Comm','Completed') DEFAULT (_utf8mb4'Preliminaries'),
  `contract_amount` int DEFAULT NULL,
  `schedule_created` tinyint DEFAULT (0),
  `contract_type` enum('Monthly','Quarterly') DEFAULT NULL,
  `region` varchar(255) DEFAULT NULL,
  `province/municipality` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `current_task` varchar(255) DEFAULT NULL,
  `has_team` tinyint DEFAULT (0),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=308 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (1,'SkyLift 1003','High-speed passenger lift for a commercial buildings.',600,'2025-05-30','Gearless Traction','Automatic Sliding',8,'Microprocessor',11,'B1-F12','40m','3-Phase 415V','Concrete','2.5m x 2.5m','2.1m x 1.5m','1.2m x 2.1m',4500,1500,61,'2025-08-28','2025-09-17','2025-11-01','2025-11-16','Grand Horizon Commercial Towers',NULL,'Installation',NULL,1,NULL,NULL,NULL,NULL,'Travelling Cable Layout',0),(44,'Office Tower Elevator A','High-speed passenger elevator for new office building',700,'2025-06-13','Gearless Traction','Automatic Center Opening',4,'Microprocessor',10,'1-10','45m','3-phase 415V','Concrete','2.5m x 2.5m','2.1m x 1.5m','1.2m x 2.1m',4500,1500,21,'2025-09-11','2025-10-01','2025-11-17','2025-12-02','MetroRise Developers Inc.',NULL,'Installation',NULL,1,NULL,NULL,NULL,NULL,'Test Task',0),(45,'Residential Lift A','Medium-speed lift for apartment complex',900,'2025-09-25','Machine Room Less','Automatic Slide',7,'V3F',8,'1-8','28m','3-phase 380V','Concrete','2.2m x 2.2m','2.0m x 1.5m','1.1m x 2.0m',4200,1300,0,'2025-12-24','2026-01-13','2026-02-27','2026-03-14','Greenfield Residences',NULL,'Structural/Manufacturing',NULL,1,NULL,NULL,NULL,NULL,'Shaft Construction',0),(46,'Hospital Service Elevator','Heavy-duty service elevator for medical equipment transport',100,'2025-05-08','Hydraulic','Automatic Side Opening',1,'PLC',6,'B-5','25m','3-phase 400V','Steel Frame','3m x 3.5m','2.5m x 2.5m','2.0m x 2.5m',4000,1200,84,'2025-08-06','2025-08-26','2025-10-10','2025-10-25','St. Mary’s Medical Center',NULL,'Test and Comm',NULL,1,NULL,NULL,NULL,NULL,'Final Adjust',0),(47,'Shopping Mall Panoramic','Glass observation elevator for shopping center atrium',100,'2025-05-25','Gearless Traction','Automatic Glass',1,'MPC',5,'G-4','20m','3-phase','Glass & Steel','2500x2500mm','1800x1600mm','1200x2200mm',3500,900,69,'2025-08-23','2025-09-12','2025-10-27','2025-11-11','SunMall Group',NULL,'Installation',NULL,1,NULL,NULL,NULL,NULL,'Hoisting',0),(48,'Warehouse Freight Lift','Industrial cargo lift for warehouse operations',100,'2025-09-28','Geared Traction','Manual Roller',1,'Relay',4,'1-4','15m','3-phase','Structural Steel','3000x3000mm','2500x2200mm','2000x2500mm',2800,800,0,'2025-12-27','2026-01-16','2026-03-02','2026-03-17','Apex Logistics Corp.',NULL,'Structural/Manufacturing',NULL,1,NULL,NULL,NULL,NULL,'Shaft Construction',0),(265,'Omega-XL Passenger Elevator','High-capacity elevator for commercial buildings with advanced safety features',2000,'2025-09-28','Traction','Automatic Sliding',180,'Microprocessor V3F',15,'B2 to L15','45m','380V 3Phase','Concrete','2000x2000mm','1600x1400mm','1100',3500,1200,0,'2025-12-27','2026-01-16','2026-03-02','2026-03-17','Zenith Commercial Properties',NULL,'Structural/Manufacturing',NULL,1,NULL,NULL,NULL,NULL,'Shaft Construction',0),(266,'Hydro-Lift Freight Elevator','Heavy duty freight elevator for industrial applications',5000,'2025-06-21','Hydraulic','Vertical Bi-Parting',60,'Relay Logic',8,'G to L7','25m','415V 3Phase','Structural Steel','3000x3000mm','2800x2700mm','1400',4200,1500,0,'2025-10-04','2025-10-27','2025-12-18','2026-01-05','Titan Manufacturing Co.',NULL,'Planning',NULL,1,NULL,NULL,NULL,NULL,'Preparation of tools and materials for elevator installation',0),(267,'Eco-Mini Residential Elevator','Space-saving elevator for residential buildings with energy-efficient operation',400,'2025-09-07','Machine-Room-Less','Swing',90,'Solid State',5,'G to L4','15m','220V 1Phase','Pre-fabricated','1200x1200mm','900x900mm','800',2300,950,0,'2025-12-06','2025-12-26','2026-02-09','2026-02-24','EcoHomes Development Corp.',NULL,'Structural/Manufacturing',NULL,1,NULL,NULL,NULL,NULL,'Shaft Construction',0),(294,'Sample Lift Name','Some description',22,'2025-04-20','24','24',24,'24',41,'123','42','123','4','22','1424','4242',142,2424,100,'2025-07-19',NULL,NULL,'2025-10-07','Tapos SO PMS','hospital elevator','Completed',NULL,0,'Monthly',NULL,NULL,NULL,NULL,0),(305,'re5','545',434,'2025-10-18','34','3443',34343,'3343434',434,'444','34','34','34','3443','43434','34',343,434,0,NULL,NULL,NULL,NULL,'3321','passenger elevator','Preliminaries',NULL,0,NULL,'NCR','Metro Manila','Caloocan',NULL,0),(306,'234','qwre',6565,'2025-10-18','64','646',656,'64',6464,'65656','464','46','46','4','64','6',46,4,0,NULL,NULL,NULL,NULL,'23','hospital elevator','Preliminaries',NULL,0,NULL,'Region I','Ilocos Sur','Banayoyo',NULL,0),(307,'C Esporsado','fsda',656,'2025-10-19','6556','656',6566,'65656',66565,'65656','56565','6565','6565','6565','6565','55',55,55,0,NULL,NULL,NULL,NULL,'23','car elevator','Preliminaries',NULL,0,NULL,'CAR','Apayao','Calanasan',NULL,0);
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
  PRIMARY KEY (`id`),
  KEY `emp_id` (`emp_id`),
  KEY `team_members_ibfk_3` (`foreman_id`),
  CONSTRAINT `team_members_ibfk_2` FOREIGN KEY (`emp_id`) REFERENCES `employees` (`employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=142 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team_members`
--

LOCK TABLES `team_members` WRITE;
/*!40000 ALTER TABLE `team_members` DISABLE KEYS */;
INSERT INTO `team_members` VALUES (3,10,11,0),(4,10,12,0),(5,10,42,0),(6,10,43,0),(29,13,19,0),(30,13,20,0),(31,13,21,0),(34,18,38,0),(35,18,39,0),(36,18,40,0),(37,18,41,0),(72,37,57,0),(73,37,58,0),(74,37,59,0),(75,37,60,0);
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
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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

-- Dump completed on 2025-10-20 13:05:33
