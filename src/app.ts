import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import { json } from 'body-parser';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { authRouter, loginRouter, signupRouter, usersRouter } from './routes';
// Initialize express.
const app = express();

// Get environment variables to re-export.
const { NODE_ENV, PORT, ORIGIN, MONGO_URI, JWT_KEY } = process.env;

// Setup application.
app.use(cors({ origin: ORIGIN, credentials: true }));
app.use(json());
app.use(cookieParser());
app.use(helmet());

// Add routes.
app.use(authRouter);
app.use(loginRouter);
app.use(signupRouter);
app.use(usersRouter);

// Export the app and environment variables.
export { app, NODE_ENV, PORT, ORIGIN, MONGO_URI, JWT_KEY };
