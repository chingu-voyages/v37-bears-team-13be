import { Stock, StockDoc } from '../models';

type StockInput = string;

export const findStockHandler = async (symbol: StockInput) => {
  try {
    const stock = await Stock.findOne({ symbol });

    if (!stock) throw new Error('Stock not found');

    return stock;
  } catch (err: any) {
    throw new Error(err);
  }
};

export const createStockHandler = async (name: string, symbol: string) => {
  try {
    const stock: StockDoc = Stock.build({ name, symbol });
    await stock.save();
    return stock;
  } catch (err) {
    throw new Error('Error building the stock record');
  }
};

export const findAllStocksHandler = async () => {
  try {
    const stocks = await Stock.find();

    return stocks;
  } catch (err) {
    throw new Error('Cant find the stock records');
  }
};
