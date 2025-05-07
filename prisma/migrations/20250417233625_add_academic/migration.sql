/*
  Warnings:

  - You are about to drop the `initial_stats` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "initial_stats";

-- CreateTable
CREATE TABLE "daily_stats" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "followers" INTEGER NOT NULL,
    "likes" INTEGER NOT NULL,
    "comments" INTEGER NOT NULL,
    "followerGrowth" INTEGER NOT NULL,
    "likeGrowth" INTEGER NOT NULL,
    "commentGrowth" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "daily_stats_profileId_date_key" ON "daily_stats"("profileId", "date");
