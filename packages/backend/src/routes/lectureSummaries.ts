import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const lectureSummariesRouter = Router();

// GET /api/lecture-summaries?subjectId=...&lectureTag=...
lectureSummariesRouter.get('/', async (req, res, next) => {
  try {
    const { subjectId, lectureTag } = req.query;
    const summaries = await prisma.lectureSummary.findMany({
      where: {
        ...(subjectId ? { subjectId: String(subjectId) } : {}),
        ...(lectureTag ? { lectureTag: String(lectureTag) } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(summaries);
  } catch (error) {
    next(error);
  }
});

// GET /api/lecture-summaries/:id
lectureSummariesRouter.get('/:id', async (req, res, next) => {
  try {
    const summary = await prisma.lectureSummary.findUnique({ where: { id: req.params.id } });
    if (!summary) return res.status(404).json({ error: 'LectureSummary not found' });
    res.json(summary);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/lecture-summaries/:id
lectureSummariesRouter.delete('/:id', async (req, res, next) => {
  try {
    await prisma.lectureSummary.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});
