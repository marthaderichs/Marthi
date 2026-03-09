-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "subjectId" TEXT,
    "topicId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "StudyPlanItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "durationMin" INTEGER NOT NULL DEFAULT 30,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "Note_subjectId_idx" ON "Note"("subjectId");

-- CreateIndex
CREATE INDEX "StudyPlanItem_date_idx" ON "StudyPlanItem"("date");

-- CreateIndex
CREATE INDEX "StudyPlanItem_subjectId_idx" ON "StudyPlanItem"("subjectId");
