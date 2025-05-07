/*
  Warnings:

  - You are about to drop the column `aiJobId` on the `AiPlan` table. All the data in the column will be lost.
  - You are about to drop the column `stepByStep` on the `AiPlan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AiPlan" DROP COLUMN "aiJobId",
DROP COLUMN "stepByStep";

-- CreateTable
CREATE TABLE "AiPlanTask" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiPlanTask_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AiPlanTask" ADD CONSTRAINT "AiPlanTask_planId_fkey" FOREIGN KEY ("planId") REFERENCES "AiPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
