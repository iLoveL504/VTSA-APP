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
-- Table structure for table `callback_documents`
--

DROP TABLE IF EXISTS `callback_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `callback_documents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `callback_id` int DEFAULT NULL,
  `contract_id` int DEFAULT NULL,
  `doc_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `document_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `callback_id` (`callback_id`),
  KEY `contract_id` (`contract_id`),
  CONSTRAINT `callback_documents_ibfk_1` FOREIGN KEY (`callback_id`) REFERENCES `callback_history` (`id`) ON DELETE CASCADE,
  CONSTRAINT `callback_documents_ibfk_2` FOREIGN KEY (`contract_id`) REFERENCES `contracts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `callback_documents`
--

LOCK TABLES `callback_documents` WRITE;
/*!40000 ALTER TABLE `callback_documents` DISABLE KEYS */;
/*!40000 ALTER TABLE `callback_documents` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `callback_inspection_team`
--

LOCK TABLES `callback_inspection_team` WRITE;
/*!40000 ALTER TABLE `callback_inspection_team` DISABLE KEYS */;
/*!40000 ALTER TABLE `callback_inspection_team` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `callback_photos`
--

DROP TABLE IF EXISTS `callback_photos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `callback_photos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `callback_id` int DEFAULT NULL,
  `contract_id` int DEFAULT NULL,
  `doc_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `callback_id` (`callback_id`),
  KEY `contract_id` (`contract_id`),
  CONSTRAINT `callback_photos_ibfk_1` FOREIGN KEY (`callback_id`) REFERENCES `callback_history` (`id`) ON DELETE CASCADE,
  CONSTRAINT `callback_photos_ibfk_2` FOREIGN KEY (`contract_id`) REFERENCES `contracts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `callback_photos`
--

LOCK TABLES `callback_photos` WRITE;
/*!40000 ALTER TABLE `callback_photos` DISABLE KEYS */;
/*!40000 ALTER TABLE `callback_photos` ENABLE KEYS */;
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
INSERT INTO `client_baby_book` VALUES (45,'Greenfield Residences','2025-11-23 17:10:51'),(48,'Apex Logistics Corp.','2025-11-21 11:40:34'),(328,'Saint Ireneus','2025-11-21 12:17:05'),(344,'Silverstone Properties','2025-11-21 12:17:52');
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
  `contract_start_date` date DEFAULT (curdate()),
  `contract_end_date` date DEFAULT NULL,
  `renewal_number` int DEFAULT '1',
  `current_contract` tinyint DEFAULT '1',
  `free_pms` tinyint DEFAULT (1),
  PRIMARY KEY (`id`),
  KEY `contracts_ibfk_1` (`baby_book_id`),
  CONSTRAINT `contracts_ibfk_1` FOREIGN KEY (`baby_book_id`) REFERENCES `client_baby_book` (`pms_id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contracts`
--

LOCK TABLES `contracts` WRITE;
/*!40000 ALTER TABLE `contracts` DISABLE KEYS */;
INSERT INTO `contracts` VALUES (15,48,NULL,'2025-11-21',NULL,1,1,1),(16,328,NULL,'2025-11-21',NULL,1,1,1),(17,344,NULL,'2025-11-21',NULL,1,1,1),(18,45,NULL,'2025-11-24',NULL,1,1,1);
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
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `daily_report_photos`
--

LOCK TABLES `daily_report_photos` WRITE;
/*!40000 ALTER TABLE `daily_report_photos` DISABLE KEYS */;
/*!40000 ALTER TABLE `daily_report_photos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `default_tasks`
--

DROP TABLE IF EXISTS `default_tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `default_tasks` (
  `id` int NOT NULL,
  `text` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('task','summary') COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `duration` int DEFAULT NULL,
  `parent` int DEFAULT NULL,
  `is_open` tinyint(1) DEFAULT '1',
  `percent_progress` decimal(5,2) DEFAULT '0.00',
  `section_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `weight` decimal(5,2) DEFAULT NULL,
  `item_code` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_parent` (`parent`),
  KEY `idx_type` (`type`),
  KEY `idx_section_title` (`section_title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `default_tasks`
--

LOCK TABLES `default_tasks` WRITE;
/*!40000 ALTER TABLE `default_tasks` DISABLE KEYS */;
INSERT INTO `default_tasks` VALUES (100,'Preliminaries','summary',NULL,NULL,15,0,1,0.00,NULL,NULL,NULL,'2025-11-18 06:06:26','2025-11-18 06:06:26'),(101,'Pre-Inspection(Checkin of Shaft)','task',NULL,NULL,6,100,1,0.00,NULL,NULL,NULL,'2025-11-18 06:06:26','2025-11-18 06:06:26'),(102,'Layout of Drawing','task',NULL,NULL,3,100,1,0.00,NULL,NULL,NULL,'2025-11-18 06:06:26','2025-11-18 06:06:26'),(103,'Submission of Drawing and Finishes for Approval','task',NULL,NULL,5,100,1,0.00,NULL,NULL,NULL,'2025-11-18 06:06:26','2025-11-18 06:06:26'),(104,'Submission of PO to Factory','task',NULL,NULL,1,100,1,0.00,NULL,NULL,NULL,'2025-11-18 06:06:26','2025-11-18 06:06:26'),(200,'Structural/Civil Works','summary',NULL,NULL,47,0,1,0.00,NULL,NULL,NULL,'2025-11-18 06:06:26','2025-11-18 06:06:26'),(201,'Shaft Construction','task',NULL,NULL,47,200,1,0.00,NULL,NULL,NULL,'2025-11-18 06:06:26','2025-11-18 06:06:26'),(300,'Manufacturing and Importation Process','summary',NULL,NULL,47,0,1,0.00,NULL,NULL,NULL,'2025-11-18 06:06:26','2025-11-18 06:06:26'),(301,'Manufacturing and Importation','task',NULL,NULL,47,300,1,0.00,NULL,NULL,NULL,'2025-11-18 06:06:26','2025-11-18 06:06:26'),(400,'Planning For Mobilization And Execution','summary',NULL,NULL,20,0,1,0.00,NULL,NULL,NULL,'2025-11-18 06:06:26','2025-11-18 06:06:26'),(401,'Preparation of tools and materials for elevator installation','task',NULL,NULL,14,400,1,0.00,NULL,NULL,NULL,'2025-11-18 06:06:26','2025-11-18 06:06:26'),(402,'Layout of boardup markings','task',NULL,NULL,3,400,1,0.00,NULL,NULL,NULL,'2025-11-18 06:06:26','2025-11-18 06:06:26'),(403,'Partial delivery of tools and boardup materials','task',NULL,NULL,3,400,1,0.00,NULL,NULL,NULL,'2025-11-18 06:06:26','2025-11-18 06:06:26'),(404,'Preperation for Installation/Manufacturing','task',NULL,NULL,8,400,1,0.00,NULL,NULL,NULL,'2025-11-18 06:06:26','2025-11-18 06:06:26'),(500,'Mechanical Installation','summary',NULL,NULL,45,0,1,0.00,NULL,NULL,NULL,'2025-11-18 06:06:26','2025-11-18 06:06:26'),(501,'Unloading of elevator equipments','task',NULL,NULL,1,500,1,0.00,'General',0.00,'1','2025-11-18 06:06:26','2025-11-18 06:06:26'),(502,'Scaffolding Installation','task',NULL,NULL,2,500,1,7.00,'General',7.00,'2','2025-11-18 06:06:26','2025-11-18 06:06:26'),(503,'Hauling Works','task',NULL,NULL,2,500,1,7.00,'General',7.00,'3','2025-11-18 06:06:26','2025-11-18 06:06:26'),(504,'Template Setting','task',NULL,NULL,2,500,1,7.00,'General',7.00,'4','2025-11-18 06:06:26','2025-11-18 06:06:26'),(505,'Marking and Boring of Holes','task',NULL,NULL,1,500,1,0.00,'General',0.00,'5','2025-11-18 06:06:26','2025-11-18 06:06:26'),(506,'Rail Bracket Installation','task',NULL,NULL,2,500,1,7.00,'General',7.00,'6','2025-11-18 06:06:26','2025-11-18 06:06:26'),(507,'Guide Rail Setting','summary',NULL,NULL,5,500,0,0.00,NULL,NULL,NULL,'2025-11-18 06:06:26','2025-11-18 06:06:26'),(508,'Main/Car','task',NULL,NULL,2,507,1,5.00,'Guide Rail Setting',5.00,'A','2025-11-18 06:06:26','2025-11-18 06:06:26'),(509,'Counterweight (CWT)','task',NULL,NULL,2,507,1,3.00,'Guide Rail Setting',3.00,'B','2025-11-18 06:06:26','2025-11-18 06:06:26'),(510,'Gauging','task',NULL,NULL,1,507,1,3.00,'Guide Rail Setting',3.00,'C','2025-11-18 06:06:26','2025-11-18 06:06:26'),(511,'Landing Door Assembly','summary',NULL,NULL,6,500,0,0.00,NULL,NULL,NULL,'2025-11-18 06:06:26','2025-11-18 06:06:26'),(512,'Sills and Supports','task',NULL,NULL,2,511,1,2.00,'Landing Door Assembly',2.00,'A','2025-11-18 06:06:26','2025-11-18 06:06:26'),(513,'Jamb and Supports','task',NULL,NULL,2,511,1,2.00,'Landing Door Assembly',2.00,'B','2025-11-18 06:06:26','2025-11-18 06:06:26'),(514,'Frame and Doors','task',NULL,NULL,2,511,1,3.00,'Landing Door Assembly',3.00,'C','2025-11-18 06:06:26','2025-11-18 06:06:26'),(515,'M/R Equipment Setting','summary',NULL,NULL,6,500,0,0.00,NULL,NULL,NULL,'2025-11-18 06:06:26','2025-11-18 06:06:26'),(516,'Traction Machine','task',NULL,NULL,2,515,1,5.00,'M/R Equipment Setting',5.00,'A','2025-11-18 06:06:26','2025-11-18 06:06:26'),(517,'Support Beams','task',NULL,NULL,2,515,1,5.00,'M/R Equipment Setting',5.00,'B','2025-11-18 06:06:26','2025-11-18 06:06:26'),(518,'Governor (M/R)','task',NULL,NULL,2,515,1,2.00,'M/R Equipment Setting',2.00,'C','2025-11-18 06:06:26','2025-11-18 06:06:26'),(519,'Installation of Control Panel','task',NULL,NULL,2,500,1,3.00,'M/R Equipment Setting',3.00,'D','2025-11-18 06:06:26','2025-11-18 06:06:26'),(520,'Car Assembly','summary',NULL,NULL,3,500,0,0.00,NULL,NULL,NULL,'2025-11-18 06:06:26','2025-11-18 06:06:26'),(521,'All Accessories','task',NULL,NULL,2,520,1,3.00,'Car Assembly',3.00,'A','2025-11-18 06:06:26','2025-11-18 06:06:26'),(522,'Car Piping/Wiring','task',NULL,NULL,1,520,1,3.00,'Car Assembly',3.00,'B','2025-11-18 06:06:26','2025-11-18 06:06:26'),(523,'Travelling Cable Layout','task',NULL,NULL,2,500,1,2.00,'Car Assembly',2.00,'C','2025-11-18 06:06:26','2025-11-18 06:06:26'),(524,'Counterweight Assembly','task',NULL,NULL,2,500,1,2.00,'Car Assembly',2.00,'D','2025-11-18 06:06:26','2025-11-18 06:06:26'),(525,'Laying out of Ropes','summary',NULL,NULL,5,500,0,0.00,NULL,NULL,NULL,'2025-11-18 06:06:26','2025-11-18 06:06:26'),(526,'Hoisting','task',NULL,NULL,2,525,1,2.00,'Laying out of ropes',2.00,'A','2025-11-18 06:06:26','2025-11-18 06:06:26'),(527,'Governor (Ropes)','task',NULL,NULL,2,525,1,3.00,'Compensating',3.00,'B','2025-11-18 06:06:26','2025-11-18 06:06:26'),(528,'Compensating','task',NULL,NULL,1,525,1,3.00,'Laying out of ropes',3.00,'C','2025-11-18 06:06:26','2025-11-18 06:06:26'),(529,'Wiring','summary',NULL,NULL,2,500,0,0.00,NULL,NULL,NULL,'2025-11-18 06:06:26','2025-11-18 06:06:26'),(530,'Machine Room','task',NULL,NULL,1,529,1,5.00,'Wiring',5.00,'A','2025-11-18 06:06:26','2025-11-18 06:06:26'),(531,'Hoistway','task',NULL,NULL,1,529,1,3.00,'Wiring',3.00,'B','2025-11-18 06:06:26','2025-11-18 06:06:26'),(532,'Installation of Pit Ladder / Hoistway Lighting','task',NULL,NULL,2,500,1,3.00,'Wiring',3.00,'C','2025-11-18 06:06:26','2025-11-18 06:06:26'),(600,'Testing and Commissioning','summary',NULL,NULL,15,0,1,0.00,NULL,NULL,NULL,'2025-11-18 06:06:26','2025-11-18 06:06:26'),(601,'Initial testing','task',NULL,NULL,3,600,1,3.00,'Testing and Commissioning (Passenger Elevator)',3.00,'A','2025-11-18 06:06:26','2025-11-18 06:06:26'),(602,'Slow speed','task',NULL,NULL,2,600,1,1.00,'Testing and Commissioning (Passenger Elevator)',1.00,'B','2025-11-18 06:06:26','2025-11-18 06:06:26'),(603,'High speed and Mechanical Adjustment','task',NULL,NULL,2,600,1,2.00,'Testing and Commissioning (Passenger Elevator)',2.00,'C','2025-11-18 06:06:26','2025-11-18 06:06:26'),(604,'Load Test','task',NULL,NULL,2,600,1,1.00,'Testing and Commissioning (Passenger Elevator)',1.00,'D','2025-11-18 06:06:26','2025-11-18 06:06:26'),(605,'Final Adjust','task',NULL,NULL,2,600,1,1.00,'Testing and Commissioning (Passenger Elevator)',1.00,'E','2025-11-18 06:06:26','2025-11-18 06:06:26'),(606,'Features Test / Correction of Defects','task',NULL,NULL,2,600,1,1.00,'Testing and Commissioning (Passenger Elevator)',1.00,'F','2025-11-18 06:06:26','2025-11-18 06:06:26'),(607,'Final Cleaning / Hand over','task',NULL,NULL,2,600,1,1.00,'Testing and Commissioning (Passenger Elevator)',1.00,'G','2025-11-18 06:06:26','2025-11-18 06:06:26');
/*!40000 ALTER TABLE `default_tasks` ENABLE KEYS */;
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
  `email` varchar(40) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  `phone_number` varchar(40) DEFAULT NULL,
  `employee_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `job` varchar(25) DEFAULT NULL,
  `branch` varchar(255) DEFAULT NULL,
  `prev_foreman` int DEFAULT NULL,
  `secondary_job` varchar(255) DEFAULT NULL,
  `hire_date` date DEFAULT (curdate()),
  `is_active` tinyint(1) DEFAULT '0',
  `refresh_token` varchar(550) DEFAULT NULL,
  `island_group` enum('Luzon','Visayas','Mindanao') DEFAULT NULL,
  `in_house` tinyint DEFAULT (1),
  PRIMARY KEY (`employee_id`),
  KEY `prev_foreman` (`prev_foreman`),
  CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`prev_foreman`) REFERENCES `employees` (`employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=134 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES ('BalaneJustin',NULL,'Password123!',NULL,1,'Justin','Balane','Operations Manager','Pasig',NULL,NULL,'2023-01-02',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkZpdHpnZXJhbGRKIiwiaWF0IjoxNzYzMDgzMTI2LCJleHAiOjE3NjMxNjk1MjZ9.7ih1lr3KvuYcEZ_HQ6HvVcjnajNdkbvQT_HJMmu_6Tw','Luzon',1),('FremistaE',NULL,'Password123!',NULL,2,'Edzeil','Fremista','Project Manager','Pasig',NULL,NULL,'2023-01-03',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkZyZW1pc3RhRSIsImlhdCI6MTc2Mzk3OTg5OCwiZXhwIjoxNzY0MDY2Mjk4fQ.xbhrI71RaQSGQGAbcLIUKN3SH9_TPDsiB_x2XeMSOxw','Luzon',1),('PorioJ',NULL,'Password123!',NULL,3,'Jhonuel','Porio','Project Engineer','Cebu',NULL,NULL,'2024-01-04',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlBvcmlvSiIsImlhdCI6MTc2Mzk3NjY0NywiZXhwIjoxNzY0MDYzMDQ3fQ.QUB87e6rj_ZxbKoUKZTYEfMfkr2AFs7c-0TWB_NeBYM','Visayas',1),('VillalinoJ',NULL,'Password123!','093-564-2476',4,'Jomar','Villalinou','Project Engineer','Pasig',NULL,NULL,'2023-01-05',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlZpbGxhbGlub0oiLCJpYXQiOjE3NjM5ODQ4MjQsImV4cCI6MTc2NDA3MTIyNH0.U7cxadNqYhkuEe00SR-LczlWyipjSScMtN0SA7UfDUM','Luzon',1),('CruzN',NULL,'Password123!',NULL,5,'Nathaniel','Cruz','Project Engineer','Pasig',NULL,NULL,'2023-01-06',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkNydXpOIiwiaWF0IjoxNzYzNTIwMDU2LCJleHAiOjE3NjM2MDY0NTZ9.GnWIPC7vjP0TXyj2a2Vi8FELDgNTfn0vF5WGYOp4HPs','Luzon',1),('MirafloresE',NULL,'Password123!',NULL,6,'Eleazar','Miraflores','Project Engineer','Davao',NULL,NULL,'2023-01-07',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlJleWVzRCIsImlhdCI6MTc2MzA0OTcxNCwiZXhwIjoxNzYzMTM2MTE0fQ.XsF7xbEaodChsDkZzbL5OrNnnzqvndPHZPifegRp2nI','Mindanao',1),('BalaneJ',NULL,'Password123!',NULL,7,'Joel','Balane','Project Engineer','Baguio',NULL,NULL,'2023-02-01',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkJhbGFuZUoiLCJpYXQiOjE3NjM5MjM3OTYsImV4cCI6MTc2NDAxMDE5Nn0.Tsz0iqMMge2SN8xLQprANL19Kpx4YjDeWC91Usp_HzM','Luzon',1),('PagaroM',NULL,'Password123!',NULL,9,'Mark','Pagaro','Project Engineer','Pasig',NULL,NULL,'2023-03-10',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlV5QyIsImlhdCI6MTc2MzAzNTczMywiZXhwIjoxNzYzMTIyMTMzfQ._33iR2qrNm3Hci3vW9B2J-A7oWhHVtS1n1cLKgfDlL8','Luzon',1),('NatP',NULL,'Password123!','',10,'Nat','Peterson','Foreman','Cebu',NULL,NULL,'2023-04-05',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik5hdFAiLCJpYXQiOjE3NjM5MzQ4MTEsImV4cCI6MTc2NDAyMTIxMX0.9ZZwSWhJcsrmIN9YwLQUo2Vlg1CAnx2xVfBRuNS8A80','Visayas',1),('Tom',NULL,'Password123!',NULL,11,'Tom','Johnson','Skilled Installer','Pasig',13,NULL,'2023-05-12',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlRvbSIsImlhdCI6MTc2MzMwMDk5MCwiZXhwIjoxNzYzMzg3MzkwfQ.M5QoGQM2_BruntmpfmyoyiVC07-CGvqwD-DO4DSpfqg','Luzon',1),('GarciaA',NULL,'Password123!',NULL,12,'Antonio','Garcia','Skilled Installer','Baguio',NULL,NULL,'2023-05-15',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkZyZWQiLCJpYXQiOjE3NTc1ODUxODYsImV4cCI6MTc1NzY3MTU4Nn0.zpCYclwwmnS7aBWq6CZY1X2ZuRmGwpmwdky0XCoGphM','Luzon',1),('GavinG',NULL,'Password123!',NULL,13,'Gallego','Gavin','Foreman','Cebu',NULL,NULL,'2023-06-01',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik5lYmJ5IiwiaWF0IjoxNzYzNDkyOTUwLCJleHAiOjE3NjM1NzkzNTB9.UTLcv_pynOkDvYGj1khGIjbfkyrSHeCYU3lVGx83-h8','Visayas',1),('AlbertP',NULL,'Password123!','093-564-2476',14,'Albert','Pablo','Skilled Installer','Davao',NULL,NULL,'2023-06-10',1,NULL,'Mindanao',1),('AquinoL',NULL,'Password123!',NULL,15,'Luis','Aquino','Skilled Installer','Cebu',NULL,NULL,'2023-07-01',1,NULL,'Visayas',1),('Betsy',NULL,'Password123!',NULL,16,'Betsy','Krabs','Skilled Installer','Pasig',53,NULL,'2023-07-15',1,NULL,'Luzon',1),('OliverosF',NULL,'Password123!',NULL,17,'Fraley','Oliveros','Skilled Installer','Cebu',NULL,NULL,'2023-08-01',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkdhcnkiLCJpYXQiOjE3NjM1MDM5OTAsImV4cCI6MTc2MzU5MDM5MH0.1tpr9nB5h9fWfUFqe5Jc6iG1TRilcNWHuZrYoywh0CY','Visayas',1),('Dela CruzJ',NULL,'Password123!',NULL,18,'Jose','Dela Cruz','Foreman','Cebu',NULL,NULL,'2023-08-10',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkRlbGEgQ3J1ekoiLCJpYXQiOjE3NjM0ODk5NTEsImV4cCI6MTc2MzU3NjM1MX0.G7-ZYur117pBNtGZY_I5CUa8xVK6vj6JoRpCvSWYkU0','Visayas',1),('ConnorN',NULL,'Password123!',NULL,19,'Nick','Connor','Skilled Installer','Pasig',NULL,NULL,'2023-09-01',1,NULL,'Luzon',1),('San JoseK',NULL,'Password123!',NULL,20,'Kylen','San Jose','Installer','Davao',13,NULL,'2023-09-15',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IktpbmdOZXB0dW5lIiwiaWF0IjoxNzYxOTA1NDg4LCJleHAiOjE3NjE5OTE4ODh9.e8m3cgdQtyzlFSaDHlADfLwTy-WlUT7ZDVabE2Vfmhc','Mindanao',1),('LegaspiZ',NULL,'Password123!',NULL,21,'Zion','Legaspi','Installer','Davao',NULL,NULL,'2023-10-01',1,NULL,'Mindanao',1),('JohnDoe',NULL,'Password123!',NULL,37,'John','Doe','Foreman','Pasig',NULL,NULL,'2023-07-01',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkpvaG5Eb2UiLCJpYXQiOjE3NjMwNDk3MzgsImV4cCI6MTc2MzEzNjEzOH0.vZAfwlet5Qtm7YITcfuj6Ui8TT8ta45dQmAFLRRzh-4','Luzon',1),('JaneSmith',NULL,'Password123!',NULL,38,'Jane','Smith','Installer','Pasig',NULL,NULL,'2023-07-05',1,NULL,'Luzon',1),('MikeJohnson',NULL,'Password123!',NULL,39,'Mike','Johnson','Installer','Pasig',53,NULL,'2023-07-10',1,NULL,'Luzon',1),('SarahWilson',NULL,'Password123!',NULL,40,'Sarah','Wilson','Installer','Pasig',NULL,NULL,'2023-07-15',0,NULL,'Luzon',1),('DavidBrown',NULL,'Password123!',NULL,41,'David','Brown','Installer','Pasig',NULL,NULL,'2023-07-20',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkRhdmlkQnJvd24iLCJpYXQiOjE3NjE4Mjg1NDksImV4cCI6MTc2MTkxNDk0OX0.7qwm23U60x1L79DgE6bV6Tifw6otgzATi1zSqqSXj8o','Luzon',1),('EmilyDavis',NULL,'Password123!',NULL,42,'Emily','Davis','Installer','Pasig',NULL,NULL,'2023-08-01',1,NULL,'Luzon',1),('RobertLee',NULL,'Password123!',NULL,43,'Robert','Lee','Installer','Pasig',NULL,NULL,'2023-08-05',1,NULL,'Luzon',1),('LisaTaylor',NULL,'Password123!',NULL,44,'Lisa','Taylor','Installer','Pasig',NULL,NULL,'2023-08-10',1,NULL,'Luzon',1),('ChrisMartin',NULL,'Password123!',NULL,45,'Chris','Martin','Installer','Pasig',NULL,NULL,'2023-08-15',0,NULL,'Luzon',1),('AmyClark',NULL,'Password123!',NULL,46,'Amy','Clark','Installer','Pasig',NULL,NULL,'2023-08-20',0,NULL,'Luzon',1),('KevinWhite',NULL,'Password123!',NULL,47,'Kevin','White','Installer','Pasig',NULL,NULL,'2023-09-01',0,NULL,'Luzon',1),('MichelleHall',NULL,'Password123!',NULL,48,'Michelle','Hall','Installer','Pasig',NULL,NULL,'2023-09-05',0,NULL,'Luzon',1),('BrianScott',NULL,'Password123!',NULL,49,'Brian','Scott','Installer','Pasig',NULL,NULL,'2023-09-10',1,NULL,'Luzon',1),('JessicaKing',NULL,'Password123!',NULL,50,'Jessica','King','Installer','Pasig',NULL,NULL,'2023-09-15',0,NULL,'Luzon',1),('DanielYoung',NULL,'Password123!',NULL,51,'Daniel','Young','Installer','Pasig',NULL,NULL,'2023-09-20',0,NULL,'Luzon',1),('JohnD',NULL,'Password123!',NULL,52,'Ray','Ban','Foreman','Pasig',NULL,NULL,'2023-04-10',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkpvaG5EIiwiaWF0IjoxNzYxNDAwMTk2LCJleHAiOjE3NjE0ODY1OTZ9.41qabzHa3JFTZIzLkrbNugs7_mtRSdU5TOhfOgE0BuE','Luzon',1),('MichaelB',NULL,'Password123!',NULL,53,'Michael','Brown','Foreman','Pasig',NULL,NULL,'2023-04-12',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik1pY2hhZWxCIiwiaWF0IjoxNzYzMDQ5OTI1LCJleHAiOjE3NjMxMzYzMjV9.sy_LZXiS5Fo0Yq5genjDgOk3juJy2G6p6-_0rDvcnY8','Luzon',1),('DavidW',NULL,'Password123!',NULL,54,'David','Williams','Foreman','Pasig',NULL,NULL,'2023-04-15',1,NULL,'Luzon',1),('ChrisT',NULL,'Password123!',NULL,55,'Chris','Taylor','Foreman','Pasig',NULL,NULL,'2023-04-18',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkNocmlzVCIsImlhdCI6MTc2MzI5Nzc5MCwiZXhwIjoxNzYzMzg0MTkwfQ.igfua5m_rSFocfqyTpn573mRw4JGVO3_79n4_G2O8sM','Luzon',1),('AnthonyM',NULL,'Password123!',NULL,56,'Anthony','Miller','Foreman','Pasig',NULL,NULL,'2023-04-20',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFudGhvbnlNIiwiaWF0IjoxNzYzNDkwODA3LCJleHAiOjE3NjM1NzcyMDd9.T7YhY45d9StQBZ4fmxoY_1zSHjmbp8PA12zTnJ9hD78','Luzon',1),('RyanLee',NULL,'Password123!',NULL,57,'Ryan','Lee','Installer','Pasig',NULL,NULL,'2023-10-01',1,NULL,'Luzon',1),('SarahBrown',NULL,'Password123!',NULL,58,'Sarah','Brown','Installer','Pasig',NULL,NULL,'2023-10-05',0,NULL,'Luzon',1),('JasonChen',NULL,'Password123!',NULL,59,'Jason','Chen','Installer','Pasig',NULL,NULL,'2023-10-10',0,NULL,'Luzon',1),('EmilyWright',NULL,'Password123!',NULL,60,'Emily','Wright','Installer','Pasig',NULL,NULL,'2023-10-15',0,NULL,'Luzon',1),('MichaelTurner',NULL,'Password123!',NULL,61,'Michael','Turner','Installer','Pasig',NULL,NULL,'2023-10-20',0,NULL,'Luzon',1),('OliviaParker',NULL,'Password123!',NULL,62,'Olivia','Parker','Installer','Pasig',NULL,NULL,'2023-10-25',0,NULL,'Luzon',1),('DavidMiller',NULL,'Password123!',NULL,63,'David','Miller','Installer','Pasig',NULL,NULL,'2023-11-01',0,NULL,'Luzon',1),('SophiaGarcia',NULL,'Password123!',NULL,64,'Sophia','Garcia','Installer','Pasig',NULL,NULL,'2023-11-05',0,NULL,NULL,1),('AndrewHill',NULL,'Password123!',NULL,65,'Andrew','Hill','Installer','Pasig',NULL,NULL,'2023-11-10',1,NULL,'Luzon',1),('GraceLewis',NULL,'Password123!',NULL,66,'Grace','Lewis','Installer','Pasig',NULL,NULL,'2023-11-15',1,NULL,'Luzon',1),('JoshuaWalker',NULL,'Password123!',NULL,67,'Joshua','Walker','Installer','Pasig',NULL,NULL,'2023-11-20',0,NULL,'Luzon',1),('ChloeRobinson',NULL,'Password123!',NULL,68,'Chloe','Robinson','Installer','Cebu',NULL,NULL,'2023-11-25',0,NULL,'Visayas',1),('NicholasHall',NULL,'Password123!',NULL,69,'Nicholas','Hall','Installer','Pasig',NULL,NULL,'2023-12-01',0,NULL,'Luzon',1),('LilyAllen',NULL,'Password123!',NULL,70,'Lily','Allen','Installer','Pasig',NULL,NULL,'2023-12-05',0,NULL,'Luzon',1),('TylerYoung',NULL,'Password123!',NULL,71,'Tyler','Young','Installer','Pasig',NULL,NULL,'2023-12-10',0,NULL,'Luzon',1),('HannahKing',NULL,'Password123!',NULL,72,'Hannah','King','Installer','Pasig',NULL,NULL,'2023-12-15',0,NULL,'Luzon',1),('BrandonScott',NULL,'Password123!',NULL,73,'Brandon','Scott','Installer','Pasig',NULL,NULL,'2023-12-20',0,NULL,'Luzon',1),('AvaGreen',NULL,'Password123!',NULL,74,'Ava','Green','Installer','Cebu',NULL,NULL,'2023-12-25',0,NULL,'Visayas',0),('JustinAdams',NULL,'Password123!',NULL,75,'Justin','Adams','Installer','Pasig',NULL,NULL,'2023-12-30',0,NULL,'Luzon',1),('MiaNelson',NULL,'Password123!',NULL,76,'Mia','Nelson','Installer','Pasig',NULL,NULL,'2024-01-04',0,NULL,'Luzon',1),('BalaneE',NULL,'Password123!',NULL,77,'Eric','Balane','PMS Coordinator','Pasig',NULL,NULL,'2025-10-31',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkJhbGFuZUUiLCJpYXQiOjE3NjM5NDAzMjMsImV4cCI6MTc2NDAyNjcyM30.xhQ9GV1ksloQ1rzYYhSMLUqSr-HxBY_6nqZD0JxSAsk','Luzon',1),('ArcheD',NULL,'Password123!',NULL,78,'Denitsa','Arche','PMS Technician','Pasig',NULL,NULL,'2025-10-31',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFyY2hlRCIsImlhdCI6MTc2MzUxOTY4NiwiZXhwIjoxNzYzNjA2MDg2fQ.l5g_e0v9-nHWW4uOerrmbfLLA4GnqJJFdjSJQMOSLyY','Mindanao',1),('YusufK',NULL,'Password123!',NULL,79,'Kassia','Yusuf','PMS Technician','Pasig',NULL,NULL,'2025-10-31',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ill1c3VmSyIsImlhdCI6MTc2Mzk1MDAwMCwiZXhwIjoxNzY0MDM2NDAwfQ.EZSEka8xZ9kA7jMDchs9KipZFweAHhmFGl9xWhk5g7U','Luzon',1),('SabasE',NULL,'Password123!',NULL,80,'Emilio','Sabas','PMS Technician','Davao',NULL,NULL,'2025-10-31',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkthbHBhbmFLIiwiaWF0IjoxNzYyNDM3OTkwLCJleHAiOjE3NjI1MjQzOTB9.vo7-XlyFapKZDsuTZkS_MEYDMo1d6SJTjS8JeFG5CfI','Mindanao',1),('DipakaT',NULL,'Password123!',NULL,81,'Toshiko','Dipaka','PMS Technician','Pasig',NULL,NULL,'2025-10-31',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkRpcGFrYVQiLCJpYXQiOjE3NjM5MTEyNTUsImV4cCI6MTc2Mzk5NzY1NX0.EB_R0dLKjLsCH2xVvk7QBACE_xEM0WKvUtd7jnqDBdw','Luzon',1),('YuuriI',NULL,'Password123!',NULL,82,'Ipek','Yuri','PMS Technician','Pasig',NULL,NULL,'2025-10-31',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ill1dXJpSSIsImlhdCI6MTc2MjA4NjE4NCwiZXhwIjoxNzYyMTcyNTg0fQ.I66FuQuBmfM6BpJkRMGJFO8iQ8rLIdGDYdeJD1TyM4Y','Luzon',1),('KeanK',NULL,'Password123!',NULL,83,'Kiuk','Kean','PMS Technician','Pasig',NULL,NULL,'2025-10-31',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IktlYW5LIiwiaWF0IjoxNzYzNTIwODQ1LCJleHAiOjE3NjM2MDcyNDV9.mtD2dzQYx2P0oqY2GwO46-FFAdwHHII-v_VwdDlxlz4','Luzon',1),('GallaF',NULL,'Password123!',NULL,86,'Faiza','Galla','TNC Technician','Pasig',NULL,NULL,'2025-10-31',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkdhbGxhRiIsImlhdCI6MTc2MzkxNjg5OCwiZXhwIjoxNzY0MDAzMjk4fQ.Esy7siv_XLvvWR3VrNoRkddjxZLQ5UICeOH3Xonavd0','Luzon',1),('LoganP',NULL,'Password123!',NULL,87,'Pepcan','Logan','TNC Technician','Pasig',NULL,NULL,'2025-10-31',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkxvZ2FuUCIsImlhdCI6MTc2MzAzNTY1OSwiZXhwIjoxNzYzMTIyMDU5fQ.KvgWONgyNdv8OZg4Ph_GUgEJKEKdcI8hoiA3W9jJJX8','Luzon',1),('IgnaasM',NULL,'Password123!',NULL,88,'Machlain','Ignaas','TNC Technician','Pasig',NULL,NULL,'2025-10-31',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IklnbmFhc00iLCJpYXQiOjE3NjMwMTY1NjksImV4cCI6MTc2MzEwMjk2OX0.dLlxDWtnm8hi3s0Kxp6d0m0IB4WBQvvkJLvhNlyZAaM','Luzon',1),('RoosN',NULL,'Password123!',NULL,89,'Nelle','Roos','TNC Technician','Pasig',NULL,NULL,'2025-10-31',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlJvb3NOIiwiaWF0IjoxNzYzMDQ3NTAxLCJleHAiOjE3NjMxMzM5MDF9.HsQ7BJL5NaK1korcNlTaecDcWS0AnJFu5mg6Myf6CPI','Luzon',1),('RajaD',NULL,'Password123!',NULL,90,'Declan','Raja','TNC Technician','Pasig',NULL,NULL,'2025-10-31',0,NULL,'Luzon',1),('Humphry',NULL,'Password123!',NULL,91,'Vincenzo','Humphry','QAQC','Pasig',NULL,NULL,'2025-10-31',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ikh1bXBocnkiLCJpYXQiOjE3NjM5NTY4OTcsImV4cCI6MTc2NDA0MzI5N30.a_VIZxB1dJJ4A5jnKuqMwYBIl0Si6uUC10iCKmsn3L4','Luzon',1),('TomWilson',NULL,'Password123!',NULL,92,'Tom','Wilson','QAQC','Pasig',NULL,NULL,'2024-01-15',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlRvbVdpbHNvbiIsImlhdCI6MTc2MzQ0MTQ4NSwiZXhwIjoxNzYzNTI3ODg1fQ.fz8S234jFNbjMAJuNEXcGkT-rAKIw_go7ZDtn8v30lE','Luzon',1),('JessicaBrown',NULL,'Password123!',NULL,93,'Jessica','Brown','QAQC','Pasig',NULL,NULL,'2024-01-20',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ikplc3NpY2FCcm93biIsImlhdCI6MTc2MjQyNTg0MiwiZXhwIjoxNzYyNTEyMjQyfQ.HZLG4QdIbf0R_no1ggvY2z0Cy5SVzPqyY6c0K7r-Wok','Luzon',1),('MichaelChen',NULL,'Password123!',NULL,94,'Michael','Chen','QAQC','Pasig',NULL,NULL,'2024-01-25',0,NULL,'Luzon',1),('AdjokH',NULL,'Password123!',NULL,95,'Harrem','Adjok','QAQC Coordinator','Pasig',NULL,NULL,'2025-10-31',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFkam9rSCIsImlhdCI6MTc2Mzk1NjY3MiwiZXhwIjoxNzY0MDQzMDcyfQ.cGTt27ITBjRI1U0oNDj8MRSRUMe4mtClfajN4_lVbyM','Luzon',1),('SumangJ',NULL,'Password123!',NULL,96,'Jayson','Sumang','TNC Coordinator','Pasig',NULL,NULL,'2025-10-31',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlN1bWFuZ0oiLCJpYXQiOjE3NjM5NzQ5NDEsImV4cCI6MTc2NDA2MTM0MX0.NI9JXTR05_uOn9ZXVMCVCMsJw1Y0Lx3cx7Ibbd7JZSw','Luzon',1),('BunagJ',NULL,'Password123!',NULL,97,'Julian','Bunag','QAQC','Pasig',NULL,NULL,'2025-10-31',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkJ1bmFnSiIsImlhdCI6MTc2MTYyMDgzMCwiZXhwIjoxNzYxNzA3MjMwfQ.KIybmblSV1fJ_D-sc_DyiUHA7oRXI8JMnFYtQl2S8OA','Luzon',1),('CardenasA',NULL,'Password123!',NULL,98,'Andrew','Cardenas','QAQC','Pasig',NULL,NULL,'2025-10-31',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkNhcmRlbmFzQSIsImlhdCI6MTc2MzE0MTMyNCwiZXhwIjoxNzYzMjI3NzI0fQ.dKWAyu4_ePxBNmPHcYRsTUNZ4EBz32Z3-9OEm6qmxxU','Luzon',1),('MarkS',NULL,'Password123!',NULL,102,'Mark','Sanders','Skilled Installer','Pasig',NULL,NULL,'2023-06-15',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mark1','Luzon',1),('LeoM',NULL,'Password123!',NULL,103,'Leo','Mendoza','Skilled Installer','Pasig',NULL,NULL,'2023-07-01',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.leo2','Luzon',1),('AndreC',NULL,'Password123!',NULL,104,'Andre','Cruz','Skilled Installer','Pasig',NULL,NULL,'2023-07-12',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.andre3','Luzon',1),('JeromeG',NULL,'Password123!',NULL,105,'Jerome','Garcia','Skilled Installer','Pasig',18,NULL,'2023-07-20',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.jerome4','Luzon',1),('CarlD',NULL,'Password123!',NULL,106,'Carl','Dela Cruz','Skilled Installer','Pasig',NULL,NULL,'2023-08-02',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.carl5','Luzon',1),('RandyP',NULL,'Password123!',NULL,107,'Randy','Perez','Skilled Installer','Pasig',NULL,NULL,'2023-08-10',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.randy6','Luzon',1),('OscarB',NULL,'Password123!',NULL,108,'Oscar','Bautista','Skilled Installer','Pasig',NULL,NULL,'2023-08-20',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.oscar7','Luzon',1),('JaredT',NULL,'Password123!',NULL,109,'Jared','Tolentino','Skilled Installer','Davao',NULL,NULL,'2023-09-01',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.jared8','Mindanao',1),('MacanK',NULL,'Password123!',NULL,112,'Kelly','Macan','Installer','Pasig',NULL,NULL,'2025-11-17',0,NULL,'Luzon',1),('JonesF','chingcuangco7904@gmail.com','Password123!',NULL,121,'Fian','Jones','Installer','Davao',NULL,NULL,'2025-11-22',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkpvbmVzRiIsImlhdCI6MTc2MzgwNzkyOCwiZXhwIjoxNzYzODk0MzI4fQ.g-Dd3mFllx_mKYAqjGuwf-akrc74IoDIJ8m9zA4Hr3o',NULL,1),('JonesF','chingcuangco7904@gmail.com','Password123!',NULL,122,'Frian','Jones','Installer','Davao',NULL,NULL,'2025-11-22',0,NULL,NULL,1),('BayotJ','chingcuangco7904@gmail.com','ft*2ZHMrS!Mo',NULL,126,'John','Bayot','Installer','Cebu',NULL,NULL,'2025-11-24',0,NULL,NULL,1);
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
) ENGINE=InnoDB AUTO_INCREMENT=390 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `handover_documents`
--

