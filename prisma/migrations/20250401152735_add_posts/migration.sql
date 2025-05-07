/*
  Warnings:

  - You are about to drop the column `shares` on the `SocialStats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SocialStats" DROP COLUMN "shares",
ADD COLUMN     "posts" INTEGER;
