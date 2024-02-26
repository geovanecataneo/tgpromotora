/*
 Navicat Premium Data Transfer

 Source Server         : bigdata
 Source Server Type    : MySQL
 Source Server Version : 100148
 Source Host           : 167.86.81.193:3306
 Source Schema         : theyllor_zaplus

 Target Server Type    : MySQL
 Target Server Version : 100148
 File Encoding         : 65001

 Date: 20/11/2023 14:28:22
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for contacts
-- ----------------------------
DROP TABLE IF EXISTS `contacts`;
CREATE TABLE `contacts`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `cpf` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `contact` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `cpf`(`cpf` ASC) USING BTREE,
  INDEX `contact`(`contact` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 171599 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Compact;

SET FOREIGN_KEY_CHECKS = 1;
