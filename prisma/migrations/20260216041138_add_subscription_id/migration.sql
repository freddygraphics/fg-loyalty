/*
  Warnings:

  - A unique constraint covering the columns `[subscriptionId]` on the table `Business` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "subscriptionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Business_subscriptionId_key" ON "Business"("subscriptionId");
