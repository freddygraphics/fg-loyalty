/*
  Warnings:

  - You are about to drop the column `password` on the `user` table. All the data in the column will be lost.
  - Made the column `pinHash` on table `business` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `passwordHash` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "business" ALTER COLUMN "pinHash" SET NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "password",
ADD COLUMN     "passwordHash" TEXT NOT NULL,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'OWNER';
