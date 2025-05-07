/*
  Warnings:

  - The `authors` column on the `Citation` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Citation" DROP COLUMN "authors",
ADD COLUMN     "authors" TEXT[],
ALTER COLUMN "year" SET DATA TYPE TEXT;
