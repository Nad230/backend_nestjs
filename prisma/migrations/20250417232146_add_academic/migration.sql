/*
  Warnings:

  - You are about to drop the column `commentGrowth` on the `initial_stats` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `initial_stats` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedAgeGroup` on the `initial_stats` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedCountry` on the `initial_stats` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedGender` on the `initial_stats` table. All the data in the column will be lost.
  - You are about to drop the column `followerGrowth` on the `initial_stats` table. All the data in the column will be lost.
  - You are about to drop the column `likeGrowth` on the `initial_stats` table. All the data in the column will be lost.
  - You are about to drop the column `platform` on the `initial_stats` table. All the data in the column will be lost.
  - You are about to drop the column `posts` on the `initial_stats` table. All the data in the column will be lost.
  - You are about to drop the column `shareGrowth` on the `initial_stats` table. All the data in the column will be lost.
  - Made the column `likes` on table `initial_stats` required. This step will fail if there are existing NULL values in that column.
  - Made the column `comments` on table `initial_stats` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "initial_stats" DROP CONSTRAINT "initial_stats_profileId_fkey";

-- AlterTable
ALTER TABLE "initial_stats" DROP COLUMN "commentGrowth",
DROP COLUMN "date",
DROP COLUMN "estimatedAgeGroup",
DROP COLUMN "estimatedCountry",
DROP COLUMN "estimatedGender",
DROP COLUMN "followerGrowth",
DROP COLUMN "likeGrowth",
DROP COLUMN "platform",
DROP COLUMN "posts",
DROP COLUMN "shareGrowth",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "likes" SET NOT NULL,
ALTER COLUMN "comments" SET NOT NULL;
