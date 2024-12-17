/*
  Warnings:

  - A unique constraint covering the columns `[authCustomerId]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Customer_authCustomerId_key" ON "Customer"("authCustomerId");
