/*
  Warnings:

  - You are about to drop the column `estimatedAgeCountry` on the `SocialStats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SocialStats" DROP COLUMN "estimatedAgeCountry",
ADD COLUMN     "estimatedCountry" TEXT;
