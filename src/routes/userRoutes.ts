import { Router } from 'express';

import { body } from 'express-validator';

import { loginUserHandler } from '../controller/user/login.controller';
import validation from '../middleware/validationResult';
import { getAllUsersHandler } from '../controller/user/users.controller';
import { signupUserHandler } from '../controller/user/signup.controller';
import { checkAuthorization } from '../middleware';
import { addStocksHandler } from '../controller/user/addUserStock.controller';

const router = Router();
router.route('/user');

const sanitize = [
  body('username').isLength({ min: 1, max: 20 }).escape(),
  body('email').isLength({ max: 30 }).isEmail().escape(),
  body('password').isLength({ min: 2, max: 20 }).escape(),
];

router.post('/login', sanitize, validation, loginUserHandler);

router.post('/signup', sanitize, validation, signupUserHandler);

router.get('/', getAllUsersHandler);

router.post(
  '/add-stock',
  [
    body('stockId').trim().isLength({ min: 1, max: 30 }).escape(),
    body('userNotes').trim().isLength({ max: 100 }).isAlphanumeric().escape(),
    checkAuthorization,
  ],
  addStocksHandler
);

export { router as userRoutes };
