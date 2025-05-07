/*
  Warnings:

  - The `priority` column on the `tasks` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `type` column on the `tasks` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "priority",
ADD COLUMN     "priority" TEXT,
DROP COLUMN "type",
ADD COLUMN     "type" TEXT;
