/*
  Warnings:

  - The `strategyModel` column on the `projects` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "StrategyModel" AS ENUM ('LEAN_STARTUP', 'AGILE_SPRINT', 'MVP_FOCUS', 'CUSTOM_PLAN');

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "strategyModel",
ADD COLUMN     "strategyModel" "StrategyModel" NOT NULL DEFAULT 'LEAN_STARTUP';
