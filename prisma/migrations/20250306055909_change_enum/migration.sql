/*
  Warnings:

  - The `status` column on the `time_entries` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('BUSINESS', 'CREATIVE', 'SOCIAL_IMPACT', 'PERSONAL', 'OTHER');

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "fundingSourceOther" TEXT;

-- AlterTable
ALTER TABLE "time_entries" DROP COLUMN "status",
ADD COLUMN     "status" TEXT;
