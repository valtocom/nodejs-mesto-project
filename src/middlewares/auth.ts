import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const { JWT_SECRET = 'dev-secret' } = process.env;

interface CustomRequest extends Request {
  user?: string | JwtPayload;
}

export default (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
};
