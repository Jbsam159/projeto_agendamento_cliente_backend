import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllClients = async (req: Request, res: Response) => {
  try {
    const clients = await prisma.client.findMany();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar clientes' });
  }
};

export const getClientById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const client = await prisma.client.findUnique({ where: { id } });
    if (!client) return res.status(404).json({ error: 'Cliente não encontrado' });
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar cliente' });
  }
};

export const createClient = async (req: Request, res: Response) => {
  const { name, email, password, phone, notes } = req.body;
  try {
    const newClient = await prisma.client.create({
      data: { name, email, password, phone, notes },
    });
    res.status(201).json(newClient);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar cliente' });
  }
};

export const updateClient = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name, email, password, phone, notes } = req.body;
  try {
    const updatedClient = await prisma.client.update({
      where: { id },
      data: { name, email, password, phone, notes },
    });
    res.json(updatedClient);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar cliente' });
  }
};

export const deleteClient = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    await prisma.client.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar cliente' });
  }
};
