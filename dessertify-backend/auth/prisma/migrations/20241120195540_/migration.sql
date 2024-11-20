/*
  Warnings:

  - A unique constraint covering the columns `[customerId]` on the table `CustomerAuth` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CustomerAuth_customerId_key" ON "CustomerAuth"("customerId");
