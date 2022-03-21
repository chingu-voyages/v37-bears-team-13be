import express from 'express';
import { body } from 'express-validator';

import { checkAuthorization } from '../../middleware';
import { addStocksHandler } from '../../controller/user-stocks/add-user-stock.controller';

const router = express.Router();

router.post(
  '/api/v1/user-stocks/add-stock',
  [
    body('stockId').trim().isLength({ min: 1, max: 30 }).escape(),
    body('userNotes').trim().isLength({ max: 100 }).isAlphanumeric().escape(),
    checkAuthorization,
  ],
  addStocksHandler
);
export { router as addUserStockRouter };
