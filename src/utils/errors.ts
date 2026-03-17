/* eslint-disable max-classes-per-file */

import { HttpStatus } from './constants';

// Базовый класс для всех ошибок
export class AppError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Специализированные ошибки
export class NotFoundError extends AppError {
  constructor(message: string = 'Ресурс не найден') {
    super(message, HttpStatus.NotFound);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = 'Переданы некорректные данные') {
    super(message, HttpStatus.BadRequest);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Необходима авторизация') {
    super(message, HttpStatus.Unauthorized);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Доступ запрещен') {
    super(message, HttpStatus.Forbidden);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Конфликт данных') {
    super(message, HttpStatus.Conflict);
  }
}
