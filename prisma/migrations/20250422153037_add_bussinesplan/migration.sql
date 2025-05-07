/*
  Warnings:

  - You are about to drop the column `placeId` on the `BusinessPlan` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[UserLocationId]` on the table `BusinessPlan` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `UserLocationId` to the `BusinessPlan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BusinessPlan" DROP CONSTRAINT "BusinessPlan_placeId_fkey";

-- DropIndex
DROP INDEX "BusinessPlan_placeId_key";

-- AlterTable
ALTER TABLE "BusinessPlan" DROP COLUMN "placeId",
ADD COLUMN     "UserLocationId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BusinessPlan_UserLocationId_key" ON "BusinessPlan"("UserLocationId");

-- AddForeignKey
ALTER TABLE "BusinessPlan" ADD CONSTRAINT "BusinessPlan_UserLocationId_fkey" FOREIGN KEY ("UserLocationId") REFERENCES "UserLocation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
