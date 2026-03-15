import { celebrate, Joi, Segments } from 'celebrate';

// Валидация регистрации
export const validateSignup = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().uri(),
  }),
});

// Валидация логина
export const validateSignin = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

// Валидация ID пользователя в параметрах
export const validateUserId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  }),
});

// Валидация ID карточки в параметрах
export const validateCardId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
});

// Валидация создания карточки
export const validateCreateCard = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().uri(),
  }),
});

// Валидация обновления профиля
export const validateUpdateProfile = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(200),
  }),
});

// Валидация обновления аватара
export const validateUpdateAvatar = celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().required().uri(),
  }),
});
