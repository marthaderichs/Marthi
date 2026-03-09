import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { ImportPayloadSchema } from '@medilearn/shared';

const prisma = new PrismaClient();
export const importRouter = Router();

// GET /api/import/template - erlaubte Subject-IDs + Beispiel-Format
importRouter.get('/template', async (_req, res, next) => {
  try {
    const subjects = await prisma.subject.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });

    res.json({
      allowedSubjectIds: subjects,
      examplePayload: {
        topics: [
          {
            subjectId: subjects[0]?.id || 'cardio',
            title: 'Beispiel-Topic',
            content: 'Inhalt hier...',
          },
        ],
        questions: [
          {
            subjectId: subjects[0]?.id || 'cardio',
            text: 'Was ist die häufigste Ursache für...?',
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctAnswerIndex: 0,
            explanation: 'Erklärung hier...',
          },
        ],
        flashcards: [
          {
            subjectId: subjects[0]?.id || 'cardio',
            front: 'Was ist...?',
            back: 'Die Antwort ist...',
          },
        ],
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/import
importRouter.post('/', async (req, res, next) => {
  try {
    const parsed = ImportPayloadSchema.parse(req.body);

    const result = await prisma.$transaction(async (tx) => {
      // Upsert Topics (create or update if ID already exists)
      const createdTopics = await Promise.all(
        parsed.topics.map((topic) => {
          const data = { subjectId: topic.subjectId, title: topic.title, content: topic.content };
          if (topic.id) {
            return tx.topic.upsert({
              where: { id: topic.id },
              create: { id: topic.id, ...data },
              update: data,
            });
          }
          return tx.topic.create({ data });
        })
      );

      const topicIdMap = new Map<string, string>();
      parsed.topics.forEach((original, i) => {
        if (original.id) topicIdMap.set(original.id, createdTopics[i].id);
      });

      // Create Questions
      const createdQuestions = await Promise.all(
        parsed.questions.map((q) => {
          const resolvedTopicId = q.topicId ? topicIdMap.get(q.topicId) || q.topicId : null;
          return tx.question.create({
            data: {
              subjectId: q.subjectId,
              topicId: resolvedTopicId,
              text: q.text,
              options: JSON.stringify(q.options),
              correctAnswerIndex: q.correctAnswerIndex,
              explanation: q.explanation,
            },
          });
        })
      );

      // Create Flashcards
      const createdFlashcards = await Promise.all(
        parsed.flashcards.map((fc) => {
          const resolvedTopicId = fc.topicId ? topicIdMap.get(fc.topicId) || fc.topicId : null;
          return tx.flashcard.create({
            data: {
              subjectId: fc.subjectId,
              topicId: resolvedTopicId,
              front: fc.front,
              back: fc.back,
            },
          });
        })
      );

      return {
        topics: createdTopics.length,
        questions: createdQuestions.length,
        flashcards: createdFlashcards.length,
      };
    });

    res.status(201).json({ message: 'Import successful', created: result });
  } catch (error) {
    next(error);
  }
});
