/*
  Warnings:

  - You are about to drop the column `milestones` on the `ProjectPlan` table. All the data in the column will be lost.
  - You are about to drop the column `roadmap` on the `ProjectPlan` table. All the data in the column will be lost.
  - You are about to drop the column `roadmap` on the `ProjectPlanLite` table. All the data in the column will be lost.
  - You are about to drop the column `tasks` on the `ProjectPlanLite` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `tasks` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_projectId_fkey";

-- AlterTable
ALTER TABLE "ProjectPlan" DROP COLUMN "milestones",
DROP COLUMN "roadmap";

-- AlterTable
ALTER TABLE "ProjectPlanLite" DROP COLUMN "roadmap",
DROP COLUMN "tasks";

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "projectId";
