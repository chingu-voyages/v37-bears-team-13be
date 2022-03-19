import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';

import { Stock, UserStock, UserStockDoc } from '../../models';
import customError from '../../util/customError';

export const addStocksHandler = async (req: Request, res: Response) => {
  try {
    // Check that user is authenticated.
    const { currentUser } = req;
    if (!currentUser)
      customError(401, 'Must be signed in to add a stock to your account.');

    // Get stock id.
    const { stockId, userNotes } = req.body;

    // Check if user has already added this stock to their collection.
    const hasUserStock = await UserStock.find({ stock: stockId });
    if (hasUserStock && hasUserStock.length) {
      res.status(409).json({ error: 'Stock already added to user.' });
      return;
    }

    // If not, see if the stock exists in the commmunity database.
    const stock = await Stock.findById(stockId);
    if (!stock) {
      res.status(400).json({ error: 'Stock not found in our database.' });
      return;
    }

    // Associate the existing stock with this user.
    const userStock: UserStockDoc = UserStock.build({
      userId: (currentUser as JwtPayload).id,
      userNotes: userNotes as string,
      stock,
    });

    await userStock.save();

    // Send back userStock.
    res.status(201).json(userStock);
  } catch (err: any) {
    res.status(err.status).json({ message: err.message, data: null });
  }
};
