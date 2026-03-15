import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';
import router from './routes';
import { requestLogger, errorLogger } from './middlewares/logger';
import errorHandler from './middlewares/error-handler';

const { PORT = 3000 } = process.env;
const app = express();

mongoose.set('strictQuery', false);

mongoose.connect('mongodb://localhost:27017/mestodb')
  .then(() => {
    console.log('Connected to MongoDB');

    app.use(express.json());
    app.use(cookieParser());
    app.use(requestLogger);
    app.use(router);
    app.use(errorLogger);
    app.use(errors());
    app.use(errorHandler);

    app.use('*', (req: Request, res: Response) => {
      res.status(404).send({ message: 'Маршрут не найден' });
    });

    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });
