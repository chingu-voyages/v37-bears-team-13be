import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { checkAuthorization, upperCaseSymbol } from '../../middleware';
import { Stock, StockDoc } from '../../models';
import { getCompany } from '../../util/api';

const router = express.Router();

router.post(
  '/api/v1/stocks/add-stock',
  [
    body('symbol').trim().isLength({ min: 1, max: 15 }).escape(),
    upperCaseSymbol,
    checkAuthorization,
  ],
  async (req: Request, res: Response) => {
    // Check that user is authenticated.
    const { currentUser } = req;
    if (!currentUser) {
      res
        .status(401)
        .json({ message: 'Must be signed in to add a marketable security.' });
      return;
    }

    // Get stock symbol.
    const { symbol } = req.body;

    // Check if stock exists in db.
    const existingStock = await Stock.findOne({ symbol });
    if (existingStock) {
      res
        .status(409)
        .json({ error: 'This marketable security already exists.' });
      return;
    }

    // Check that the stock can actually get a quote from Finnhub.
    // Right now, this might only work with companies (because we're only
    // checking the Finnhub company endpoint).
    const { error, errorData, found, successData } = await getCompany({
      symbol,
      apiKey: process.env.FINNHUB_KEY as string,
    });

    // Check for error, log possibly sensitive info, and
    // send a response.
    if (error) {
      const msg = `Error verifying marketable security`;
      console.error(`Error type: ${errorData!.errorType}`);
      console.error(`Error message: ${errorData!.message}`);
      console.error(`Error status code: ${errorData!.status}`);
      res.status(500).json({ error: msg });
      return;
    }

    // Check for not found.
    if (!found) {
      res.status(400).json({ error: 'Marketable security not found' });
      return;
    }

    // Stock has been found, so add it to database.
    let stock: StockDoc;
    try {
      // Add company/stock name.
      const { name } = successData!;
      stock = Stock.build({ name, symbol });
      await stock.save();
    } catch (err) {
      const msg = 'Something went wrong saving stock to database';
      console.error(`${msg}: ${(err as Error).message}`);
      res.status(500).json({ error: msg });
      return;
    }

    // Send back the stock.
    res.status(201).json(stock);
  }
);

export { router as addStockRouter };
