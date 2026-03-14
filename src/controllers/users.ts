import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';

const { JWT_SECRET = 'dev-secret' } = process.env;

// GET /users - возвращает всех пользователей
export const getUsers = (req: Request, res: Response) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => {
      res.status(500).send({ message: 'Ошибка на сервере' });
    });
};

// GET /users/:userId - возвращает пользователя по _id
export const getUserById = (req: Request, res: Response) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Некорректный _id пользователя' });
      }
      return res.status(500).send({ message: 'Ошибка на сервере' });
    });
};

// POST /users - создаёт пользователя
export const createUser = (req: Request, res: Response) => {
  const { email, password, name, about, avatar } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar
    }))
    .then((user) => {
      // Используем деструктуризацию для удаления пароля
      const userObject = user.toObject();
      const { password, ...userWithoutPassword } = userObject;
      res.status(201).send(userWithoutPassword);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return res.status(409).send({ message: 'Пользователь с таким email уже существует' });
      }
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ message: 'Ошибка на сервере' });
    });
};

// POST /signin - логин пользователя
export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return res.status(401).send({ message: 'Неправильные почта или пароль' });
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return res.status(401).send({ message: 'Неправильные почта или пароль' });
          }

          // Создаем JWT токен
          const token = jwt.sign(
            { _id: user._id },
            JWT_SECRET,
            { expiresIn: '7d' }
          );

          // Отправляем токен в httpOnly куке
          res.cookie('jwt', token, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
            sameSite: 'strict'
          }).send({ message: 'Успешный вход' });
        });
    })
    .catch(() => {
      res.status(500).send({ message: 'Ошибка на сервере' });
    });
};

// GET /users/me - возвращает информацию о текущем пользователе
export const getCurrentUser = (req: any, res: Response) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      return res.send(user);
    })
    .catch(() => {
      res.status(500).send({ message: 'Ошибка на сервере' });
    });
};

// PATCH /users/me - обновляет профиль
export const updateProfile = (req: any, res: Response) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ message: 'Ошибка на сервере' });
    });
};

// PATCH /users/me/avatar - обновляет аватар
export const updateAvatar = (req: any, res: Response) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ message: 'Ошибка на сервере' });
    });
};
