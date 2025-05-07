/*
  Warnings:

  - Added the required column `categoryId` to the `achievements` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "achievements" ADD COLUMN     "categoryId" TEXT NOT NULL,
ADD COLUMN     "icon" TEXT,
ADD COLUMN     "isHidden" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "AchievementCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "AchievementCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AchievementProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "achievementId" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "goal" INTEGER NOT NULL,

    CONSTRAINT "AchievementProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserAchievements" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserAchievements_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_MilestoneAchievements" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MilestoneAchievements_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_TaskAchievements" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TaskAchievements_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProjectAchievements" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProjectAchievements_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "AchievementCategory_name_key" ON "AchievementCategory"("name");

-- CreateIndex
CREATE INDEX "_UserAchievements_B_index" ON "_UserAchievements"("B");

-- CreateIndex
CREATE INDEX "_MilestoneAchievements_B_index" ON "_MilestoneAchievements"("B");

-- CreateIndex
CREATE INDEX "_TaskAchievements_B_index" ON "_TaskAchievements"("B");

-- CreateIndex
CREATE INDEX "_ProjectAchievements_B_index" ON "_ProjectAchievements"("B");

-- AddForeignKey
ALTER TABLE "achievements" ADD CONSTRAINT "achievements_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "AchievementCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AchievementProgress" ADD CONSTRAINT "AchievementProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AchievementProgress" ADD CONSTRAINT "AchievementProgress_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "achievements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserAchievements" ADD CONSTRAINT "_UserAchievements_A_fkey" FOREIGN KEY ("A") REFERENCES "achievements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserAchievements" ADD CONSTRAINT "_UserAchievements_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MilestoneAchievements" ADD CONSTRAINT "_MilestoneAchievements_A_fkey" FOREIGN KEY ("A") REFERENCES "achievements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MilestoneAchievements" ADD CONSTRAINT "_MilestoneAchievements_B_fkey" FOREIGN KEY ("B") REFERENCES "Milestone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TaskAchievements" ADD CONSTRAINT "_TaskAchievements_A_fkey" FOREIGN KEY ("A") REFERENCES "achievements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TaskAchievements" ADD CONSTRAINT "_TaskAchievements_B_fkey" FOREIGN KEY ("B") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectAchievements" ADD CONSTRAINT "_ProjectAchievements_A_fkey" FOREIGN KEY ("A") REFERENCES "achievements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectAchievements" ADD CONSTRAINT "_ProjectAchievements_B_fkey" FOREIGN KEY ("B") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
