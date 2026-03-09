import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const notesRouter = Router();

// GET /api/notes
notesRouter.get('/', async (req, res, next) => {
  try {
    const notes = await prisma.note.findMany({ orderBy: { updatedAt: 'desc' } });
    res.json(notes);
  } catch (error) { next(error); }
});

// POST /api/notes
notesRouter.post('/', async (req, res, next) => {
  try {
    const { title, content, subjectId, topicId } = req.body;
    const note = await prisma.note.create({ data: { title: title || 'Neue Notiz', content: content || '', subjectId: subjectId || null, topicId: topicId || null } });
    res.status(201).json(note);
  } catch (error) { next(error); }
});

// PUT /api/notes/:id
notesRouter.put('/:id', async (req, res, next) => {
  try {
    const { title, content, subjectId } = req.body;
    const note = await prisma.note.update({ where: { id: req.params.id }, data: { title, content, subjectId: subjectId || null } });
    res.json(note);
  } catch (error) { next(error); }
});

// DELETE /api/notes/:id
notesRouter.delete('/:id', async (req, res, next) => {
  try {
    await prisma.note.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (error) { next(error); }
});
