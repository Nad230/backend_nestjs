/*
  Warnings:

  - You are about to drop the column `aiInsights` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `aiUnlocked` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `budgetRange` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `collaborations` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `fundingSource` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `planType` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `projectMilestones` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `revenueModel` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `strategyModel` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fullname]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "users_phone_key";

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "aiInsights",
DROP COLUMN "aiUnlocked",
DROP COLUMN "budgetRange",
DROP COLUMN "collaborations",
DROP COLUMN "endTime",
DROP COLUMN "fundingSource",
DROP COLUMN "location",
DROP COLUMN "planType",
DROP COLUMN "projectMilestones",
DROP COLUMN "revenueModel",
DROP COLUMN "startTime",
DROP COLUMN "strategyModel";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "phone";

-- CreateIndex
CREATE UNIQUE INDEX "users_fullname_key" ON "users"("fullname");
