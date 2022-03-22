import { Request, Response } from 'express';

import customError from '../../util/customError';
import { findAllStocksHandler } from '../../service/stock.service';

export const stocksHandler = async (req: Request, res: Response) => {
  try {
    // Check that user is authenticated.
    const { currentUser } = req;
    if (!currentUser)
      customError(401, 'Must be signed in to view marketable securities.');

    const stocks = await findAllStocksHandler();

    res.status(200).json({
      stocks,
    });
  } catch (err: any) {
    res.status(err.status).json({ message: err.message });
  }
};
