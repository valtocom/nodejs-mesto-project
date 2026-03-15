import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { HttpStatus, ErrorMessages } from '../utils/constants';

const { JWT_SECRET = 'dev-secret' } = process.env;

// Создаём интерфейс для авторизованного запроса
interface AuthRequest extends Request {
  user?: {
    _id: string;
  }
}

// GET /users - возвращает всех пользователей
export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      next(err);
    });
};

// GET /users/:userId - возвращает пользователя по _id
export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        const error: any = new Error(ErrorMessages.USER_NOT_FOUND);
        error.statusCode = HttpStatus.NotFound;
        throw error;
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error: any = new Error(ErrorMessages.INVALID_USER_ID);
        error.statusCode = HttpStatus.BadRequest;
        next(error);
      } else {
        next(err);
      }
    });
};

// POST /users - создаёт пользователя
export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => {
      const userObject = user.toObject();
      const { password: _, ...userWithoutPassword } = userObject; // Переименовали password в _
      res.status(HttpStatus.Created).send(userWithoutPassword);
    })
    .catch((err) => {
      if (err.code === 11000) {
        const error: any = new Error(ErrorMessages.EMAIL_EXISTS);
        error.statusCode = HttpStatus.Conflict;
        next(error);
      }
      if (err.name === 'ValidationError') {
        const error: any = new Error(ErrorMessages.INVALID_DATA);
        error.statusCode = HttpStatus.BadRequest;
        next(error);
      }
      next(err);
    });
};

// POST /signin - логин пользователя
export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password: loginPassword } = req.body; // Переименовали password в loginPassword

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        const error: any = new Error(ErrorMessages.INVALID_CREDENTIALS);
        error.statusCode = HttpStatus.Unauthorized;
        throw error;
      }

      return bcrypt.compare(loginPassword, user.password) // Используем loginPassword
        .then((matched) => {
          if (!matched) {
            const error: any = new Error(ErrorMessages.INVALID_CREDENTIALS);
            error.statusCode = HttpStatus.Unauthorized;
            throw error;
          }

          // Создаем JWT токен
          const token = jwt.sign(
            { _id: user._id },
            JWT_SECRET,
            { expiresIn: '7d' },
          );

          // Отправляем токен в httpOnly куке
          res.cookie('jwt', token, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
            sameSite: 'strict',
          }).send({ message: 'Успешный вход' });
        });
    })
    .catch((err) => {
      next(err);
    });
};

// GET /users/me - возвращает информацию о текущем пользователе
export const getCurrentUser = (req: AuthRequest, res: Response, next: NextFunction) => {
  User.findById(req.user!._id)
    .then((user) => {
      if (!user) {
        const error: any = new Error(ErrorMessages.USER_NOT_FOUND);
        error.statusCode = HttpStatus.NotFound;
        throw error;
      }
      return res.send(user);
    })
    .catch((err) => {
      next(err);
    });
};

// PATCH /users/me - обновляет профиль
export const updateProfile = (req: AuthRequest, res: Response, next: NextFunction) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user!._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        const error: any = new Error(ErrorMessages.USER_NOT_FOUND);
        error.statusCode = HttpStatus.NotFound;
        throw error;
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error: any = new Error(ErrorMessages.INVALID_DATA);
        error.statusCode = HttpStatus.BadRequest;
        next(error);
      } else {
        next(err);
      }
    });
};

// PATCH /users/me/avatar - обновляет аватар
export const updateAvatar = (req: AuthRequest, res: Response, next: NextFunction) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user!._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        const error: any = new Error(ErrorMessages.USER_NOT_FOUND);
        error.statusCode = HttpStatus.NotFound;
        throw error;
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error: any = new Error(ErrorMessages.INVALID_DATA);
        error.statusCode = HttpStatus.BadRequest;
        next(error);
      } else {
        next(err);
      }
    });
};
