import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const subjectsRouter = Router();

// GET /api/subjects - All subjects with counts and progress
subjectsRouter.get('/', async (_req, res, next) => {
  try {
    const subjects = await prisma.subject.findMany({
      include: {
        _count: {
          select: {
            topics: true,
            questions: true,
            flashcards: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    const subjectsWithProgress = await Promise.all(subjects.map(async (s) => {
      // Get unique questions answered correctly for this subject
      const correctQuestionsCount = await prisma.examResult.count({
        where: {
          wasCorrect: true,
          question: {
            subjectId: s.id
          }
        },
      });

      const progress = s._count.questions > 0
        ? Math.min(100, Math.round((correctQuestionsCount / s._count.questions) * 100))
        : 0;

      const learnedFlashcards = await prisma.flashcard.count({
        where: { subjectId: s.id, repetitions: { gt: 0 } },
      });
      const flashcardProgress = s._count.flashcards > 0
        ? Math.min(100, Math.round((learnedFlashcards / s._count.flashcards) * 100))
        : 0;

      return { ...s, progress, flashcardProgress };
    }));

    res.json(subjectsWithProgress);
  } catch (error) {
    next(error);
  }
});

// GET /api/subjects/:id
subjectsRouter.get('/:id', async (req, res, next) => {
  try {
    const subject = await prisma.subject.findUnique({
      where: { id: req.params.id },
      include: {
        topics: { orderBy: { title: 'asc' } },
        _count: {
          select: { questions: true, flashcards: true },
        },
      },
    });

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    res.json(subject);
  } catch (error) {
    next(error);
  }
});
