-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isChecklistComplete" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "ChecklistProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "state" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChecklistProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChecklistLog" (
    "id" TEXT NOT NULL,
    "checklistProgressId" TEXT NOT NULL,
    "changes" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChecklistLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChecklistProgress_userId_key" ON "ChecklistProgress"("userId");

-- CreateIndex
CREATE INDEX "ChecklistProgress_userId_idx" ON "ChecklistProgress"("userId");

-- CreateIndex
CREATE INDEX "ChecklistLog_checklistProgressId_idx" ON "ChecklistLog"("checklistProgressId");

-- AddForeignKey
ALTER TABLE "ChecklistProgress" ADD CONSTRAINT "ChecklistProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistLog" ADD CONSTRAINT "ChecklistLog_checklistProgressId_fkey" FOREIGN KEY ("checklistProgressId") REFERENCES "ChecklistProgress"("id") ON DELETE CASCADE ON UPDATE CASCADE;
