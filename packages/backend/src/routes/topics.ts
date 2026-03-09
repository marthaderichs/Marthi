import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { TopicCreateSchema } from '@medilearn/shared';

const prisma = new PrismaClient();
export const topicsRouter = Router();

// GET /api/topics?subjectId=...
topicsRouter.get('/', async (req, res, next) => {
  try {
    const { subjectId } = req.query;
    const topics = await prisma.topic.findMany({
      where: subjectId ? { subjectId: String(subjectId) } : {},
      orderBy: { title: 'asc' },
    });
    res.json(topics);
  } catch (error) {
    next(error);
  }
});

// GET /api/topics/:id
topicsRouter.get('/:id', async (req, res, next) => {
  try {
    const topic = await prisma.topic.findUnique({
      where: { id: req.params.id },
      include: {
        questions: true,
      },
    });
    if (!topic) return res.status(404).json({ error: 'Topic not found' });
    res.json(topic);
  } catch (error) {
    next(error);
  }
});

// POST /api/topics
topicsRouter.post('/', async (req, res, next) => {
  try {
    const data = TopicCreateSchema.parse(req.body);
    const topic = await prisma.topic.create({ data });
    res.status(201).json(topic);
  } catch (error) {
    next(error);
  }
});

// PUT /api/topics/:id
topicsRouter.put('/:id', async (req, res, next) => {
  try {
    const { id: _id, ...data } = TopicCreateSchema.parse(req.body);
    const topic = await prisma.topic.update({
      where: { id: req.params.id },
      data,
    });
    res.json(topic);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/topics/:id
topicsRouter.delete('/:id', async (req, res, next) => {
  try {
    await prisma.topic.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});
