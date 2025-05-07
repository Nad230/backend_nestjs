/*
  Warnings:

  - You are about to drop the column `content` on the `ScheduledPost` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ScheduledPost" DROP COLUMN "content",
ADD COLUMN     "caption" TEXT,
ADD COLUMN     "hashtags" TEXT[],
ADD COLUMN     "mediaType" TEXT;
