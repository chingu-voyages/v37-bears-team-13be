import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

import { User } from '../../models';
import { PasswordManager } from '../../util/hash/index';
import customError from '../../util/customError';

export const loginHandler = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    // Find User in Database
    const user = await User.findOne({ username });
    if (!user) throw customError(401);

    const passwordCorrect = await PasswordManager.compare(
      user.password,
      password
    );
    // Return error is user does not exist or password is incorrect
    if (!passwordCorrect) throw customError(401);
    // username & password are correct
    // create a jwt
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      process.env.JWT_KEY!,
      { expiresIn: 60 * 60 }
    );
    res
      .status(200)
      .cookie('access_token', userJwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      })
      .json(user);
  } catch (err: any) {
    res.status(err.status).json({
      message: err.message,
    });
  }
};
