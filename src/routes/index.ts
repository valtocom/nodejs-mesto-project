import { Router } from 'express';
import userRouter from './users';
import cardRouter from './cards';
import auth from '../middlewares/auth';
import { createUser, login } from '../controllers/users';

const router = Router();

// Публичные роуты
router.post('/signin', login);
router.post('/signup', createUser);

// Защищенные роуты
router.use(auth);
router.use('/users', userRouter);
router.use('/cards', cardRouter);

export default router;
