/*
  Warnings:

  - The `maxPoints` column on the `AcadTask` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "AcadTask" DROP COLUMN "maxPoints",
ADD COLUMN     "maxPoints" INTEGER;
