/*
  Warnings:

  - You are about to drop the column `impact` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `vision` on the `projects` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "BudgetRange" ADD VALUE 'Im_not_sure_yet';

-- AlterEnum
ALTER TYPE "RevenueModel" ADD VALUE 'OTHER';

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "impact",
DROP COLUMN "vision",
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "otherBudgetRange" TEXT,
ADD COLUMN     "otherProjectType" TEXT,
ADD COLUMN     "otherRevenueModel" TEXT,
ADD COLUMN     "visionImpact" TEXT;
