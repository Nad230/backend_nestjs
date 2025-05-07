-- CreateTable
CREATE TABLE "initial_stats" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "followers" INTEGER NOT NULL,
    "likes" INTEGER NOT NULL,
    "comments" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "initial_stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "initial_stats_profileId_key" ON "initial_stats"("profileId");
