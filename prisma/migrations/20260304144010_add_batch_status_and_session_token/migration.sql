-- CreateEnum
CREATE TYPE "BatchStatus" AS ENUM ('ACTIVE', 'DISABLED');

-- AlterTable
ALTER TABLE "Batch" ADD COLUMN     "status" "BatchStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "sessionToken" TEXT;
