-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "earnStep" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "limitMode" TEXT NOT NULL DEFAULT 'cap',
ADD COLUMN     "redeemMode" TEXT NOT NULL DEFAULT 'subtract';

-- AlterTable
ALTER TABLE "LoyaltyCard" ADD COLUMN     "lastScanAt" TIMESTAMP(3);
