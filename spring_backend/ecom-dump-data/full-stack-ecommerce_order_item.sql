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
-- Table structure for table `order_item`
--

DROP TABLE IF EXISTS `order_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_item` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `image_url` varchar(255) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `unit_price` decimal(19,2) DEFAULT NULL,
  `order_id` bigint DEFAULT NULL,
  `product_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `K_order_id` (`order_id`),
  KEY `FK_product_id` (`product_id`),
  CONSTRAINT `FK_order_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `FK_product_id` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_item`
--

LOCK TABLES `order_item` WRITE;
/*!40000 ALTER TABLE `order_item` DISABLE KEYS */;
INSERT INTO `order_item` VALUES (1,'assets/images/products/luggagetags/luggagetag-luv2code-1002.png',1,16.99,1,78),(2,'assets/images/products/coffeemugs/coffeemug-luv2code-1001.png',2,18.99,1,27),(3,'assets/images/products/luggagetags/luggagetag-luv2code-1003.png',1,16.99,1,79),(4,'assets/images/products/coffeemugs/coffeemug-luv2code-1000.png',1,18.99,1,26),(5,'assets/images/products/books/book-luv2code-1003.png',2,13.99,2,4),(6,'assets/images/products/books/book-luv2code-1003.png',2,13.99,3,4),(7,'assets/images/products/luggagetags/luggagetag-luv2code-1001.png',3,16.99,3,77),(8,'assets/images/products/luggagetags/luggagetag-luv2code-1003.png',2,16.99,3,79),(9,'assets/images/products/luggagetags/luggagetag-luv2code-1003.png',2,16.99,4,79),(10,'assets/images/products/books/book-luv2code-1003.png',2,13.99,4,4),(11,'assets/images/products/luggagetags/luggagetag-luv2code-1001.png',3,16.99,4,77),(12,'assets/images/products/books/book-luv2code-1000.png',1,14.99,5,1),(13,'assets/images/products/luggagetags/luggagetag-luv2code-1001.png',1,16.99,5,77),(14,'assets/images/products/books/book-luv2code-1003.png',2,13.99,5,4),(15,'assets/images/products/coffeemugs/coffeemug-luv2code-1003.png',1,18.99,6,29),(16,'assets/images/products/books/book-luv2code-1002.png',1,14.99,6,3),(17,'assets/images/products/mousepads/mousepad-luv2code-1000.png',1,17.99,6,51),(18,'assets/images/products/coffeemugs/coffeemug-luv2code-1001.png',1,18.99,6,27),(19,'assets/images/products/coffeemugs/coffeemug-luv2code-1002.png',1,18.99,7,28),(20,'assets/images/products/luggagetags/luggagetag-luv2code-1001.png',1,16.99,7,77),(21,'assets/images/products/books/book-luv2code-1004.png',1,18.99,7,5),(22,'assets/images/products/coffeemugs/coffeemug-luv2code-1001.png',1,18.99,7,27),(23,'assets/images/products/luggagetags/luggagetag-luv2code-1003.png',2,16.99,7,79),(24,'assets/images/products/luggagetags/luggagetag-luv2code-1000.png',1,16.99,8,76),(25,'assets/images/products/books/book-luv2code-1004.png',1,18.99,8,5),(26,'assets/images/products/books/book-luv2code-1002.png',2,14.99,8,3),(27,'assets/images/products/books/book-luv2code-1001.png',2,20.99,8,2),(28,'assets/images/products/books/book-luv2code-1000.png',1,14.99,8,1),(29,'assets/images/products/books/book-luv2code-1003.png',1,13.99,8,4),(30,'assets/images/products/books/book-luv2code-1002.png',1,14.99,9,3),(31,'assets/images/products/books/book-luv2code-1001.png',1,20.99,9,2),(32,'assets/images/products/books/book-luv2code-1003.png',1,13.99,9,4);
/*!40000 ALTER TABLE `order_item` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-07-13 14:48:24
