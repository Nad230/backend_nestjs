/*
  Warnings:

  - Made the column `caption` on table `ScheduledPost` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ScheduledPost" ALTER COLUMN "caption" SET NOT NULL;
