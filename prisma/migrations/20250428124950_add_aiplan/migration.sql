-- CreateTable
CREATE TABLE "AiPlan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "stepByStep" JSONB NOT NULL,
    "budget" JSONB NOT NULL,
    "launchPlan" JSONB NOT NULL,
    "risks" JSONB NOT NULL,
    "bonusTip" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiPlan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AiPlan" ADD CONSTRAINT "AiPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiPlan" ADD CONSTRAINT "AiPlan_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "AiJob"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
