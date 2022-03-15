import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { JwtPayload } from 'jsonwebtoken';
import { checkAuthorization } from '../../middleware';
import { Stock, UserStock, UserStockDoc } from '../../models';

const router = express.Router();

router.post(
  '/api/v1/user-stocks/add-stock',
  [
    body('stockId').trim().isLength({ min: 1, max: 30 }).escape(),
    body('userNotes').trim().isLength({ max: 100 }).isAlphanumeric().escape(),
    checkAuthorization,
  ],
  async (req: Request, res: Response) => {
    // Check that user is authenticated.
    const { currentUser } = req;
    if (!currentUser) {
      res
        .status(401)
        .json({ message: 'Must be signed in to add a stock to your account.' });
      return;
    }

    // Get stock id.
    const { stockId, userNotes } = req.body;

    // Check if user has already added this stock to their collection.
    const hasUserStock = await UserStock.find({ stock: stockId });
    if (hasUserStock && hasUserStock.length) {
      res.status(409).json({ error: 'Stock already added to user.' });
      return;
    }

    // If not, see if the stock exists in the commmunity database.
    const stock = await Stock.findById(stockId);
    if (!stock) {
      res.status(400).json({ error: 'Stock not found in our database.' });
      return;
    }

    // Associate the existing stock with this user.
    let userStock: UserStockDoc;
    try {
      userStock = UserStock.build({
        userId: (currentUser as JwtPayload).id,
        userNotes: userNotes as string,
        stock,
      });
      await userStock.save();
    } catch (error) {
      const msg = 'Something went wrong saving user stock to database';
      console.error(`${msg}: ${(error as Error).message}`);
      res.status(500).json({ error: msg });
      return;
    }

    // Send back userStock.
    res.status(201).json(userStock);
  }
);
export { router as addUserStockRouter };
