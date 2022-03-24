import { Request, Response } from 'express';

import { deleteStock } from '../../service/stock.service';
import customError from '../../util/customError';

export const deleteStockHandler = async (req: Request, res: Response) => {
  try {
    const { currentUser } = req;
    const { symbol } = req.body;
    if (!currentUser) customError(401, 'Unauthorized action');

    await deleteStock(symbol);
    res.status(201).json(symbol);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
