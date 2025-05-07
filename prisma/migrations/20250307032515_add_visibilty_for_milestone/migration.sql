-- AlterTable
ALTER TABLE "Milestone" ADD COLUMN     "visibleTo" TEXT[] DEFAULT ARRAY[]::TEXT[];
