-- DropForeignKey
ALTER TABLE "AiPlan" DROP CONSTRAINT "AiPlan_jobId_fkey";

-- AlterTable
ALTER TABLE "AiPlan" ADD COLUMN     "aiJobId" TEXT;

-- AddForeignKey
ALTER TABLE "AiPlan" ADD CONSTRAINT "AiPlan_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "BusinessPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
