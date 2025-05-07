-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_createdBy_fkey";

-- AlterTable
ALTER TABLE "Client" ALTER COLUMN "createdBy" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Invoice" ALTER COLUMN "createdBy" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
