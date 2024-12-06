import express from 'express';
import { getUsers, getUserById, updateUser } from '../controllers/users';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/', authMiddleware, getUsers);
router.get('/:id', authMiddleware, getUserById);
router.put('/:id', authMiddleware, updateUser);

export { router };