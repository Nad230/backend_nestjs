/*
  Warnings:

  - The `role` column on the `community_memberships` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `visibility` column on the `posts` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `fundingSourceOther` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `otherBudgetRange` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `otherProjectType` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `otherRevenueModel` on the `projects` table. All the data in the column will be lost.
  - The `fundingSource` column on the `projects` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `projects` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `visibility` column on the `projects` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `budgetRange` column on the `projects` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `revenueModel` column on the `projects` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `timeline` column on the `projects` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `type` column on the `projects` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "community_memberships" DROP COLUMN "role",
ADD COLUMN     "role" TEXT DEFAULT 'MEMBER';

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "visibility",
ADD COLUMN     "visibility" TEXT DEFAULT 'PUBLIC';

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "fundingSourceOther",
DROP COLUMN "otherBudgetRange",
DROP COLUMN "otherProjectType",
DROP COLUMN "otherRevenueModel",
DROP COLUMN "fundingSource",
ADD COLUMN     "fundingSource" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT,
DROP COLUMN "visibility",
ADD COLUMN     "visibility" TEXT,
DROP COLUMN "budgetRange",
ADD COLUMN     "budgetRange" TEXT,
DROP COLUMN "revenueModel",
ADD COLUMN     "revenueModel" TEXT,
DROP COLUMN "timeline",
ADD COLUMN     "timeline" TEXT,
DROP COLUMN "type",
ADD COLUMN     "type" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role",
ADD COLUMN     "role" TEXT DEFAULT 'USER';

-- DropEnum
DROP TYPE "ProjectType";
