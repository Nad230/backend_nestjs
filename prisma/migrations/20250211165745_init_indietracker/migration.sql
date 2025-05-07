/*
  Warnings:

  - You are about to drop the column `category` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `privacy` on the `projects` table. All the data in the column will be lost.
  - The `budgetRange` column on the `projects` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `revenueModel` column on the `projects` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `timeline` column on the `projects` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `comments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `communities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `community_memberships` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `group_memberships` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `groups` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `messages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `posts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `time_entries` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `votes` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `status` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `visibility` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `projects` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'MODERATOR');

-- CreateEnum
CREATE TYPE "PackageType" AS ENUM ('SILVER', 'GOLD', 'DIAMOND');

-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('BUSINESS', 'CREATIVE', 'SOCIAL_IMPACT', 'OTHER');

-- CreateEnum
CREATE TYPE "RevenueModel" AS ENUM ('SUBSCRIPTION', 'ONE_TIME_SALES', 'ADS', 'DONATIONS');

-- CreateEnum
CREATE TYPE "BudgetRange" AS ENUM ('LOW_1K_5K', 'MID_5K_10K', 'HIGH_10K_PLUS');

-- CreateEnum
CREATE TYPE "Timeline" AS ENUM ('SHORT_0_3_MONTHS', 'MEDIUM_3_12_MONTHS', 'LONG_1_PLUS_YEARS');

-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('PUBLIC', 'PRIVATE', 'INVITE_ONLY');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('IDEA', 'PLANNING', 'IN_PROGRESS', 'COMPLETED', 'PAUSED');

-- CreateEnum
CREATE TYPE "FundingSource" AS ENUM ('BOOTSTRAPPED', 'INVESTOR_BACKED', 'CROWDFUNDED', 'OTHER');

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_userId_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_postId_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_userId_fkey";

-- DropForeignKey
ALTER TABLE "communities" DROP CONSTRAINT "communities_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "community_memberships" DROP CONSTRAINT "community_memberships_communityId_fkey";

-- DropForeignKey
ALTER TABLE "community_memberships" DROP CONSTRAINT "community_memberships_userId_fkey";

-- DropForeignKey
ALTER TABLE "group_memberships" DROP CONSTRAINT "group_memberships_groupId_fkey";

-- DropForeignKey
ALTER TABLE "group_memberships" DROP CONSTRAINT "group_memberships_userId_fkey";

-- DropForeignKey
ALTER TABLE "groups" DROP CONSTRAINT "groups_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_groupId_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_senderId_fkey";

-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_communityId_fkey";

-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_userId_fkey";

-- DropForeignKey
ALTER TABLE "time_entries" DROP CONSTRAINT "time_entries_projectId_fkey";

-- DropForeignKey
ALTER TABLE "time_entries" DROP CONSTRAINT "time_entries_taskId_fkey";

-- DropForeignKey
ALTER TABLE "time_entries" DROP CONSTRAINT "time_entries_userId_fkey";

-- DropForeignKey
ALTER TABLE "votes" DROP CONSTRAINT "votes_postId_fkey";

-- DropForeignKey
ALTER TABLE "votes" DROP CONSTRAINT "votes_userId_fkey";

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "category",
DROP COLUMN "privacy",
ADD COLUMN     "aiInsights" JSONB,
ADD COLUMN     "collaborations" JSONB,
ADD COLUMN     "fundingSource" "FundingSource",
ADD COLUMN     "projectMilestones" JSONB,
ADD COLUMN     "status" "ProjectStatus" NOT NULL,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "teamId" TEXT,
ADD COLUMN     "visibility" "Visibility" NOT NULL,
DROP COLUMN "budgetRange",
ADD COLUMN     "budgetRange" "BudgetRange",
DROP COLUMN "revenueModel",
ADD COLUMN     "revenueModel" "RevenueModel",
DROP COLUMN "timeline",
ADD COLUMN     "timeline" "Timeline",
DROP COLUMN "type",
ADD COLUMN     "type" "ProjectType" NOT NULL;

-- DropTable
DROP TABLE "Task";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "comments";

-- DropTable
DROP TABLE "communities";

-- DropTable
DROP TABLE "community_memberships";

-- DropTable
DROP TABLE "group_memberships";

-- DropTable
DROP TABLE "groups";

-- DropTable
DROP TABLE "messages";

-- DropTable
DROP TABLE "posts";

-- DropTable
DROP TABLE "time_entries";

-- DropTable
DROP TABLE "votes";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "id_users" TEXT NOT NULL,
    "phone" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "fullname" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profile_photo" TEXT,
    "packageType" "PackageType" NOT NULL DEFAULT 'SILVER',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "companyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TeamMembers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TeamMembers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_id_users_key" ON "users"("id_users");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "_TeamMembers_B_index" ON "_TeamMembers"("B");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamMembers" ADD CONSTRAINT "_TeamMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamMembers" ADD CONSTRAINT "_TeamMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
