import express from 'express';

import { checkAuthorization } from '../../middleware';
import { stocksHandler } from '../../controller/stocks/stocks.controller';

const router = express.Router();

router.get('/api/v1/stocks/', [checkAuthorization], stocksHandler);

export { router as stocksRouter };
