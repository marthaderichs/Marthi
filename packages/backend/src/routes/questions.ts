import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { QuestionCreateSchema } from '@medilearn/shared';

const prisma = new PrismaClient();
export const questionsRouter = Router();

// GET /api/questions?subjectId=...
questionsRouter.get('/', async (req, res, next) => {
  try {
    const { subjectId } = req.query;
    const questions = await prisma.question.findMany({
      where: subjectId ? { subjectId: String(subjectId) } : {},
    });
    // Parse options JSON
    res.json(questions.map(q => ({ ...q, options: JSON.parse(q.options) })));
  } catch (error) {
    next(error);
  }
});

// GET /api/questions/:id
questionsRouter.get('/:id', async (req, res, next) => {
  try {
    const question = await prisma.question.findUnique({
      where: { id: req.params.id },
    });
    if (!question) return res.status(404).json({ error: 'Question not found' });
    res.json({ ...question, options: JSON.parse(question.options) });
  } catch (error) {
    next(error);
  }
});

// POST /api/questions
questionsRouter.post('/', async (req, res, next) => {
  try {
    const data = QuestionCreateSchema.parse(req.body);
    const question = await prisma.question.create({
      data: {
        ...data,
        options: JSON.stringify(data.options),
      },
    });
    res.status(201).json({ ...question, options: JSON.parse(question.options) });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/questions/:id
questionsRouter.delete('/:id', async (req, res, next) => {
  try {
    await prisma.question.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});
