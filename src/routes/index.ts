import { Router } from 'express';
import userRouter from './users';
import cardRouter from './cards';
import auth from '../middlewares/auth';
import { createUser, login } from '../controllers/users';
import { validateSignup, validateSignin } from '../middlewares/validation';

const router = Router();

// Публичные роуты
router.post('/signin', validateSignin, login);
router.post('/signup', validateSignup, createUser);

// Защищенные роуты
router.use(auth);
router.use('/users', userRouter);
router.use('/cards', cardRouter);

export default router;
