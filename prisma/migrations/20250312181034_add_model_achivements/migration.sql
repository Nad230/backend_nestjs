/*
  Warnings:

  - A unique constraint covering the columns `[userId,achievementId]` on the table `AchievementProgress` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AchievementProgress_userId_achievementId_key" ON "AchievementProgress"("userId", "achievementId");
