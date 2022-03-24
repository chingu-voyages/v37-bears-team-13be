import express, { Response, Request } from 'express';

const app = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to our Stock Race backend hosted on Heroku');
});

export { app as herokuHomePage };
