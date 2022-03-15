import { Request, Response, NextFunction } from 'express';

/**
 * This middleware takes the stock symbol field from the request body
 * and makes it uppercase. This means stock symbols AAPL, AaPL, and aapl,
 * should all correspond with AAPL.
 *
 *
 * @remarks
 * As of March 12, 2022, experiments show that some Finnhub API endpoints
 * (like the quote endpoint), will only provide relevant (non-null) data
 * if all the letters in a stock are uppercase. Also, this middleware helps
 * to avoid storing duplicate data in the stock database.
 *
 *
 * @param req  - Express request object.
 * @param res  - Express response object.
 * @param next - Express next object.
 * @returns - next(). It calls the next middleware having now made
 *                    any symbol field on the body uppercase.
 *
 */
export const upperCaseSymbol = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { symbol } = req.body;
  if (!symbol) {
    return next();
  }
  req.body.symbol = symbol.toUpperCase();
  return next();
};
