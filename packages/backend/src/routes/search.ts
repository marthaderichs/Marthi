import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const searchRouter = Router();

// GET /api/search?q=...
searchRouter.get('/', async (req, res, next) => {
  try {
    const q = String(req.query.q || '').trim();
    if (q.length < 2) return res.json({ topics: [], questions: [], flashcards: [] });

    const [topics, questions, flashcards] = await Promise.all([
      prisma.topic.findMany({
        where: { OR: [{ title: { contains: q } }, { content: { contains: q } }] },
        include: { subject: { select: { name: true, color: true, id: true } } },
        take: 8,
        orderBy: { title: 'asc' },
      }),
      prisma.question.findMany({
        where: { OR: [{ text: { contains: q } }, { explanation: { contains: q } }] },
        include: { subject: { select: { name: true, color: true, id: true } } },
        take: 8,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.flashcard.findMany({
        where: { OR: [{ front: { contains: q } }, { back: { contains: q } }] },
        include: { subject: { select: { name: true, color: true, id: true } } },
        take: 8,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    res.json({ topics, questions, flashcards });
  } catch (error) { next(error); }
});
