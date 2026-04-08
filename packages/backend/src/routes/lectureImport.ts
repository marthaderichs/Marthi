import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { LectureImportPayloadSchema } from '@medilearn/shared';

const prisma = new PrismaClient();
export const lectureImportRouter = Router();

// POST /api/lecture-import
lectureImportRouter.post('/', async (req, res, next) => {
  try {
    const parsed = LectureImportPayloadSchema.parse(req.body);

    const result = await prisma.$transaction(async (tx) => {
      const createdCards = await Promise.all(
        parsed.lectureCards.map((card) =>
          tx.lectureCard.create({
            data: {
              front: card.front,
              back: card.back,
              lectureTag: card.lectureTag ?? null,
            },
          })
        )
      );

      const createdSummaries = await Promise.all(
        parsed.lectureSummaries.map((s) =>
          tx.lectureSummary.create({
            data: {
              title: s.title,
              content: s.content,
              lectureTag: s.lectureTag ?? null,
            },
          })
        )
      );

      return {
        lectureCards: createdCards.length,
        lectureSummaries: createdSummaries.length,
      };
    });

    res.status(201).json({ message: 'Import erfolgreich', created: result });
  } catch (error) {
    next(error);
  }
});
