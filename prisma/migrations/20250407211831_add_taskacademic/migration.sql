/*
  Warnings:

  - Added the required column `assignedById` to the `AcademicTask` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AcademicTask" ADD COLUMN     "assignedById" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "AcademicTask" ADD CONSTRAINT "AcademicTask_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
