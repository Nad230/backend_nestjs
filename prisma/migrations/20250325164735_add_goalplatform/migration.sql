/*
  Warnings:

  - You are about to drop the column `goalType` on the `CreatorGoal` table. All the data in the column will be lost.
  - Added the required column `creatorType` to the `CreatorGoal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `CreatorGoal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `goalId` to the `CreatorGoal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `platform` to the `CreatorGoal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `CreatorGoal` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CreatorType" AS ENUM ('CONTENT', 'INFLUENCER', 'ECOMMERCE', 'EDUCATOR', 'ARTIST', 'NEWS');

-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('YOUTUBE', 'INSTAGRAM', 'TIKTOK', 'FACEBOOK');

-- AlterTable
ALTER TABLE "CreatorGoal" DROP COLUMN "goalType",
ADD COLUMN     "creatorType" "CreatorType" NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "goalId" TEXT NOT NULL,
ADD COLUMN     "metrics" TEXT[],
ADD COLUMN     "platform" "Platform" NOT NULL,
ADD COLUMN     "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "title" TEXT NOT NULL,
ALTER COLUMN "targetValue" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "currentValue" SET DEFAULT 0,
ALTER COLUMN "currentValue" SET DATA TYPE DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "GoalMilestone" (
    "id" TEXT NOT NULL,
    "goalId" TEXT NOT NULL,
    "percentage" INTEGER NOT NULL,
    "targetValue" DOUBLE PRECISION NOT NULL,
    "achieved" BOOLEAN NOT NULL DEFAULT false,
    "achievedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "evidenceUrl" TEXT,

    CONSTRAINT "GoalMilestone_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GoalMilestone" ADD CONSTRAINT "GoalMilestone_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "CreatorGoal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
