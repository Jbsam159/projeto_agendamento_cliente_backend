import {Router} from "express";
import { getAllAppointments } from "../controllers/AppointmentController";
import { authenticateToken } from "../middlewares/authMiddleware";
import { isAdmin } from "../middlewares/isAdmin";

const router = Router()

router.get("/checkadmin", authenticateToken, isAdmin, getAllAppointments)

export default router