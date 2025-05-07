-- AlterTable
ALTER TABLE "SocialStats" ADD COLUMN     "commentGrowth" INTEGER,
ADD COLUMN     "followerGrowth" INTEGER,
ADD COLUMN     "likeGrowth" INTEGER,
ADD COLUMN     "shareGrowth" INTEGER;

-- CreateIndex
CREATE INDEX "SocialStats_date_idx" ON "SocialStats"("date");
