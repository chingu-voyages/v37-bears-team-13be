import { JwtPayload } from 'jsonwebtoken';

import { StockDoc, UserStock, UserStockDoc } from '../models';

export const findUserStocks = async (stock: string) => {
  try {
    const stockFound = await UserStock.find({ stock });

    if (!stockFound) throw new Error('stock not found');

    return stockFound;
  } catch (err: any) {
    throw new Error(err);
  }
};

export const createUserStock = async (
  stock: StockDoc,
  currentUser: any,
  userNotes: string
) => {
  const userStock: UserStockDoc = UserStock.build({
    userId: (currentUser as JwtPayload).id,
    userNotes,
    stock,
  });

  await userStock.save();
};
