/*
  Warnings:

  - You are about to drop the column `riskFactor` on the `Milestone` table. All the data in the column will be lost.
  - You are about to drop the column `aiPriorityAdjustment` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `aiSuggestions` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `aiTaskOptimization` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `bestAction` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `feedback` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `freePackageLimit` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `overTimeRisk` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `timeAllocation` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `timeDeviation` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the `GoalMilestone` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectPlan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectPlanLite` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `phone` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "GoalMilestone" DROP CONSTRAINT "GoalMilestone_goalId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectPlan" DROP CONSTRAINT "ProjectPlan_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectPlanLite" DROP CONSTRAINT "ProjectPlanLite_projectId_fkey";

-- AlterTable
ALTER TABLE "Milestone" DROP COLUMN "riskFactor",
ADD COLUMN     "actualTime" INTEGER,
ADD COLUMN     "position" INTEGER,
ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "status" DROP DEFAULT;

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "aiInsights" JSONB;

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "aiPriorityAdjustment",
DROP COLUMN "aiSuggestions",
DROP COLUMN "aiTaskOptimization",
DROP COLUMN "bestAction",
DROP COLUMN "feedback",
DROP COLUMN "freePackageLimit",
DROP COLUMN "overTimeRisk",
DROP COLUMN "timeAllocation",
DROP COLUMN "timeDeviation",
DROP COLUMN "type",
ADD COLUMN     "position" INTEGER;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "phone" TEXT NOT NULL;

-- DropTable
DROP TABLE "GoalMilestone";

-- DropTable
DROP TABLE "ProjectPlan";

-- DropTable
DROP TABLE "ProjectPlanLite";
