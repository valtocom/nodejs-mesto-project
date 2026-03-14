import { Request, Response } from 'express';
import Card from '../models/card';

// GET /cards - возвращает все карточки
export const getCards = (req: Request, res: Response) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(() => {
      res.status(500).send({ message: 'Ошибка на сервере' });
    });
};

// POST /cards - создаёт карточку
export const createCard = (req: any, res: Response) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ message: 'Ошибка на сервере' });
    });
};

// DELETE /cards/:cardId - удаляет карточку по идентификатору
export const deleteCardById = (req: any, res: Response) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      if (card.owner.toString() !== req.user._id) {
        return res.status(403).send({ message: 'Нельзя удалить чужую карточку' });
      }

      return Card.findByIdAndRemove(req.params.cardId)
        .then(() => res.send({ message: 'Карточка удалена' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Некорректный _id карточки' });
      }
      return res.status(500).send({ message: 'Ошибка на сервере' });
    });
};

// PUT /cards/:cardId/likes - поставить лайк карточке
export const likeCard = (req: any, res: Response) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Некорректный _id карточки' });
      }
      return res.status(500).send({ message: 'Ошибка на сервере' });
    });
};

// DELETE /cards/:cardId/likes - убрать лайк с карточки
export const dislikeCard = (req: any, res: Response) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Некорректный _id карточки' });
      }
      return res.status(500).send({ message: 'Ошибка на сервере' });
    });
};
