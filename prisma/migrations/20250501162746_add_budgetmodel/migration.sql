/*
  Warnings:

  - You are about to drop the column `budgetRangeId` on the `LocalBusiness` table. All the data in the column will be lost.
  - You are about to drop the column `budgetRangeId` on the `LocalUserBusinessplan` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "LocalBusiness" DROP CONSTRAINT "LocalBusiness_budgetRangeId_fkey";

-- DropForeignKey
ALTER TABLE "LocalUserBusinessplan" DROP CONSTRAINT "LocalUserBusinessplan_budgetRangeId_fkey";

-- AlterTable
ALTER TABLE "LocalBusiness" DROP COLUMN "budgetRangeId";

-- AlterTable
ALTER TABLE "LocalUserBusinessplan" DROP COLUMN "budgetRangeId",
ADD COLUMN     "BudgetRange" INTEGER;
