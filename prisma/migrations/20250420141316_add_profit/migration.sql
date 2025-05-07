-- AlterTable
ALTER TABLE "DailyProfit" ADD COLUMN     "day" TEXT,
ADD COLUMN     "timeWorked" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "endTime" TEXT,
ADD COLUMN     "startTime" TEXT;
