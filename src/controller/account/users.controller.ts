import { Request, Response } from 'express';

import { User } from '../../models/user';

export const usersHandler = async (_req: Request, res: Response) => {
  try {
    const users = await User.find();

    if (!users) throw new Error('No users found');

    res.status(200).json({
      users,
    });
  } catch (err) {
    res
      .status(400)
      .json({ message: 'No users records in collection', data: null });
  }
};
