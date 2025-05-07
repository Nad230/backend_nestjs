/*
  Warnings:

  - Added the required column `platform` to the `initial_stats` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "SocialStats_profileId_key";

-- AlterTable
ALTER TABLE "initial_stats" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "platform" TEXT NOT NULL;
