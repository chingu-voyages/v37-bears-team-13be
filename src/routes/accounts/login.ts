import { body } from 'express-validator';

import { loginHandler } from '../../controller/account/login.controller';

const loginRouter = require('express').Router();

loginRouter.post(
  '/api/v1/users/login',
  [
    body('username').isLength({ min: 1, max: 20 }).escape(),
    body('email').isLength({ max: 30 }).isEmail().escape(),
    body('password').isLength({ min: 2, max: 20 }).escape(),
  ],
  loginHandler
);

export { loginRouter };
