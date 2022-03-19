import express from 'express';

import { usersHandler } from '../../controller/account/users.controller';

const router = express.Router();

router.get('/api/v1/users/', usersHandler);

export { router as usersRouter };
