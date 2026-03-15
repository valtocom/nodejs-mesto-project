import { Request, Response, NextFunction } from 'express';
import Card from '../models/card';
import { HttpStatus, ErrorMessages } from '../utils/constants';

interface AuthRequest extends Request {
  user?: {
    _id: string;
  }
}

// GET /cards - возвращает все карточки
export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch((err) => {
      next(err);
    });
};

// POST /cards - создаёт карточку
export const createCard = (req: AuthRequest, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const owner = req.user!._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(HttpStatus.Created).send(card))
    .catch((err) => {
      next(err);
    });
};

// DELETE /cards/:cardId - удаляет карточку по идентификатору
export const deleteCardById = (req: AuthRequest, res: Response, next: NextFunction) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        const error: any = new Error(ErrorMessages.CARD_NOT_FOUND);
        error.statusCode = HttpStatus.NotFound;
        throw error;
      }
      if (card.owner.toString() !== req.user!._id) {
        const error: any = new Error(ErrorMessages.FORBIDDEN_DELETE);
        error.statusCode = HttpStatus.Forbidden;
        throw error;
      }

      return Card.findByIdAndRemove(req.params.cardId)
        .then(() => res.send({ message: 'Карточка удалена' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error: any = new Error(ErrorMessages.INVALID_CARD_ID);
        error.statusCode = HttpStatus.BadRequest;
        next(error);
      } else {
        next(err);
      }
    });
};

// PUT /cards/:cardId/likes - поставить лайк карточке
export const likeCard = (req: AuthRequest, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user!._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        const error: any = new Error(ErrorMessages.CARD_NOT_FOUND);
        error.statusCode = HttpStatus.NotFound;
        throw error;
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error: any = new Error(ErrorMessages.INVALID_CARD_ID);
        error.statusCode = HttpStatus.BadRequest;
        next(error);
      } else {
        next(err);
      }
    });
};

// DELETE /cards/:cardId/likes - убрать лайк с карточки
export const dislikeCard = (req: AuthRequest, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user!._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        const error: any = new Error(ErrorMessages.CARD_NOT_FOUND);
        error.statusCode = HttpStatus.NotFound;
        throw error;
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error: any = new Error(ErrorMessages.INVALID_CARD_ID);
        error.statusCode = HttpStatus.BadRequest;
        next(error);
      } else {
        next(err);
      }
    });
};
