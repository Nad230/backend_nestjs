/*
  Warnings:

  - You are about to drop the column `userId` on the `CreatorGoal` table. All the data in the column will be lost.
  - Added the required column `profileId` to the `CreatorGoal` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CreatorGoal" DROP CONSTRAINT "CreatorGoal_userId_fkey";

-- AlterTable
ALTER TABLE "CreatorGoal" DROP COLUMN "userId",
ADD COLUMN     "profileId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "CreatorGoal" ADD CONSTRAINT "CreatorGoal_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
