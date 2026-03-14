import { Router } from 'express';
import {
  getUsers,
  getUserById,
  getCurrentUser,
  updateProfile,
  updateAvatar
} from '../controllers/users';

const router = Router();

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', getUserById);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

export default router;
