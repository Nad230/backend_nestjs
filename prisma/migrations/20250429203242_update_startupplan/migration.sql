/*
  Warnings:

  - You are about to drop the column `createdAt` on the `AiPlanTask` table. All the data in the column will be lost.
  - You are about to drop the column `label` on the `AiPlanTask` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `AiPlanTask` table. All the data in the column will be lost.
  - You are about to drop the column `planId` on the `AiPlanTask` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `AiPlanTask` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `AiPlanTask` table. All the data in the column will be lost.
  - Added the required column `dayNumber` to the `AiPlanTask` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `AiPlanTask` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startupPlanId` to the `AiPlanTask` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `AiPlanTask` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AiPlanTask" DROP CONSTRAINT "AiPlanTask_planId_fkey";

-- AlterTable
ALTER TABLE "AiPlanTask" DROP COLUMN "createdAt",
DROP COLUMN "label",
DROP COLUMN "order",
DROP COLUMN "planId",
DROP COLUMN "text",
DROP COLUMN "updatedAt",
ADD COLUMN     "dayNumber" INTEGER NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "plannedDate" TIMESTAMP(3),
ADD COLUMN     "startupPlanId" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "StartupPlan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "budget" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "jobId" TEXT NOT NULL,

    CONSTRAINT "StartupPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BudgetItem" (
    "id" TEXT NOT NULL,
    "startupPlanId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "suggestedCost" DOUBLE PRECISION NOT NULL,
    "actualCost" DOUBLE PRECISION,
    "notes" TEXT,

    CONSTRAINT "BudgetItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserExpense" (
    "id" TEXT NOT NULL,
    "startupPlanId" TEXT NOT NULL,
    "taskId" TEXT,
    "title" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,

    CONSTRAINT "UserExpense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tip" (
    "id" TEXT NOT NULL,
    "startupPlanId" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "Tip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Risk" (
    "id" TEXT NOT NULL,
    "startupPlanId" TEXT NOT NULL,
    "risk" TEXT NOT NULL,
    "mitigation" TEXT NOT NULL,

    CONSTRAINT "Risk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CalendarWeek" (
    "id" TEXT NOT NULL,
    "startupPlanId" TEXT NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "summary" TEXT NOT NULL,

    CONSTRAINT "CalendarWeek_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StartupPlan" ADD CONSTRAINT "StartupPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StartupPlan" ADD CONSTRAINT "StartupPlan_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "BusinessPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiPlanTask" ADD CONSTRAINT "AiPlanTask_startupPlanId_fkey" FOREIGN KEY ("startupPlanId") REFERENCES "StartupPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetItem" ADD CONSTRAINT "BudgetItem_startupPlanId_fkey" FOREIGN KEY ("startupPlanId") REFERENCES "StartupPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserExpense" ADD CONSTRAINT "UserExpense_startupPlanId_fkey" FOREIGN KEY ("startupPlanId") REFERENCES "StartupPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserExpense" ADD CONSTRAINT "UserExpense_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "AiPlanTask"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tip" ADD CONSTRAINT "Tip_startupPlanId_fkey" FOREIGN KEY ("startupPlanId") REFERENCES "StartupPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Risk" ADD CONSTRAINT "Risk_startupPlanId_fkey" FOREIGN KEY ("startupPlanId") REFERENCES "StartupPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarWeek" ADD CONSTRAINT "CalendarWeek_startupPlanId_fkey" FOREIGN KEY ("startupPlanId") REFERENCES "StartupPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
