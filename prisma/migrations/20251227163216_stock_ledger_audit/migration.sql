/*
  Warnings:

  - Added the required column `source` to the `StockLedger` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StockUpdateSource" AS ENUM ('PRODUCT_EDIT', 'STOCK_UPDATES_PAGE');

-- AlterTable
ALTER TABLE "StockLedger" ADD COLUMN     "source" "StockUpdateSource" NOT NULL;
