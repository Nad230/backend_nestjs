/*
  Warnings:

  - You are about to drop the column `fundingSourceOther` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `media` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `teamMembers` on the `projects` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "projects" DROP COLUMN "fundingSourceOther",
DROP COLUMN "media",
DROP COLUMN "teamMembers";
