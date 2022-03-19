import express from 'express';
import { body } from 'express-validator';

import { signupHandler } from '../../controller/account/signup.controller';

const router = express.Router();

router.post(
  '/api/v1/users/signup',
  [
    body('username').isLength({ min: 1, max: 20 }).escape(),
    body('email').isLength({ max: 30 }).isEmail().escape(),
    body('password').isLength({ min: 2, max: 20 }).escape(),
  ],
  signupHandler
);

export { router as signupRouter };
