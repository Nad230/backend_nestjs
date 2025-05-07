/*
  Warnings:

  - Made the column `mediaUrl` on table `ScheduledPost` required. This step will fail if there are existing NULL values in that column.
  - Made the column `mediaType` on table `ScheduledPost` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ScheduledPost" ALTER COLUMN "mediaUrl" SET NOT NULL,
ALTER COLUMN "mediaType" SET NOT NULL;
