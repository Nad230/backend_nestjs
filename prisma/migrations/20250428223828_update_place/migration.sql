/*
  Warnings:

  - You are about to drop the column `source` on the `Place` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Place` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `Place` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Place` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Place` table without a default value. This is not possible if the table is not empty.
  - Made the column `address` on table `Place` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Place" DROP COLUMN "source",
DROP COLUMN "type",
ADD COLUMN     "categoryId" INTEGER NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ALTER COLUMN "address" SET NOT NULL;

-- CreateTable
CREATE TABLE "PlaceDetail" (
    "id" SERIAL NOT NULL,
    "placeId" INTEGER NOT NULL,
    "operator" TEXT,
    "brand" TEXT,
    "stars" INTEGER,
    "phone" TEXT,
    "email" TEXT,

    CONSTRAINT "PlaceDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryPlace" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CategoryPlace_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlaceDetail_placeId_key" ON "PlaceDetail"("placeId");

-- CreateIndex
CREATE UNIQUE INDEX "CategoryPlace_name_key" ON "CategoryPlace"("name");

-- AddForeignKey
ALTER TABLE "Place" ADD CONSTRAINT "Place_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "CategoryPlace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaceDetail" ADD CONSTRAINT "PlaceDetail_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
