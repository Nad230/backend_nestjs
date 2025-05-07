/*
  Warnings:

  - A unique constraint covering the columns `[profileId]` on the table `initial_stats` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "initial_stats_profileId_key" ON "initial_stats"("profileId");
