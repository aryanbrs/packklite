-- AlterTable
ALTER TABLE "Variant" ADD COLUMN     "currentStock" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastOrderAt" TIMESTAMP(3),
ADD COLUMN     "lastQuoteAt" TIMESTAMP(3),
ADD COLUMN     "minStockThreshold" INTEGER NOT NULL DEFAULT 0;
