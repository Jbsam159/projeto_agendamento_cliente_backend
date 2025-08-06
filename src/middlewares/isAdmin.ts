import { Request, Response, NextFunction } from "express";
import { CustomJwtPayload } from "../@types/express/customJwtPayload";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const client = (req as any).client as CustomJwtPayload;

  if (!client || !client.isAdmin) {
    return res.status(403).json({ error: "Acesso negado. Somente administradores." });
  }

  next();
};
