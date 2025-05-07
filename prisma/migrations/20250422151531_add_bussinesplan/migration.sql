-- CreateTable
CREATE TABLE "BusinessPlan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "whyItFits" TEXT NOT NULL,
    "bonusTip" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "timeToProfit" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "placeId" INTEGER NOT NULL,
    "status" TEXT,
    "estimatedCost" INTEGER,

    CONSTRAINT "BusinessPlan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BusinessPlan_placeId_key" ON "BusinessPlan"("placeId");

-- AddForeignKey
ALTER TABLE "BusinessPlan" ADD CONSTRAINT "BusinessPlan_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessPlan" ADD CONSTRAINT "BusinessPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
