-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "createdBy" TEXT;

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "createdBy" TEXT;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
