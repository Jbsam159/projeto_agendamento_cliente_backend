import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req: Request, res: Response) => {
  const { name, email, password, phone, notes } = req.body;

  try {
    const existingUser = await prisma.client.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "E-mail já está em uso" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newClient = await prisma.client.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        notes,
      },
    });

    res.status(201).json({ message: "Cliente registrado com sucesso", client: newClient });
  } catch (error) {
    res.status(500).json({ message: "Erro ao registrar cliente", error });
  }
};

export const login = async (req: Request, res: Response) => {

  const { email, password } = req.body;

  try {
    
    const client = await prisma.client.findUnique({ where: { email } });

    if (!client) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const passwordMatch = await bcrypt.compare(password, client.password);

    console.log("Senha digitada:", password);
    console.log("Senha do banco:", client.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Senha incorreta" });
    }

    const token = jwt.sign({ clientId: client.id }, JWT_SECRET as string, { expiresIn: "1d" });

    res.status(200).json({ message: "Login bem-sucedido", token, client });
  } catch (error) {
    res.status(500).json({ message: "Erro ao fazer login", error });
  }
};
