import { Request, Response } from 'express';

import { Stock } from '../../models/stock';
import customError from '../../util/customError';

export const stocksHandler = async (req: Request, res: Response) => {
  try {
    // Check that user is authenticated.
    const { currentUser } = req;
    if (!currentUser)
      customError(401, 'Must be signed in to view marketable securities.');

    const stocks = await Stock.find();

    res.status(200).json({
      stocks,
    });
  } catch (err: any) {
    res.status(err.status).json({ message: err.message });
  }
};
