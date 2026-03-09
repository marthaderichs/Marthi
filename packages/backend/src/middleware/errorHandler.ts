import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const name = (err as any)?.name ?? 'Error';
  const message = String((err as any)?.message ?? 'Unknown error');

  process.stderr.write(`❌ ${name}: ${message}\n`);

  if (name === 'ZodError') {
    const issues = (err as any)?.errors ?? [];
    return res.status(400).json({
      error: 'Validierungsfehler',
      details: issues.map((e: any) => ({
        path: (e.path ?? []).join('.'),
        message: e.message,
      })),
    });
  }

  if (name === 'PrismaClientKnownRequestError') {
    return res.status(400).json({ error: 'Datenbankfehler', message });
  }

  res.status(500).json({
    error: 'Interner Serverfehler',
    message: process.env.NODE_ENV === 'development' ? message : undefined,
  });
}
