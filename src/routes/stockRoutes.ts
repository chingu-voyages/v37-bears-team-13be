import { Router } from 'express';
import { body } from 'express-validator';

import { checkAuthorization, upperCaseSymbol } from '../middleware';
import { addStockHandler } from '../controller/stocks/addStock.controller';
import { stocksHandler } from '../controller/stocks/stocks.controller';
import { deleteStockHandler } from '../controller/stocks/deleteStock.controller';

const router = Router();
router.route('/stocks');
router.post(
  '/add',
  [
    body('symbol').trim().isLength({ min: 1, max: 15 }).escape(),
    upperCaseSymbol,
    checkAuthorization,
  ],
  addStockHandler
);

router.delete(
  '/delete',
  [
    body('symbol').trim().isLength({ min: 1, max: 15 }).escape(),
    upperCaseSymbol,
    checkAuthorization,
  ],
  deleteStockHandler
);

router.get('/', [checkAuthorization], stocksHandler);

export { router as stockRouter };
