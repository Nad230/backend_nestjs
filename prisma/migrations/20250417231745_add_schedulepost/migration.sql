/*
  Warnings:

  - You are about to drop the column `createdAt` on the `initial_stats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "initial_stats" DROP COLUMN "createdAt",
ADD COLUMN     "commentGrowth" INTEGER,
ADD COLUMN     "estimatedAgeGroup" TEXT,
ADD COLUMN     "estimatedCountry" TEXT,
ADD COLUMN     "estimatedGender" TEXT,
ADD COLUMN     "followerGrowth" INTEGER,
ADD COLUMN     "likeGrowth" INTEGER,
ADD COLUMN     "posts" INTEGER,
ADD COLUMN     "shareGrowth" INTEGER,
ALTER COLUMN "likes" DROP NOT NULL,
ALTER COLUMN "comments" DROP NOT NULL,
ALTER COLUMN "platform" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "initial_stats" ADD CONSTRAINT "initial_stats_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
