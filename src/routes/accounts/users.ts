import express from 'express';

import { getAllUsersHandler } from '../../controller/account/users.controller';

const router = express.Router();

router.get('/api/v1/users/', getAllUsersHandler);

export { router as usersRouter };
