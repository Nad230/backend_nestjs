-- CreateTable
CREATE TABLE "Profit" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "invoiceId" TEXT,
    "productId" TEXT,

    CONSTRAINT "Profit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Profit" ADD CONSTRAINT "Profit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profit" ADD CONSTRAINT "Profit_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profit" ADD CONSTRAINT "Profit_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
