/*
  Warnings:

  - The `repeat` column on the `Expense` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "repeatType" TEXT,
DROP COLUMN "repeat",
ADD COLUMN     "repeat" BOOLEAN DEFAULT false;
