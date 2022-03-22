import express from 'express';
import { body } from 'express-validator';

import { checkAuthorization, upperCaseSymbol } from '../../middleware';
import { addStockHandler } from '../../controller/stocks/add-stocks.controller';

const router = express.Router();

router.post(
  '/api/v1/stocks/add-stock',
  [
    body('symbol').trim().isLength({ min: 1, max: 15 }).escape(),
    upperCaseSymbol,
    checkAuthorization,
  ],
  addStockHandler
);

export { router as addStockRouter };
