-- CreateEnum
CREATE TYPE "Theme" AS ENUM ('modern', 'elegant', 'fun', 'minimal', 'tech');

-- AlterTable
ALTER TABLE "Presentation" ADD COLUMN     "theme" "Theme" NOT NULL DEFAULT 'modern';
