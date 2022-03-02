import express, { Response } from 'express';
import { User } from '../models/user';

const router = express.Router();

router.get('/api/v1/users/', async (_, res: Response) => {
  const getUsers = await User.find();

  res.status(200).json({
    getUsers,
  });
});

export { router as usersRouter };