LOCK TABLES `handover_documents` WRITE;
/*!40000 ALTER TABLE `handover_documents` DISABLE KEYS */;
INSERT INTO `handover_documents` VALUES (18,48,'Handover Document','/uploads/1763724847997-handover_doc_Checklist Prior Template Setting.pdf'),(19,48,'Handover Document','/uploads/1763724848049-handover_doc_EQUIPMENT ISSUE or INCIDENT REPORT_New Format.pdf'),(20,48,'Handover Document','/uploads/1763724848057-handover_doc_Inspection Checklist (Prior Shaft Acceptance)-images-0.jpg'),(21,48,'Handover Document','/uploads/1763724848081-handover_doc_Kick-off Meeting Checklist.pdf'),(22,48,'Handover Document','/uploads/1763724848090-handover_doc_Load Test Procedure Checklist.pdf'),(23,48,'Handover Document','/uploads/1763725233772-handover_doc_Checklist Prior Template Setting.pdf'),(24,48,'Handover Document','/uploads/1763725233824-handover_doc_EQUIPMENT ISSUE or INCIDENT REPORT_New Format.pdf'),(25,48,'Handover Document','/uploads/1763725233836-handover_doc_Inspection Checklist (Prior Shaft Acceptance)-images-0.jpg'),(26,48,'Handover Document','/uploads/1763725233855-handover_doc_Kick-off Meeting Checklist.pdf'),(27,48,'Handover Document','/uploads/1763725233868-handover_doc_Load Test Procedure Checklist.pdf'),(28,328,'Handover Document','/uploads/1763727425796-handover_doc_Sample babybook.jpg'),(29,328,'Handover Document','/uploads/1763727425901-handover_doc_sample contract (specifications).jpeg'),(30,344,'Handover Document','/uploads/1763727471858-handover_doc_Sample babybook.jpg'),(31,344,'Handover Document','/uploads/1763727471920-handover_doc_sample contract (specifications).jpeg'),(32,344,'Handover Document','/uploads/1763727471931-handover_doc_Schneider Elevator Service Report.pdf'),(33,344,'Handover Document','/uploads/1763727471934-handover_doc_TNC Trouble and Solution Record.pdf'),(34,45,'Handover Document','/uploads/1763917849384-handover_doc_Actual Shaft Condition (PreInspection Checklist).png');
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
) ENGINE=InnoDB AUTO_INCREMENT=325 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `message_recipients`
--

