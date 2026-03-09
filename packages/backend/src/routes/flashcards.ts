import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { FlashcardCreateSchema, FlashcardReviewSchema } from '@medilearn/shared';

const prisma = new PrismaClient();
export const flashcardsRouter = Router();

// GET /api/flashcards?subjectId=...
flashcardsRouter.get('/', async (req, res, next) => {
  try {
    const { subjectId } = req.query;
    const flashcards = await prisma.flashcard.findMany({
      where: subjectId ? { subjectId: String(subjectId) } : {},
    });
    res.json(flashcards);
  } catch (error) {
    next(error);
  }
});

// GET /api/flashcards/due?subjectId=...
flashcardsRouter.get('/due', async (req, res, next) => {
  try {
    const { subjectId } = req.query;
    const dueCards = await prisma.flashcard.findMany({
      where: {
        ...(subjectId ? { subjectId: String(subjectId) } : {}),
        nextReview: { lte: new Date() },
      },
      orderBy: { nextReview: 'asc' },
    });
    res.json(dueCards);
  } catch (error) {
    next(error);
  }
});

// POST /api/flashcards
flashcardsRouter.post('/', async (req, res, next) => {
  try {
    const data = FlashcardCreateSchema.parse(req.body);
    const flashcard = await prisma.flashcard.create({ data });
    res.status(201).json(flashcard);
  } catch (error) {
    next(error);
  }
});

// POST /api/flashcards/:id/review
flashcardsRouter.post('/:id/review', async (req, res, next) => {
  try {
    const { quality } = FlashcardReviewSchema.parse(req.body);
    const flashcard = await prisma.flashcard.findUnique({
      where: { id: req.params.id },
    });

    if (!flashcard) return res.status(404).json({ error: 'Flashcard not found' });

    // SM-2 Algorithm
    let { easeFactor, interval, repetitions } = flashcard;

    if (quality >= 3) {
      if (repetitions === 0) {
        interval = 1;
      } else if (repetitions === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      repetitions += 1;
    } else {
      repetitions = 0;
      interval = 1;
    }

    easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + interval);

    const updated = await prisma.flashcard.update({
      where: { id: req.params.id },
      data: {
        easeFactor,
        interval,
        repetitions,
        nextReview,
        lastReview: new Date(),
      },
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/flashcards/:id
flashcardsRouter.delete('/:id', async (req, res, next) => {
  try {
    await prisma.flashcard.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});
