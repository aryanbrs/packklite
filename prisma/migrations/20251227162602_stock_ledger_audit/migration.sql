-- CreateEnum
CREATE TYPE "StockChangeType" AS ENUM ('SET', 'ADJUST');

-- CreateTable
CREATE TABLE "StockLedger" (
    "id" SERIAL NOT NULL,
    "variantId" INTEGER NOT NULL,
    "adminId" INTEGER NOT NULL,
    "changeType" "StockChangeType" NOT NULL,
    "previousStock" INTEGER NOT NULL,
    "newStock" INTEGER NOT NULL,
    "delta" INTEGER NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StockLedger_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StockLedger_variantId_idx" ON "StockLedger"("variantId");

-- CreateIndex
CREATE INDEX "StockLedger_adminId_idx" ON "StockLedger"("adminId");

-- CreateIndex
CREATE INDEX "StockLedger_createdAt_idx" ON "StockLedger"("createdAt");

-- AddForeignKey
ALTER TABLE "StockLedger" ADD CONSTRAINT "StockLedger_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "Variant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockLedger" ADD CONSTRAINT "StockLedger_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
