import { Router } from 'express';
import {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
} from '../controllers/ClientController';
import { validateClient } from "../middlewares/validateClient"
import {authenticateToken} from "../middlewares/authMiddleware"

const router = Router();

router.get('/getclientes', authenticateToken, getAllClients);
router.get('/getcliente/:id', authenticateToken, getClientById);
router.post('/addcliente', authenticateToken, validateClient, createClient);
router.put('/updatecliente/:id', authenticateToken, validateClient, updateClient);
router.delete('/deletecliente/:id', authenticateToken, deleteClient);

export default router;
