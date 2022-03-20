import { Request, Response } from 'express';

import { findAllUsers } from '../../service/user.service';

export const getAllUsersHandler = async (_req: Request, res: Response) => {
  try {
    const users = await findAllUsers();

    if (!users) throw new Error('No users found');

    res.status(200).json({
      users,
    });
  } catch (err: any) {
    res.status(err.status).json({ message: err.message, data: null });
  }
};
