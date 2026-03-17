import { Request, Response } from 'express';
import { HttpStatus, ErrorMessages } from '../utils/constants';

interface CustomError extends Error {
  statusCode?: number;
}

export default (err: CustomError, req: Request, res: Response) => {
  const statusCode = err.statusCode || HttpStatus.InternalServerError;
  const message = statusCode === HttpStatus.InternalServerError
    ? ErrorMessages.SERVER_ERROR
    : err.message;

  res.status(statusCode).send({ message });
};
