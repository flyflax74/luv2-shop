-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: localhost    Database: full-stack-ecommerce
-- ------------------------------------------------------
-- Server version	8.0.32

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `order_tracking_number` varchar(255) DEFAULT NULL,
  `total_price` decimal(19,2) DEFAULT NULL,
  `total_quantity` int DEFAULT NULL,
  `billing_address_id` bigint DEFAULT NULL,
  `customer_id` bigint DEFAULT NULL,
  `shipping_address_id` bigint DEFAULT NULL,
  `status` varchar(128) DEFAULT NULL,
  `date_created` datetime(6) DEFAULT NULL,
  `last_updated` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_billing_address_id` (`billing_address_id`),
  UNIQUE KEY `UK_shipping_address_id` (`shipping_address_id`),
  KEY `K_customer_id` (`customer_id`),
  CONSTRAINT `FK_billing_address_id` FOREIGN KEY (`billing_address_id`) REFERENCES `address` (`id`),
  CONSTRAINT `FK_customer_id` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`id`),
  CONSTRAINT `FK_shipping_address_id` FOREIGN KEY (`shipping_address_id`) REFERENCES `address` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'1030b55d-373b-48ce-b850-61f5d0a91acb',90.95,5,NULL,1,1,NULL,'2023-05-05 08:21:32.461000','2023-05-05 08:21:32.461000'),(2,'91bed053-43f5-4c1f-ae0e-3dc1c25c9c8a',27.98,2,NULL,2,2,NULL,'2023-05-08 12:49:39.810000','2023-05-08 12:49:39.810000'),(3,'77dc48a4-37f1-4385-b67b-a1f1c1d9c294',112.93,7,NULL,2,3,NULL,'2023-05-08 13:34:48.418000','2023-05-08 13:34:48.418000'),(4,'0a7f658f-37e5-4f39-989e-3607c29f9015',112.93,7,NULL,2,4,NULL,'2023-05-09 07:09:54.758000','2023-05-09 07:09:54.759000'),(5,'88c440ad-261b-4b9f-bfce-623753fe46f6',59.96,4,NULL,2,5,NULL,'2023-05-09 10:08:55.566000','2023-05-09 10:08:55.566000'),(6,'6bdcd5b2-5fd0-4995-b41c-75c0e9ac5fd5',70.96,4,NULL,2,6,NULL,'2023-05-09 10:39:53.654000','2023-05-09 10:39:53.654000'),(7,'3f15440a-76e5-4e3f-8f2f-68000713e7cc',107.94,6,NULL,3,7,NULL,'2023-05-09 11:03:08.335000','2023-05-09 11:03:08.335000'),(8,'8252748b-5f1f-4626-8bd8-ca24362e14e1',136.92,8,NULL,2,8,NULL,'2023-05-09 11:11:17.034000','2023-05-09 11:11:17.034000'),(9,'76b1e2bf-d9fb-45b8-8ab2-f59e194c64f0',49.97,3,NULL,2,9,NULL,'2023-05-10 05:23:01.036000','2023-05-10 05:23:01.036000');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-07-13 14:48:25
