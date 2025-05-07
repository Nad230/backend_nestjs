/*
  Warnings:

  - You are about to drop the column `assignedTo` on the `tasks` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_assignedTo_fkey";

-- AlterTable
ALTER TABLE "Milestone" ADD COLUMN     "assignedBy" TEXT,
ADD COLUMN     "assignedToId" TEXT;

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "assignedTo",
ADD COLUMN     "assignedToId" TEXT;

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "team_members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_assignedBy_fkey" FOREIGN KEY ("assignedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "team_members"("id") ON DELETE SET NULL ON UPDATE CASCADE;
