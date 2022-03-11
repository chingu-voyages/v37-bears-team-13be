import express, { Request, Response } from 'express';
import { cookie } from 'express-validator';
import { checkAuthorization } from '../../middleware';

const router = express.Router();

// This validator aims to prevent unusually large cookies
// from being passed to the app, and also aims to sanitize
// cookies that may contain scripts from malicious users.
const cookieJWTCheck = [
  cookie('access_token')
    .trim()
    .isLength({ min: 1, max: 10000 })
    .isJWT()
    .escape(),
];

router.get(
  '/api/v1/authenticated',
  cookieJWTCheck,
  checkAuthorization,
  (req: Request, res: Response) => {
    res.json({ authenticated: !!req.currentUser });
  }
);

export { router as authRouter };
