-- DropForeignKey
ALTER TABLE "AcademicTask" DROP CONSTRAINT "AcademicTask_assigneeId_fkey";

-- AlterTable
ALTER TABLE "AcademicTask" ALTER COLUMN "assigneeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "AcademicTask" ADD CONSTRAINT "AcademicTask_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
