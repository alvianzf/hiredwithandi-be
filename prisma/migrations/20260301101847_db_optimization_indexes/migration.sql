-- CreateIndex
CREATE INDEX "Job_userId_idx" ON "Job"("userId");

-- CreateIndex
CREATE INDEX "Job_status_idx" ON "Job"("status");

-- CreateIndex
CREATE INDEX "Job_dateApplied_idx" ON "Job"("dateApplied");

-- CreateIndex
CREATE INDEX "Job_boardPosition_idx" ON "Job"("boardPosition");

-- CreateIndex
CREATE INDEX "JobHistory_jobId_idx" ON "JobHistory"("jobId");

-- CreateIndex
CREATE INDEX "JobHistory_status_idx" ON "JobHistory"("status");

-- CreateIndex
CREATE INDEX "User_orgId_idx" ON "User"("orgId");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");
