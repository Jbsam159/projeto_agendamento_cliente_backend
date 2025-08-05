import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import ClientRoutes from './routes/ClientRoutes';
import AuthRoutes from './routes/authRoutes';
import AppointmentRoutes from "./routes/AppointmentRoutes"

import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use('/api', ClientRoutes);
app.use('/auth', AuthRoutes);
app.use("/api", AppointmentRoutes)

// Rota teste
app.get('/', (req, res) => {
  res.send('API de Agendamento rodando!');
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
