import { Request, Response } from 'express';

import customError from '../../util/customError';

import {
  findUserStocks,
  createUserStock,
} from '../../service/userStock.service';
import { findStock } from '../../service/stock.service';

export const addStocksHandler = async (req: Request, res: Response) => {
  try {
    // Check that user is authenticated.
    const { currentUser } = req;
    if (!currentUser)
      customError(401, 'Must be signed in to add a stock to your account.');

    // Get stock id.
    const { stockId, userNotes } = req.body;

    // Check if user has already added this stock to their collection.
    const hasUserStock = await findUserStocks(stockId);

    if (hasUserStock && hasUserStock.length)
      return res.status(409).json({ error: 'Stock already added to user.' });

    // If not, see if the stock exists in the commmunity database.
    const stock = await findStock(stockId);

    // Associate the existing stock with this user.
    const userStock = await createUserStock(stock, currentUser, userNotes);

    // Send back userStock.
    return res.status(201).json(userStock);
  } catch (err: any) {
    return res.status(err.status).json({ message: err.message, data: null });
  }
};
