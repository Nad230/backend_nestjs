-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "bio" TEXT,
    "profilePic" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialStats" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "followers" INTEGER NOT NULL,
    "likes" INTEGER,
    "comments" INTEGER,
    "shares" INTEGER,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SocialStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentPerformance" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "mediaType" TEXT NOT NULL,
    "caption" TEXT,
    "likeCount" INTEGER,
    "commentCount" INTEGER,
    "shareCount" INTEGER,
    "mediaUrl" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentPerformance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreatorGoal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "goalType" TEXT NOT NULL,
    "targetValue" INTEGER NOT NULL,
    "currentValue" INTEGER NOT NULL DEFAULT 0,
    "deadline" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreatorGoal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_username_key" ON "Profile"("username");

-- CreateIndex
CREATE UNIQUE INDEX "SocialStats_profileId_date_key" ON "SocialStats"("profileId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "ContentPerformance_postId_key" ON "ContentPerformance"("postId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialStats" ADD CONSTRAINT "SocialStats_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentPerformance" ADD CONSTRAINT "ContentPerformance_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatorGoal" ADD CONSTRAINT "CreatorGoal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
