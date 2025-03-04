/*
  Warnings:

  - You are about to drop the column `country` on the `DeliveryAddress` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `DeliveryAddress` table. All the data in the column will be lost.
  - Added the required column `neighborhood` to the `DeliveryAddress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DeliveryAddress" DROP COLUMN "country",
DROP COLUMN "state",
ADD COLUMN     "complement" TEXT,
ADD COLUMN     "neighborhood" TEXT NOT NULL,
ADD COLUMN     "reference" TEXT;
