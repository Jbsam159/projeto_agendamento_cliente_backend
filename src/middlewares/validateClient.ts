import { Request, Response, NextFunction } from 'express';
import { clientSchema } from '../schemas/clientSchema';

export function validateClient(req: Request, res: Response, next: NextFunction) {
  const result = clientSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: 'Erro de validação',
      details: result.error?.issues?.map((e) => ({
        field: e.path[0],
        message: e.message,
      })) || [],
    });
  }

  next();
}
