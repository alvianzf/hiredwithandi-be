-- AlterTable
ALTER TABLE "User" ADD COLUMN     "batchId" TEXT;

-- CreateTable
CREATE TABLE "Batch" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Batch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Batch_orgId_idx" ON "Batch"("orgId");

-- CreateIndex
CREATE UNIQUE INDEX "Batch_name_orgId_key" ON "Batch"("name", "orgId");

-- CreateIndex
CREATE INDEX "User_batchId_idx" ON "User"("batchId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Batch" ADD CONSTRAINT "Batch_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
