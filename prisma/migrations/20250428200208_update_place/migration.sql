/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Place` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Place` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Place` table. All the data in the column will be lost.
  - You are about to drop the `CategoryPlace` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlaceDetail` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Place" DROP CONSTRAINT "Place_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "PlaceDetail" DROP CONSTRAINT "PlaceDetail_placeId_fkey";

-- AlterTable
ALTER TABLE "Place" DROP COLUMN "categoryId",
DROP COLUMN "city",
DROP COLUMN "country",
ADD COLUMN     "source" TEXT,
ADD COLUMN     "type" TEXT,
ALTER COLUMN "address" DROP NOT NULL;

-- DropTable
DROP TABLE "CategoryPlace";

-- DropTable
DROP TABLE "PlaceDetail";
