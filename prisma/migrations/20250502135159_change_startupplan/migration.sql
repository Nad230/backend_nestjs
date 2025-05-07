-- DropForeignKey
ALTER TABLE "StartupPlan" DROP CONSTRAINT "StartupPlan_jobId_fkey";

-- AlterTable
ALTER TABLE "StartupPlan" ADD COLUMN     "BusinessId" TEXT,
ALTER COLUMN "jobId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "StartupPlan" ADD CONSTRAINT "StartupPlan_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "BusinessPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StartupPlan" ADD CONSTRAINT "StartupPlan_BusinessId_fkey" FOREIGN KEY ("BusinessId") REFERENCES "LocalUserBusinessplan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
