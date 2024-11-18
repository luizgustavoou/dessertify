/*
  Warnings:

  - Added the required column `customerId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "customerId" TEXT NOT NULL;
