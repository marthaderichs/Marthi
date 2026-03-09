import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const studyplanRouter = Router();

// GET /api/studyplan?from=2026-03-01&to=2026-03-31
studyplanRouter.get('/', async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const where: any = {};
    if (from && to) {
      where.date = { gte: String(from), lte: String(to) };
    }
    const items = await prisma.studyPlanItem.findMany({
      where,
      orderBy: [{ date: 'asc' }, { createdAt: 'asc' }],
    });
    res.json(items);
  } catch (error) { next(error); }
});

// POST /api/studyplan
studyplanRouter.post('/', async (req, res, next) => {
  try {
    const { date, subjectId, type, durationMin, note } = req.body;
    const item = await prisma.studyPlanItem.create({
      data: { date, subjectId, type, durationMin: durationMin || 30, note: note || null },
    });
    res.status(201).json(item);
  } catch (error) { next(error); }
});

// PATCH /api/studyplan/:id  (toggle completed)
studyplanRouter.patch('/:id', async (req, res, next) => {
  try {
    const { completed } = req.body;
    const item = await prisma.studyPlanItem.update({
      where: { id: req.params.id },
      data: { completed },
    });
    res.json(item);
  } catch (error) { next(error); }
});

// DELETE /api/studyplan/:id
studyplanRouter.delete('/:id', async (req, res, next) => {
  try {
    await prisma.studyPlanItem.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (error) { next(error); }
});
