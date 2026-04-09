import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { LectureImportPayloadSchema } from '@medilearn/shared';

const prisma = new PrismaClient();
export const lectureImportRouter = Router();

// POST /api/lecture-import
lectureImportRouter.post('/', async (req, res, next) => {
  try {
    const parsed = LectureImportPayloadSchema.parse(req.body);

    // Validate subjectId exists
    const subject = await prisma.subject.findUnique({ where: { id: parsed.subjectId }, select: { id: true } });
    if (!subject) {
      const available = await prisma.subject.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } });
      return res.status(400).json({
        error: `Unbekannte subjectId: ${parsed.subjectId}`,
        message: `Erlaubte IDs: ${available.map(s => `${s.id} (${s.name})`).join(', ')}`,
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const createdCards = await Promise.all(
        parsed.lectureCards.map((card) =>
          tx.lectureCard.create({
            data: {
              subjectId: parsed.subjectId,
              front: card.front,
              back: card.back,
              lectureTag: card.lectureTag ?? parsed.lectureTag ?? null,
            },
          })
        )
      );

      const createdSummaries = await Promise.all(
        parsed.lectureSummaries.map((s) =>
          tx.lectureSummary.create({
            data: {
              subjectId: parsed.subjectId,
              title: s.title,
              content: s.content,
              lectureTag: s.lectureTag ?? parsed.lectureTag ?? null,
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
