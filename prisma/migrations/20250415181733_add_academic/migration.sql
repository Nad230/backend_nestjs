/*
  Warnings:

  - You are about to drop the `CourseStudent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CourseTeacher` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CourseStudent" DROP CONSTRAINT "CourseStudent_courseId_fkey";

-- DropForeignKey
ALTER TABLE "CourseStudent" DROP CONSTRAINT "CourseStudent_studentId_fkey";

-- DropForeignKey
ALTER TABLE "CourseTeacher" DROP CONSTRAINT "CourseTeacher_courseId_fkey";

-- DropForeignKey
ALTER TABLE "CourseTeacher" DROP CONSTRAINT "CourseTeacher_teacherId_fkey";

-- DropTable
DROP TABLE "CourseStudent";

-- DropTable
DROP TABLE "CourseTeacher";
