import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import { json, urlencoded } from 'body-parser';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import {
  addStockRouter,
  addUserStockRouter,
  authRouter,
  deleteStockRouter,
  loginRouter,
  signupRouter,
  stocksRouter,
  usersRouter,
  homeRouter,
} from './routes';

// Initialize express.
const app = express();

// Get environment variables to re-export.
const { NODE_ENV, PORT, ORIGIN, MONGO_URI, JWT_KEY, FINNHUB_KEY } = process.env;

// Setup application.
app.use(cors({ origin: ORIGIN, credentials: true }));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
// Add heroku homepage route to correct error
app.use(homeRouter);
// Add user routes.
app.use(authRouter);
app.use(loginRouter);
app.use(signupRouter);
app.use(usersRouter);

// Add stock routes.
app.use(addStockRouter);
app.use(stocksRouter);
app.use(deleteStockRouter);

// Add user stock routes.
app.use(addUserStockRouter);

// Export the app and environment variables.
export { app, NODE_ENV, PORT, ORIGIN, MONGO_URI, JWT_KEY, FINNHUB_KEY };
