/*
  Warnings:

  - You are about to drop the column `project` on the `AcademicTask` table. All the data in the column will be lost.
  - Added the required column `projectId` to the `AcademicTask` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AcademicTask" DROP COLUMN "project",
ADD COLUMN     "projectId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "AcademicProject" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "vibe" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "vision" TEXT NOT NULL,
    "firstMove" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "spirit" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AcademicProject_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AcademicTask" ADD CONSTRAINT "AcademicTask_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "AcademicProject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicProject" ADD CONSTRAINT "AcademicProject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
