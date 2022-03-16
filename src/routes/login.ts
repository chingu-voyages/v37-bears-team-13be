import { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { PasswordManager } from '../util/hash/index';

const loginRouter = require('express').Router();

loginRouter.post(
  '/api/v1/users/login',
  [
    body('username').isLength({ min: 1, max: 20 }).escape(),
    body('email').isLength({ max: 30 }).isEmail().escape(),
    body('password').isLength({ min: 2, max: 20 }).escape(),
  ],
  async (req: Request, res: Response) => {
    const reqbody = req.body;
    // Find User in Database
    const user = await User.findOne({ username: reqbody.username });
    const passwordCorrect =
      user === null
        ? false
        : await PasswordManager.compare(user.password, reqbody.password);
    // Return error is user does not exist or password is incorrect
    if (!(user && passwordCorrect)) {
      res.status(401).json({
        error: 'invalid username or password',
      });
    }
    // username & password are correct
    else {
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
    }
  }
);

export { loginRouter };
