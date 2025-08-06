import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import crypto from "crypto";
import nodemailer from "nodemailer";

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req: Request, res: Response) => {
  const { name, email, password, phone, notes, isAdmin } = req.body;

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
        isAdmin
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

    const token = jwt.sign({ clientId: client.id, isAdmin: client.isAdmin }, JWT_SECRET as string, { expiresIn: "1d" });

    res.status(200).json({ message: "Login bem-sucedido", token, client });
  } catch (error) {
    res.status(500).json({ message: "Erro ao fazer login", error });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {

  const {email} = req.body;

  try {
    
    const client = await prisma.client.findUnique({where: {email}})

    if(!client){
      return res.status(404).json({Message:"Usuário Não Encontrado"})
    }

    const token = crypto.randomBytes(32).toString("hex")
    const expiration = new Date(Date.now() + 3600000)

    await prisma.client.update({

      where: {id: client.id},
      data: {
        resetPasswordToken: token,
        resetPasswordExpires: expiration
      }

    })

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      to: client.email,
      from: process.env.EMAIL_USER,
      subject: "Redefinição de Senha",
      text: `Clique no link para redefinir sua senha: http://localhost:3000/resetpassword/${token}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "E-mail enviado com sucesso!" });

  } catch (error) {
    
    console.log("Error ao enviar email: ",error)
    res.status(500).json({ message: "Erro ao enviar o e-mail." });

  }

}

export const resetPassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const client = await prisma.client.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { gte: new Date() },
      },
    });

    if (!client) {
      return res.status(400).json({ message: "Token inválido ou expirado." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.client.update({
      where: { id: client.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    res.status(200).json({ message: "Senha redefinida com sucesso!" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao redefinir a senha." });
  }
};

