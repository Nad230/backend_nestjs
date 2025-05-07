-- CreateTable
CREATE TABLE "BusinessSuggestion" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "whyItFits" TEXT NOT NULL,
    "bonusTip" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "timeToProfit" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "estimatedBudget" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BusinessSuggestion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BusinessSuggestion" ADD CONSTRAINT "BusinessSuggestion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
