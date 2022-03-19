import express, { Request, Response } from 'express';
import { checkAuthorization, cookieJWTCheck } from '../../middleware';

const router = express.Router();

router.get(
  '/api/v1/authenticated',
  cookieJWTCheck,
  checkAuthorization,
  (req: Request, res: Response) => {
    res.json({ authenticated: !!req.currentUser });
  }
);

export { router as authRouter };
