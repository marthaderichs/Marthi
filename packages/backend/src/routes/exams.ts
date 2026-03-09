import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { ExamSubmitSchema } from '@medilearn/shared';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();
export const examsRouter = Router();

// GET /api/exams/generate?subjectId=...&count=...&topicIds=...&onlyNew=...
examsRouter.get('/generate', async (req, res, next) => {
  try {
    const subjectId = req.query.subjectId as string;
    const count = parseInt(req.query.count as string) || 20;
    const topicIds = req.query.topicIds as string;
    const onlyNew = req.query.onlyNew === 'true';

    if (!subjectId) return res.status(400).json({ error: 'subjectId is required' });

    const where: any = { subjectId };
    
    if (topicIds && topicIds.trim() !== '') {
      where.topicId = { in: topicIds.split(',') };
    }

    if (onlyNew) {
      // Get IDs of questions already answered
      const answeredResults = await prisma.examResult.findMany({
        select: { questionId: true },
        distinct: ['questionId']
      });
      const answeredIds = answeredResults.map(r => r.questionId);
      where.id = { notIn: answeredIds };
    }

    const allQuestions = await prisma.question.findMany({ where });
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));

    res.json({
      sessionId: uuidv4(),
      subjectId,
      questions: selected.map(q => ({ ...q, options: JSON.parse(q.options) })),
      totalAvailable: allQuestions.length,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/exams/submit
examsRouter.post('/submit', async (req, res, next) => {
  try {
    const parsed = ExamSubmitSchema.parse(req.body);
    const sessionId = uuidv4();
    let correctCount = 0;

    const questionIds = parsed.answers.map(a => a.questionId);
    const questions = await prisma.question.findMany({ where: { id: { in: questionIds } } });
    const questionMap = new Map(questions.map(q => [q.id, q]));

    const results = parsed.answers.map(answer => {
      const question = questionMap.get(answer.questionId);
      const wasCorrect = question ? answer.selectedIndex === question.correctAnswerIndex : false;
      if (wasCorrect) correctCount++;
      return {
        questionId: answer.questionId,
        selectedIndex: answer.selectedIndex,
        wasCorrect,
        examSessionId: sessionId,
      };
    });

    await prisma.examResult.createMany({ data: results });

    const session = await prisma.examSession.create({
      data: {
        id: sessionId,
        subjectId: parsed.subjectId,
        totalQuestions: parsed.answers.length,
        correctAnswers: correctCount,
        percentage: (correctCount / parsed.answers.length) * 100,
      },
    });

    res.json(session);
  } catch (error) {
    next(error);
  }
});

// GET /api/exams/history?subjectId=...
examsRouter.get('/history', async (req, res, next) => {
  try {
    const subjectId = req.query.subjectId as string;
    const sessions = await prisma.examSession.findMany({
      where: subjectId ? { subjectId } : {},
      orderBy: { completedAt: 'desc' },
      take: 50,
    });
    res.json(sessions);
  } catch (error) {
    next(error);
  }
});
