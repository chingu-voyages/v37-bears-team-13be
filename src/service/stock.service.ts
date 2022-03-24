import { Stock, StockDoc } from '../models';

type StockInput = string;

export const findStock = async (symbol: StockInput) => {
  try {
    const stock = await Stock.findOne({ symbol });

    if (!stock) throw new Error('Stock not found');

    return stock;
  } catch (err: any) {
    throw new Error(err);
  }
};

export const createStock = async (name: string, symbol: string) => {
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
    throw new Error('Stocks records not found');
  }
};

export const deleteStock = async (symbol: string) => {
  try {
    const existingStock = await Stock.findOne({ symbol });
    if (!existingStock) throw Error('Record not found');
    await Stock.deleteOne({ symbol });
  } catch (err: any) {
    throw new Error(err.message);
  }
};
