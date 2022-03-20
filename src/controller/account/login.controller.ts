import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

import { findUser } from '../../service/user.service';

export const loginUserHandler = async (req: Request, res: Response) => {
  try {
    // Find User in Database
    const user = await findUser(req.body);

    if (!process.env.JWT_KEY)
      throw new Error('Missing JWT_KEY, please add it in your .env file');

    // username & password are correct
    // create a jwt
    const userJwt = jwt.sign({ ...user }, process.env.JWT_KEY, {
      expiresIn: 60 * 60,
    });
    res
      .status(200)
      .cookie('access_token', userJwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      })
      .json(user);
  } catch (err: any) {
    res.status(409).json({
      message: err.message,
    });
  }
};
