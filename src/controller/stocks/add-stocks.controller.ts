import { Request, Response } from 'express';

import { Stock, StockDoc } from '../../models';
import { getCompany } from '../../util/api';
import customError from '../../util/customError';

export const addStockHandler = async (req: Request, res: Response) => {
  try {
    // Check that user is authenticated.
    const { currentUser } = req;

    if (!currentUser)
      customError(401, 'Must be signed in to add a marketable security.');

    // Get stock symbol.
    const { symbol } = req.body;

    // Check if stock exists in db.
    const existingStock = await Stock.findOne({ symbol });

    if (existingStock)
      customError(409, 'This marketable security already exists.');

    // Check that the stock can actually get a quote from Finnhub.
    // Right now, this might only work with companies (because we're only
    // checking the Finnhub company endpoint).
    if (!process.env.FINNHUB_KEY)
      throw new Error(
        'Missing FINNHUB_KEY key, please add it to your .env file'
      );
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
    if (!found) customError(400, 'Marketable security not found');

    // Stock has been found, so add it to database.
    // Add company/stock name.
    const { name } = successData!;

    const stock: StockDoc = Stock.build({ name, symbol });

    await stock.save();

    // Send back the stock.
    res.status(201).json(stock);
  } catch (err: any) {
    res.status(err.status).json({ message: err.message, data: null });
  }
};
