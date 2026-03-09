import { z } from 'zod';

export const SubjectIdSchema = z.string().min(1).max(50);

export const TopicCreateSchema = z.object({
  id: z.string().min(1).optional(),
  subjectId: SubjectIdSchema,
  title: z.string().min(1).max(500),
  content: z.string().min(1),
});

export const QuestionCreateSchema = z.object({
  id: z.string().min(1).optional(),
  subjectId: SubjectIdSchema,
  topicId: z.string().min(1).nullable().optional(),
  text: z.string().min(1),
  options: z.array(z.string().min(1)).min(2).max(10),
  correctAnswerIndex: z.number().int().min(0),
  explanation: z.string().min(1),
}).refine(
  (data) => data.correctAnswerIndex < data.options.length,
  { message: 'correctAnswerIndex must be less than options.length' }
);

export const FlashcardCreateSchema = z.object({
  id: z.string().min(1).optional(),
  subjectId: SubjectIdSchema,
  topicId: z.string().min(1).nullable().optional(),
  front: z.string().min(1),
  back: z.string().min(1),
});

export const ImportPayloadSchema = z.object({
  topics: z.array(TopicCreateSchema).default([]),
  questions: z.array(QuestionCreateSchema).default([]),
  flashcards: z.array(FlashcardCreateSchema).default([]),
});

export const ExamAnswerSchema = z.object({
  questionId: z.string().uuid(),
  selectedIndex: z.number().int().min(0),
});

export const ExamSubmitSchema = z.object({
  subjectId: SubjectIdSchema,
  answers: z.array(ExamAnswerSchema).min(1),
});

export const FlashcardReviewSchema = z.object({
  quality: z.number().int().min(0).max(5),
});

export type TopicCreate = z.infer<typeof TopicCreateSchema>;
export type QuestionCreate = z.infer<typeof QuestionCreateSchema>;
export type FlashcardCreate = z.infer<typeof FlashcardCreateSchema>;
export type ImportPayload = z.infer<typeof ImportPayloadSchema>;
export type ExamSubmit = z.infer<typeof ExamSubmitSchema>;
export type FlashcardReview = z.infer<typeof FlashcardReviewSchema>;
