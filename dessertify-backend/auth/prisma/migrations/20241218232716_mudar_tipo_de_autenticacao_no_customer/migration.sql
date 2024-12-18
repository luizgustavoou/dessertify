-- CreateEnum
CREATE TYPE "RegisterType" AS ENUM ('DEFAULT', 'GOOGLE');

-- AlterTable
ALTER TABLE "CustomerAuth" ADD COLUMN     "registerType" "RegisterType" NOT NULL DEFAULT 'DEFAULT';
