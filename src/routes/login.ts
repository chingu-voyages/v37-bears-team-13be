/* eslint-disable no-throw-literal */
import { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { User } from '../models';
import { PasswordManager } from '../util/hash/index';

const loginRouter = require('express').Router();

interface MyError {
  status: number;
  message: string;
}

const customError = (
  status: number,
  message: string = 'Invalid credentials'
): MyError => ({
  status,
  message,
});

loginRouter.post(
  '/api/v1/users/login',
  [
    body('username').isLength({ min: 1, max: 20 }).escape(),
    body('email').isLength({ max: 30 }).isEmail().escape(),
    body('password').isLength({ min: 2, max: 20 }).escape(),
  ],
  async (req: Request, res: Response) => {
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
  }
);

export { loginRouter };
