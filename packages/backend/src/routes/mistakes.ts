import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const mistakesRouter = Router();

// GET /api/mistakes
mistakesRouter.get('/', async (_req, res, next) => {
  try {
    const mistakes = await prisma.mistake.findMany({ orderBy: { addedAt: 'desc' } });
    res.json(mistakes);
  } catch (error) {
    next(error);
  }
});

// POST /api/mistakes
mistakesRouter.post('/', async (req, res, next) => {
  try {
    const { id, subjectId, text, options, correctAnswerIndex, explanation } = req.body;
    const mistake = await prisma.mistake.upsert({
      where: { id },
      update: {},
      create: {
        id,
        subjectId,
        text,
        options: typeof options === 'string' ? options : JSON.stringify(options),
        correctAnswerIndex,
        explanation,
      },
    });
    res.status(201).json(mistake);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/mistakes/:id/master
mistakesRouter.patch('/:id/master', async (req, res, next) => {
  try {
    const { id } = req.params;
    const mistake = await prisma.mistake.findUnique({ where: { id } });
    if (!mistake) { res.status(404).json({ error: 'Not found' }); return; }

    if (mistake.masteredCount + 1 >= 2) {
      await prisma.mistake.delete({ where: { id } });
      res.status(204).end();
    } else {
      const updated = await prisma.mistake.update({
        where: { id },
        data: { masteredCount: { increment: 1 } },
      });
      res.json(updated);
    }
  } catch (error) {
    next(error);
  }
});

// DELETE /api/mistakes/:id
mistakesRouter.delete('/:id', async (req, res, next) => {
  try {
    await prisma.mistake.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});
