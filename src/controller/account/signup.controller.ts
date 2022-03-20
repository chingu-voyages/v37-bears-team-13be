import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { User, UserDoc } from '../../models';
import { findUser } from '../../service/user.service';

export const signupUserHandler = async (req: Request, res: Response) => {
  try {
    // Check if user exists in db.
    await findUser({ username: req.body.username });

    // Create user and save them to db.
    const user: UserDoc = User.build({ ...req.body });
    await user.save();

    // Create a JWT.
    if (!process.env.JWT_KEY)
      throw new Error('Missing JWT_KEY, please add it to your .env file');

    const userJwt = jwt.sign({ ...user }, process.env.JWT_KEY);

    // Send back response with a cookie.
    res
      .cookie('access_token', userJwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      })
      .status(201)
      .json(user);
  } catch (err: any) {
    const msg = 'Something went wrong saving to database';
    console.error(`${msg}: ${(err as Error).message}`);
    res.status(err.status).json({ message: err.message });
  }
};
