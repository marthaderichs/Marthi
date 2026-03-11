-- CreateTable
CREATE TABLE "Mistake" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subjectId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "options" TEXT NOT NULL,
    "correctAnswerIndex" INTEGER NOT NULL,
    "explanation" TEXT NOT NULL,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "masteredCount" INTEGER NOT NULL DEFAULT 0
);

-- CreateIndex
CREATE INDEX "Mistake_subjectId_idx" ON "Mistake"("subjectId");
