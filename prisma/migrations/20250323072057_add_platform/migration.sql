/*
  Warnings:

  - A unique constraint covering the columns `[userId,platform]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Profile_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_platform_key" ON "Profile"("userId", "platform");
