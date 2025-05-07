-- AlterTable
ALTER TABLE "Citation" ADD COLUMN     "taskId" TEXT;

-- AddForeignKey
ALTER TABLE "Citation" ADD CONSTRAINT "Citation_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "AcadTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;
