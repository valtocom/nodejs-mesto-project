import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import router from './routes';

const { PORT = 3000 } = process.env;
const app = express();

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());

app.use((req: any, res, next) => {
  req.user = {
    _id: '69b1c40ed2f53cc31d0e4ed4',
  };
  next();
});

app.use(router);

app.use('*', (req: Request, res: Response) => {
  res.status(404).send({ message: 'Маршрут не найден' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
