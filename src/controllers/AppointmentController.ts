// src/controllers/appointmentController.ts
import { Request, Response } from 'express';
import { prisma } from '../lib/prisma'; // ajuste o caminho conforme seu projeto

export const getAllAppointments = async (req: Request, res: Response) => {

  try {
    
    const appointments = await prisma.appointment.findMany({

      include: {

        client: true

      },

    })

    return res.status(200).json(appointments)

  } catch (error) {
    
    console.error(error);
    return res.status(500).json({ error: 'Erro ao buscar agendamentos.' });

  }

}

export const createAppointment = async (req: Request, res: Response) => {
  const { clientId, datetime, description } = req.body;

  try {
    const appointment = await prisma.appointment.create({
      data: {
        clientId,
        datetime: new Date(datetime),
        description,
      },
    });

    return res.status(201).json(appointment);
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    return res.status(500).json({ message: "Erro ao criar agendamento" });
  }
};

export const getAppointmentsByClient = async (req: Request, res: Response) =>{

  const {clientId} = req.params

  try{

    const appointments = await prisma.appointment.findMany({

      where:{
        clientId: parseInt(clientId)
      },
      orderBy: {
        datetime: 'asc'
      }

    })

    res.status(200).json(appointments)

  }catch(error){

    res.status(500).json({error:"Erro ao buscar agendametnos do cliente."})

  }

}

export const updateAppointment = async (req: Request, res: Response) => {

  const {appointmentId} = req.params
  const {datetime,description,status} = req.body

  try {
    
    const updateAppointment = await prisma.appointment.update({

      where: {

        id: parseInt(appointmentId)

      },
      data: {

        datetime: new Date(datetime),
        description,
        status

      }

    })

    res.status(200).json(updateAppointment)

  } catch (error) {
    
    res.status(500).json({ error: 'Erro ao atualizar o agendamento.' });

  }

}

export const deleteAppointment = async (req: Request, res: Response) =>{

  const {id} = req.params

  try{

    await prisma.appointment.delete({

      where: {

        id: parseInt(id)

      }

    })

    res.status(200).json({message:"Agendamento Cancelado Com Sucesso"})

  }catch(error){

    res.status(500).json({ error: 'Erro ao cancelar o agendamento.' });

  }

}

export const checkAvailability = async (req: Request, res: Response) => {

  const {date} = req.body

  try {
    
    const existing = await prisma.appointment.findFirst({

      where: {

        datetime: new Date(date)

      }

    })

    if(existing){

      return res.status(200).json({available: false, message: "Horário já agendado."})

    }

    res.status(200).json({available: true, message: "Horário Disponível"})

  } catch (error) {
    
    res.status(500).json({error: "Error ao verificar disponibilidade"})

  }

}

export const getAppointmentsByDate = async (req: Request, res: Response) => {
  const { date } = req.query;

  try {
    if (!date || typeof date !== 'string') {
      return res.status(400).json({ message: "Parâmetro 'date' é obrigatório (formato: YYYY-MM-DD)" });
    }

    // Monta intervalo UTC para o dia inteiro
    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);

    const appointments = await prisma.appointment.findMany({
      where: {
        datetime: {
          gte: startOfDay,
          lte: endOfDay,
        }
      },
      include: {
        client: true, // traz dados do cliente junto
      }
    });

    return res.status(200).json(appointments);
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    return res.status(500).json({ message: "Erro ao buscar agendamentos" });
  }
};