LOCK TABLES `message_recipients` WRITE;
/*!40000 ALTER TABLE `message_recipients` DISABLE KEYS */;
INSERT INTO `message_recipients` VALUES (314,77,77,1,'2025-11-21 18:47:04'),(315,77,7,0,NULL),(316,78,1,0,NULL),(317,78,7,0,NULL),(318,78,77,1,'2025-11-21 18:47:50'),(319,79,77,1,'2025-11-21 18:47:48'),(320,80,2,1,'2025-11-24 17:05:05'),(321,81,3,0,NULL),(322,82,3,0,NULL),(323,82,96,0,NULL),(324,83,2,0,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=84 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (77,2,'Hello Mr Balane AKA PMS COordinator :P','2025-11-21 18:47:01',NULL,0),(78,2,'Run it back again','2025-11-21 18:47:31',NULL,0),(79,2,'again','2025-11-21 18:47:41',NULL,0),(80,4,'Hello to my project manager','2025-11-24 17:05:01',NULL,0),(81,2,'Testing the inbox','2025-11-24 17:06:06',NULL,0),(82,2,'Testing inbox again','2025-11-24 17:06:30',NULL,0),(83,3,'Hello sir Edzeil','2025-11-24 17:11:34',NULL,0);
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
  `body` text,
  `date` date DEFAULT (curdate()),
  `project_id` int DEFAULT NULL,
  `short_description` text,
  `notify_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `functionality` json DEFAULT NULL,
  PRIMARY KEY (`notification_id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `notification_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=605 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
INSERT INTO `notification` VALUES (531,'New Project Assignment','Project Assigned for Office Tower Elevator A (MetroRise Developers Inc.)','2025-11-19',NULL,NULL,'2025-11-19 06:12:51','{\"function\": \"projects-navigate\", \"project-id\": 44}'),(532,'Project Created','Project 348 Porio Jhonuel at 19/11/2025','2025-11-19',NULL,NULL,'2025-11-19 06:31:04','{\"function\": \"projects-navigate\", \"project-id\": \"348\"}'),(533,'Project Created','Project 349 Villalino Jomar at 19/11/2025','2025-11-19',NULL,NULL,'2025-11-19 06:47:49','{\"function\": \"projects-navigate\", \"project-id\": \"349\"}'),(534,'Project Assigned','Project Assigned for Residential Lift B (Greenfield Residences)','2025-11-19',NULL,NULL,'2025-11-19 06:56:54','{\"function\": \"projects-navigate\", \"project-id\": 45}'),(535,'New Project Assignment','Project Assigned for Residential Lift B (Greenfield Residences)','2025-11-19',NULL,NULL,'2025-11-19 07:00:10','{\"function\": \"projects-navigate\", \"project-id\": 45}'),(536,'Project Created','Project 46 Villalino Jomar at 19/11/2025','2025-11-19',NULL,NULL,'2025-11-19 07:13:43','{\"function\": \"projects-navigate\", \"project-id\": \"46\"}'),(537,'Project Created','Project 45 Balane Joel at 19/11/2025','2025-11-19',NULL,NULL,'2025-11-19 07:14:30','{\"function\": \"projects-navigate\", \"project-id\": \"45\"}'),(538,'New Project Assignment','Project Assigned for Hospital Service Elevator 1 (St. Mary’s Medical Center)','2025-11-19',NULL,NULL,'2025-11-19 07:30:51','{\"function\": \"projects-navigate\", \"project-id\": 46}'),(539,'New Project Assignment','Project Assigned for SkyLift A2 (Silvergate Properties)','2025-11-19',NULL,NULL,'2025-11-19 07:31:30','{\"function\": \"projects-navigate\", \"project-id\": 348}'),(540,'Project Created','Project 345 Cruz Nathaniel at 19/11/2025','2025-11-19',NULL,NULL,'2025-11-19 07:33:55','{\"function\": \"projects-navigate\", \"project-id\": \"345\"}'),(541,'PMS Inspection Assigned','PMS Inspection scheduled for Silverstone Properties (SkyRise v7) on 2025-11-19','2025-11-19',NULL,NULL,'2025-11-19 10:34:00',NULL),(542,'Project Created','Project 330 Cruz Nathaniel at 19/11/2025','2025-11-19',NULL,NULL,'2025-11-19 10:41:04','{\"function\": \"projects-navigate\", \"project-id\": \"330\"}'),(543,'Project Created','Project 353 Cruz Nathaniel at 19/11/2025','2025-11-19',NULL,NULL,'2025-11-19 10:42:02','{\"function\": \"projects-navigate\", \"project-id\": \"353\"}'),(544,'PMS Inspection Assigned','PMS Inspection scheduled for Silverstone Properties (SkyRise v7) on 2025-11-19','2025-11-19',NULL,NULL,'2025-11-19 10:42:45',NULL),(545,'PMS Inspection Assigned','PMS Inspection scheduled for Saint Ireneus (K40 Residential Elevator) on 2025-11-19','2025-11-19',NULL,NULL,'2025-11-19 10:44:12',NULL),(546,'PMS Inspection Assigned','PMS Inspection scheduled for Saint Ireneus (K40 Residential Elevator) on 2026-02-19','2025-11-19',NULL,NULL,'2025-11-19 10:47:22',NULL),(547,'PMS Inspection Updated','PMS Inspection rescheduled for Saint Ireneus (K40 Residential Elevator) on 2025-11-19','2025-11-19',NULL,NULL,'2025-11-19 10:48:00',NULL),(548,'Project Created','Project 44 Villalino Jomar at 19/11/2025','2025-11-19',NULL,NULL,'2025-11-19 10:49:28','{\"function\": \"projects-navigate\", \"project-id\": \"44\"}'),(549,'Request for Inspection','Inspection to be conducted for Office Tower Elevator A (Client: MetroRise Developers Inc.) at 2025-11-19 for Template Setting','2025-11-19',NULL,NULL,'2025-11-19 10:50:25',NULL),(550,'QAQC Assignment Updated','QAQC Inspection for Office Tower Elevator A is updated to Humphry Vincenzo','2025-11-19',NULL,NULL,'2025-11-19 10:51:02',NULL),(551,'Task Pending for completion','Template Setting pending for completion for Office Tower Elevator A (Client: MetroRise Developers Inc.)','2025-11-19',NULL,NULL,'2025-11-19 10:52:20',NULL),(552,'PMS Inspection Updated','PMS Inspection rescheduled for Saint Ireneus (K40 Residential Elevator) on 2025-11-19','2025-11-19',NULL,NULL,'2025-11-19 10:53:42',NULL),(553,'PMS Inspection Assigned','PMS Inspection scheduled for Silverstone Properties (SkyRise v7) on 2025-11-21','2025-11-21',NULL,NULL,'2025-11-21 18:59:47',NULL),(554,'Project Created','Project 48 Porio Jhonuel at 21/11/2025','2025-11-21',NULL,NULL,'2025-11-21 19:10:30','{\"function\": \"projects-navigate\", \"project-id\": \"48\"}'),(555,'Project Assigned','Project Assigned for Warehouse Freight Lift (Apex Logistics Corp.)','2025-11-21',NULL,NULL,'2025-11-21 19:14:11','{\"function\": \"projects-navigate\", \"project-id\": 48}'),(556,'Project Assigned','Project Assigned for VertifFlow 400 (Redwood Trading Co.)','2025-11-21',NULL,NULL,'2025-11-21 19:25:15','{\"function\": \"projects-navigate\", \"project-id\": 345}'),(557,'Project Assigned','Project Assigned for Warehouse Freight Lift (Apex Logistics Corp.)','2025-11-21',NULL,NULL,'2025-11-21 19:30:55','{\"function\": \"projects-navigate\", \"project-id\": 48}'),(558,'PMS Inspection Assigned','PMS Inspection scheduled for Apex Logistics Corp. (Warehouse Freight Lift) on 2025-11-21','2025-11-21',NULL,NULL,'2025-11-21 19:41:23',NULL),(559,'PMS Inspection Assigned','PMS Inspection scheduled for Apex Logistics Corp. (Warehouse Freight Lift) on 2025-11-21','2025-11-21',NULL,NULL,'2025-11-21 19:44:03',NULL),(560,'PMS Inspection Assigned','PMS Inspection scheduled for Silverstone Properties (SkyRise v7) on 2026-02-21','2025-11-21',NULL,NULL,'2025-11-21 20:20:26',NULL),(561,'PMS Inspection Assigned','PMS Inspection scheduled for Saint Ireneus (K40 Residential Elevator) on 2025-11-21','2025-11-21',NULL,NULL,'2025-11-21 20:20:54',NULL),(562,'Request for Inspection','Inspection to be conducted for Residential Lift B (Client: Greenfield Residences) at 2025-11-23','2025-11-23',NULL,NULL,'2025-11-23 20:23:47',NULL),(563,'Approved and Assigned for Final Join Inspection','Final Joint Inspection to be conducted for Residential Lift B (Client: Greenfield Residences)\n                     at 2025-11-22T16:00:00.000Z. Assigned PMS Technician: Dipaka Toshiko','2025-11-23',NULL,NULL,'2025-11-23 20:54:08',NULL),(564,'Request for Inspection','Inspection to be conducted for Residential Lift B (Client: Greenfield Residences) at 2025-11-23','2025-11-23',NULL,NULL,'2025-11-23 20:55:56',NULL),(565,'New Project Assignment','Project Assigned for AeroRise 900 (Carmine Corp)','2025-11-23',NULL,NULL,'2025-11-23 21:53:15','{\"function\": \"projects-navigate\", \"project-id\": 349}'),(566,'Request for Inspection','Inspection to be conducted for Residential Lift B (Client: Greenfield Residences) at 2025-11-23','2025-11-23',NULL,NULL,'2025-11-23 23:28:47',NULL),(567,'Approved and Assigned for Final Join Inspection','Final Joint Inspection to be conducted for Residential Lift B (Client: Greenfield Residences)\n                     at 2025-11-22T16:00:00.000Z. Assigned PMS Technician: Arche Denitsa','2025-11-23',NULL,NULL,'2025-11-23 23:32:02','{\"function\": \"projects-navigate\", \"project-id\": 45}'),(568,'Request for Inspection','Inspection to be conducted for Residential Lift B (Client: Greenfield Residences) at 2025-11-23','2025-11-23',NULL,NULL,'2025-11-23 23:33:44',NULL),(569,'Approved and Assigned for Final Join Inspection','Final Joint Inspection to be conducted for Residential Lift B (Client: Greenfield Residences)\n                     at 2025-11-22T16:00:00.000Z. Assigned PMS Technician: Yusuf Kassia','2025-11-23',NULL,NULL,'2025-11-23 23:35:38','{\"function\": \"projects-navigate\", \"project-id\": 45}'),(570,'Request for Inspection','Inspection to be conducted for Residential Lift B (Client: Greenfield Residences) at 2025-11-23','2025-11-23',NULL,NULL,'2025-11-23 23:54:14',NULL),(571,'Approved and Assigned for Final Join Inspection','Final Joint Inspection to be conducted for Residential Lift B (Client: Greenfield Residences)\n                     at 2025-11-22T16:00:00.000Z. Assigned PMS Technician: Yusuf Kassia','2025-11-23',NULL,NULL,'2025-11-23 23:56:26','{\"function\": \"projects-navigate\", \"project-id\": 45}'),(572,'Request for Inspection','Inspection to be conducted for Residential Lift B (Client: Greenfield Residences) at 2025-11-24','2025-11-24',NULL,NULL,'2025-11-24 00:27:42',NULL),(573,'Approved and Assigned for Final Join Inspection','Final Joint Inspection to be conducted for Residential Lift B (Client: Greenfield Residences)\n                     at 2025-11-23T16:00:00.000Z. Assigned PMS Technician: Yusuf Kassia','2025-11-24',NULL,NULL,'2025-11-24 00:27:56','{\"function\": \"projects-navigate\", \"project-id\": 45}'),(574,'Assigned for TNC Inspection','TNC Inspection for Residential Lift B is assigned to Galla Faiza from 11/24/2025 to 12/7/2025','2025-11-24',NULL,NULL,'2025-11-24 00:54:42',NULL),(575,'Prepare Handover','Prepare handover for Residential Lift B (Client: Greenfield Residences)','2025-11-24',NULL,NULL,'2025-11-24 00:59:02',NULL),(576,'PMS Inspection Assigned','PMS Inspection scheduled for Greenfield Residences (Residential Lift B) on 2025-12-24','2025-11-24',NULL,NULL,'2025-11-24 01:23:37',NULL),(577,'PMS Inspection Updated','PMS Inspection rescheduled for Greenfield Residences (Residential Lift B) on 2025-11-24','2025-11-24',NULL,NULL,'2025-11-24 01:26:21',NULL),(578,'PMS Inspection Updated','PMS Inspection rescheduled for Greenfield Residences (Residential Lift B) on 2025-11-24','2025-11-24',NULL,NULL,'2025-11-24 01:26:23',NULL),(579,'Project Created','Project 330 Balane Joel at 24/11/2025','2025-11-24',NULL,NULL,'2025-11-24 01:33:07','{\"function\": \"projects-navigate\", \"project-id\": \"330\"}'),(580,'Task Pending for completion','Template Setting pending for completion for Office Tower Elevator A (Client: MetroRise Developers Inc.)','2025-11-24',NULL,NULL,'2025-11-24 05:58:09',NULL),(581,'PMS Inspection Assigned','PMS Inspection scheduled for Apex Logistics Corp. (Warehouse Freight Lift) on 2025-11-24','2025-11-24',NULL,NULL,'2025-11-24 06:18:04',NULL),(582,'PMS Inspection Assigned','PMS Inspection scheduled for Apex Logistics Corp. (Warehouse Freight Lift) on 2025-11-24','2025-11-24',NULL,NULL,'2025-11-24 07:25:41',NULL),(583,'Request for Inspection','Inspection to be conducted for Office Tower Elevator A (Client: MetroRise Developers Inc.) at 2025-11-24 for Template Setting','2025-11-24',NULL,NULL,'2025-11-24 11:58:07',NULL),(584,'Assigned for QAQC Inspection','QAQC Inspection for Office Tower Elevator A is assigned to Humphry Vincenzo','2025-11-24',NULL,NULL,'2025-11-24 11:59:07',NULL),(585,'New Project Assignment','Project Assigned for Office Tower Elevator A (MetroRise Developers Inc.)','2025-11-24',NULL,NULL,'2025-11-24 15:24:21','{\"function\": \"projects-navigate\", \"project-id\": 44}'),(586,'New Project Assignment','Project Assigned for undefined (undefined)','2025-11-24',NULL,NULL,'2025-11-24 15:25:39','{\"function\": \"projects-navigate\"}'),(587,'Project Hold Request','Project AeroRise 900 (Client: Carmine Corp) has requested to be put on hold.\n\nReason: sdga\n\nThis will involve demobilizing manpower and resources from the site. Please review and approve the hold request.','2025-11-24',NULL,NULL,'2025-11-24 15:39:54',NULL),(588,'Hold Request Approved','Your hold request for AeroRise 900 (Client: Carmine Corp) has been rejected','2025-11-24',NULL,NULL,'2025-11-24 15:48:23',NULL),(589,'Project Hold Request','Project Hospital Service Elevator 1 (Client: St. Mary’s Medical Center) has requested to be put on hold.\n\nReason: Client cannot proceed to tnc\n\nThis will involve demobilizing manpower and resources from the site. Please review and approve the hold request.','2025-11-24',NULL,NULL,'2025-11-24 16:15:45',NULL),(590,'Hold Request Approved','Your hold request for Hospital Service Elevator 1 (Client: St. Mary’s Medical Center) has been rejected','2025-11-24',NULL,NULL,'2025-11-24 16:16:06',NULL),(591,'Project Hold Request','Project Hospital Service Elevator 1 (Client: St. Mary’s Medical Center) has requested to be put on hold.\n\nReason: Client cannot proceed tnc\n\nThis will involve demobilizing manpower and resources from the site. Please review and approve the hold request.','2025-11-24',NULL,NULL,'2025-11-24 16:16:36',NULL),(592,'Hold Request Approved','Your hold request for Hospital Service Elevator 1 (Client: St. Mary’s Medical Center) has been approved.\n\nProject is now on hold and resources will be demobilized. You can request to resume when ready.','2025-11-24',NULL,NULL,'2025-11-24 16:16:54',NULL),(593,'Project Resume Request','Project Hospital Service Elevator 1 (Client: St. Mary’s Medical Center) requested to resume on 11/24/2025. Please review and approve the resume date.','2025-11-24',NULL,NULL,'2025-11-24 16:17:19',NULL),(594,'Project Resume Approved','Your resume request for project Hospital Service Elevator 1 (Client: St. Mary’s Medical Center) has been approved. Project will resume on 11/24/2025. Please prepare accordingly.','2025-11-24',NULL,NULL,'2025-11-24 16:17:35',NULL),(595,'Project Hold Request','Project Hospital Service Elevator 1 (Client: St. Mary’s Medical Center) has requested to be put on hold.\n\nReason: Cannot proceed to tnc\n\nThis will involve demobilizing manpower and resources from the site. Please review and approve the hold request.','2025-11-24',NULL,NULL,'2025-11-24 16:26:04',NULL),(596,'Hold Request Approved','Your hold request for Hospital Service Elevator 1 (Client: St. Mary’s Medical Center) has been approved.\n\nProject is now on hold and resources will be demobilized. You can request to resume when ready.','2025-11-24',NULL,NULL,'2025-11-24 16:27:16',NULL),(597,'Project Resume Request','Project Hospital Service Elevator 1 (Client: St. Mary’s Medical Center) requested to resume on 11/24/2025. Please review and approve the resume date.','2025-11-24',NULL,NULL,'2025-11-24 16:33:32',NULL),(598,'Project Resume Approved','Your resume request for project Hospital Service Elevator 1 (Client: St. Mary’s Medical Center) has been approved. Project will resume on 11/24/2025. Please prepare accordingly.','2025-11-24',NULL,NULL,'2025-11-24 16:33:50',NULL),(599,'Project Hold Request','Project Hospital Service Elevator 1 (Client: St. Mary’s Medical Center) has requested to be put on hold.\n\nReason: Cannot Proceed to tnc\n\nThis will involve demobilizing manpower and resources from the site. Please review and approve the hold request.','2025-11-24',NULL,NULL,'2025-11-24 16:47:44',NULL),(600,'Hold Request Approved','Your hold request for Hospital Service Elevator 1 (Client: St. Mary’s Medical Center) has been rejected','2025-11-24',NULL,NULL,'2025-11-24 16:54:12',NULL),(601,'Request for Inspection','Inspection to be conducted for SkyLift A2 (Client: Silvergate Properties) at 2025-11-24','2025-11-24',NULL,NULL,'2025-11-24 17:02:42',NULL),(602,'Assigned for TNC Inspection','TNC Inspection for SkyLift A2 is assigned to Galla Faiza from 11/24/2025 to 12/8/2025','2025-11-24',NULL,NULL,'2025-11-24 17:03:01',NULL),(603,'New Project Assignment','Project Assigned for SkyLift A2 (Silvergate Properties)','2025-11-24',NULL,NULL,'2025-11-24 17:28:17','{\"function\": \"projects-navigate\", \"project-id\": 348}'),(604,'New Project Assignment','Project Assigned for SkyLift A2 (Silvergate Properties)','2025-11-24',NULL,NULL,'2025-11-24 17:32:08','{\"function\": \"projects-navigate\", \"project-id\": 348}');
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
) ENGINE=InnoDB AUTO_INCREMENT=1293 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification_recipients`
--

LOCK TABLES `notification_recipients` WRITE;
/*!40000 ALTER TABLE `notification_recipients` DISABLE KEYS */;
INSERT INTO `notification_recipients` VALUES (1161,531,10,0,0),(1162,531,21,0,0),(1163,531,17,0,0),(1164,532,3,0,0),(1165,533,4,0,0),(1166,534,11,0,0),(1167,534,NULL,0,0),(1168,534,38,0,0),(1169,534,13,0,0),(1170,535,11,0,0),(1171,535,13,0,0),(1172,535,20,0,0),(1173,536,4,0,0),(1174,537,7,0,0),(1175,538,37,0,0),(1176,538,14,0,0),(1177,538,38,0,0),(1178,539,18,0,0),(1179,539,15,0,0),(1180,539,68,0,0),(1181,540,5,0,0),(1182,541,79,0,1),(1183,542,5,0,0),(1184,543,5,0,0),(1185,544,79,0,1),(1186,545,79,0,1),(1187,546,79,0,1),(1188,547,79,0,1),(1189,548,4,0,0),(1190,549,95,0,0),(1191,549,2,0,1),(1192,550,91,0,0),(1193,550,2,0,1),(1194,550,4,0,0),(1195,551,4,0,0),(1196,552,83,0,0),(1197,553,79,0,1),(1198,554,3,0,0),(1199,555,19,0,0),(1200,555,53,0,0),(1201,555,44,0,0),(1202,555,3,0,0),(1203,556,19,0,0),(1204,556,44,0,0),(1205,556,NULL,0,0),(1206,556,54,0,0),(1207,557,16,0,0),(1208,557,39,0,0),(1209,557,3,0,0),(1210,557,53,0,0),(1211,558,79,0,1),(1212,559,79,0,1),(1213,560,79,0,1),(1214,561,79,0,1),(1215,562,77,0,0),(1216,562,2,0,1),(1217,563,7,0,0),(1218,563,2,0,1),(1219,563,81,0,0),(1220,564,96,0,0),(1221,564,2,0,1),(1222,565,39,0,0),(1223,565,55,0,0),(1224,565,16,0,0),(1225,566,77,0,0),(1226,566,2,0,1),(1227,567,2,0,1),(1228,567,78,0,0),(1229,567,7,0,0),(1230,568,77,0,0),(1231,568,2,0,1),(1232,569,2,0,1),(1233,569,79,0,1),(1234,569,7,0,0),(1235,570,2,0,1),(1236,570,77,0,0),(1237,571,2,0,1),(1238,571,79,0,0),(1239,571,7,0,0),(1240,572,77,0,0),(1241,572,2,0,1),(1242,573,2,0,1),(1243,573,79,0,0),(1244,573,7,0,0),(1245,574,7,0,0),(1246,574,2,0,1),(1247,574,86,0,0),(1248,575,2,0,1),(1249,575,77,0,0),(1250,576,79,0,0),(1251,577,79,0,0),(1252,578,79,0,0),(1253,579,7,0,0),(1254,580,4,0,0),(1255,581,79,0,0),(1256,582,79,0,0),(1257,583,95,0,0),(1258,583,2,0,1),(1259,584,2,0,1),(1260,584,91,0,0),(1261,584,4,0,0),(1262,585,53,0,0),(1263,585,21,0,0),(1264,585,17,0,0),(1265,586,21,0,0),(1266,586,17,0,0),(1267,586,10,0,0),(1268,587,2,0,1),(1269,588,4,0,0),(1270,589,2,0,1),(1271,590,4,0,0),(1272,591,2,0,1),(1273,592,4,0,0),(1274,593,2,0,1),(1275,594,4,0,0),(1276,595,2,0,1),(1277,596,4,0,0),(1278,597,2,0,1),(1279,598,4,0,0),(1280,599,2,0,1),(1281,600,4,0,0),(1282,601,96,0,0),(1283,601,2,0,0),(1284,602,2,0,0),(1285,602,3,0,0),(1286,602,86,0,0),(1287,603,18,0,0),(1288,603,68,0,0),(1289,603,15,0,0),(1290,604,15,0,0),(1291,604,68,0,0),(1292,604,13,0,0);
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
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pms_history`
--

LOCK TABLES `pms_history` WRITE;
/*!40000 ALTER TABLE `pms_history` DISABLE KEYS */;
INSERT INTO `pms_history` VALUES (15,329,NULL,'2025-11-17',1,11),(16,48,NULL,'2025-11-21',1,15),(17,48,NULL,'2025-11-21',1,15),(18,328,NULL,'2025-11-21',1,16),(19,45,NULL,'2025-11-24',1,18),(20,48,NULL,'2025-11-24',1,15);
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
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pms_inspection_documents`
--

LOCK TABLES `pms_inspection_documents` WRITE;
/*!40000 ALTER TABLE `pms_inspection_documents` DISABLE KEYS */;
INSERT INTO `pms_inspection_documents` VALUES (18,15,'service_report_Schneider Elevator Service Report.pdf','/uploads/1763725395987-service_report_Schneider Elevator Service Report.pdf',16),(19,15,'service_report_Actual Shaft Condition (PreInspection Checklist).png','/uploads/1763726897217-service_report_Actual Shaft Condition (PreInspection Checklist).png',17),(20,16,'service_report_Schneider Elevator Service Report.pdf','/uploads/1763727701852-service_report_Schneider Elevator Service Report.pdf',18),(21,16,'service_report_TNC Trouble and Solution Record.pdf','/uploads/1763727701857-service_report_TNC Trouble and Solution Record.pdf',18),(22,18,'service_report_QA.QC Punchlisting.pdf','/uploads/1763918862414-service_report_QA.QC Punchlisting.pdf',19),(23,15,'service_report_lift-shaft-old-multistorey-building-1024x683.jpg','/uploads/1763936825902-service_report_lift-shaft-old-multistorey-building-1024x683.jpg',20);
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
  KEY `pms_technician_id` (`pms_technician_id`),
  KEY `pms_inspection_team_ibfk_1` (`pms_id`),
  CONSTRAINT `pms_inspection_team_ibfk_1` FOREIGN KEY (`pms_id`) REFERENCES `pms_projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `pms_inspection_team_ibfk_2` FOREIGN KEY (`pms_technician_id`) REFERENCES `employees` (`employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pms_inspection_team`
--

LOCK TABLES `pms_inspection_team` WRITE;
/*!40000 ALTER TABLE `pms_inspection_team` DISABLE KEYS */;
INSERT INTO `pms_inspection_team` VALUES (93,344,79),(99,48,79);
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
  `contract_watchlist` tinyint DEFAULT (0),
  PRIMARY KEY (`id`),
  CONSTRAINT `pms_projects_ibfk_1` FOREIGN KEY (`id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pms_projects`
--

LOCK TABLES `pms_projects` WRITE;
/*!40000 ALTER TABLE `pms_projects` DISABLE KEYS */;
INSERT INTO `pms_projects` VALUES (45,'2025-11-24',1,'2026-11-24','2025-12-24',1,0,0,19,'Monthly','2025-11-24',NULL,NULL,0,0,0),(48,'2025-11-21',1,'2026-11-21','2025-11-24',1,1,0,20,'Monthly','2025-11-24',NULL,NULL,0,0,0),(328,'2025-11-21',1,'2026-11-21','2025-12-21',1,0,0,18,'Monthly','2025-11-21',NULL,NULL,0,0,0),(344,'2025-11-21',1,'2026-11-21','2026-02-21',1,1,0,NULL,'Quarterly',NULL,NULL,NULL,0,0,0);
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
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_1_schedule`
--

LOCK TABLES `project_1_schedule` WRITE;
/*!40000 ALTER TABLE `project_1_schedule` DISABLE KEYS */;
INSERT INTO `project_1_schedule` VALUES (1,100,'Preliminaries','2025-11-18','2025-12-09',15,'summary',NULL,0,0,0,0,'General',NULL,'Preliminaries','1',0.00,0.00,0.00,'2025-11-18 22:02:11'),(2,101,'Pre-Inspection(Checkin of Shaft)','2025-11-18','2025-11-26',6,'task',100,0,0,0,1,'General',NULL,'Pre-Inspection(Checkin of Shaft)','1',0.00,0.00,0.00,'2025-11-18 22:02:11'),(3,301,'Manufacturing and Importation','2025-12-09','2026-02-12',47,'task',300,0,0,0,0,'General',NULL,'Manufacturing and Importation','1',0.00,0.00,0.00,'2025-11-18 22:02:11'),(4,400,'Planning For Mobilization And Execution','2026-02-12','2026-03-24',28,'summary',NULL,0,0,0,0,'General',NULL,'Planning For Mobilization And Execution','1',0.00,0.00,0.00,'2025-11-18 22:02:11'),(5,104,'Submission of PO to Factory','2025-12-08','2025-12-09',1,'task',100,0,0,0,0,'General',NULL,'Submission of PO to Factory','1',0.00,0.00,0.00,'2025-11-18 22:02:11'),(6,103,'Submission of Drawing and Finishes for Approval','2025-12-01','2025-12-08',5,'task',100,0,0,0,0,'General',NULL,'Submission of Drawing and Finishes for Approval','1',0.00,0.00,0.00,'2025-11-18 22:02:11'),(7,300,'Manufacturing and Importation Process','2025-12-09','2026-02-12',47,'summary',NULL,0,0,0,0,'General',NULL,'Manufacturing and Importation Process','1',0.00,0.00,0.00,'2025-11-18 22:02:11'),(8,200,'Structural/Civil Works','2025-12-09','2026-02-12',47,'summary',NULL,0,0,0,0,'General',NULL,'Structural/Civil Works','1',0.00,0.00,0.00,'2025-11-18 22:02:11'),(9,102,'Layout of Drawing','2025-11-26','2025-12-01',3,'task',100,0,0,0,0,'General',NULL,'Layout of Drawing','1',0.00,0.00,0.00,'2025-11-18 22:02:11'),(10,201,'Shaft Construction','2025-12-09','2026-02-12',47,'task',200,0,0,0,0,'General',NULL,'Shaft Construction','1',0.00,0.00,0.00,'2025-11-18 22:02:11'),(11,401,'Preparation of tools and materials for elevator installation','2026-02-12','2026-03-04',14,'task',400,0,0,0,0,'General',NULL,'Preparation of tools and materials for elevator installation','1',0.00,0.00,0.00,'2025-11-18 22:02:11'),(12,402,'Layout of boardup markings','2026-03-04','2026-03-09',3,'task',400,0,0,0,0,'General',NULL,'Layout of boardup markings','1',0.00,0.00,0.00,'2025-11-18 22:02:11'),(13,403,'Partial delivery of tools and boardup materials','2026-03-09','2026-03-12',3,'task',400,0,0,0,0,'General',NULL,'Partial delivery of tools and boardup materials','1',0.00,0.00,0.00,'2025-11-18 22:02:11'),(14,404,'Preperation for Installation/Manufacturing','2026-03-12','2026-03-24',8,'task',400,0,0,0,0,'General',NULL,'Preperation for Installation/Manufacturing','1',0.00,0.00,0.00,'2025-11-18 22:02:11'),(15,500,'Mechanical Installation','2026-03-24','2026-05-26',45,'summary',NULL,0,0,0,0,'General',NULL,'Mechanical Installation','1',0.00,0.00,0.00,'2025-11-18 22:02:11'),(16,501,'Unloading of elevator equipments','2026-03-24','2026-03-25',1,'task',500,0,0,0,0,'General','1','Unloading of elevator equipments','1',0.00,0.00,0.00,'2025-11-18 22:02:11'),(17,503,'Hauling Works','2026-03-29','2026-03-31',2,'task',500,0,0,7,0,'General','3','Hauling Works','1',7.00,0.00,0.00,'2025-11-18 22:02:11'),(18,504,'Template Setting','2026-03-31','2026-04-02',2,'task',500,0,0,7,0,'General','4','Template Setting','1',7.00,0.00,0.00,'2025-11-18 22:02:11'),(19,502,'Scaffolding Installation','2026-03-25','2026-03-29',2,'task',500,0,0,7,0,'General','2','Scaffolding Installation','1',7.00,0.00,0.00,'2025-11-18 22:02:11'),(20,505,'Marking and Boring of Holes','2026-04-02','2026-04-05',1,'task',500,0,0,0,0,'General','5','Marking and Boring of Holes','1',0.00,0.00,0.00,'2025-11-18 22:02:11'),(21,506,'Rail Bracket Installation','2026-04-05','2026-04-07',2,'task',500,0,0,7,0,'General','6','Rail Bracket Installation','1',7.00,0.00,0.00,'2025-11-18 22:02:11'),(22,507,'Guide Rail Setting','2026-04-07','2026-04-14',5,'summary',500,0,0,0,0,'General',NULL,'Guide Rail Setting','1',0.00,0.00,0.00,'2025-11-18 22:02:11'),(23,508,'Main/Car','2026-04-07','2026-04-09',2,'task',507,0,0,5,0,'Guide Rail Setting','A','Main/Car','1',5.00,0.00,0.00,'2025-11-18 22:02:11'),(24,509,'Counterweight (CWT)','2026-04-09','2026-04-13',2,'task',507,0,0,3,0,'Guide Rail Setting','B','Counterweight (CWT)','1',3.00,0.00,0.00,'2025-11-18 22:02:11'),(25,510,'Gauging','2026-04-13','2026-04-14',1,'task',507,0,0,3,0,'Guide Rail Setting','C','Gauging','1',3.00,0.00,0.00,'2025-11-18 22:02:11'),(26,511,'Landing Door Assembly','2026-04-14','2026-04-22',6,'summary',500,0,0,0,0,'General',NULL,'Landing Door Assembly','1',0.00,0.00,0.00,'2025-11-18 22:02:11'),(27,512,'Sills and Supports','2026-04-14','2026-04-16',2,'task',511,0,0,2,0,'Landing Door Assembly','A','Sills and Supports','1',2.00,0.00,0.00,'2025-11-18 22:02:11'),(28,513,'Jamb and Supports','2026-04-16','2026-04-20',2,'task',511,0,0,2,0,'Landing Door Assembly','B','Jamb and Supports','1',2.00,0.00,0.00,'2025-11-18 22:02:11'),(29,514,'Frame and Doors','2026-04-20','2026-04-22',2,'task',511,0,0,3,0,'Landing Door Assembly','C','Frame and Doors','1',3.00,0.00,0.00,'2025-11-18 22:02:11'),(30,515,'M/R Equipment Setting','2026-04-22','2026-04-30',6,'summary',500,0,0,0,0,'General',NULL,'M/R Equipment Setting','1',0.00,0.00,0.00,'2025-11-18 22:02:11'),(31,517,'Support Beams','2026-04-26','2026-04-28',2,'task',515,0,0,5,0,'M/R Equipment Setting','B','Support Beams','1',5.00,0.00,0.00,'2025-11-18 22:02:11'),(32,516,'Traction Machine','2026-04-22','2026-04-26',2,'task',515,0,0,5,0,'M/R Equipment Setting','A','Traction Machine','1',5.00,0.00,0.00,'2025-11-18 22:02:11'),(33,518,'Governor (M/R)','2026-04-28','2026-04-30',2,'task',515,0,0,2,0,'M/R Equipment Setting','C','Governor (M/R)','1',2.00,0.00,0.00,'2025-11-18 22:02:11'),(34,519,'Installation of Control Panel','2026-04-30','2026-05-04',2,'task',500,0,0,3,0,'M/R Equipment Setting','D','Installation of Control Panel','1',3.00,0.00,0.00,'2025-11-18 22:02:11'),(35,520,'Car Assembly','2026-05-04','2026-05-07',3,'summary',500,0,0,0,0,'General',NULL,'Car Assembly','1',0.00,0.00,0.00,'2025-11-18 22:02:11'),(36,521,'All Accessories','2026-05-04','2026-05-06',2,'task',520,0,0,3,0,'Car Assembly','A','All Accessories','1',3.00,0.00,0.00,'2025-11-18 22:02:11'),(37,522,'Car Piping/Wiring','2026-05-06','2026-05-07',1,'task',520,0,0,3,0,'Car Assembly','B','Car Piping/Wiring','1',3.00,0.00,0.00,'2025-11-18 22:02:11'),(38,523,'Travelling Cable Layout','2026-05-07','2026-05-11',2,'task',500,0,0,2,0,'Car Assembly','C','Travelling Cable Layout','1',2.00,0.00,0.00,'2025-11-18 22:02:11'),(39,524,'Counterweight Assembly','2026-05-11','2026-05-13',2,'task',500,0,0,2,0,'Car Assembly','D','Counterweight Assembly','1',2.00,0.00,0.00,'2025-11-18 22:02:11'),(40,525,'Laying out of Ropes','2026-05-13','2026-05-20',5,'summary',500,0,0,0,0,'General',NULL,'Laying out of Ropes','1',0.00,0.00,0.00,'2025-11-18 22:02:11'),(41,526,'Hoisting','2026-05-13','2026-05-17',2,'task',525,0,0,2,0,'Laying out of ropes','A','Hoisting','1',2.00,0.00,0.00,'2025-11-18 22:02:11'),(42,527,'Governor (Ropes)','2026-05-17','2026-05-19',2,'task',525,0,0,3,0,'Compensating','B','Governor (Ropes)','1',3.00,0.00,0.00,'2025-11-18 22:02:11'),(43,528,'Compensating','2026-05-19','2026-05-20',1,'task',525,0,0,3,0,'Laying out of ropes','C','Compensating','1',3.00,0.00,0.00,'2025-11-18 22:02:11'),(44,529,'Wiring','2026-05-20','2026-05-24',2,'summary',500,0,0,0,0,'General',NULL,'Wiring','1',0.00,0.00,0.00,'2025-11-18 22:02:11'),(45,530,'Machine Room','2026-05-20','2026-05-21',1,'task',529,0,0,5,0,'Wiring','A','Machine Room','1',5.00,0.00,0.00,'2025-11-18 22:02:11'),(46,531,'Hoistway','2026-05-21','2026-05-24',1,'task',529,0,0,3,0,'Wiring','B','Hoistway','1',3.00,0.00,0.00,'2025-11-18 22:02:11'),(47,532,'Installation of Pit Ladder / Hoistway Lighting','2026-05-24','2026-05-26',2,'task',500,0,0,3,0,'Wiring','C','Installation of Pit Ladder / Hoistway Lighting','1',3.00,0.00,0.00,'2025-11-18 22:02:11'),(48,600,'Testing and Commissioning','2026-05-26','2026-06-16',15,'summary',NULL,0,0,0,0,'General',NULL,'Testing and Commissioning','1',0.00,0.00,0.00,'2025-11-18 22:02:11'),(49,601,'Initial testing','2026-05-26','2026-05-31',3,'task',600,0,0,3,0,'Testing and Commissioning (Passenger Elevator)','A','Initial testing','1',3.00,0.00,0.00,'2025-11-18 22:02:11'),(50,602,'Slow speed','2026-05-31','2026-06-02',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','B','Slow speed','1',1.00,0.00,0.00,'2025-11-18 22:02:11'),(51,603,'High speed and Mechanical Adjustment','2026-06-02','2026-06-04',2,'task',600,0,0,2,0,'Testing and Commissioning (Passenger Elevator)','C','High speed and Mechanical Adjustment','1',2.00,0.00,0.00,'2025-11-18 22:02:11'),(52,604,'Load Test','2026-06-04','2026-06-08',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','D','Load Test','1',1.00,0.00,0.00,'2025-11-18 22:02:11'),(53,605,'Final Adjust','2026-06-08','2026-06-10',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','E','Final Adjust','1',1.00,0.00,0.00,'2025-11-18 22:02:11'),(54,606,'Features Test / Correction of Defects','2026-06-10','2026-06-14',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','F','Features Test / Correction of Defects','1',1.00,0.00,0.00,'2025-11-18 22:02:11'),(55,607,'Final Cleaning / Hand over','2026-06-14','2026-06-16',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','G','Final Cleaning / Hand over','1',1.00,0.00,0.00,'2025-11-18 22:02:11');
/*!40000 ALTER TABLE `project_1_schedule` ENABLE KEYS */;
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
INSERT INTO `project_344_schedule` VALUES (1,103,'Submission of Drawing and Finishes for Approval','2025-09-18','2025-09-25',5,'task',100,0,0,0,0,'General',NULL,'Submission of Drawing and Finishes for Approval','1',0.00,0.00,0.00,'2025-11-18 23:39:03'),(2,201,'Shaft Construction','2025-09-28','2025-12-02',47,'task',200,0,0,0,0,'General',NULL,'Shaft Construction','1',0.00,0.00,0.00,'2025-11-18 23:39:03'),(3,104,'Submission of PO to Factory','2025-09-25','2025-09-28',1,'task',100,0,0,0,0,'General',NULL,'Submission of PO to Factory','1',0.00,0.00,0.00,'2025-11-18 23:39:03'),(4,301,'Manufacturing and Importation','2025-09-28','2025-12-02',47,'task',300,0,0,0,0,'General',NULL,'Manufacturing and Importation','1',0.00,0.00,0.00,'2025-11-18 23:39:03'),(5,400,'Planning For Mobilization And Execution','2025-12-02','2026-01-11',28,'summary',NULL,0,0,0,0,'General',NULL,'Planning For Mobilization And Execution','1',0.00,0.00,0.00,'2025-11-18 23:39:03'),(6,101,'Pre-Inspection(Checkin of Shaft)','2025-09-07','2025-09-15',6,'task',100,0,0,0,1,'General',NULL,'Pre-Inspection(Checkin of Shaft)','1',0.00,0.00,0.00,'2025-11-18 23:39:03'),(7,300,'Manufacturing and Importation Process','2025-09-28','2025-12-02',47,'summary',NULL,0,0,0,0,'General',NULL,'Manufacturing and Importation Process','1',0.00,0.00,0.00,'2025-11-18 23:39:03'),(8,102,'Layout of Drawing','2025-09-15','2025-09-18',3,'task',100,0,0,0,0,'General',NULL,'Layout of Drawing','1',0.00,0.00,0.00,'2025-11-18 23:39:03'),(9,200,'Structural/Civil Works','2025-09-28','2025-12-02',47,'summary',NULL,0,0,0,0,'General',NULL,'Structural/Civil Works','1',0.00,0.00,0.00,'2025-11-18 23:39:03'),(10,100,'Preliminaries','2025-09-07','2025-09-28',15,'summary',NULL,0,0,0,0,'General',NULL,'Preliminaries','1',0.00,0.00,0.00,'2025-11-18 23:39:03'),(11,401,'Preparation of tools and materials for elevator installation','2025-12-02','2025-12-22',14,'task',400,0,0,0,0,'General',NULL,'Preparation of tools and materials for elevator installation','1',0.00,0.00,0.00,'2025-11-18 23:39:03'),(12,402,'Layout of boardup markings','2025-12-22','2025-12-25',3,'task',400,0,0,0,0,'General',NULL,'Layout of boardup markings','1',0.00,0.00,0.00,'2025-11-18 23:39:03'),(13,403,'Partial delivery of tools and boardup materials','2025-12-25','2025-12-30',3,'task',400,0,0,0,0,'General',NULL,'Partial delivery of tools and boardup materials','1',0.00,0.00,0.00,'2025-11-18 23:39:03'),(14,404,'Preperation for Installation/Manufacturing','2025-12-30','2026-01-11',8,'task',400,0,0,0,0,'General',NULL,'Preperation for Installation/Manufacturing','1',0.00,0.00,0.00,'2025-11-18 23:39:03'),(15,500,'Mechanical Installation','2026-01-11','2026-03-15',45,'summary',NULL,0,0,0,0,'General',NULL,'Mechanical Installation','1',0.00,0.00,0.00,'2025-11-18 23:39:03'),(16,501,'Unloading of elevator equipments','2026-01-11','2026-01-12',1,'task',500,0,0,0,0,'General','1','Unloading of elevator equipments','1',0.00,0.00,0.00,'2025-11-18 23:39:03'),(17,502,'Scaffolding Installation','2026-01-12','2026-01-14',2,'task',500,0,0,7,0,'General','2','Scaffolding Installation','1',7.00,0.00,0.00,'2025-11-18 23:39:03'),(18,503,'Hauling Works','2026-01-14','2026-01-18',2,'task',500,0,0,7,0,'General','3','Hauling Works','1',7.00,0.00,0.00,'2025-11-18 23:39:03'),(19,504,'Template Setting','2026-01-18','2026-01-20',2,'task',500,0,0,7,0,'General','4','Template Setting','1',7.00,0.00,0.00,'2025-11-18 23:39:03'),(20,505,'Marking and Boring of Holes','2026-01-20','2026-01-21',1,'task',500,0,0,0,0,'General','5','Marking and Boring of Holes','1',0.00,0.00,0.00,'2025-11-18 23:39:03'),(21,506,'Rail Bracket Installation','2026-01-21','2026-01-25',2,'task',500,0,0,7,0,'General','6','Rail Bracket Installation','1',7.00,0.00,0.00,'2025-11-18 23:39:03'),(22,507,'Guide Rail Setting','2026-01-25','2026-02-01',5,'summary',500,0,0,0,0,'General',NULL,'Guide Rail Setting','1',0.00,0.00,0.00,'2025-11-18 23:39:03'),(23,508,'Main/Car','2026-01-25','2026-01-27',2,'task',507,0,0,5,0,'Guide Rail Setting','A','Main/Car','1',5.00,0.00,0.00,'2025-11-18 23:39:03'),(24,509,'Counterweight (CWT)','2026-01-27','2026-01-29',2,'task',507,0,0,3,0,'Guide Rail Setting','B','Counterweight (CWT)','1',3.00,0.00,0.00,'2025-11-18 23:39:03'),(25,510,'Gauging','2026-01-29','2026-02-01',1,'task',507,0,0,3,0,'Guide Rail Setting','C','Gauging','1',3.00,0.00,0.00,'2025-11-18 23:39:03'),(26,511,'Landing Door Assembly','2026-02-01','2026-02-09',6,'summary',500,0,0,0,0,'General',NULL,'Landing Door Assembly','1',0.00,0.00,0.00,'2025-11-18 23:39:03'),(27,512,'Sills and Supports','2026-02-01','2026-02-03',2,'task',511,0,0,2,0,'Landing Door Assembly','A','Sills and Supports','1',2.00,0.00,0.00,'2025-11-18 23:39:03'),(28,513,'Jamb and Supports','2026-02-03','2026-02-05',2,'task',511,0,0,2,0,'Landing Door Assembly','B','Jamb and Supports','1',2.00,0.00,0.00,'2025-11-18 23:39:03'),(29,514,'Frame and Doors','2026-02-05','2026-02-09',2,'task',511,0,0,3,0,'Landing Door Assembly','C','Frame and Doors','1',3.00,0.00,0.00,'2025-11-18 23:39:03'),(30,515,'M/R Equipment Setting','2026-02-09','2026-02-17',6,'summary',500,0,0,0,0,'General',NULL,'M/R Equipment Setting','1',0.00,0.00,0.00,'2025-11-18 23:39:03'),(31,516,'Traction Machine','2026-02-09','2026-02-11',2,'task',515,0,0,5,0,'M/R Equipment Setting','A','Traction Machine','1',5.00,0.00,0.00,'2025-11-18 23:39:03'),(32,517,'Support Beams','2026-02-11','2026-02-15',2,'task',515,0,0,5,0,'M/R Equipment Setting','B','Support Beams','1',5.00,0.00,0.00,'2025-11-18 23:39:03'),(33,519,'Installation of Control Panel','2026-02-17','2026-02-19',2,'task',500,0,0,3,0,'M/R Equipment Setting','D','Installation of Control Panel','1',3.00,0.00,0.00,'2025-11-18 23:39:03'),(34,518,'Governor (M/R)','2026-02-15','2026-02-17',2,'task',515,0,0,2,0,'M/R Equipment Setting','C','Governor (M/R)','1',2.00,0.00,0.00,'2025-11-18 23:39:03'),(35,520,'Car Assembly','2026-02-19','2026-02-24',3,'summary',500,0,0,0,0,'General',NULL,'Car Assembly','1',0.00,0.00,0.00,'2025-11-18 23:39:03'),(36,521,'All Accessories','2026-02-19','2026-02-23',2,'task',520,0,0,3,0,'Car Assembly','A','All Accessories','1',3.00,0.00,0.00,'2025-11-18 23:39:03'),(37,522,'Car Piping/Wiring','2026-02-23','2026-02-24',1,'task',520,0,0,3,0,'Car Assembly','B','Car Piping/Wiring','1',3.00,0.00,0.00,'2025-11-18 23:39:03'),(38,523,'Travelling Cable Layout','2026-02-24','2026-02-26',2,'task',500,0,0,2,0,'Car Assembly','C','Travelling Cable Layout','1',2.00,0.00,0.00,'2025-11-18 23:39:03'),(39,524,'Counterweight Assembly','2026-02-26','2026-03-02',2,'task',500,0,0,2,0,'Car Assembly','D','Counterweight Assembly','1',2.00,0.00,0.00,'2025-11-18 23:39:03'),(40,525,'Laying out of Ropes','2026-03-02','2026-03-09',5,'summary',500,0,0,0,0,'General',NULL,'Laying out of Ropes','1',0.00,0.00,0.00,'2025-11-18 23:39:03'),(41,526,'Hoisting','2026-03-02','2026-03-04',2,'task',525,0,0,2,0,'Laying out of ropes','A','Hoisting','1',2.00,0.00,0.00,'2025-11-18 23:39:03'),(42,527,'Governor (Ropes)','2026-03-04','2026-03-08',2,'task',525,0,0,3,0,'Compensating','B','Governor (Ropes)','1',3.00,0.00,0.00,'2025-11-18 23:39:03'),(43,528,'Compensating','2026-03-08','2026-03-09',1,'task',525,0,0,3,0,'Laying out of ropes','C','Compensating','1',3.00,0.00,0.00,'2025-11-18 23:39:03'),(44,529,'Wiring','2026-03-09','2026-03-11',2,'summary',500,0,0,0,0,'General',NULL,'Wiring','1',0.00,0.00,0.00,'2025-11-18 23:39:03'),(45,530,'Machine Room','2026-03-09','2026-03-10',1,'task',529,0,0,5,0,'Wiring','A','Machine Room','1',5.00,0.00,0.00,'2025-11-18 23:39:03'),(46,531,'Hoistway','2026-03-10','2026-03-11',1,'task',529,0,0,3,0,'Wiring','B','Hoistway','1',3.00,0.00,0.00,'2025-11-18 23:39:03'),(47,532,'Installation of Pit Ladder / Hoistway Lighting','2026-03-11','2026-03-15',2,'task',500,0,0,3,0,'Wiring','C','Installation of Pit Ladder / Hoistway Lighting','1',3.00,0.00,0.00,'2025-11-18 23:39:03'),(48,600,'Testing and Commissioning','2026-03-15','2026-04-05',15,'summary',NULL,0,0,0,0,'General',NULL,'Testing and Commissioning','1',0.00,0.00,0.00,'2025-11-18 23:39:03'),(49,601,'Initial testing','2026-03-15','2026-03-18',3,'task',600,0,0,3,0,'Testing and Commissioning (Passenger Elevator)','A','Initial testing','1',3.00,0.00,0.00,'2025-11-18 23:39:03'),(50,602,'Slow speed','2026-03-18','2026-03-22',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','B','Slow speed','1',1.00,0.00,0.00,'2025-11-18 23:39:03'),(51,603,'High speed and Mechanical Adjustment','2026-03-22','2026-03-24',2,'task',600,0,0,2,0,'Testing and Commissioning (Passenger Elevator)','C','High speed and Mechanical Adjustment','1',2.00,0.00,0.00,'2025-11-18 23:39:03'),(52,604,'Load Test','2026-03-24','2026-03-26',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','D','Load Test','1',1.00,0.00,0.00,'2025-11-18 23:39:03'),(53,605,'Final Adjust','2026-03-26','2026-03-30',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','E','Final Adjust','1',1.00,0.00,0.00,'2025-11-18 23:39:03'),(54,606,'Features Test / Correction of Defects','2026-03-30','2026-04-01',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','F','Features Test / Correction of Defects','1',1.00,0.00,0.00,'2025-11-18 23:39:03'),(55,607,'Final Cleaning / Hand over','2026-04-01','2026-04-05',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','G','Final Cleaning / Hand over','1',1.00,0.00,0.00,'2025-11-18 23:39:03');
/*!40000 ALTER TABLE `project_344_schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_345_schedule`
--

DROP TABLE IF EXISTS `project_345_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_345_schedule` (
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
-- Dumping data for table `project_345_schedule`
--

LOCK TABLES `project_345_schedule` WRITE;
/*!40000 ALTER TABLE `project_345_schedule` DISABLE KEYS */;
INSERT INTO `project_345_schedule` VALUES (1,100,'Preliminaries','2025-09-14','2025-09-29',15,'summary',NULL,0,0,0,0,'General',NULL,'Preliminaries','1',0.00,0.00,0.00,'2025-11-18 23:34:16'),(2,103,'Submission of Drawing and Finishes for Approval','2025-09-23','2025-09-28',5,'task',100,0,0,0,0,'General',NULL,'Submission of Drawing and Finishes for Approval','1',0.00,0.00,0.00,'2025-11-18 23:34:16'),(3,301,'Manufacturing and Importation','2025-09-29','2025-11-15',47,'task',300,0,0,0,0,'General',NULL,'Manufacturing and Importation','1',0.00,0.00,0.00,'2025-11-18 23:34:16'),(4,400,'Planning For Mobilization And Execution','2025-11-15','2025-12-13',28,'summary',NULL,0,0,0,0,'General',NULL,'Planning For Mobilization And Execution','1',0.00,0.00,0.00,'2025-11-18 23:34:16'),(5,102,'Layout of Drawing','2025-09-20','2025-09-23',3,'task',100,0,0,0,0,'General',NULL,'Layout of Drawing','1',0.00,0.00,0.00,'2025-11-18 23:34:16'),(6,101,'Pre-Inspection(Checkin of Shaft)','2025-09-14','2025-09-20',6,'task',100,0,0,0,1,'General',NULL,'Pre-Inspection(Checkin of Shaft)','1',0.00,0.00,0.00,'2025-11-18 23:34:16'),(7,104,'Submission of PO to Factory','2025-09-28','2025-09-29',1,'task',100,0,0,0,0,'General',NULL,'Submission of PO to Factory','1',0.00,0.00,0.00,'2025-11-18 23:34:16'),(8,300,'Manufacturing and Importation Process','2025-09-29','2025-11-15',47,'summary',NULL,0,0,0,0,'General',NULL,'Manufacturing and Importation Process','1',0.00,0.00,0.00,'2025-11-18 23:34:16'),(9,200,'Structural/Civil Works','2025-09-29','2025-11-15',47,'summary',NULL,0,0,0,0,'General',NULL,'Structural/Civil Works','1',0.00,0.00,0.00,'2025-11-18 23:34:16'),(10,201,'Shaft Construction','2025-09-29','2025-11-15',47,'task',200,0,0,0,0,'General',NULL,'Shaft Construction','1',0.00,0.00,0.00,'2025-11-18 23:34:16'),(11,401,'Preparation of tools and materials for elevator installation','2025-11-15','2025-11-29',14,'task',400,0,0,0,0,'General',NULL,'Preparation of tools and materials for elevator installation','1',0.00,0.00,0.00,'2025-11-18 23:34:16'),(12,402,'Layout of boardup markings','2025-11-29','2025-12-02',3,'task',400,0,0,0,0,'General',NULL,'Layout of boardup markings','1',0.00,0.00,0.00,'2025-11-18 23:34:16'),(13,403,'Partial delivery of tools and boardup materials','2025-12-02','2025-12-05',3,'task',400,0,0,0,0,'General',NULL,'Partial delivery of tools and boardup materials','1',0.00,0.00,0.00,'2025-11-18 23:34:16'),(14,404,'Preperation for Installation/Manufacturing','2025-12-05','2025-12-13',8,'task',400,0,0,0,0,'General',NULL,'Preperation for Installation/Manufacturing','1',0.00,0.00,0.00,'2025-11-18 23:34:16'),(15,500,'Mechanical Installation','2025-12-13','2026-01-27',45,'summary',NULL,0,0,0,0,'General',NULL,'Mechanical Installation','1',0.00,0.00,0.00,'2025-11-18 23:34:16'),(16,501,'Unloading of elevator equipments','2025-12-13','2025-12-14',1,'task',500,0,0,0,0,'General','1','Unloading of elevator equipments','1',0.00,0.00,0.00,'2025-11-18 23:34:16'),(17,502,'Scaffolding Installation','2025-12-14','2025-12-16',2,'task',500,0,0,7,0,'General','2','Scaffolding Installation','1',7.00,0.00,0.00,'2025-11-18 23:34:16'),(18,503,'Hauling Works','2025-12-16','2025-12-18',2,'task',500,0,0,7,0,'General','3','Hauling Works','1',7.00,0.00,0.00,'2025-11-18 23:34:16'),(19,504,'Template Setting','2025-12-18','2025-12-20',2,'task',500,0,0,7,0,'General','4','Template Setting','1',7.00,0.00,0.00,'2025-11-18 23:34:16'),(20,505,'Marking and Boring of Holes','2025-12-20','2025-12-21',1,'task',500,0,0,0,0,'General','5','Marking and Boring of Holes','1',0.00,0.00,0.00,'2025-11-18 23:34:16'),(21,506,'Rail Bracket Installation','2025-12-21','2025-12-23',2,'task',500,0,0,7,0,'General','6','Rail Bracket Installation','1',7.00,0.00,0.00,'2025-11-18 23:34:16'),(22,507,'Guide Rail Setting','2025-12-23','2025-12-28',5,'summary',500,0,0,0,0,'General',NULL,'Guide Rail Setting','1',0.00,0.00,0.00,'2025-11-18 23:34:16'),(23,508,'Main/Car','2025-12-23','2025-12-25',2,'task',507,0,0,5,0,'Guide Rail Setting','A','Main/Car','1',5.00,0.00,0.00,'2025-11-18 23:34:16'),(24,509,'Counterweight (CWT)','2025-12-25','2025-12-27',2,'task',507,0,0,3,0,'Guide Rail Setting','B','Counterweight (CWT)','1',3.00,0.00,0.00,'2025-11-18 23:34:16'),(25,510,'Gauging','2025-12-27','2025-12-28',1,'task',507,0,0,3,0,'Guide Rail Setting','C','Gauging','1',3.00,0.00,0.00,'2025-11-18 23:34:16'),(26,511,'Landing Door Assembly','2025-12-28','2026-01-03',6,'summary',500,0,0,0,0,'General',NULL,'Landing Door Assembly','1',0.00,0.00,0.00,'2025-11-18 23:34:16'),(27,512,'Sills and Supports','2025-12-28','2025-12-30',2,'task',511,0,0,2,0,'Landing Door Assembly','A','Sills and Supports','1',2.00,0.00,0.00,'2025-11-18 23:34:16'),(28,513,'Jamb and Supports','2025-12-30','2026-01-01',2,'task',511,0,0,2,0,'Landing Door Assembly','B','Jamb and Supports','1',2.00,0.00,0.00,'2025-11-18 23:34:16'),(29,514,'Frame and Doors','2026-01-01','2026-01-03',2,'task',511,0,0,3,0,'Landing Door Assembly','C','Frame and Doors','1',3.00,0.00,0.00,'2025-11-18 23:34:16'),(30,515,'M/R Equipment Setting','2026-01-03','2026-01-09',6,'summary',500,0,0,0,0,'General',NULL,'M/R Equipment Setting','1',0.00,0.00,0.00,'2025-11-18 23:34:16'),(31,516,'Traction Machine','2026-01-03','2026-01-05',2,'task',515,0,0,5,0,'M/R Equipment Setting','A','Traction Machine','1',5.00,0.00,0.00,'2025-11-18 23:34:16'),(32,517,'Support Beams','2026-01-05','2026-01-07',2,'task',515,0,0,5,0,'M/R Equipment Setting','B','Support Beams','1',5.00,0.00,0.00,'2025-11-18 23:34:16'),(33,518,'Governor (M/R)','2026-01-07','2026-01-09',2,'task',515,0,0,2,0,'M/R Equipment Setting','C','Governor (M/R)','1',2.00,0.00,0.00,'2025-11-18 23:34:16'),(34,519,'Installation of Control Panel','2026-01-09','2026-01-11',2,'task',500,0,0,3,0,'M/R Equipment Setting','D','Installation of Control Panel','1',3.00,0.00,0.00,'2025-11-18 23:34:16'),(35,520,'Car Assembly','2026-01-11','2026-01-14',3,'summary',500,0,0,0,0,'General',NULL,'Car Assembly','1',0.00,0.00,0.00,'2025-11-18 23:34:16'),(36,521,'All Accessories','2026-01-11','2026-01-13',2,'task',520,0,0,3,0,'Car Assembly','A','All Accessories','1',3.00,0.00,0.00,'2025-11-18 23:34:16'),(37,522,'Car Piping/Wiring','2026-01-13','2026-01-14',1,'task',520,0,0,3,0,'Car Assembly','B','Car Piping/Wiring','1',3.00,0.00,0.00,'2025-11-18 23:34:16'),(38,523,'Travelling Cable Layout','2026-01-14','2026-01-16',2,'task',500,0,0,2,0,'Car Assembly','C','Travelling Cable Layout','1',2.00,0.00,0.00,'2025-11-18 23:34:16'),(39,524,'Counterweight Assembly','2026-01-16','2026-01-18',2,'task',500,0,0,2,0,'Car Assembly','D','Counterweight Assembly','1',2.00,0.00,0.00,'2025-11-18 23:34:16'),(40,525,'Laying out of Ropes','2026-01-18','2026-01-23',5,'summary',500,0,0,0,0,'General',NULL,'Laying out of Ropes','1',0.00,0.00,0.00,'2025-11-18 23:34:16'),(41,526,'Hoisting','2026-01-18','2026-01-20',2,'task',525,0,0,2,0,'Laying out of ropes','A','Hoisting','1',2.00,0.00,0.00,'2025-11-18 23:34:16'),(42,527,'Governor (Ropes)','2026-01-20','2026-01-22',2,'task',525,0,0,3,0,'Compensating','B','Governor (Ropes)','1',3.00,0.00,0.00,'2025-11-18 23:34:16'),(43,528,'Compensating','2026-01-22','2026-01-23',1,'task',525,0,0,3,0,'Laying out of ropes','C','Compensating','1',3.00,0.00,0.00,'2025-11-18 23:34:16'),(44,529,'Wiring','2026-01-23','2026-01-25',2,'summary',500,0,0,0,0,'General',NULL,'Wiring','1',0.00,0.00,0.00,'2025-11-18 23:34:16'),(45,530,'Machine Room','2026-01-23','2026-01-24',1,'task',529,0,0,5,0,'Wiring','A','Machine Room','1',5.00,0.00,0.00,'2025-11-18 23:34:16'),(46,531,'Hoistway','2026-01-24','2026-01-25',1,'task',529,0,0,3,0,'Wiring','B','Hoistway','1',3.00,0.00,0.00,'2025-11-18 23:34:16'),(47,532,'Installation of Pit Ladder / Hoistway Lighting','2026-01-25','2026-01-27',2,'task',500,0,0,3,0,'Wiring','C','Installation of Pit Ladder / Hoistway Lighting','1',3.00,0.00,0.00,'2025-11-18 23:34:16'),(48,600,'Testing and Commissioning','2026-01-27','2026-02-11',15,'summary',NULL,0,0,0,0,'General',NULL,'Testing and Commissioning','1',0.00,0.00,0.00,'2025-11-18 23:34:16'),(49,601,'Initial testing','2026-01-27','2026-01-30',3,'task',600,0,0,3,0,'Testing and Commissioning (Passenger Elevator)','A','Initial testing','1',3.00,0.00,0.00,'2025-11-18 23:34:16'),(50,602,'Slow speed','2026-01-30','2026-02-01',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','B','Slow speed','1',1.00,0.00,0.00,'2025-11-18 23:34:16'),(51,603,'High speed and Mechanical Adjustment','2026-02-01','2026-02-03',2,'task',600,0,0,2,0,'Testing and Commissioning (Passenger Elevator)','C','High speed and Mechanical Adjustment','1',2.00,0.00,0.00,'2025-11-18 23:34:16'),(52,605,'Final Adjust','2026-02-05','2026-02-07',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','E','Final Adjust','1',1.00,0.00,0.00,'2025-11-18 23:34:16'),(53,604,'Load Test','2026-02-03','2026-02-05',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','D','Load Test','1',1.00,0.00,0.00,'2025-11-18 23:34:16'),(54,606,'Features Test / Correction of Defects','2026-02-07','2026-02-09',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','F','Features Test / Correction of Defects','1',1.00,0.00,0.00,'2025-11-18 23:34:16'),(55,607,'Final Cleaning / Hand over','2026-02-09','2026-02-11',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','G','Final Cleaning / Hand over','1',1.00,0.00,0.00,'2025-11-18 23:34:16');
/*!40000 ALTER TABLE `project_345_schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_348_schedule`
--

DROP TABLE IF EXISTS `project_348_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_348_schedule` (
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
-- Dumping data for table `project_348_schedule`
--

LOCK TABLES `project_348_schedule` WRITE;
/*!40000 ALTER TABLE `project_348_schedule` DISABLE KEYS */;
INSERT INTO `project_348_schedule` VALUES (1,100,'Preliminaries','2025-04-30','2025-05-21',15,'summary',NULL,0,1,0,0,'General',NULL,'Preliminaries','1',0.00,100.00,0.00,'2025-11-24 07:35:03'),(2,103,'Submission of Drawing and Finishes for Approval','2025-05-13','2025-05-20',5,'task',100,0,1,0,0,'General',NULL,'Submission of Drawing and Finishes for Approval','1',0.00,100.00,0.00,'2025-11-24 07:35:03'),(3,102,'Layout of Drawing','2025-05-08','2025-05-13',3,'task',100,0,1,0,0,'General',NULL,'Layout of Drawing','1',0.00,100.00,0.00,'2025-11-24 07:35:03'),(4,201,'Shaft Construction','2025-05-21','2025-07-25',47,'task',200,0,1,0,0,'General',NULL,'Shaft Construction','1',0.00,100.00,0.00,'2025-11-24 07:35:03'),(5,301,'Manufacturing and Importation','2025-05-21','2025-07-25',47,'task',300,0,1,0,0,'General',NULL,'Manufacturing and Importation','1',0.00,100.00,0.00,'2025-11-24 07:35:03'),(6,104,'Submission of PO to Factory','2025-05-20','2025-05-21',1,'task',100,0,1,0,0,'General',NULL,'Submission of PO to Factory','1',0.00,100.00,0.00,'2025-11-24 07:35:03'),(7,200,'Structural/Civil Works','2025-05-21','2025-07-25',47,'summary',NULL,0,1,0,0,'General',NULL,'Structural/Civil Works','1',0.00,100.00,0.00,'2025-11-24 07:35:03'),(8,300,'Manufacturing and Importation Process','2025-05-21','2025-07-25',47,'summary',NULL,0,1,0,0,'General',NULL,'Manufacturing and Importation Process','1',0.00,100.00,0.00,'2025-11-24 07:35:03'),(9,101,'Pre-Inspection(Checkin of Shaft)','2025-04-30','2025-05-08',6,'task',100,0,1,0,0,'General',NULL,'Pre-Inspection(Checkin of Shaft)','1',0.00,100.00,0.00,'2025-11-24 07:35:03'),(10,400,'Planning For Mobilization And Execution','2025-07-25','2025-09-03',28,'summary',NULL,0,1,0,0,'General',NULL,'Planning For Mobilization And Execution','1',0.00,100.00,0.00,'2025-11-24 07:35:03'),(11,401,'Preparation of tools and materials for elevator installation','2025-07-25','2025-08-14',14,'task',400,0,1,0,0,'General',NULL,'Preparation of tools and materials for elevator installation','1',0.00,100.00,0.00,'2025-11-24 07:35:03'),(12,402,'Layout of boardup markings','2025-08-14','2025-08-19',3,'task',400,0,1,0,0,'General',NULL,'Layout of boardup markings','1',0.00,100.00,0.00,'2025-11-24 07:35:03'),(13,403,'Partial delivery of tools and boardup materials','2025-08-19','2025-08-22',3,'task',400,0,1,0,0,'General',NULL,'Partial delivery of tools and boardup materials','1',0.00,100.00,0.00,'2025-11-24 07:35:03'),(14,404,'Preperation for Installation/Manufacturing','2025-08-22','2025-09-03',8,'task',400,0,1,0,0,'General',NULL,'Preperation for Installation/Manufacturing','1',0.00,100.00,0.00,'2025-11-24 07:35:03'),(15,500,'Mechanical Installation','2025-09-03','2025-11-05',45,'summary',NULL,0,1,0,0,'General',NULL,'Mechanical Installation','1',0.00,100.00,0.00,'2025-11-24 07:35:03'),(16,501,'Unloading of elevator equipments','2025-09-03','2025-09-04',1,'task',500,0,1,0,0,'General','1','Unloading of elevator equipments','1',0.00,100.00,0.00,'2025-11-24 07:35:03'),(17,502,'Scaffolding Installation','2025-09-04','2025-09-08',2,'task',500,0,1,7,0,'General','2','Scaffolding Installation','1',7.00,100.00,0.00,'2025-11-24 07:35:03'),(18,503,'Hauling Works','2025-09-08','2025-09-10',2,'task',500,0,1,7,0,'General','3','Hauling Works','1',7.00,100.00,0.00,'2025-11-24 07:35:03'),(19,504,'Template Setting','2025-09-10','2025-09-12',2,'task',500,0,1,7,0,'General','4','Template Setting','1',7.00,100.00,0.00,'2025-11-24 07:35:03'),(20,505,'Marking and Boring of Holes','2025-09-12','2025-09-15',1,'task',500,0,1,0,0,'General','5','Marking and Boring of Holes','1',0.00,100.00,0.00,'2025-11-24 07:35:03'),(21,506,'Rail Bracket Installation','2025-09-15','2025-09-17',2,'task',500,0,1,7,0,'General','6','Rail Bracket Installation','1',7.00,100.00,0.00,'2025-11-24 07:35:03'),(22,507,'Guide Rail Setting','2025-09-17','2025-09-24',5,'summary',500,0,1,0,0,'General',NULL,'Guide Rail Setting','1',0.00,100.00,0.00,'2025-11-24 07:35:03'),(23,508,'Main/Car','2025-09-17','2025-09-19',2,'task',507,0,1,5,0,'Guide Rail Setting','A','Main/Car','1',5.00,100.00,0.00,'2025-11-24 07:35:03'),(24,509,'Counterweight (CWT)','2025-09-19','2025-09-23',2,'task',507,0,1,3,0,'Guide Rail Setting','B','Counterweight (CWT)','1',3.00,100.00,0.00,'2025-11-24 07:35:03'),(25,510,'Gauging','2025-09-23','2025-09-24',1,'task',507,0,1,3,0,'Guide Rail Setting','C','Gauging','1',3.00,100.00,0.00,'2025-11-24 07:35:03'),(26,511,'Landing Door Assembly','2025-09-24','2025-10-02',6,'summary',500,0,1,0,0,'General',NULL,'Landing Door Assembly','1',0.00,100.00,0.00,'2025-11-24 07:35:03'),(27,512,'Sills and Supports','2025-09-24','2025-09-26',2,'task',511,0,1,2,0,'Landing Door Assembly','A','Sills and Supports','1',2.00,100.00,0.00,'2025-11-24 07:35:03'),(28,513,'Jamb and Supports','2025-09-26','2025-09-30',2,'task',511,0,1,2,0,'Landing Door Assembly','B','Jamb and Supports','1',2.00,100.00,0.00,'2025-11-24 07:35:03'),(29,514,'Frame and Doors','2025-09-30','2025-10-02',2,'task',511,0,1,3,0,'Landing Door Assembly','C','Frame and Doors','1',3.00,100.00,0.00,'2025-11-24 07:35:03'),(30,515,'M/R Equipment Setting','2025-10-02','2025-10-10',6,'summary',500,0,1,0,0,'General',NULL,'M/R Equipment Setting','1',0.00,100.00,0.00,'2025-11-24 07:35:03'),(31,516,'Traction Machine','2025-10-02','2025-10-06',2,'task',515,0,1,5,0,'M/R Equipment Setting','A','Traction Machine','1',5.00,100.00,0.00,'2025-11-24 07:35:03'),(32,517,'Support Beams','2025-10-06','2025-10-08',2,'task',515,0,1,5,0,'M/R Equipment Setting','B','Support Beams','1',5.00,100.00,0.00,'2025-11-24 07:35:03'),(33,518,'Governor (M/R)','2025-10-08','2025-10-10',2,'task',515,0,1,2,0,'M/R Equipment Setting','C','Governor (M/R)','1',2.00,100.00,0.00,'2025-11-24 07:35:03'),(34,519,'Installation of Control Panel','2025-10-10','2025-10-14',2,'task',500,0,1,3,0,'M/R Equipment Setting','D','Installation of Control Panel','1',3.00,100.00,0.00,'2025-11-24 07:35:03'),(35,520,'Car Assembly','2025-10-14','2025-10-17',3,'summary',500,0,1,0,0,'General',NULL,'Car Assembly','1',0.00,100.00,0.00,'2025-11-24 07:35:03'),(36,521,'All Accessories','2025-10-14','2025-10-16',2,'task',520,0,1,3,0,'Car Assembly','A','All Accessories','1',3.00,100.00,0.00,'2025-11-24 07:35:03'),(37,522,'Car Piping/Wiring','2025-10-16','2025-10-17',1,'task',520,0,1,3,0,'Car Assembly','B','Car Piping/Wiring','1',3.00,100.00,0.00,'2025-11-24 07:35:03'),(38,523,'Travelling Cable Layout','2025-10-17','2025-10-21',2,'task',500,0,1,2,0,'Car Assembly','C','Travelling Cable Layout','1',2.00,100.00,0.00,'2025-11-24 07:35:03'),(39,524,'Counterweight Assembly','2025-10-21','2025-10-23',2,'task',500,0,1,2,0,'Car Assembly','D','Counterweight Assembly','1',2.00,100.00,0.00,'2025-11-24 07:35:03'),(40,525,'Laying out of Ropes','2025-10-23','2025-10-30',5,'summary',500,0,1,0,0,'General',NULL,'Laying out of Ropes','1',0.00,100.00,0.00,'2025-11-24 07:35:03'),(41,526,'Hoisting','2025-10-23','2025-10-27',2,'task',525,0,1,2,0,'Laying out of ropes','A','Hoisting','1',2.00,100.00,0.00,'2025-11-24 07:35:03'),(42,527,'Governor (Ropes)','2025-10-27','2025-10-29',2,'task',525,0,1,3,0,'Compensating','B','Governor (Ropes)','1',3.00,100.00,0.00,'2025-11-24 07:35:03'),(43,528,'Compensating','2025-10-29','2025-10-30',1,'task',525,0,1,3,0,'Laying out of ropes','C','Compensating','1',3.00,100.00,0.00,'2025-11-24 07:35:03'),(44,529,'Wiring','2025-10-30','2025-11-03',2,'summary',500,0,1,0,0,'General',NULL,'Wiring','1',0.00,100.00,0.00,'2025-11-24 07:35:03'),(45,530,'Machine Room','2025-10-30','2025-10-31',1,'task',529,0,1,5,0,'Wiring','A','Machine Room','1',5.00,100.00,0.00,'2025-11-24 07:35:03'),(46,531,'Hoistway','2025-10-31','2025-11-03',1,'task',529,0,1,3,0,'Wiring','B','Hoistway','1',3.00,100.00,0.00,'2025-11-24 07:35:03'),(47,532,'Installation of Pit Ladder / Hoistway Lighting','2025-11-03','2025-11-05',2,'task',500,0,1,3,0,'Wiring','C','Installation of Pit Ladder / Hoistway Lighting','1',3.00,100.00,0.00,'2025-11-24 07:35:03'),(48,600,'Testing and Commissioning','2025-11-05','2025-11-26',15,'summary',NULL,0,1,0,0,'General',NULL,'Testing and Commissioning','1',0.00,100.00,0.00,'2025-11-24 07:35:03'),(49,601,'Initial testing','2025-11-05','2025-11-10',3,'task',600,0,1,3,0,'Testing and Commissioning (Passenger Elevator)','A','Initial testing','1',3.00,100.00,0.00,'2025-11-24 07:35:03'),(50,602,'Slow speed','2025-11-10','2025-11-12',2,'task',600,0,1,1,0,'Testing and Commissioning (Passenger Elevator)','B','Slow speed','1',1.00,100.00,0.00,'2025-11-24 07:35:03'),(51,603,'High speed and Mechanical Adjustment','2025-11-12','2025-11-14',2,'task',600,0,1,2,0,'Testing and Commissioning (Passenger Elevator)','C','High speed and Mechanical Adjustment','1',2.00,100.00,0.00,'2025-11-24 07:35:03'),(52,604,'Load Test','2025-11-14','2025-11-18',2,'task',600,0,1,1,0,'Testing and Commissioning (Passenger Elevator)','D','Load Test','1',1.00,100.00,0.00,'2025-11-24 07:35:03'),(53,605,'Final Adjust','2025-11-18','2025-11-20',2,'task',600,0,1,1,0,'Testing and Commissioning (Passenger Elevator)','E','Final Adjust','1',1.00,100.00,0.00,'2025-11-24 07:35:03'),(54,606,'Features Test / Correction of Defects','2025-11-20','2025-11-24',2,'task',600,0,1,1,0,'Testing and Commissioning (Passenger Elevator)','F','Features Test / Correction of Defects','1',1.00,100.00,0.00,'2025-11-24 07:35:03'),(55,607,'Final Cleaning / Hand over','2025-11-24','2025-11-26',2,'task',600,0,0,1,1,'Testing and Commissioning (Passenger Elevator)','G','Final Cleaning / Hand over','1',1.00,0.00,0.00,'2025-11-24 07:35:03');
/*!40000 ALTER TABLE `project_348_schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_349_schedule`
--

DROP TABLE IF EXISTS `project_349_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_349_schedule` (
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
-- Dumping data for table `project_349_schedule`
--

LOCK TABLES `project_349_schedule` WRITE;
/*!40000 ALTER TABLE `project_349_schedule` DISABLE KEYS */;
INSERT INTO `project_349_schedule` VALUES (1,103,'Submission of Drawing and Finishes for Approval','2025-06-20','2025-06-27',5,'task',100,0,1,0,0,'General',NULL,'Submission of Drawing and Finishes for Approval','1',0.00,100.00,0.00,'2025-11-24 07:36:20'),(2,300,'Manufacturing and Importation Process','2025-06-30','2025-09-03',47,'summary',NULL,0,1,0,0,'General',NULL,'Manufacturing and Importation Process','1',0.00,100.00,0.00,'2025-11-24 07:36:20'),(3,100,'Preliminaries','2025-06-09','2025-06-30',15,'summary',NULL,0,1,0,0,'General',NULL,'Preliminaries','1',0.00,100.00,0.00,'2025-11-24 07:36:20'),(4,201,'Shaft Construction','2025-06-30','2025-09-03',47,'task',200,0,1,0,0,'General',NULL,'Shaft Construction','1',0.00,100.00,0.00,'2025-11-24 07:36:20'),(5,200,'Structural/Civil Works','2025-06-30','2025-09-03',47,'summary',NULL,0,1,0,0,'General',NULL,'Structural/Civil Works','1',0.00,100.00,0.00,'2025-11-24 07:36:20'),(6,301,'Manufacturing and Importation','2025-06-30','2025-09-03',47,'task',300,0,1,0,0,'General',NULL,'Manufacturing and Importation','1',0.00,100.00,0.00,'2025-11-24 07:36:20'),(7,102,'Layout of Drawing','2025-06-17','2025-06-20',3,'task',100,0,1,0,0,'General',NULL,'Layout of Drawing','1',0.00,100.00,0.00,'2025-11-24 07:36:20'),(8,104,'Submission of PO to Factory','2025-06-27','2025-06-30',1,'task',100,0,1,0,0,'General',NULL,'Submission of PO to Factory','1',0.00,100.00,0.00,'2025-11-24 07:36:20'),(9,101,'Pre-Inspection(Checkin of Shaft)','2025-06-09','2025-06-17',6,'task',100,0,1,0,0,'General',NULL,'Pre-Inspection(Checkin of Shaft)','1',0.00,100.00,0.00,'2025-11-24 07:36:20'),(10,401,'Preparation of tools and materials for elevator installation','2025-09-03','2025-09-23',14,'task',400,0,1,0,0,'General',NULL,'Preparation of tools and materials for elevator installation','1',0.00,100.00,0.00,'2025-11-24 07:36:20'),(11,400,'Planning For Mobilization And Execution','2025-09-03','2025-10-13',28,'summary',NULL,0,1,0,0,'General',NULL,'Planning For Mobilization And Execution','1',0.00,100.00,0.00,'2025-11-24 07:36:20'),(12,402,'Layout of boardup markings','2025-09-23','2025-09-26',3,'task',400,0,1,0,0,'General',NULL,'Layout of boardup markings','1',0.00,100.00,0.00,'2025-11-24 07:36:20'),(13,403,'Partial delivery of tools and boardup materials','2025-09-26','2025-10-01',3,'task',400,0,1,0,0,'General',NULL,'Partial delivery of tools and boardup materials','1',0.00,100.00,0.00,'2025-11-24 07:36:20'),(14,404,'Preperation for Installation/Manufacturing','2025-10-01','2025-10-13',8,'task',400,0,1,0,0,'General',NULL,'Preperation for Installation/Manufacturing','1',0.00,100.00,0.00,'2025-11-24 07:36:20'),(15,500,'Mechanical Installation','2025-10-13','2025-12-15',45,'summary',NULL,0,1,0,0,'General',NULL,'Mechanical Installation','1',0.00,100.00,0.00,'2025-11-24 07:36:20'),(16,501,'Unloading of elevator equipments','2025-10-13','2025-10-14',1,'task',500,0,1,0,0,'General','1','Unloading of elevator equipments','1',0.00,100.00,0.00,'2025-11-24 07:36:20'),(17,502,'Scaffolding Installation','2025-10-14','2025-10-16',2,'task',500,0,1,7,0,'General','2','Scaffolding Installation','1',7.00,100.00,0.00,'2025-11-24 07:36:20'),(18,503,'Hauling Works','2025-10-16','2025-10-20',2,'task',500,0,1,7,0,'General','3','Hauling Works','1',7.00,100.00,0.00,'2025-11-24 07:36:20'),(19,504,'Template Setting','2025-10-20','2025-10-22',2,'task',500,0,1,7,0,'General','4','Template Setting','1',7.00,100.00,0.00,'2025-11-24 07:36:20'),(20,505,'Marking and Boring of Holes','2025-10-22','2025-10-23',1,'task',500,0,1,0,0,'General','5','Marking and Boring of Holes','1',0.00,100.00,0.00,'2025-11-24 07:36:20'),(21,506,'Rail Bracket Installation','2025-10-23','2025-10-27',2,'task',500,0,1,7,0,'General','6','Rail Bracket Installation','1',7.00,100.00,0.00,'2025-11-24 07:36:20'),(22,507,'Guide Rail Setting','2025-10-27','2025-11-03',5,'summary',500,0,1,0,0,'General',NULL,'Guide Rail Setting','1',0.00,100.00,0.00,'2025-11-24 07:36:20'),(23,508,'Main/Car','2025-10-27','2025-10-29',2,'task',507,0,1,5,0,'Guide Rail Setting','A','Main/Car','1',5.00,100.00,0.00,'2025-11-24 07:36:20'),(24,509,'Counterweight (CWT)','2025-10-29','2025-10-31',2,'task',507,0,1,3,0,'Guide Rail Setting','B','Counterweight (CWT)','1',3.00,100.00,0.00,'2025-11-24 07:36:20'),(25,510,'Gauging','2025-10-31','2025-11-03',1,'task',507,0,1,3,0,'Guide Rail Setting','C','Gauging','1',3.00,100.00,0.00,'2025-11-24 07:36:20'),(26,511,'Landing Door Assembly','2025-11-03','2025-11-11',6,'summary',500,0,1,0,0,'General',NULL,'Landing Door Assembly','1',0.00,100.00,0.00,'2025-11-24 07:36:20'),(27,512,'Sills and Supports','2025-11-03','2025-11-05',2,'task',511,0,1,2,0,'Landing Door Assembly','A','Sills and Supports','1',2.00,100.00,0.00,'2025-11-24 07:36:20'),(28,513,'Jamb and Supports','2025-11-05','2025-11-07',2,'task',511,0,1,2,0,'Landing Door Assembly','B','Jamb and Supports','1',2.00,100.00,0.00,'2025-11-24 07:36:20'),(29,514,'Frame and Doors','2025-11-07','2025-11-11',2,'task',511,0,1,3,0,'Landing Door Assembly','C','Frame and Doors','1',3.00,100.00,0.00,'2025-11-24 07:36:20'),(30,515,'M/R Equipment Setting','2025-11-11','2025-11-19',6,'summary',500,0,1,0,0,'General',NULL,'M/R Equipment Setting','1',0.00,100.00,0.00,'2025-11-24 07:36:20'),(31,516,'Traction Machine','2025-11-11','2025-11-13',2,'task',515,0,1,5,0,'M/R Equipment Setting','A','Traction Machine','1',5.00,100.00,0.00,'2025-11-24 07:36:21'),(32,517,'Support Beams','2025-11-13','2025-11-17',2,'task',515,0,1,5,0,'M/R Equipment Setting','B','Support Beams','1',5.00,100.00,0.00,'2025-11-24 07:36:21'),(33,518,'Governor (M/R)','2025-11-17','2025-11-19',2,'task',515,0,1,2,0,'M/R Equipment Setting','C','Governor (M/R)','1',2.00,100.00,0.00,'2025-11-24 07:36:21'),(34,519,'Installation of Control Panel','2025-11-19','2025-11-21',2,'task',500,0,1,3,0,'M/R Equipment Setting','D','Installation of Control Panel','1',3.00,100.00,0.00,'2025-11-24 07:36:21'),(35,520,'Car Assembly','2025-11-21','2025-11-26',3,'summary',500,0,1,0,0,'General',NULL,'Car Assembly','1',0.00,100.00,0.00,'2025-11-24 07:36:21'),(36,521,'All Accessories','2025-11-21','2025-11-25',2,'task',520,0,0,3,1,'Car Assembly','A','All Accessories','1',3.00,0.00,0.00,'2025-11-24 07:36:21'),(37,522,'Car Piping/Wiring','2025-11-25','2025-11-26',1,'task',520,0,0,3,0,'Car Assembly','B','Car Piping/Wiring','1',3.00,0.00,0.00,'2025-11-24 07:36:21'),(38,523,'Travelling Cable Layout','2025-11-26','2025-11-28',2,'task',500,0,0,2,0,'Car Assembly','C','Travelling Cable Layout','1',2.00,0.00,0.00,'2025-11-24 07:36:21'),(39,524,'Counterweight Assembly','2025-11-28','2025-12-02',2,'task',500,0,0,2,0,'Car Assembly','D','Counterweight Assembly','1',2.00,0.00,0.00,'2025-11-24 07:36:21'),(40,525,'Laying out of Ropes','2025-12-02','2025-12-09',5,'summary',500,0,0,0,0,'General',NULL,'Laying out of Ropes','1',0.00,0.00,0.00,'2025-11-24 07:36:21'),(41,526,'Hoisting','2025-12-02','2025-12-04',2,'task',525,0,0,2,0,'Laying out of ropes','A','Hoisting','1',2.00,0.00,0.00,'2025-11-24 07:36:21'),(42,527,'Governor (Ropes)','2025-12-04','2025-12-08',2,'task',525,0,0,3,0,'Compensating','B','Governor (Ropes)','1',3.00,0.00,0.00,'2025-11-24 07:36:21'),(43,528,'Compensating','2025-12-08','2025-12-09',1,'task',525,0,0,3,0,'Laying out of ropes','C','Compensating','1',3.00,0.00,0.00,'2025-11-24 07:36:21'),(44,529,'Wiring','2025-12-09','2025-12-11',2,'summary',500,0,0,0,0,'General',NULL,'Wiring','1',0.00,0.00,0.00,'2025-11-24 07:36:21'),(45,530,'Machine Room','2025-12-09','2025-12-10',1,'task',529,0,0,5,0,'Wiring','A','Machine Room','1',5.00,0.00,0.00,'2025-11-24 07:36:21'),(46,531,'Hoistway','2025-12-10','2025-12-11',1,'task',529,0,0,3,0,'Wiring','B','Hoistway','1',3.00,0.00,0.00,'2025-11-24 07:36:21'),(47,532,'Installation of Pit Ladder / Hoistway Lighting','2025-12-11','2025-12-15',2,'task',500,0,0,3,0,'Wiring','C','Installation of Pit Ladder / Hoistway Lighting','1',3.00,0.00,0.00,'2025-11-24 07:36:21'),(48,600,'Testing and Commissioning','2025-12-15','2026-01-05',15,'summary',NULL,0,0,0,0,'General',NULL,'Testing and Commissioning','1',0.00,0.00,0.00,'2025-11-24 07:36:21'),(49,601,'Initial testing','2025-12-15','2025-12-18',3,'task',600,0,0,3,0,'Testing and Commissioning (Passenger Elevator)','A','Initial testing','1',3.00,0.00,0.00,'2025-11-24 07:36:21'),(50,602,'Slow speed','2025-12-18','2025-12-22',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','B','Slow speed','1',1.00,0.00,0.00,'2025-11-24 07:36:21'),(51,603,'High speed and Mechanical Adjustment','2025-12-22','2025-12-24',2,'task',600,0,0,2,0,'Testing and Commissioning (Passenger Elevator)','C','High speed and Mechanical Adjustment','1',2.00,0.00,0.00,'2025-11-24 07:36:21'),(52,604,'Load Test','2025-12-24','2025-12-26',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','D','Load Test','1',1.00,0.00,0.00,'2025-11-24 07:36:21'),(53,605,'Final Adjust','2025-12-26','2025-12-30',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','E','Final Adjust','1',1.00,0.00,0.00,'2025-11-24 07:36:21'),(54,606,'Features Test / Correction of Defects','2025-12-30','2026-01-01',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','F','Features Test / Correction of Defects','1',1.00,0.00,0.00,'2025-11-24 07:36:21'),(55,607,'Final Cleaning / Hand over','2026-01-01','2026-01-05',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','G','Final Cleaning / Hand over','1',1.00,0.00,0.00,'2025-11-24 07:36:21');
/*!40000 ALTER TABLE `project_349_schedule` ENABLE KEYS */;
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
INSERT INTO `project_44_schedule` VALUES (1,103,'Submission of Drawing and Finishes for Approval','2025-07-25','2025-08-01',5,'task',100,0,1,0,0,'General',NULL,'Submission of Drawing and Finishes for Approval','1',0.00,100.00,0.00,'2025-11-24 07:17:17'),(2,101,'Pre-Inspection(Checkin of Shaft)','2025-07-14','2025-07-22',6,'task',100,0,1,0,0,'General',NULL,'Pre-Inspection(Checkin of Shaft)','1',0.00,100.00,0.00,'2025-11-24 07:17:17'),(3,100,'Preliminaries','2025-07-14','2025-08-04',15,'summary',NULL,0,1,0,0,'General',NULL,'Preliminaries','1',0.00,100.00,0.00,'2025-11-24 07:17:17'),(4,301,'Manufacturing and Importation','2025-08-04','2025-10-08',47,'task',300,0,1,0,0,'General',NULL,'Manufacturing and Importation','1',0.00,100.00,0.00,'2025-11-24 07:17:17'),(5,400,'Planning For Mobilization And Execution','2025-10-08','2025-11-17',28,'summary',NULL,0,1,0,0,'General',NULL,'Planning For Mobilization And Execution','1',0.00,100.00,0.00,'2025-11-24 07:17:17'),(6,300,'Manufacturing and Importation Process','2025-08-04','2025-10-08',47,'summary',NULL,0,1,0,0,'General',NULL,'Manufacturing and Importation Process','1',0.00,100.00,0.00,'2025-11-24 07:17:17'),(7,104,'Submission of PO to Factory','2025-08-01','2025-08-04',1,'task',100,0,1,0,0,'General',NULL,'Submission of PO to Factory','1',0.00,100.00,0.00,'2025-11-24 07:17:17'),(8,201,'Shaft Construction','2025-08-04','2025-10-08',47,'task',200,0,1,0,0,'General',NULL,'Shaft Construction','1',0.00,100.00,0.00,'2025-11-24 07:17:17'),(9,102,'Layout of Drawing','2025-07-22','2025-07-25',3,'task',100,0,1,0,0,'General',NULL,'Layout of Drawing','1',0.00,100.00,0.00,'2025-11-24 07:17:17'),(10,200,'Structural/Civil Works','2025-08-04','2025-10-08',47,'summary',NULL,0,1,0,0,'General',NULL,'Structural/Civil Works','1',0.00,100.00,0.00,'2025-11-24 07:17:17'),(11,401,'Preparation of tools and materials for elevator installation','2025-10-08','2025-10-28',14,'task',400,0,1,0,0,'General',NULL,'Preparation of tools and materials for elevator installation','1',0.00,100.00,0.00,'2025-11-24 07:17:17'),(12,402,'Layout of boardup markings','2025-10-28','2025-10-31',3,'task',400,0,1,0,0,'General',NULL,'Layout of boardup markings','1',0.00,100.00,0.00,'2025-11-24 07:17:18'),(13,403,'Partial delivery of tools and boardup materials','2025-10-31','2025-11-05',3,'task',400,0,1,0,0,'General',NULL,'Partial delivery of tools and boardup materials','1',0.00,100.00,0.00,'2025-11-24 07:17:18'),(14,404,'Preperation for Installation/Manufacturing','2025-11-05','2025-11-17',8,'task',400,0,1,0,0,'General',NULL,'Preperation for Installation/Manufacturing','1',0.00,100.00,0.00,'2025-11-24 07:17:18'),(15,500,'Mechanical Installation','2025-11-17','2026-01-19',45,'summary',NULL,0,1,0,0,'General',NULL,'Mechanical Installation','1',0.00,100.00,0.00,'2025-11-24 07:17:18'),(16,501,'Unloading of elevator equipments','2025-11-17','2025-11-18',1,'task',500,0,1,0,0,'General','1','Unloading of elevator equipments','1',0.00,100.00,0.00,'2025-11-24 07:17:18'),(17,502,'Scaffolding Installation','2025-11-18','2025-11-20',2,'task',500,0,1,7,0,'General','2','Scaffolding Installation','1',7.00,100.00,0.00,'2025-11-24 07:17:18'),(18,503,'Hauling Works','2025-11-20','2025-11-24',2,'task',500,0,1,7,0,'General','3','Hauling Works','1',7.00,100.00,0.00,'2025-11-24 07:17:18'),(19,504,'Template Setting','2025-11-24','2025-11-26',2,'task',500,0,1,7,1,'General','4','Template Setting','1',7.00,0.00,0.00,'2025-11-24 07:17:18'),(20,505,'Marking and Boring of Holes','2025-11-26','2025-11-27',1,'task',500,0,1,0,0,'General','5','Marking and Boring of Holes','1',0.00,0.00,0.00,'2025-11-24 07:17:18'),(21,506,'Rail Bracket Installation','2025-11-27','2025-12-01',2,'task',500,0,1,7,0,'General','6','Rail Bracket Installation','1',7.00,0.00,0.00,'2025-11-24 07:17:18'),(22,507,'Guide Rail Setting','2025-12-01','2025-12-08',5,'summary',500,0,1,0,0,'General',NULL,'Guide Rail Setting','1',0.00,0.00,0.00,'2025-11-24 07:17:18'),(23,508,'Main/Car','2025-12-01','2025-12-03',2,'task',507,0,1,5,0,'Guide Rail Setting','A','Main/Car','1',5.00,0.00,0.00,'2025-11-24 07:17:18'),(24,509,'Counterweight (CWT)','2025-12-03','2025-12-05',2,'task',507,0,1,3,0,'Guide Rail Setting','B','Counterweight (CWT)','1',3.00,0.00,0.00,'2025-11-24 07:17:18'),(25,510,'Gauging','2025-12-05','2025-12-08',1,'task',507,0,1,3,0,'Guide Rail Setting','C','Gauging','1',3.00,0.00,0.00,'2025-11-24 07:17:18'),(26,511,'Landing Door Assembly','2025-12-08','2025-12-16',6,'summary',500,0,1,0,0,'General',NULL,'Landing Door Assembly','1',0.00,0.00,0.00,'2025-11-24 07:17:18'),(27,512,'Sills and Supports','2025-12-08','2025-12-10',2,'task',511,0,1,2,0,'Landing Door Assembly','A','Sills and Supports','1',2.00,0.00,0.00,'2025-11-24 07:17:18'),(28,513,'Jamb and Supports','2025-12-10','2025-12-12',2,'task',511,0,1,2,0,'Landing Door Assembly','B','Jamb and Supports','1',2.00,0.00,0.00,'2025-11-24 07:17:18'),(29,514,'Frame and Doors','2025-12-12','2025-12-16',2,'task',511,0,1,3,0,'Landing Door Assembly','C','Frame and Doors','1',3.00,0.00,0.00,'2025-11-24 07:17:18'),(30,515,'M/R Equipment Setting','2025-12-16','2025-12-24',6,'summary',500,0,1,0,0,'General',NULL,'M/R Equipment Setting','1',0.00,0.00,0.00,'2025-11-24 07:17:18'),(31,516,'Traction Machine','2025-12-16','2025-12-18',2,'task',515,0,1,5,0,'M/R Equipment Setting','A','Traction Machine','1',5.00,0.00,0.00,'2025-11-24 07:17:18'),(32,517,'Support Beams','2025-12-18','2025-12-22',2,'task',515,0,1,5,0,'M/R Equipment Setting','B','Support Beams','1',5.00,0.00,0.00,'2025-11-24 07:17:18'),(33,518,'Governor (M/R)','2025-12-22','2025-12-24',2,'task',515,0,1,2,0,'M/R Equipment Setting','C','Governor (M/R)','1',2.00,0.00,0.00,'2025-11-24 07:17:18'),(34,519,'Installation of Control Panel','2025-12-24','2025-12-26',2,'task',500,0,1,3,0,'M/R Equipment Setting','D','Installation of Control Panel','1',3.00,0.00,0.00,'2025-11-24 07:17:18'),(35,520,'Car Assembly','2025-12-26','2025-12-31',3,'summary',500,0,1,0,0,'General',NULL,'Car Assembly','1',0.00,0.00,0.00,'2025-11-24 07:17:18'),(36,521,'All Accessories','2025-12-26','2025-12-30',2,'task',520,0,1,3,0,'Car Assembly','A','All Accessories','1',3.00,0.00,0.00,'2025-11-24 07:17:18'),(37,522,'Car Piping/Wiring','2025-12-30','2025-12-31',1,'task',520,0,1,3,0,'Car Assembly','B','Car Piping/Wiring','1',3.00,0.00,0.00,'2025-11-24 07:17:18'),(38,523,'Travelling Cable Layout','2025-12-31','2026-01-02',2,'task',500,0,1,2,0,'Car Assembly','C','Travelling Cable Layout','1',2.00,0.00,0.00,'2025-11-24 07:17:18'),(39,524,'Counterweight Assembly','2026-01-02','2026-01-06',2,'task',500,0,1,2,0,'Car Assembly','D','Counterweight Assembly','1',2.00,0.00,0.00,'2025-11-24 07:17:18'),(40,525,'Laying out of Ropes','2026-01-06','2026-01-13',5,'summary',500,0,1,0,0,'General',NULL,'Laying out of Ropes','1',0.00,0.00,0.00,'2025-11-24 07:17:18'),(41,526,'Hoisting','2026-01-06','2026-01-08',2,'task',525,0,1,2,0,'Laying out of ropes','A','Hoisting','1',2.00,0.00,0.00,'2025-11-24 07:17:18'),(42,527,'Governor (Ropes)','2026-01-08','2026-01-12',2,'task',525,0,1,3,0,'Compensating','B','Governor (Ropes)','1',3.00,0.00,0.00,'2025-11-24 07:17:18'),(43,528,'Compensating','2026-01-12','2026-01-13',1,'task',525,0,1,3,0,'Laying out of ropes','C','Compensating','1',3.00,0.00,0.00,'2025-11-24 07:17:18'),(44,529,'Wiring','2026-01-13','2026-01-15',2,'summary',500,0,1,0,0,'General',NULL,'Wiring','1',0.00,0.00,0.00,'2025-11-24 07:17:18'),(45,530,'Machine Room','2026-01-13','2026-01-14',1,'task',529,0,1,5,0,'Wiring','A','Machine Room','1',5.00,0.00,0.00,'2025-11-24 07:17:18'),(46,531,'Hoistway','2026-01-14','2026-01-15',1,'task',529,0,1,3,0,'Wiring','B','Hoistway','1',3.00,0.00,0.00,'2025-11-24 07:17:18'),(47,532,'Installation of Pit Ladder / Hoistway Lighting','2026-01-15','2026-01-19',2,'task',500,0,1,3,0,'Wiring','C','Installation of Pit Ladder / Hoistway Lighting','1',3.00,0.00,0.00,'2025-11-24 07:17:18'),(48,600,'Testing and Commissioning','2026-01-19','2026-02-09',15,'summary',NULL,0,0,0,0,'General',NULL,'Testing and Commissioning','1',0.00,0.00,0.00,'2025-11-24 07:17:18'),(49,601,'Initial testing','2026-01-19','2026-01-22',3,'task',600,0,0,3,0,'Testing and Commissioning (Passenger Elevator)','A','Initial testing','1',3.00,0.00,0.00,'2025-11-24 07:17:18'),(50,602,'Slow speed','2026-01-22','2026-01-26',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','B','Slow speed','1',1.00,0.00,0.00,'2025-11-24 07:17:18'),(51,603,'High speed and Mechanical Adjustment','2026-01-26','2026-01-28',2,'task',600,0,0,2,0,'Testing and Commissioning (Passenger Elevator)','C','High speed and Mechanical Adjustment','1',2.00,0.00,0.00,'2025-11-24 07:17:18'),(52,604,'Load Test','2026-01-28','2026-01-30',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','D','Load Test','1',1.00,0.00,0.00,'2025-11-24 07:17:18'),(53,605,'Final Adjust','2026-01-30','2026-02-03',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','E','Final Adjust','1',1.00,0.00,0.00,'2025-11-24 07:17:18'),(54,606,'Features Test / Correction of Defects','2026-02-03','2026-02-05',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','F','Features Test / Correction of Defects','1',1.00,0.00,0.00,'2025-11-24 07:17:18'),(55,607,'Final Cleaning / Hand over','2026-02-05','2026-02-09',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','G','Final Cleaning / Hand over','1',1.00,0.00,0.00,'2025-11-24 07:17:18');
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
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_45_schedule`
--

LOCK TABLES `project_45_schedule` WRITE;
/*!40000 ALTER TABLE `project_45_schedule` DISABLE KEYS */;
INSERT INTO `project_45_schedule` VALUES (1,201,'Shaft Construction','2025-05-15','2025-07-21',47,'task',200,0,1,0,0,'General',NULL,'Shaft Construction','1',0.00,100.00,0.00,'2025-11-18 23:12:38'),(2,100,'Preliminaries','2025-04-24','2025-05-15',15,'summary',NULL,0,1,0,0,'General',NULL,'Preliminaries','1',0.00,100.00,0.00,'2025-11-18 23:12:38'),(3,301,'Manufacturing and Importation','2025-05-15','2025-07-21',47,'task',300,0,1,0,0,'General',NULL,'Manufacturing and Importation','1',0.00,100.00,0.00,'2025-11-18 23:12:38'),(4,200,'Structural/Civil Works','2025-05-15','2025-07-21',47,'summary',NULL,0,1,0,0,'General',NULL,'Structural/Civil Works','1',0.00,100.00,0.00,'2025-11-18 23:12:38'),(5,103,'Submission of Drawing and Finishes for Approval','2025-05-07','2025-05-14',5,'task',100,0,1,0,0,'General',NULL,'Submission of Drawing and Finishes for Approval','1',0.00,100.00,0.00,'2025-11-18 23:12:38'),(6,102,'Layout of Drawing','2025-05-04','2025-05-07',3,'task',100,0,1,0,0,'General',NULL,'Layout of Drawing','1',0.00,100.00,0.00,'2025-11-18 23:12:38'),(7,400,'Planning For Mobilization And Execution','2025-07-21','2025-08-28',28,'summary',NULL,0,1,0,0,'General',NULL,'Planning For Mobilization And Execution','1',0.00,100.00,0.00,'2025-11-18 23:12:38'),(8,104,'Submission of PO to Factory','2025-05-14','2025-05-15',1,'task',100,0,1,0,0,'General',NULL,'Submission of PO to Factory','1',0.00,100.00,0.00,'2025-11-18 23:12:38'),(9,101,'Pre-Inspection(Checkin of Shaft)','2025-04-24','2025-05-04',6,'task',100,0,1,0,0,'General',NULL,'Pre-Inspection(Checkin of Shaft)','1',0.00,100.00,0.00,'2025-11-18 23:12:38'),(10,300,'Manufacturing and Importation Process','2025-05-15','2025-07-21',47,'summary',NULL,0,1,0,0,'General',NULL,'Manufacturing and Importation Process','1',0.00,100.00,0.00,'2025-11-18 23:12:38'),(11,401,'Preparation of tools and materials for elevator installation','2025-07-21','2025-08-10',14,'task',400,0,1,0,0,'General',NULL,'Preparation of tools and materials for elevator installation','1',0.00,100.00,0.00,'2025-11-18 23:12:38'),(12,403,'Partial delivery of tools and boardup materials','2025-08-13','2025-08-18',3,'task',400,0,1,0,0,'General',NULL,'Partial delivery of tools and boardup materials','1',0.00,100.00,0.00,'2025-11-18 23:12:38'),(13,404,'Preperation for Installation/Manufacturing','2025-08-18','2025-08-28',8,'task',400,0,1,0,0,'General',NULL,'Preperation for Installation/Manufacturing','1',0.00,100.00,0.00,'2025-11-18 23:12:38'),(14,500,'Mechanical Installation','2025-08-28','2025-10-30',45,'summary',NULL,0,1,0,0,'General',NULL,'Mechanical Installation','1',0.00,100.00,0.00,'2025-11-18 23:12:38'),(15,501,'Unloading of elevator equipments','2025-08-28','2025-08-31',1,'task',500,0,1,0,0,'General','1','Unloading of elevator equipments','1',0.00,100.00,0.00,'2025-11-18 23:12:38'),(16,502,'Scaffolding Installation','2025-08-31','2025-09-02',2,'task',500,0,1,7,0,'General','2','Scaffolding Installation','1',7.00,100.00,0.00,'2025-11-18 23:12:38'),(17,503,'Hauling Works','2025-09-02','2025-09-04',2,'task',500,0,1,7,0,'General','3','Hauling Works','1',7.00,100.00,0.00,'2025-11-18 23:12:38'),(18,504,'Template Setting','2025-09-04','2025-09-08',2,'task',500,0,1,7,0,'General','4','Template Setting','1',7.00,100.00,0.00,'2025-11-18 23:12:38'),(19,402,'Layout of boardup markings','2025-08-10','2025-08-13',3,'task',400,0,1,0,0,'General',NULL,'Layout of boardup markings','1',0.00,100.00,0.00,'2025-11-18 23:12:38'),(20,505,'Marking and Boring of Holes','2025-09-08','2025-09-09',1,'task',500,0,1,0,0,'General','5','Marking and Boring of Holes','1',0.00,100.00,0.00,'2025-11-18 23:12:38'),(21,506,'Rail Bracket Installation','2025-09-09','2025-09-11',2,'task',500,0,1,7,0,'General','6','Rail Bracket Installation','1',7.00,100.00,0.00,'2025-11-18 23:12:38'),(22,507,'Guide Rail Setting','2025-09-11','2025-09-18',5,'summary',500,0,1,0,0,'General',NULL,'Guide Rail Setting','1',0.00,100.00,0.00,'2025-11-18 23:12:38'),(23,508,'Main/Car','2025-09-11','2025-09-15',2,'task',507,0,1,5,0,'Guide Rail Setting','A','Main/Car','1',5.00,100.00,0.00,'2025-11-18 23:12:38'),(24,509,'Counterweight (CWT)','2025-09-15','2025-09-17',2,'task',507,0,1,3,0,'Guide Rail Setting','B','Counterweight (CWT)','1',3.00,100.00,0.00,'2025-11-18 23:12:38'),(25,510,'Gauging','2025-09-17','2025-09-18',1,'task',507,0,1,3,0,'Guide Rail Setting','C','Gauging','1',3.00,100.00,0.00,'2025-11-18 23:12:38'),(26,511,'Landing Door Assembly','2025-09-18','2025-09-28',6,'summary',500,0,1,0,0,'General',NULL,'Landing Door Assembly','1',0.00,100.00,0.00,'2025-11-18 23:12:38'),(27,512,'Sills and Supports','2025-09-18','2025-09-22',2,'task',511,0,1,2,0,'Landing Door Assembly','A','Sills and Supports','1',2.00,100.00,0.00,'2025-11-18 23:12:38'),(28,513,'Jamb and Supports','2025-09-22','2025-09-24',2,'task',511,0,1,2,0,'Landing Door Assembly','B','Jamb and Supports','1',2.00,100.00,0.00,'2025-11-18 23:12:38'),(29,514,'Frame and Doors','2025-09-24','2025-09-28',2,'task',511,0,1,3,0,'Landing Door Assembly','C','Frame and Doors','1',3.00,100.00,0.00,'2025-11-18 23:12:38'),(30,515,'M/R Equipment Setting','2025-09-28','2025-10-06',6,'summary',500,0,1,0,0,'General',NULL,'M/R Equipment Setting','1',0.00,100.00,0.00,'2025-11-18 23:12:38'),(31,516,'Traction Machine','2025-09-28','2025-09-30',2,'task',515,0,1,5,0,'M/R Equipment Setting','A','Traction Machine','1',5.00,100.00,0.00,'2025-11-18 23:12:38'),(32,517,'Support Beams','2025-09-30','2025-10-02',2,'task',515,0,1,5,0,'M/R Equipment Setting','B','Support Beams','1',5.00,100.00,0.00,'2025-11-18 23:12:38'),(33,518,'Governor (M/R)','2025-10-02','2025-10-06',2,'task',515,0,1,2,0,'M/R Equipment Setting','C','Governor (M/R)','1',2.00,100.00,0.00,'2025-11-18 23:12:38'),(34,519,'Installation of Control Panel','2025-10-06','2025-10-08',2,'task',500,0,1,3,0,'M/R Equipment Setting','D','Installation of Control Panel','1',3.00,100.00,0.00,'2025-11-18 23:12:38'),(35,520,'Car Assembly','2025-10-08','2025-10-13',3,'summary',500,0,1,0,0,'General',NULL,'Car Assembly','1',0.00,100.00,0.00,'2025-11-18 23:12:38'),(36,521,'All Accessories','2025-10-08','2025-10-12',2,'task',520,0,1,3,0,'Car Assembly','A','All Accessories','1',3.00,100.00,0.00,'2025-11-18 23:12:38'),(37,522,'Car Piping/Wiring','2025-10-12','2025-10-13',1,'task',520,0,1,3,0,'Car Assembly','B','Car Piping/Wiring','1',3.00,100.00,0.00,'2025-11-18 23:12:38'),(38,523,'Travelling Cable Layout','2025-10-13','2025-10-15',2,'task',500,0,1,2,0,'Car Assembly','C','Travelling Cable Layout','1',2.00,100.00,0.00,'2025-11-18 23:12:38'),(39,524,'Counterweight Assembly','2025-10-15','2025-10-19',2,'task',500,0,1,2,0,'Car Assembly','D','Counterweight Assembly','1',2.00,100.00,0.00,'2025-11-18 23:12:38'),(40,525,'Laying out of Ropes','2025-10-19','2025-10-26',5,'summary',500,0,1,0,0,'General',NULL,'Laying out of Ropes','1',0.00,100.00,0.00,'2025-11-18 23:12:38'),(41,526,'Hoisting','2025-10-19','2025-10-21',2,'task',525,0,1,2,0,'Laying out of ropes','A','Hoisting','1',2.00,100.00,0.00,'2025-11-18 23:12:38'),(42,527,'Governor (Ropes)','2025-10-21','2025-10-23',2,'task',525,0,1,3,0,'Compensating','B','Governor (Ropes)','1',3.00,100.00,0.00,'2025-11-18 23:12:38'),(43,529,'Wiring','2025-10-26','2025-10-28',2,'summary',500,0,1,0,0,'General',NULL,'Wiring','1',0.00,100.00,0.00,'2025-11-18 23:12:38'),(44,530,'Machine Room','2025-10-26','2025-10-27',1,'task',529,0,1,5,0,'Wiring','A','Machine Room','1',5.00,100.00,0.00,'2025-11-18 23:12:38'),(45,531,'Hoistway','2025-10-27','2025-10-28',1,'task',529,0,1,3,0,'Wiring','B','Hoistway','1',3.00,100.00,0.00,'2025-11-18 23:12:38'),(46,532,'Installation of Pit Ladder / Hoistway Lighting','2025-10-28','2025-10-30',2,'task',500,0,1,3,0,'Wiring','C','Installation of Pit Ladder / Hoistway Lighting','1',3.00,100.00,0.00,'2025-11-18 23:12:38'),(47,600,'Testing and Commissioning','2025-10-30','2025-11-20',15,'summary',NULL,0,1,0,0,'General',NULL,'Testing and Commissioning','1',0.00,100.00,0.00,'2025-11-18 23:12:38'),(48,601,'Initial testing','2025-10-30','2025-11-04',3,'task',600,0,1,3,0,'Testing and Commissioning (Passenger Elevator)','A','Initial testing','1',3.00,100.00,0.00,'2025-11-18 23:12:38'),(49,603,'High speed and Mechanical Adjustment','2025-11-06','2025-11-10',2,'task',600,0,1,2,0,'Testing and Commissioning (Passenger Elevator)','C','High speed and Mechanical Adjustment','1',2.00,100.00,0.00,'2025-11-18 23:12:38'),(50,528,'Compensating','2025-10-23','2025-10-26',1,'task',525,0,1,3,0,'Laying out of ropes','C','Compensating','1',3.00,100.00,0.00,'2025-11-18 23:12:38'),(51,604,'Load Test','2025-11-10','2025-11-12',2,'task',600,0,1,1,0,'Testing and Commissioning (Passenger Elevator)','D','Load Test','1',1.00,100.00,0.00,'2025-11-18 23:12:38'),(52,602,'Slow speed','2025-11-04','2025-11-06',2,'task',600,0,1,1,0,'Testing and Commissioning (Passenger Elevator)','B','Slow speed','1',1.00,100.00,0.00,'2025-11-18 23:12:38'),(53,605,'Final Adjust','2025-11-12','2025-11-16',2,'task',600,0,1,1,0,'Testing and Commissioning (Passenger Elevator)','E','Final Adjust','1',1.00,100.00,0.00,'2025-11-18 23:12:38'),(54,606,'Features Test / Correction of Defects','2025-11-16','2025-11-18',2,'task',600,0,1,1,0,'Testing and Commissioning (Passenger Elevator)','F','Features Test / Correction of Defects','1',1.00,100.00,0.00,'2025-11-18 23:12:38'),(55,607,'Final Cleaning / Hand over','2025-11-18','2025-11-20',2,'task',600,1,1,1,1,'Testing and Commissioning (Passenger Elevator)','G','Final Cleaning / Hand over','1',1.00,100.00,0.00,'2025-11-18 23:12:38');
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
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_46_schedule`
--

LOCK TABLES `project_46_schedule` WRITE;
/*!40000 ALTER TABLE `project_46_schedule` DISABLE KEYS */;
INSERT INTO `project_46_schedule` VALUES (1,400,'Planning For Mobilization And Execution','2025-08-15','2025-09-24',28,'summary',NULL,0,1,0,0,'General',NULL,'Planning For Mobilization And Execution','1',0.00,100.00,0.00,'2025-11-24 08:33:49'),(2,100,'Preliminaries','2025-05-21','2025-06-11',15,'summary',NULL,0,1,0,0,'General',NULL,'Preliminaries','1',0.00,100.00,0.00,'2025-11-24 08:33:49'),(3,101,'Pre-Inspection(Checkin of Shaft)','2025-05-21','2025-05-29',6,'task',100,0,1,0,0,'General',NULL,'Pre-Inspection(Checkin of Shaft)','1',0.00,100.00,0.00,'2025-11-24 08:33:49'),(4,301,'Manufacturing and Importation','2025-06-11','2025-08-15',47,'task',300,0,1,0,0,'General',NULL,'Manufacturing and Importation','1',0.00,100.00,0.00,'2025-11-24 08:33:49'),(5,104,'Submission of PO to Factory','2025-06-10','2025-06-11',1,'task',100,0,1,0,0,'General',NULL,'Submission of PO to Factory','1',0.00,100.00,0.00,'2025-11-24 08:33:49'),(6,401,'Preparation of tools and materials for elevator installation','2025-08-15','2025-09-04',14,'task',400,0,1,0,0,'General',NULL,'Preparation of tools and materials for elevator installation','1',0.00,100.00,0.00,'2025-11-24 08:33:49'),(7,200,'Structural/Civil Works','2025-06-11','2025-08-15',47,'summary',NULL,0,1,0,0,'General',NULL,'Structural/Civil Works','1',0.00,100.00,0.00,'2025-11-24 08:33:49'),(8,103,'Submission of Drawing and Finishes for Approval','2025-06-03','2025-06-10',5,'task',100,0,1,0,0,'General',NULL,'Submission of Drawing and Finishes for Approval','1',0.00,100.00,0.00,'2025-11-24 08:33:49'),(9,201,'Shaft Construction','2025-06-11','2025-08-15',47,'task',200,0,1,0,0,'General',NULL,'Shaft Construction','1',0.00,100.00,0.00,'2025-11-24 08:33:49'),(10,402,'Layout of boardup markings','2025-09-04','2025-09-09',3,'task',400,0,1,0,0,'General',NULL,'Layout of boardup markings','1',0.00,100.00,0.00,'2025-11-24 08:33:49'),(11,102,'Layout of Drawing','2025-05-29','2025-06-03',3,'task',100,0,1,0,0,'General',NULL,'Layout of Drawing','1',0.00,100.00,0.00,'2025-11-24 08:33:49'),(12,403,'Partial delivery of tools and boardup materials','2025-09-09','2025-09-12',3,'task',400,0,1,0,0,'General',NULL,'Partial delivery of tools and boardup materials','1',0.00,100.00,0.00,'2025-11-24 08:33:49'),(13,300,'Manufacturing and Importation Process','2025-06-11','2025-08-15',47,'summary',NULL,0,1,0,0,'General',NULL,'Manufacturing and Importation Process','1',0.00,100.00,0.00,'2025-11-24 08:33:49'),(14,404,'Preperation for Installation/Manufacturing','2025-09-12','2025-09-24',8,'task',400,0,1,0,0,'General',NULL,'Preperation for Installation/Manufacturing','1',0.00,100.00,0.00,'2025-11-24 08:33:49'),(15,501,'Unloading of elevator equipments','2025-09-24','2025-09-25',1,'task',500,0,1,0,0,'General','1','Unloading of elevator equipments','1',0.00,100.00,0.00,'2025-11-24 08:33:49'),(16,500,'Mechanical Installation','2025-09-24','2025-11-26',45,'summary',NULL,0,1,0,0,'General',NULL,'Mechanical Installation','1',0.00,100.00,0.00,'2025-11-24 08:33:49'),(17,502,'Scaffolding Installation','2025-09-25','2025-09-29',2,'task',500,0,1,7,0,'General','2','Scaffolding Installation','1',7.00,100.00,0.00,'2025-11-24 08:33:49'),(18,506,'Rail Bracket Installation','2025-10-06','2025-10-08',2,'task',500,0,1,7,0,'General','6','Rail Bracket Installation','1',7.00,100.00,0.00,'2025-11-24 08:33:49'),(19,504,'Template Setting','2025-10-01','2025-10-03',2,'task',500,0,1,7,0,'General','4','Template Setting','1',7.00,100.00,0.00,'2025-11-24 08:33:49'),(20,503,'Hauling Works','2025-09-29','2025-10-01',2,'task',500,0,1,7,0,'General','3','Hauling Works','1',7.00,100.00,0.00,'2025-11-24 08:33:49'),(21,505,'Marking and Boring of Holes','2025-10-03','2025-10-06',1,'task',500,0,1,0,0,'General','5','Marking and Boring of Holes','1',0.00,100.00,0.00,'2025-11-24 08:33:49'),(22,507,'Guide Rail Setting','2025-10-08','2025-10-15',5,'summary',500,0,1,0,0,'General',NULL,'Guide Rail Setting','1',0.00,100.00,0.00,'2025-11-24 08:33:49'),(23,508,'Main/Car','2025-10-08','2025-10-10',2,'task',507,0,1,5,0,'Guide Rail Setting','A','Main/Car','1',5.00,100.00,0.00,'2025-11-24 08:33:49'),(24,509,'Counterweight (CWT)','2025-10-10','2025-10-14',2,'task',507,0,1,3,0,'Guide Rail Setting','B','Counterweight (CWT)','1',3.00,100.00,0.00,'2025-11-24 08:33:49'),(25,510,'Gauging','2025-10-14','2025-10-15',1,'task',507,0,1,3,0,'Guide Rail Setting','C','Gauging','1',3.00,100.00,0.00,'2025-11-24 08:33:49'),(26,511,'Landing Door Assembly','2025-10-15','2025-10-23',6,'summary',500,0,1,0,0,'General',NULL,'Landing Door Assembly','1',0.00,100.00,0.00,'2025-11-24 08:33:49'),(27,512,'Sills and Supports','2025-10-15','2025-10-17',2,'task',511,0,1,2,0,'Landing Door Assembly','A','Sills and Supports','1',2.00,100.00,0.00,'2025-11-24 08:33:49'),(28,513,'Jamb and Supports','2025-10-17','2025-10-21',2,'task',511,0,1,2,0,'Landing Door Assembly','B','Jamb and Supports','1',2.00,100.00,0.00,'2025-11-24 08:33:49'),(29,514,'Frame and Doors','2025-10-21','2025-10-23',2,'task',511,0,1,3,0,'Landing Door Assembly','C','Frame and Doors','1',3.00,100.00,0.00,'2025-11-24 08:33:49'),(30,515,'M/R Equipment Setting','2025-10-23','2025-10-31',6,'summary',500,0,1,0,0,'General',NULL,'M/R Equipment Setting','1',0.00,100.00,0.00,'2025-11-24 08:33:49'),(31,517,'Support Beams','2025-10-27','2025-10-29',2,'task',515,0,1,5,0,'M/R Equipment Setting','B','Support Beams','1',5.00,100.00,0.00,'2025-11-24 08:33:49'),(32,518,'Governor (M/R)','2025-10-29','2025-10-31',2,'task',515,0,1,2,0,'M/R Equipment Setting','C','Governor (M/R)','1',2.00,100.00,0.00,'2025-11-24 08:33:49'),(33,516,'Traction Machine','2025-10-23','2025-10-27',2,'task',515,0,1,5,0,'M/R Equipment Setting','A','Traction Machine','1',5.00,100.00,0.00,'2025-11-24 08:33:49'),(34,519,'Installation of Control Panel','2025-10-31','2025-11-04',2,'task',500,0,1,3,0,'M/R Equipment Setting','D','Installation of Control Panel','1',3.00,100.00,0.00,'2025-11-24 08:33:49'),(35,520,'Car Assembly','2025-11-04','2025-11-07',3,'summary',500,0,1,0,0,'General',NULL,'Car Assembly','1',0.00,100.00,0.00,'2025-11-24 08:33:49'),(36,522,'Car Piping/Wiring','2025-11-06','2025-11-07',1,'task',520,0,1,3,0,'Car Assembly','B','Car Piping/Wiring','1',3.00,100.00,0.00,'2025-11-24 08:33:49'),(37,521,'All Accessories','2025-11-04','2025-11-06',2,'task',520,0,1,3,0,'Car Assembly','A','All Accessories','1',3.00,100.00,0.00,'2025-11-24 08:33:49'),(38,523,'Travelling Cable Layout','2025-11-07','2025-11-11',2,'task',500,0,1,2,0,'Car Assembly','C','Travelling Cable Layout','1',2.00,100.00,0.00,'2025-11-24 08:33:49'),(39,524,'Counterweight Assembly','2025-11-11','2025-11-13',2,'task',500,0,1,2,0,'Car Assembly','D','Counterweight Assembly','1',2.00,100.00,0.00,'2025-11-24 08:33:49'),(40,525,'Laying out of Ropes','2025-11-13','2025-11-20',5,'summary',500,0,1,0,0,'General',NULL,'Laying out of Ropes','1',0.00,100.00,0.00,'2025-11-24 08:33:49'),(41,526,'Hoisting','2025-11-13','2025-11-17',2,'task',525,0,1,2,0,'Laying out of ropes','A','Hoisting','1',2.00,100.00,0.00,'2025-11-24 08:33:49'),(42,527,'Governor (Ropes)','2025-11-17','2025-11-19',2,'task',525,0,1,3,0,'Compensating','B','Governor (Ropes)','1',3.00,100.00,0.00,'2025-11-24 08:33:49'),(43,528,'Compensating','2025-11-19','2025-11-20',1,'task',525,0,1,3,0,'Laying out of ropes','C','Compensating','1',3.00,100.00,0.00,'2025-11-24 08:33:50'),(44,529,'Wiring','2025-11-20','2025-11-24',2,'summary',500,0,1,0,0,'General',NULL,'Wiring','1',0.00,100.00,0.00,'2025-11-24 08:33:50'),(45,530,'Machine Room','2025-11-20','2025-11-21',1,'task',529,0,1,5,0,'Wiring','A','Machine Room','1',5.00,100.00,0.00,'2025-11-24 08:33:50'),(46,531,'Hoistway','2025-11-21','2025-11-24',1,'task',529,0,1,3,0,'Wiring','B','Hoistway','1',3.00,100.00,0.00,'2025-11-24 08:33:50'),(47,532,'Installation of Pit Ladder / Hoistway Lighting','2025-11-24','2025-11-26',2,'task',500,0,1,3,0,'Wiring','C','Installation of Pit Ladder / Hoistway Lighting','1',3.00,100.00,0.00,'2025-11-24 08:33:50'),(48,600,'Testing and Commissioning','2025-11-24','2025-12-15',15,'summary',NULL,0,0,0,0,'General',NULL,'Testing and Commissioning','1',0.00,0.00,0.00,'2025-11-24 08:33:50'),(49,601,'Initial testing','2025-11-24','2025-11-29',3,'task',600,0,0,3,1,'Testing and Commissioning (Passenger Elevator)','A','Initial testing','1',3.00,0.00,0.00,'2025-11-24 08:33:50'),(50,602,'Slow speed','2025-11-29','2025-12-01',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','B','Slow speed','1',1.00,0.00,0.00,'2025-11-24 08:33:50'),(51,603,'High speed and Mechanical Adjustment','2025-12-01','2025-12-03',2,'task',600,0,0,2,0,'Testing and Commissioning (Passenger Elevator)','C','High speed and Mechanical Adjustment','1',2.00,0.00,0.00,'2025-11-24 08:33:50'),(52,604,'Load Test','2025-12-03','2025-12-07',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','D','Load Test','1',1.00,0.00,0.00,'2025-11-24 08:33:50'),(53,605,'Final Adjust','2025-12-07','2025-12-09',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','E','Final Adjust','1',1.00,0.00,0.00,'2025-11-24 08:33:50'),(54,606,'Features Test / Correction of Defects','2025-12-09','2025-12-13',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','F','Features Test / Correction of Defects','1',1.00,0.00,0.00,'2025-11-24 08:33:50'),(55,607,'Final Cleaning / Hand over','2025-12-13','2025-12-15',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','G','Final Cleaning / Hand over','1',1.00,0.00,0.00,'2025-11-24 08:33:50');
/*!40000 ALTER TABLE `project_46_schedule` ENABLE KEYS */;
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
INSERT INTO `project_48_schedule` VALUES (1,101,'Pre-Inspection(Checkin of Shaft)','2025-11-20','2025-11-30',6,'task',100,0,0,0,1,'General',NULL,'Pre-Inspection(Checkin of Shaft)','1',0.00,0.00,0.00,'2025-11-21 11:10:50'),(2,102,'Layout of Drawing','2025-11-30','2025-12-03',3,'task',100,0,0,0,0,'General',NULL,'Layout of Drawing','1',0.00,0.00,0.00,'2025-11-21 11:10:50'),(3,100,'Preliminaries','2025-11-20','2025-12-11',15,'summary',NULL,0,0,0,0,'General',NULL,'Preliminaries','1',0.00,0.00,0.00,'2025-11-21 11:10:50'),(4,103,'Submission of Drawing and Finishes for Approval','2025-12-03','2025-12-10',5,'task',100,0,0,0,0,'General',NULL,'Submission of Drawing and Finishes for Approval','1',0.00,0.00,0.00,'2025-11-21 11:10:50'),(5,104,'Submission of PO to Factory','2025-12-10','2025-12-11',1,'task',100,0,0,0,0,'General',NULL,'Submission of PO to Factory','1',0.00,0.00,0.00,'2025-11-21 11:10:50'),(6,401,'Preparation of tools and materials for elevator installation','2026-02-16','2026-03-08',14,'task',400,0,0,0,0,'General',NULL,'Preparation of tools and materials for elevator installation','1',0.00,0.00,0.00,'2025-11-21 11:10:50'),(7,200,'Structural/Civil Works','2025-12-11','2026-02-16',47,'summary',NULL,0,0,0,0,'General',NULL,'Structural/Civil Works','1',0.00,0.00,0.00,'2025-11-21 11:10:50'),(8,300,'Manufacturing and Importation Process','2025-12-11','2026-02-16',47,'summary',NULL,0,0,0,0,'General',NULL,'Manufacturing and Importation Process','1',0.00,0.00,0.00,'2025-11-21 11:10:50'),(9,201,'Shaft Construction','2025-12-11','2026-02-16',47,'task',200,0,0,0,0,'General',NULL,'Shaft Construction','1',0.00,0.00,0.00,'2025-11-21 11:10:50'),(10,400,'Planning For Mobilization And Execution','2026-02-16','2026-03-26',28,'summary',NULL,0,0,0,0,'General',NULL,'Planning For Mobilization And Execution','1',0.00,0.00,0.00,'2025-11-21 11:10:50'),(11,301,'Manufacturing and Importation','2025-12-11','2026-02-16',47,'task',300,0,0,0,0,'General',NULL,'Manufacturing and Importation','1',0.00,0.00,0.00,'2025-11-21 11:10:50'),(12,402,'Layout of boardup markings','2026-03-08','2026-03-11',3,'task',400,0,0,0,0,'General',NULL,'Layout of boardup markings','1',0.00,0.00,0.00,'2025-11-21 11:10:50'),(13,403,'Partial delivery of tools and boardup materials','2026-03-11','2026-03-16',3,'task',400,0,0,0,0,'General',NULL,'Partial delivery of tools and boardup materials','1',0.00,0.00,0.00,'2025-11-21 11:10:50'),(14,404,'Preperation for Installation/Manufacturing','2026-03-16','2026-03-26',8,'task',400,0,0,0,0,'General',NULL,'Preperation for Installation/Manufacturing','1',0.00,0.00,0.00,'2025-11-21 11:10:50'),(15,500,'Mechanical Installation','2026-03-26','2026-05-28',45,'summary',NULL,0,0,0,0,'General',NULL,'Mechanical Installation','1',0.00,0.00,0.00,'2025-11-21 11:10:50'),(16,501,'Unloading of elevator equipments','2026-03-26','2026-03-29',1,'task',500,0,0,0,0,'General','1','Unloading of elevator equipments','1',0.00,0.00,0.00,'2025-11-21 11:10:50'),(17,502,'Scaffolding Installation','2026-03-29','2026-03-31',2,'task',500,0,0,7,0,'General','2','Scaffolding Installation','1',7.00,0.00,0.00,'2025-11-21 11:10:50'),(18,503,'Hauling Works','2026-03-31','2026-04-02',2,'task',500,0,0,7,0,'General','3','Hauling Works','1',7.00,0.00,0.00,'2025-11-21 11:10:50'),(19,504,'Template Setting','2026-04-02','2026-04-06',2,'task',500,0,0,7,0,'General','4','Template Setting','1',7.00,0.00,0.00,'2025-11-21 11:10:50'),(20,505,'Marking and Boring of Holes','2026-04-06','2026-04-07',1,'task',500,0,0,0,0,'General','5','Marking and Boring of Holes','1',0.00,0.00,0.00,'2025-11-21 11:10:50'),(21,506,'Rail Bracket Installation','2026-04-07','2026-04-09',2,'task',500,0,0,7,0,'General','6','Rail Bracket Installation','1',7.00,0.00,0.00,'2025-11-21 11:10:50'),(22,507,'Guide Rail Setting','2026-04-09','2026-04-16',5,'summary',500,0,0,0,0,'General',NULL,'Guide Rail Setting','1',0.00,0.00,0.00,'2025-11-21 11:10:50'),(23,508,'Main/Car','2026-04-09','2026-04-13',2,'task',507,0,0,5,0,'Guide Rail Setting','A','Main/Car','1',5.00,0.00,0.00,'2025-11-21 11:10:50'),(24,509,'Counterweight (CWT)','2026-04-13','2026-04-15',2,'task',507,0,0,3,0,'Guide Rail Setting','B','Counterweight (CWT)','1',3.00,0.00,0.00,'2025-11-21 11:10:50'),(25,510,'Gauging','2026-04-15','2026-04-16',1,'task',507,0,0,3,0,'Guide Rail Setting','C','Gauging','1',3.00,0.00,0.00,'2025-11-21 11:10:50'),(26,511,'Landing Door Assembly','2026-04-16','2026-04-26',6,'summary',500,0,0,0,0,'General',NULL,'Landing Door Assembly','1',0.00,0.00,0.00,'2025-11-21 11:10:51'),(27,512,'Sills and Supports','2026-04-16','2026-04-20',2,'task',511,0,0,2,0,'Landing Door Assembly','A','Sills and Supports','1',2.00,0.00,0.00,'2025-11-21 11:10:51'),(28,513,'Jamb and Supports','2026-04-20','2026-04-22',2,'task',511,0,0,2,0,'Landing Door Assembly','B','Jamb and Supports','1',2.00,0.00,0.00,'2025-11-21 11:10:51'),(29,514,'Frame and Doors','2026-04-22','2026-04-26',2,'task',511,0,0,3,0,'Landing Door Assembly','C','Frame and Doors','1',3.00,0.00,0.00,'2025-11-21 11:10:51'),(30,515,'M/R Equipment Setting','2026-04-26','2026-05-04',6,'summary',500,0,0,0,0,'General',NULL,'M/R Equipment Setting','1',0.00,0.00,0.00,'2025-11-21 11:10:51'),(31,516,'Traction Machine','2026-04-26','2026-04-28',2,'task',515,0,0,5,0,'M/R Equipment Setting','A','Traction Machine','1',5.00,0.00,0.00,'2025-11-21 11:10:51'),(32,517,'Support Beams','2026-04-28','2026-04-30',2,'task',515,0,0,5,0,'M/R Equipment Setting','B','Support Beams','1',5.00,0.00,0.00,'2025-11-21 11:10:51'),(33,518,'Governor (M/R)','2026-04-30','2026-05-04',2,'task',515,0,0,2,0,'M/R Equipment Setting','C','Governor (M/R)','1',2.00,0.00,0.00,'2025-11-21 11:10:51'),(34,519,'Installation of Control Panel','2026-05-04','2026-05-06',2,'task',500,0,0,3,0,'M/R Equipment Setting','D','Installation of Control Panel','1',3.00,0.00,0.00,'2025-11-21 11:10:51'),(35,520,'Car Assembly','2026-05-06','2026-05-11',3,'summary',500,0,0,0,0,'General',NULL,'Car Assembly','1',0.00,0.00,0.00,'2025-11-21 11:10:51'),(36,521,'All Accessories','2026-05-06','2026-05-10',2,'task',520,0,0,3,0,'Car Assembly','A','All Accessories','1',3.00,0.00,0.00,'2025-11-21 11:10:51'),(37,522,'Car Piping/Wiring','2026-05-10','2026-05-11',1,'task',520,0,0,3,0,'Car Assembly','B','Car Piping/Wiring','1',3.00,0.00,0.00,'2025-11-21 11:10:51'),(38,523,'Travelling Cable Layout','2026-05-11','2026-05-13',2,'task',500,0,0,2,0,'Car Assembly','C','Travelling Cable Layout','1',2.00,0.00,0.00,'2025-11-21 11:10:51'),(39,524,'Counterweight Assembly','2026-05-13','2026-05-17',2,'task',500,0,0,2,0,'Car Assembly','D','Counterweight Assembly','1',2.00,0.00,0.00,'2025-11-21 11:10:51'),(40,525,'Laying out of Ropes','2026-05-17','2026-05-24',5,'summary',500,0,0,0,0,'General',NULL,'Laying out of Ropes','1',0.00,0.00,0.00,'2025-11-21 11:10:51'),(41,526,'Hoisting','2026-05-17','2026-05-19',2,'task',525,0,0,2,0,'Laying out of ropes','A','Hoisting','1',2.00,0.00,0.00,'2025-11-21 11:10:51'),(42,527,'Governor (Ropes)','2026-05-19','2026-05-21',2,'task',525,0,0,3,0,'Compensating','B','Governor (Ropes)','1',3.00,0.00,0.00,'2025-11-21 11:10:51'),(43,528,'Compensating','2026-05-21','2026-05-24',1,'task',525,0,0,3,0,'Laying out of ropes','C','Compensating','1',3.00,0.00,0.00,'2025-11-21 11:10:51'),(44,529,'Wiring','2026-05-24','2026-05-26',2,'summary',500,0,0,0,0,'General',NULL,'Wiring','1',0.00,0.00,0.00,'2025-11-21 11:10:51'),(45,530,'Machine Room','2026-05-24','2026-05-25',1,'task',529,0,0,5,0,'Wiring','A','Machine Room','1',5.00,0.00,0.00,'2025-11-21 11:10:51'),(46,531,'Hoistway','2026-05-25','2026-05-26',1,'task',529,0,0,3,0,'Wiring','B','Hoistway','1',3.00,0.00,0.00,'2025-11-21 11:10:51'),(47,532,'Installation of Pit Ladder / Hoistway Lighting','2026-05-26','2026-05-28',2,'task',500,0,0,3,0,'Wiring','C','Installation of Pit Ladder / Hoistway Lighting','1',3.00,0.00,0.00,'2025-11-21 11:10:51'),(48,600,'Testing and Commissioning','2026-05-28','2026-06-18',15,'summary',NULL,0,0,0,0,'General',NULL,'Testing and Commissioning','1',0.00,0.00,0.00,'2025-11-21 11:10:51'),(49,601,'Initial testing','2026-05-28','2026-06-02',3,'task',600,0,0,3,0,'Testing and Commissioning (Passenger Elevator)','A','Initial testing','1',3.00,0.00,0.00,'2025-11-21 11:10:51'),(50,602,'Slow speed','2026-06-02','2026-06-04',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','B','Slow speed','1',1.00,0.00,0.00,'2025-11-21 11:10:51'),(51,603,'High speed and Mechanical Adjustment','2026-06-04','2026-06-08',2,'task',600,0,0,2,0,'Testing and Commissioning (Passenger Elevator)','C','High speed and Mechanical Adjustment','1',2.00,0.00,0.00,'2025-11-21 11:10:51'),(52,604,'Load Test','2026-06-08','2026-06-10',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','D','Load Test','1',1.00,0.00,0.00,'2025-11-21 11:10:51'),(53,605,'Final Adjust','2026-06-10','2026-06-14',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','E','Final Adjust','1',1.00,0.00,0.00,'2025-11-21 11:10:51'),(54,606,'Features Test / Correction of Defects','2026-06-14','2026-06-16',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','F','Features Test / Correction of Defects','1',1.00,0.00,0.00,'2025-11-21 11:10:51'),(55,607,'Final Cleaning / Hand over','2026-06-16','2026-06-18',2,'task',600,0,0,1,0,'Testing and Commissioning (Passenger Elevator)','G','Final Cleaning / Hand over','1',1.00,0.00,0.00,'2025-11-21 11:10:51');
/*!40000 ALTER TABLE `project_48_schedule` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_contract_photos`
--

LOCK TABLES `project_contract_photos` WRITE;
/*!40000 ALTER TABLE `project_contract_photos` DISABLE KEYS */;
INSERT INTO `project_contract_photos` VALUES (8,328,'/uploads/1762153242109-mqdefault.jpg'),(9,329,'/uploads/1762318961736-2019-03-12-Example-Template-Project-Project-Handover-Checklist-1-page-001.jpg'),(10,330,'/uploads/1762424434864-2019-03-12-Example-Template-Project-Project-Handover-Checklist-1-page-001.jpg'),(11,331,'/uploads/1762432008013-project_contract_photo.jpg'),(14,344,'/uploads/1762848087888-project_contract_photo.jpg'),(15,345,'/uploads/1763214769465-project_contract_photo.jpg'),(18,348,'/uploads/1763504632970-sample contract (specifications).jpeg'),(19,349,'/uploads/1763505689913-sample contract (specifications).jpeg');
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
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_daily_report`
--

LOCK TABLES `project_daily_report` WRITE;
/*!40000 ALTER TABLE `project_daily_report` DISABLE KEYS */;
/*!40000 ALTER TABLE `project_daily_report` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_holidays`
--

LOCK TABLES `project_holidays` WRITE;
/*!40000 ALTER TABLE `project_holidays` DISABLE KEYS */;
INSERT INTO `project_holidays` VALUES (18,44,'2025-12-10'),(19,44,'2025-12-25'),(20,44,'2025-11-26'),(21,44,'2025-12-10');
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
  `project_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `inspection_id` (`inspection_id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `project_inspection_photos_ibfk_1` FOREIGN KEY (`inspection_id`) REFERENCES `qaqc_inspection_history` (`id`),
  CONSTRAINT `project_inspection_photos_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_inspection_photos`
--

LOCK TABLES `project_inspection_photos` WRITE;
/*!40000 ALTER TABLE `project_inspection_photos` DISABLE KEYS */;
INSERT INTO `project_inspection_photos` VALUES (38,44,'/uploads/1763520721747-checklist_Checklist Prior Template Setting.pdf','Checklist Prior Template Setting',NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_manpower`
--

LOCK TABLES `project_manpower` WRITE;
/*!40000 ALTER TABLE `project_manpower` DISABLE KEYS */;
INSERT INTO `project_manpower` VALUES (2,4,NULL,10,44,NULL,NULL),(4,4,NULL,37,46,NULL,NULL),(5,3,NULL,53,48,NULL,NULL),(6,NULL,NULL,NULL,265,NULL,NULL),(35,NULL,NULL,NULL,331,NULL,NULL),(43,NULL,NULL,NULL,344,NULL,NULL),(45,NULL,NULL,NULL,1,NULL,NULL),(48,NULL,NULL,NULL,267,NULL,NULL),(50,NULL,NULL,NULL,266,NULL,NULL),(53,3,86,13,348,NULL,NULL),(54,4,NULL,55,349,NULL,NULL),(59,NULL,NULL,NULL,47,NULL,NULL);
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
  `prep_handover_date` date DEFAULT NULL,
  `template_setting_date` date DEFAULT NULL,
  `client` varchar(255) DEFAULT NULL,
  `product_type` varchar(255) DEFAULT NULL,
  `task_phase` varchar(255) DEFAULT NULL,
  `task_phase_id` int DEFAULT NULL,
  `schedule_created` tinyint DEFAULT (0),
  `contract_type` enum('Monthly','Quarterly') DEFAULT NULL,
  `island_group` enum('Luzon','Visayas','Mindanao') DEFAULT NULL,
  `region` varchar(255) DEFAULT NULL,
  `province` varchar(255) DEFAULT NULL,
  `city/municipality` varchar(255) DEFAULT NULL,
  `current_task` varchar(255) DEFAULT NULL,
  `task_end` date DEFAULT NULL,
  `task_start` date DEFAULT NULL,
  `task_done` tinyint DEFAULT (0),
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
) ENGINE=InnoDB AUTO_INCREMENT=354 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (1,'SkyLift 1003','High-speed passenger lift for a commercial buildings.','Preliminaries',600,NULL,'Gearless Traction','Automatic Sliding',8.00,'Microprocessor','11','B1-F12','40m','3-Phase 415V','Concrete','2.5m x 2.5m','2.1m x 1.5m','1.2m x 2.1m',4500,1500,0,'2025-11-18',NULL,NULL,'2026-02-12',0,'2026-03-24','2026-05-26','2026-06-16','2026-06-14','2026-03-31','Grand Horizon Commercial Towers','Machine Room Passenger Elevator','Preliminaries',100,1,NULL,'Luzon','NCR','Metro Manila','Caloocan','Pre-Inspection(Checkin of Shaft)','2025-11-26','2025-11-18',0,101,0,NULL,0.00,NULL,NULL,NULL,0,0,0,0,NULL,NULL,0,0,0,0,0,0,0,0,0,NULL,NULL,0,0,0,0,0,0,NULL,0,0,NULL,0,'working',0),(44,'Office Tower Elevator A','High-speed passenger elevator for new office building','Installation',700,NULL,'Gearless Traction','Automatic Center Opening',4.00,'Microprocessor','10','1-10','45m','3-phase 415V','Concrete','2.5m x 2.5m','2.1m x 1.5m','1.2m x 2.1m',4500,1500,14,'2025-07-14',NULL,NULL,'2025-10-08',0,'2025-11-17','2026-01-19','2026-02-09','2026-02-05','2025-11-24','MetroRise Developers Inc.','Machine Room Passenger Elevator','Mechanical Installation',500,1,NULL,'Luzon','NCR','Metro Manila','Caloocan','Template Setting','2025-11-26','2025-11-24',1,504,0,NULL,664375.00,'2025-11-24','Template Setting',NULL,45,0,1,1,NULL,NULL,0,0,0,0,1,0,0,0,0,NULL,NULL,0,0,0,0,0,0,NULL,0,0,NULL,0,'working',0),(45,'Residential Lift B','Medium-speed lift for apartment complex','Completed',900,NULL,'Machine Room Less','Automatic Slide',7.00,'V3F','8','1-8','28m','3-phase 380V','Concrete','2.2m x 2.2m','2.0m x 1.5m','1.1m x 2.0m',4200,1300,100,'2025-04-23',NULL,NULL,'2025-07-20',0,'2025-08-27','2025-10-29','2025-11-19','2025-11-17','2025-09-03','Greenfield Residences','Machine Room Passenger Elevator',NULL,NULL,1,NULL,'Luzon','NCR','Metro Manila','Caloocan','Final Cleaning / Hand over','2025-11-20','2025-11-18',1,607,1,NULL,344253.00,NULL,NULL,NULL,0,0,0,0,'2025-11-23',NULL,0,1,1,0,0,0,0,1,1,'2025-11-24','2025-11-24',0,1,0,0,0,0,NULL,0,0,NULL,1,'working',0),(46,'Hospital Service Elevator 1','Heavy-duty service elevator for medical equipment transport','Installation',100,NULL,'Hydraulic','Automatic Side Opening',1.00,'PLC','6','B-5','25m','3-phase 400V','Steel Frame','3m x 3.5m','2.5m x 2.5m','2.0m x 2.5m',4000,1200,90,'2025-05-21','2025-11-24',0,'2025-08-15',0,'2025-09-24','2025-11-24','2025-12-15','2025-12-13','2025-10-01','St. Mary’s Medical Center','Machine Room Car Elevator','Mechanical Installation',500,1,NULL,'Luzon','NCR','Metro Manila','Caloocan','Initial testing','2025-11-29','2025-11-24',0,601,0,NULL,534857.00,NULL,NULL,NULL,0,0,0,0,NULL,NULL,0,0,0,0,0,0,0,0,0,NULL,NULL,0,0,0,0,0,0,'Cannot Proceed to tnc',0,0,NULL,1,'working',0),(47,'Shopping Mall Panoramic','Glass observation elevator for shopping center atrium','Incoming',100,NULL,'Gearless Traction','Automatic Glass',1.00,'MPC','5','G-4','20m','3-phase','Glass & Steel','2500x2500mm','1800x1600mm','1200x2200mm',3500,900,0,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,'2025-11-15','2025-09-01','SunMall Group','Machine Room Panoramic Elevator',NULL,NULL,0,NULL,'Luzon','NCR','Metro Manila','Caloocan',NULL,NULL,NULL,0,NULL,0,NULL,0.00,NULL,NULL,NULL,0,0,0,0,NULL,NULL,0,0,0,0,0,0,0,0,0,NULL,NULL,0,0,0,0,0,0,NULL,0,0,NULL,0,'working',0),(48,'Warehouse Freight Lift','Industrial cargo lift for warehouse operations','Completed',100,NULL,'Geared Traction','Manual Roller',1.00,'Relay','4','1-4','15m','3-phase','Structural Steel','3000x3000mm','2500x2200mm','2000x2500mm',2800,800,0,'2025-11-19',NULL,NULL,'2026-02-15',0,'2026-03-25','2026-05-27','2026-06-17','2026-06-15','2026-04-01','Apex Logistics Corp.',NULL,'Preliminaries',100,1,NULL,'Luzon','NCR','Metro Manila','Caloocan','Pre-Inspection(Checkin of Shaft)','2025-11-30','2025-11-20',0,101,1,NULL,0.00,NULL,NULL,NULL,0,0,0,0,NULL,NULL,0,0,0,0,0,0,0,1,1,'2025-11-21','2025-11-21',0,0,1,0,0,0,NULL,0,0,NULL,0,'working',0),(265,'Omega-XL Passenger Elevator','High-capacity elevator for commercial buildings with advanced safety features','Incoming',2000,NULL,'Traction','Automatic Sliding',180.00,'Microprocessor V3F','15','B2 to L15','45m','380V 3Phase','Concrete','2000x2000mm','1600x1400mm','1100',3500,1200,0,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,'2026-01-28','2025-11-16','Zenith Commercial Properties',NULL,NULL,NULL,0,NULL,'Luzon','NCR','Metro Manila','Caloocan',NULL,'2025-11-20','2025-11-19',0,NULL,0,NULL,0.00,NULL,NULL,NULL,0,0,0,0,NULL,NULL,0,0,0,0,0,0,0,0,0,NULL,NULL,0,0,0,0,0,0,NULL,0,0,NULL,0,'working',0),(266,'Hydro-Lift Freight Elevator','Heavy duty freight elevator for industrial applications','Incoming',5000,NULL,'Hydraulic','Vertical Bi-Parting',60.00,'Relay Logic','8','G to L7','25m','415V 3Phase','Structural Steel','3000x3000mm','2800x2700mm','1400',4200,1500,0,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,'2026-02-24','2025-12-13','Titan Manufacturing Co.','Machine Room Car Elevator',NULL,NULL,0,NULL,'Luzon','NCR','Metro Manila','Caloocan',NULL,'2025-08-11','2025-08-03',0,NULL,0,55,0.00,NULL,NULL,NULL,0,0,0,0,NULL,NULL,0,0,0,0,0,0,0,0,0,NULL,NULL,0,0,0,0,0,0,NULL,0,0,NULL,0,'working',0),(267,'Eco-Mini Residential Elevator','Space-saving elevator for residential buildings with energy-efficient operation','Incoming',400,NULL,'Machine-Room-Less','Swing',90.00,'Solid State','5','G to L4','15m','220V 1Phase','Pre-fabricated','1200x1200mm','900x900mm','800',2300,950,0,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,'2026-06-10','2026-03-29','EcoHomes Development Corp.','Home/Residential Elevator',NULL,NULL,0,NULL,'Luzon','NCR','Metro Manila','Caloocan',NULL,'2025-11-25','2025-11-17',0,NULL,0,NULL,0.00,NULL,NULL,NULL,0,0,0,0,NULL,NULL,0,0,0,0,0,0,0,0,0,NULL,NULL,0,0,0,0,0,0,NULL,0,0,NULL,0,'working',0),(328,'K40 Residential Elevator','desc','Completed',400,NULL,'VVVF','Automatic VVF door operator',1.00,'Simplex','3/3/3','Gf, 2f, 3f','40m','220v / 3 Phase','Concrete','1600m x 1600mm','1000mm x 1200mm','750mm x 2100 mm',3000,1199,0,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,'2026-05-26','2026-03-14','Saint Ireneus','Machine Room Passenger Elevator',NULL,NULL,0,NULL,'Luzon','NCR','Metro Manila','Caloocan',NULL,'2025-11-10','2025-11-02',0,NULL,0,NULL,534857.00,NULL,NULL,NULL,0,0,0,0,NULL,NULL,0,0,0,0,0,0,0,1,1,'2025-11-21','2025-11-21',0,0,0,0,0,0,NULL,0,0,NULL,0,'working',0),(329,' 3300/3300 XL','Large Elevator\n','Incoming',70,NULL,'VVVF','Automatic VVF door operator',1.00,'Simplex','3/3/3','Gf, 2f, 3f','40','220v / 3 Phase','Concrete','1600m x 1600mm','1000mm x 1200mm','750mm x 2100 mm',3000,1200,0,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,'Carmine Corp','Escalator 600K',NULL,NULL,0,NULL,'Luzon','Region II','Batanes','Itbayat',NULL,NULL,NULL,0,NULL,0,NULL,0.00,NULL,NULL,NULL,0,0,0,0,NULL,NULL,0,0,0,0,0,0,0,0,0,NULL,NULL,0,0,0,0,0,0,NULL,0,0,NULL,0,'working',0),(330,'K310 Passenger Elevator','Elevator For Saint Ireneus','Incoming',400,NULL,'VVVF','Automatic VVF door operator',1.00,'Simplex','3/3/3','Gf, 2f, 3f','40m','220v / 3 Phase','Concrete','1600m x 1600mm','1000mm x 1200mm','750mm x 2100 mm',3000,1199,0,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,'Saint Ireneus','Machine Room less Car Elevator',NULL,NULL,0,NULL,'Luzon','Region I','Ilocos Sur','Banayoyo',NULL,NULL,NULL,0,NULL,0,NULL,0.00,NULL,NULL,NULL,0,0,0,0,NULL,NULL,0,0,0,0,0,0,0,0,0,NULL,NULL,0,0,0,0,0,0,NULL,0,0,NULL,0,'working',0),(331,'Apex Lift 310','Lift for Vandelay Client','Incoming',400,NULL,'VVVF','Automatic VVF door operator',1.00,'Simplex','3/3/3','Gf, 2f, 3f','40m','220v / 3 Phase','Concrete','1600m x 1600mm','1000mm x 1200mm','750mm x 2100 mm',3000,1199,0,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,'2025-12-09','2025-09-22','Vandelay Industries','Machine Room Passenger Elevator',NULL,NULL,0,NULL,'Luzon','CAR','Apayao','Flora',NULL,'2025-09-30','2025-09-26',0,NULL,0,15,0.00,NULL,NULL,NULL,0,0,0,0,NULL,NULL,0,0,0,0,0,0,0,0,0,NULL,NULL,0,0,0,0,0,0,NULL,0,0,NULL,0,'working',0),(339,'Lift-A-001','Passenger elevator for commercial building','Incoming',8,NULL,'Traction','Center Opening',1.00,'Collective','10','Ground to 10th Floor','30m','380V 3Phase','Concrete','1600x1400mm','1100x1400mm','800mm',3500,1200,0,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,'2026-01-28','2025-11-16','ABC Corporation','Passenger Elevator',NULL,NULL,0,'Monthly','Luzon','NCR','Metro Manila','Makati',NULL,'2025-07-15','2025-07-07',0,NULL,0,NULL,0.00,NULL,NULL,NULL,0,0,0,0,NULL,NULL,0,0,0,0,0,0,0,0,0,NULL,NULL,0,0,0,0,0,0,NULL,0,0,NULL,0,'working',0),(340,'Lift-B-002','Service elevator for hospital use','Incoming',13,NULL,'Hydraulic','Two Speed',0.63,'Automatic','6','Basement to 5th Floor','18m','220V Single Phase','Masonry','2000x2000mm','1400x1500mm','900mm',3200,1500,0,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,'General Hospital','Service Elevator',NULL,NULL,0,'Quarterly','Visayas','Region VII','Cebu','Cebu',NULL,NULL,NULL,0,NULL,0,NULL,0.00,NULL,NULL,NULL,0,0,0,0,NULL,NULL,0,0,0,0,0,0,0,0,0,NULL,NULL,0,0,0,0,0,0,NULL,0,0,NULL,0,'working',0),(341,'Lift-C-003','Residential elevator for condominium','Incoming',6,NULL,'Machine Room Less','Side Opening',1.60,'VVVF','15','Lobby to Penthouse','45m','380V 3Phase','Concrete','1500x1500mm','1100x1350mm','800mm',4200,1100,0,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,'Skyline Towers','Residential Elevator',NULL,NULL,0,'Monthly','Luzon','CALABARZON','Cavite','Dasmarinas',NULL,NULL,NULL,0,NULL,0,NULL,0.00,NULL,NULL,NULL,0,0,0,0,NULL,NULL,0,0,0,0,0,0,0,0,0,NULL,NULL,0,0,0,0,0,0,NULL,0,0,NULL,0,'working',0),(342,'Lift-D-004','Freight elevator for warehouse','Incoming',20,NULL,'Traction','Vertical Bi-parting',0.50,'Manual','4','Ground to 3rd Floor','12m','380V 3Phase','Steel','2500x2500mm','1800x2400mm','1200mm',3800,1800,0,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,'Logistics Inc','Freight Elevator',NULL,NULL,0,'Quarterly','Mindanao','Region XI','Davao del Sur','Davao',NULL,NULL,NULL,0,NULL,0,NULL,0.00,NULL,NULL,NULL,0,0,0,0,NULL,NULL,0,0,0,0,0,0,0,0,0,NULL,NULL,0,0,0,0,0,0,NULL,0,0,NULL,0,'working',0),(343,'Lift-E-005','Panoramic elevator for shopping mall','Incoming',10,NULL,'Traction','Glass Doors',1.25,'Group Control','8','Ground to 7th Floor','24m','380V 3Phase','Glass/Steel','1800x1800mm','1300x1400mm','1000mm',3600,1300,0,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,'Mall Group','Machine Room Car Elevator',NULL,NULL,0,'Monthly','Luzon','NCR','Metro Manila','Quezon',NULL,NULL,NULL,0,NULL,0,NULL,0.00,NULL,NULL,NULL,0,0,0,0,NULL,NULL,0,0,0,0,0,0,0,0,0,NULL,NULL,0,0,0,0,0,0,NULL,0,0,NULL,0,'working',0),(344,'SkyRise v7','Some description','Completed',600,NULL,'VVVF','Automatic VVF door operator',1.00,'Simplex','3/3/3','Gf, 2f, 3f','40m','220v / 3 Phase','Concrete','1600m x 1600mm','1000mm x 1200mm','750mm x 2100 mm',3000,1200,0,'2025-09-06',NULL,NULL,'2025-12-01',0,'2026-01-10','2026-03-14','2026-04-04','2026-03-31','2026-01-17','Silverstone Properties','Machine Room less Passenger Elevator','Structural/Civil Works',200,1,NULL,'Luzon','CAR','Apayao','Kabugao','Pre-Inspection(Checkin of Shaft)','2025-09-15','2025-09-07',0,101,0,NULL,234857.00,NULL,NULL,NULL,0,0,0,0,NULL,NULL,0,0,0,0,0,0,0,1,1,'2025-11-21','2025-11-21',0,0,1,0,0,0,NULL,0,0,NULL,1,'working',0),(345,'VertifFlow 400','Lift for Redwood Trading Co.','Planning',800,NULL,'VVVF','Automatic VVF door operator',1.00,'Simplex','3/3/3','Gf, 2f, 3f','40m','220v / 3 Phase','Concrete','1600m x 1600mm','1000mm x 1200mm','750mm x 2100 mm',3000,1000,0,'2025-09-14',NULL,NULL,'2025-11-15',0,'2025-12-13','2026-01-27','2026-02-11','2026-02-09','2025-12-18','Redwood Trading Co.','Machine Room less Car Elevator','Planning For Mobilization And Execution',400,1,NULL,'Luzon','Region IV-A','Quezon','Mulanay','Pre-Inspection(Checkin of Shaft)','2025-09-20','2025-09-14',0,101,0,NULL,0.00,NULL,NULL,NULL,0,0,0,0,NULL,NULL,0,0,0,0,0,0,0,0,0,NULL,NULL,0,0,0,0,0,0,NULL,0,0,NULL,1,'calendar',0),(348,'SkyLift A2','Lift for Silvergate','Test and Comm',400,'2025-11-19','VVVF','Automatic VVF door operator',1.00,'Simplex','3/3/3','Gf, 2f, 3f','40m','220v / 3 Phase','Concrete','1600m x 1600mm','1000mm x 1200mm','750mm x 2100 mm',3000,1500,99,'2025-04-30',NULL,NULL,'2025-07-25',0,'2025-09-03','2025-11-05','2025-11-26','2025-11-24','2025-09-10','Silvergate Properties','Machine Room Car Elevator','Testing and Commissioning',600,1,NULL,'Visayas','Region VIII','Northern Samar','Palapag','Final Cleaning / Hand over','2025-11-26','2025-11-24',0,607,0,NULL,0.00,NULL,NULL,0,NULL,0,0,0,'2025-11-24',NULL,1,1,0,0,0,0,1,0,0,NULL,NULL,0,0,0,0,0,0,NULL,0,0,NULL,0,'working',0),(349,'AeroRise 900','Elevator for Carmine Corp','Installation',400,'2025-11-19','VVVF','Automatic VVF door operator',1.00,'Simplex','3/3/3','Gf, 2f, 3f','40','220v / 3 Phase','Concrete','1600m x 1600mm','1000mm x 1200mm','750mm x 2100 mm',3000,1500,61,'2025-06-09',NULL,NULL,'2025-09-03',0,'2025-10-13','2025-12-15','2026-01-05','2026-01-01','2025-10-20','Carmine Corp','Macine Room Panoramic Elevator','Mechanical Installation',500,1,NULL,'Luzon','Region IV-B','Occidental Mindoro','Looc','All Accessories','2025-11-25','2025-11-21',0,521,0,NULL,324523.00,NULL,NULL,0,NULL,0,0,0,NULL,NULL,0,0,0,0,0,0,0,0,0,NULL,NULL,0,0,0,0,0,0,'sdga',0,0,NULL,0,'working',0);
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
  `inspection_reason` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'QAQC Inspection',
  `inspection_date` date DEFAULT (curdate()),
  `inspection_complete` tinyint DEFAULT (0),
  `qaqc_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `qaqc_id` (`qaqc_id`),
  KEY `qaqc_inspection_history_ibfk_1` (`project_id`),
  CONSTRAINT `qaqc_inspection_history_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `qaqc_inspection_history_ibfk_2` FOREIGN KEY (`qaqc_id`) REFERENCES `employees` (`employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `qaqc_inspection_history`
--

LOCK TABLES `qaqc_inspection_history` WRITE;
/*!40000 ALTER TABLE `qaqc_inspection_history` DISABLE KEYS */;
INSERT INTO `qaqc_inspection_history` VALUES (44,44,'QAQC','Template Setting','2025-11-19',1,91);
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
  `project_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `inspection_id` (`inspection_id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `qaqc_punchlisting_ibfk_1` FOREIGN KEY (`inspection_id`) REFERENCES `qaqc_inspection_history` (`id`),
  CONSTRAINT `qaqc_punchlisting_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `qaqc_punchlisting`
--

LOCK TABLES `qaqc_punchlisting` WRITE;
/*!40000 ALTER TABLE `qaqc_punchlisting` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=138 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_photos`
--

LOCK TABLES `task_photos` WRITE;
/*!40000 ALTER TABLE `task_photos` DISABLE KEYS */;
INSERT INTO `task_photos` VALUES (134,44,'Template Setting',504,'2025-11-18','2025-11-20','/uploads/1763520738692-lift-shaft-old-multistorey-building-1024x683.jpg',2,7),(135,45,'Final Cleaning / Hand over',607,'2025-11-18','2025-11-20','/uploads/1763916778029-completion_evidence_Sample babybook.jpg',2,1),(136,45,'Final Cleaning / Hand over',607,'2025-11-18','2025-11-20','/uploads/1763916923877-photo_Checklist Prior Hand-Over.jpg',2,1),(137,44,'Template Setting',504,'2025-11-23','2025-11-25','/uploads/1763935087845-qaqc inpsection checklist.PNG',2,7);
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
) ENGINE=InnoDB AUTO_INCREMENT=297 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team_members`
--

LOCK TABLES `team_members` WRITE;
/*!40000 ALTER TABLE `team_members` DISABLE KEYS */;
INSERT INTO `team_members` VALUES (287,55,16,0,349),(288,55,39,0,349),(289,53,17,0,44),(290,53,21,0,44),(291,10,17,0,44),(292,10,21,0,44),(293,18,15,0,348),(294,18,68,0,348),(295,13,68,0,348),(296,13,15,0,348);
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tnc_inspection_documents`
--

LOCK TABLES `tnc_inspection_documents` WRITE;
/*!40000 ALTER TABLE `tnc_inspection_documents` DISABLE KEYS */;
INSERT INTO `tnc_inspection_documents` VALUES (8,45,'TNC Checklist','/uploads/1763916923889-document_QA QC Checklist - with drawing.pdf','2025-11-24');
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

-- Dump completed on 2025-11-24 20:05:09
