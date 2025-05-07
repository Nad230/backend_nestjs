/*
  Warnings:

  - Added the required column `title` to the `GoalMilestone` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GoalMilestone" ADD COLUMN     "title" TEXT NOT NULL;
