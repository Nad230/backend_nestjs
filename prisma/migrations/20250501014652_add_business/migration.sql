-- CreateTable
CREATE TABLE "LocalBusiness" (
    "id" TEXT NOT NULL,
    "projectName" TEXT,
    "userId" TEXT NOT NULL,
    "projectType" TEXT,
    "location" TEXT,
    "discription" TEXT,
    "startHour" INTEGER,
    "endHour" INTEGER,
    "BudgetRange" INTEGER,

    CONSTRAINT "LocalBusiness_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocalUserBusinessplan" (
    "id" TEXT NOT NULL,
    "projectName" TEXT,
    "userId" TEXT NOT NULL,
    "projectType" TEXT,
    "city" TEXT,
    "country" TEXT,
    "discription" TEXT,
    "BudgetRange" INTEGER,

    CONSTRAINT "LocalUserBusinessplan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LocalBusiness" ADD CONSTRAINT "LocalBusiness_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocalUserBusinessplan" ADD CONSTRAINT "LocalUserBusinessplan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
