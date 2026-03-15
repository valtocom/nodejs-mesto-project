/* eslint-disable no-unused-vars */

export enum HttpStatus {
  Ok = 200,
  Created = 201,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  Conflict = 409,
  InternalServerError = 500,
}

export const ErrorMessages = {
  // Карточки
  CARD_NOT_FOUND: 'Карточка не найдена',
  INVALID_CARD_ID: 'Некорректный _id карточки',
  FORBIDDEN_DELETE: 'Нельзя удалить чужую карточку',

  // Пользователи
  USER_NOT_FOUND: 'Пользователь не найден',
  INVALID_USER_ID: 'Некорректный _id пользователя',
  EMAIL_EXISTS: 'Пользователь с таким email уже существует',
  INVALID_CREDENTIALS: 'Неправильные почта или пароль',

  // Общие
  INVALID_DATA: 'Переданы некорректные данные',
  SERVER_ERROR: 'Ошибка на сервере',
  AUTH_REQUIRED: 'Необходима авторизация',
};
