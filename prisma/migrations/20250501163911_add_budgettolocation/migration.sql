/*
  Warnings:

  - You are about to drop the `BudgetRangeUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BudgetRangeUser" DROP CONSTRAINT "BudgetRangeUser_userId_fkey";

-- AlterTable
ALTER TABLE "UserLocation" ADD COLUMN     "BudgetRange" INTEGER;

-- DropTable
DROP TABLE "BudgetRangeUser";
