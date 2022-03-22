import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Welcome to our Stock Race backend hosted on Heroku');
});

export { router as homeRouter };
