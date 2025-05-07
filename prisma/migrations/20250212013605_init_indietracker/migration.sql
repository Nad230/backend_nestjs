/*
  Warnings:

  - You are about to drop the `_TeamMembers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `teams` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('FEATURE', 'BUG', 'MILESTONE', 'TASK');

-- CreateEnum
CREATE TYPE "NFTStatus" AS ENUM ('ACTIVE', 'SOLD', 'BURNED', 'TRANSFERRED');

-- CreateEnum
CREATE TYPE "CommunityRole" AS ENUM ('MEMBER', 'MODERATOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "PostVisibility" AS ENUM ('PUBLIC', 'PRIVATE', 'MEMBERS_ONLY');

-- CreateEnum
CREATE TYPE "TimeEntryStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'PAUSED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "_TeamMembers" DROP CONSTRAINT "_TeamMembers_A_fkey";

-- DropForeignKey
ALTER TABLE "_TeamMembers" DROP CONSTRAINT "_TeamMembers_B_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_teamId_fkey";

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "aiUnlocked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "planType" TEXT NOT NULL DEFAULT 'lite';

-- DropTable
DROP TABLE "_TeamMembers";

-- DropTable
DROP TABLE "teams";

-- CreateTable
CREATE TABLE "team_members" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "tasksCompleted" INTEGER NOT NULL DEFAULT 0,
    "hoursLogged" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "efficiencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,

    CONSTRAINT "team_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nfts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "tokenId" TEXT NOT NULL,
    "mintedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "NFTStatus" NOT NULL DEFAULT 'ACTIVE',
    "type" TEXT NOT NULL,

    CONSTRAINT "nfts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectPlan" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "roadmap" JSONB,
    "milestones" JSONB,
    "priorityLevels" JSONB,
    "strategyModel" TEXT,
    "riskMitigationPlan" JSONB,
    "burnoutMonitor" BOOLEAN,
    "resourceAllocator" JSONB,
    "chronoSync" JSONB,
    "energyFlow" JSONB,
    "overloadGuard" BOOLEAN,
    "cognitiveLoadBalance" DOUBLE PRECISION,
    "motivationBoosters" JSONB,
    "AIReflectionPrompts" JSONB,
    "moodTracking" TEXT,
    "gamification" JSONB,
    "personalizedChallenges" JSONB,
    "socialLeaderboard" JSONB,
    "sprintPlanner" JSONB,
    "deepWorkBlocks" JSONB,
    "deadlineRisk" DOUBLE PRECISION,
    "adaptiveWorkMode" BOOLEAN,
    "focusScore" DOUBLE PRECISION,
    "projectedCompletion" TIMESTAMP(3),
    "timeInvestment" JSONB,
    "indieCoinEarnings" DOUBLE PRECISION,
    "progress" DOUBLE PRECISION,
    "lastUpdatedTask" TEXT,
    "dynamicScheduleAdjustment" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectPlanLite" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "roadmap" JSONB,
    "tasks" JSONB,
    "workDays" JSONB,
    "priority" TEXT,
    "motivation" TEXT,
    "socialLeaderboard" JSONB,
    "progress" DOUBLE PRECISION,
    "lastUpdatedTask" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectPlanLite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "team_members_userId_teamId_key" ON "team_members"("userId", "teamId");

-- CreateIndex
CREATE UNIQUE INDEX "nfts_tokenId_key" ON "nfts"("tokenId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectPlan_projectId_key" ON "ProjectPlan"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectPlanLite_projectId_key" ON "ProjectPlanLite"("projectId");

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfts" ADD CONSTRAINT "nfts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfts" ADD CONSTRAINT "nfts_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectPlan" ADD CONSTRAINT "ProjectPlan_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectPlanLite" ADD CONSTRAINT "ProjectPlanLite_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
