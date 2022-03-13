import express, { Request, Response } from 'express';
import { checkAuthorization } from '../../middleware';
import { Stock } from '../../models/stock';

const router = express.Router();

router.get(
  '/api/v1/stocks/',
  [checkAuthorization],
  async (req: Request, res: Response) => {
    // Check that user is authenticated.
    const { currentUser } = req;
    if (!currentUser) {
      res
        .status(401)
        .json({ message: 'Must be signed in to view marketable securities.' });
      return;
    }

    const stocks = await Stock.find();

    res.status(200).json({
      stocks,
    });
  }
);

export { router as stocksRouter };
