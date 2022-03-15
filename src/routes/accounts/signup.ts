import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User, UserDoc } from '../../models';

const router = express.Router();

router.post(
  '/api/v1/users/signup',
  [
    body('username').isLength({ min: 1, max: 20 }).escape(),
    body('email').isLength({ max: 30 }).isEmail().escape(),
    body('password').isLength({ min: 2, max: 20 }).escape(),
  ],
  async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    // Check if user exists in db.
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ error: 'user already exists' });
      return;
    }

    // Create user and save them to db.
    let user: UserDoc;
    try {
      user = User.build({ username, email, password });
      await user.save();
    } catch (err) {
      const msg = 'Something went wrong saving to database';
      console.error(`${msg}: ${(err as Error).message}`);
      res.status(500).json({ error: msg });
      return;
    }

    // Create a JWT.
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      process.env.JWT_KEY!
    );

    // Send back response with a cookie.
    res
      .cookie('access_token', userJwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      })
      .status(201)
      .json(user);
  }
);

export { router as signupRouter };
