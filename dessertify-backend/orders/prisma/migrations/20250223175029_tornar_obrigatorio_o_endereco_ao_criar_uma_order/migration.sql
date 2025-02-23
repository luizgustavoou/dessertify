/*
  Warnings:

  - You are about to drop the column `orderId` on the `DeliveryAddress` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[deliveryAddressId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `deliveryAddressId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DeliveryAddress" DROP CONSTRAINT "DeliveryAddress_orderId_fkey";

-- DropIndex
DROP INDEX "DeliveryAddress_orderId_key";

-- AlterTable
ALTER TABLE "DeliveryAddress" DROP COLUMN "orderId";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "deliveryAddressId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Order_deliveryAddressId_key" ON "Order"("deliveryAddressId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_deliveryAddressId_fkey" FOREIGN KEY ("deliveryAddressId") REFERENCES "DeliveryAddress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
