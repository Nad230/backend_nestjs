-- DropForeignKey
ALTER TABLE "Milestone" DROP CONSTRAINT "Milestone_assignedToId_fkey";

-- AlterTable
ALTER TABLE "Milestone" ADD COLUMN     "teamMemberId" TEXT;

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "team_members"("id") ON DELETE SET NULL ON UPDATE CASCADE;
