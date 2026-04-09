/*
  Warnings:

  - Added the required column `subjectId` to the `LectureCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subjectId` to the `LectureSummary` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LectureCard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "front" TEXT NOT NULL,
    "back" TEXT NOT NULL,
    "lectureTag" TEXT,
    "subjectId" TEXT NOT NULL,
    "easeFactor" REAL NOT NULL DEFAULT 2.5,
    "interval" INTEGER NOT NULL DEFAULT 0,
    "repetitions" INTEGER NOT NULL DEFAULT 0,
    "nextReview" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastReview" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LectureCard_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_LectureCard" ("back", "createdAt", "easeFactor", "front", "id", "interval", "lastReview", "lectureTag", "nextReview", "repetitions") SELECT "back", "createdAt", "easeFactor", "front", "id", "interval", "lastReview", "lectureTag", "nextReview", "repetitions" FROM "LectureCard";
DROP TABLE "LectureCard";
ALTER TABLE "new_LectureCard" RENAME TO "LectureCard";
CREATE INDEX "LectureCard_subjectId_idx" ON "LectureCard"("subjectId");
CREATE INDEX "LectureCard_nextReview_idx" ON "LectureCard"("nextReview");
CREATE INDEX "LectureCard_lectureTag_idx" ON "LectureCard"("lectureTag");
CREATE TABLE "new_LectureSummary" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "lectureTag" TEXT,
    "subjectId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LectureSummary_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_LectureSummary" ("content", "createdAt", "id", "lectureTag", "title", "updatedAt") SELECT "content", "createdAt", "id", "lectureTag", "title", "updatedAt" FROM "LectureSummary";
DROP TABLE "LectureSummary";
ALTER TABLE "new_LectureSummary" RENAME TO "LectureSummary";
CREATE INDEX "LectureSummary_subjectId_idx" ON "LectureSummary"("subjectId");
CREATE INDEX "LectureSummary_lectureTag_idx" ON "LectureSummary"("lectureTag");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
