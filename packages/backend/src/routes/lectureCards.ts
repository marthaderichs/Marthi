import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { LectureCardReviewSchema } from '@medilearn/shared';

const prisma = new PrismaClient();
export const lectureCardsRouter = Router();

// GET /api/lecture-cards?lectureTag=...
lectureCardsRouter.get('/', async (req, res, next) => {
  try {
    const { lectureTag } = req.query;
    const cards = await prisma.lectureCard.findMany({
      where: lectureTag ? { lectureTag: String(lectureTag) } : {},
      orderBy: { createdAt: 'desc' },
    });
    res.json(cards);
  } catch (error) {
    next(error);
  }
});

// GET /api/lecture-cards/due?lectureTag=...
lectureCardsRouter.get('/due', async (req, res, next) => {
  try {
    const { lectureTag } = req.query;
    const cards = await prisma.lectureCard.findMany({
      where: {
        ...(lectureTag ? { lectureTag: String(lectureTag) } : {}),
        nextReview: { lte: new Date() },
      },
      orderBy: { nextReview: 'asc' },
    });
    res.json(cards);
  } catch (error) {
    next(error);
  }
});

// POST /api/lecture-cards/:id/review
lectureCardsRouter.post('/:id/review', async (req, res, next) => {
  try {
    const { quality } = LectureCardReviewSchema.parse(req.body);
    const card = await prisma.lectureCard.findUnique({ where: { id: req.params.id } });

    if (!card) return res.status(404).json({ error: 'LectureCard not found' });

    // SM-2 Algorithm
    let { easeFactor, interval, repetitions } = card;

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

    const updated = await prisma.lectureCard.update({
      where: { id: req.params.id },
      data: { easeFactor, interval, repetitions, nextReview, lastReview: new Date() },
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/lecture-cards/:id
lectureCardsRouter.delete('/:id', async (req, res, next) => {
  try {
    await prisma.lectureCard.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});
