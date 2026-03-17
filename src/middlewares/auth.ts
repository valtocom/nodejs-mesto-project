import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UnauthorizedError } from '../utils/errors';
import { ErrorMessages } from '../utils/constants';

const { JWT_SECRET = 'dev-secret' } = process.env;

interface CustomRequest extends Request {
  user?: string | JwtPayload;
}

export default (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(new UnauthorizedError(ErrorMessages.AUTH_REQUIRED));
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return next(new UnauthorizedError(ErrorMessages.AUTH_REQUIRED));
  }
};
