/// <reference types="express" />
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      client?: string | JwtPayload;
    }
  }
}

export {}