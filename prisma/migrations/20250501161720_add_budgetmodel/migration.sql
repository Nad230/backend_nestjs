/*
  Warnings:

  - You are about to drop the column `BudgetRange` on the `LocalBusiness` table. All the data in the column will be lost.
  - You are about to drop the column `BudgetRange` on the `LocalUserBusinessplan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LocalBusiness" DROP COLUMN "BudgetRange",
ADD COLUMN     "budgetRangeId" TEXT;

-- AlterTable
ALTER TABLE "LocalUserBusinessplan" DROP COLUMN "BudgetRange",
ADD COLUMN     "budgetRangeId" TEXT;

-- CreateTable
CREATE TABLE "BudgetRangeUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "BudgetRange" INTEGER,

    CONSTRAINT "BudgetRangeUser_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LocalBusiness" ADD CONSTRAINT "LocalBusiness_budgetRangeId_fkey" FOREIGN KEY ("budgetRangeId") REFERENCES "BudgetRangeUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetRangeUser" ADD CONSTRAINT "BudgetRangeUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocalUserBusinessplan" ADD CONSTRAINT "LocalUserBusinessplan_budgetRangeId_fkey" FOREIGN KEY ("budgetRangeId") REFERENCES "BudgetRangeUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
