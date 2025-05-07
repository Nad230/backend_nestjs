/*
  Warnings:

  - A unique constraint covering the columns `[profileId]` on the table `ScheduledPost` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ScheduledPost_profileId_key" ON "ScheduledPost"("profileId");
