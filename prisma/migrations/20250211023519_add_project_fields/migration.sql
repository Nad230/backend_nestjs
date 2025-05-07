/*
  Warnings:

  - Added the required column `privacy` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "budgetRange" TEXT,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "impact" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "media" JSONB,
ADD COLUMN     "privacy" TEXT NOT NULL,
ADD COLUMN     "revenueModel" TEXT,
ADD COLUMN     "teamMembers" JSONB,
ADD COLUMN     "timeline" TEXT,
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "vision" TEXT;
