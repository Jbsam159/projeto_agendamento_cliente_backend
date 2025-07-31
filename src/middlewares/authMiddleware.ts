import jwt, { JwtPayload} from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';


export const authenticateToken = (req:Request,res:Response,next:NextFunction) =>{

  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if(!token) return res.status(401).json({message:"Token não fornecido"});

  try{

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    (req as any).client = decoded;
    next();

  }catch(error){

    return res.status(403).json({message:"Token Inválido ou Expirado"})

  }

}
