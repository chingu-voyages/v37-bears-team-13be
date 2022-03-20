import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { checkAuthorization, upperCaseSymbol } from '../../middleware';
import { Stock } from '../../models';

const router = express.Router();

router.delete(
  '/api/v1/stocks/',
  [
    body('symbol').trim().isLength({ min: 1, max: 15 }).escape(),
    upperCaseSymbol,
    checkAuthorization,
  ],
  async (req: Request, res: Response) => {
    const { currentUser } = req;
    const { symbol } = req.body;
    if (!currentUser) {
      res.status(400).json({
        message: 'Must be signed in to delete a stock from your list of stocks',
      });
      return;
    }

    const existingStock = await Stock.findOne({ symbol });
    if (!existingStock) {
      res.status(400).json({
        message: 'Please input a symbol that is in the database',
      });
      return;
    }

    try {
      await Stock.deleteOne({ symbol });
    } catch (err) {
      const msg = 'Something went wrong saving stock to database';
      console.error(`${msg}: ${(err as Error).message}`);
      res.status(500).json({ error: msg });
      return;
    }

    res.status(201).json(symbol);
  }
);

export { router as deleteStockRouter };
