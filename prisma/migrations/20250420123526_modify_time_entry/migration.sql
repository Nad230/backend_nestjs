-- DropForeignKey
ALTER TABLE "time_entries" DROP CONSTRAINT "time_entries_projectId_fkey";

-- AlterTable
ALTER TABLE "time_entries" ALTER COLUMN "projectId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "time_entries" ADD CONSTRAINT "time_entries_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
