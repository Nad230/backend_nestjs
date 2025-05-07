-- AlterTable
ALTER TABLE "ScheduledPost" ALTER COLUMN "hashtags" DROP NOT NULL,
ALTER COLUMN "hashtags" SET DATA TYPE TEXT;
