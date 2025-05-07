-- CreateTable
CREATE TABLE "Citation" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "authors" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "journal" TEXT NOT NULL,
    "doi" TEXT,
    "citedIn" TEXT[],
    "tags" TEXT[],
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Citation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Citation" ADD CONSTRAINT "Citation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
