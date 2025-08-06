import { Router } from 'express';
import { register, login, forgotPassword, resetPassword } from '../controllers/AuthController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword/:token", resetPassword)

export default router;
