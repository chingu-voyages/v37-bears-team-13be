import { Request, Response } from 'express';

import { User } from '../../models/user';

export const usersHandler = async (_req: Request, res: Response) => {
  try {
    const users = await User.find();

    if (!users) throw new Error('No users found');

    res.status(200).json({
      users,
    });
  } catch (err: any) {
    res.status(err.status).json({ message: err.message, data: null });
  }
};
