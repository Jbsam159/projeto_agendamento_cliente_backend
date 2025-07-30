import { Router } from 'express';
import {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
} from '../controllers/ClientController';
import { validateClient } from "../middlewares/validateClient"
const router = Router();

router.get('/getclientes', getAllClients);
router.get('/getcliente/:id', getClientById);
router.post('/addcliente', validateClient, createClient);
router.put('/updatecliente/:id', validateClient, updateClient);
router.delete('/deletecliente/:id', deleteClient);

export default router;
