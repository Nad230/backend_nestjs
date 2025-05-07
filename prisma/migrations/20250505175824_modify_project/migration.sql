/*
  Warnings:

  - You are about to drop the column `teamMemberId` on the `Milestone` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Milestone" DROP CONSTRAINT "Milestone_assignedToId_fkey";

-- DropForeignKey
ALTER TABLE "Milestone" DROP CONSTRAINT "Milestone_teamMemberId_fkey";

-- AlterTable
ALTER TABLE "Milestone" DROP COLUMN "teamMemberId";

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "team_members"("id") ON DELETE SET NULL ON UPDATE CASCADE;
