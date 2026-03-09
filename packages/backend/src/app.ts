import express from 'express';
import cors from 'cors';
import path from 'path';
import { subjectsRouter } from './routes/subjects';
import { topicsRouter } from './routes/topics';
import { questionsRouter } from './routes/questions';
import { flashcardsRouter } from './routes/flashcards';
import { examsRouter } from './routes/exams';
import { importRouter } from './routes/import';
import { notesRouter } from './routes/notes';
import { studyplanRouter } from './routes/studyplan';
import { searchRouter } from './routes/search';
import { errorHandler } from './middleware/errorHandler';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));

  // Health Check
  app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

  // Routes
  app.use('/api/subjects', subjectsRouter);
  app.use('/api/topics', topicsRouter);
  app.use('/api/questions', questionsRouter);
  app.use('/api/flashcards', flashcardsRouter);
  app.use('/api/exams', examsRouter);
  app.use('/api/import', importRouter);
  app.use('/api/notes', notesRouter);
  app.use('/api/studyplan', studyplanRouter);
  app.use('/api/search', searchRouter);

  // Serve frontend in production
  if (process.env.NODE_ENV === 'production') {
    const frontendDist = path.join(__dirname, '../../frontend/dist');
    app.use(express.static(frontendDist));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(frontendDist, 'index.html'));
    });
  }

  // Global Error Handler
  app.use(errorHandler);

  return app;
}
