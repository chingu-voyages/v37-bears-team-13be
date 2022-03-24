import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import { json, urlencoded } from 'body-parser';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { stockRouter } from './routes/stockRoutes';
import { userRoutes } from './routes/userRoutes';
import { herokuHomePage } from './routes/heroku-homepage';

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
app.use(herokuHomePage);
app.route('/api/v1');
// Add user routes.
app.use(stockRouter);
app.use(userRoutes);

// Export the app and environment variables.
export { app, NODE_ENV, PORT, ORIGIN, MONGO_URI, JWT_KEY, FINNHUB_KEY };
