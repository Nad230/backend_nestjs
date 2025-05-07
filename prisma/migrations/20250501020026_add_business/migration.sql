/*
  Warnings:

  - You are about to drop the column `discription` on the `LocalUserBusinessplan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LocalUserBusinessplan" DROP COLUMN "discription",
ADD COLUMN     "description" TEXT;
