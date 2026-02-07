-- CreateEnum
CREATE TYPE "TxType" AS ENUM ('earn', 'redeem', 'adjust');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "goal" INTEGER NOT NULL DEFAULT 50,
    "earnStep" INTEGER NOT NULL DEFAULT 5,
    "limitMode" TEXT NOT NULL DEFAULT 'cap',
    "redeemMode" TEXT NOT NULL DEFAULT 'reset',
    "pinHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer" (
    "id" SERIAL NOT NULL,
    "businessId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loyalty_card" (
    "id" SERIAL NOT NULL,
    "businessId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loyalty_card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "point_transaction" (
    "id" SERIAL NOT NULL,
    "businessId" INTEGER NOT NULL,
    "cardId" INTEGER NOT NULL,
    "userId" INTEGER,
    "type" "TxType" NOT NULL,
    "points" INTEGER NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "point_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "business_slug_key" ON "business"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "business_ownerId_key" ON "business"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "customer_businessId_phone_key" ON "customer"("businessId", "phone");

-- CreateIndex
CREATE UNIQUE INDEX "loyalty_card_token_key" ON "loyalty_card"("token");

-- AddForeignKey
ALTER TABLE "business" ADD CONSTRAINT "business_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer" ADD CONSTRAINT "customer_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loyalty_card" ADD CONSTRAINT "loyalty_card_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loyalty_card" ADD CONSTRAINT "loyalty_card_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "point_transaction" ADD CONSTRAINT "point_transaction_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "point_transaction" ADD CONSTRAINT "point_transaction_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "loyalty_card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "point_transaction" ADD CONSTRAINT "point_transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
