/*
  Warnings:

  - A unique constraint covering the columns `[profileId]` on the table `SocialStats` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ScheduledPost_profileId_key";

-- CreateIndex
CREATE UNIQUE INDEX "SocialStats_profileId_key" ON "SocialStats"("profileId");
