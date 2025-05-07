/*
  Warnings:

  - You are about to drop the column `categoryId` on the `achievements` table. All the data in the column will be lost.
  - You are about to drop the `AchievementCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "achievements" DROP CONSTRAINT "achievements_categoryId_fkey";

-- AlterTable
ALTER TABLE "achievements" DROP COLUMN "categoryId";

-- DropTable
DROP TABLE "AchievementCategory";
