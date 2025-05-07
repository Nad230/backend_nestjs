/*
  Warnings:

  - Changed the type of `creatorType` on the `CreatorGoal` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "CreatorGoal" DROP COLUMN "creatorType",
ADD COLUMN     "creatorType" TEXT NOT NULL;
