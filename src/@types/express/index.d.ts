/// <reference types="express" />
import { CustomJwtPayload } from "../express/customJwtPayload";

declare global {
  namespace Express {
    interface Request {
      client?: CustomJwtPayload;
    }
  }
}

export {}