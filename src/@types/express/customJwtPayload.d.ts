// src/@types/custom-jwt-payload.d.ts (ou onde preferir)

import { JwtPayload } from "jsonwebtoken";

export interface CustomJwtPayload extends JwtPayload {
  id: number;
  email: string;
  isAdmin: boolean;
}
