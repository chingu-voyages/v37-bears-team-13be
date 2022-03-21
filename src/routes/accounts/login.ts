import { body } from 'express-validator';

import { loginUserHandler } from '../../controller/account/login.controller';
import validation from '../../middleware/validationResult';

const loginRouter = require('express').Router();

loginRouter.post(
  '/api/v1/users/login',
  [
    body('username').isLength({ min: 1, max: 20 }).escape(),
    body('email').isLength({ max: 30 }).isEmail().escape(),
    body('password').isLength({ min: 2, max: 20 }).escape(),
  ],
  validation,
  loginUserHandler
);

export { loginRouter };
