// src/routes/appointmentRoutes.ts
import { Router } from 'express';
import { checkAvailability, createAppointment, deleteAppointment, getAppointmentsByClient, getAppointmentsByDate, updateAppointment } from '../controllers/AppointmentController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.post('/addappointments', authenticateToken, createAppointment);
router.get('/getappointmentsbydate', authenticateToken, getAppointmentsByDate);
router.get("/getappointmentsbyclient/:clientId", authenticateToken, getAppointmentsByClient);
router.put("/updateappointmentbyid/:appointmentId", authenticateToken, updateAppointment);
router.delete("/deleteappointmentbyid/:id", authenticateToken, deleteAppointment);
router.post("/checkavailability", authenticateToken, checkAvailability);

export default router;
