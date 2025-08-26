import Book from '../models/Book.js';
import fs from 'fs';

function createBook(req, res, next) {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  book.save()
    .then(() => { res.status(201).json({ message: 'Objet enregistré !'})})
    .catch(error => { res.status(400).json({ error })});
}

function rateBook(req, res, next) {
  const authUserId = req.auth?.userId;
  const grade = Number(req.body.rating);

  if (!authUserId || authUserId !== req.body.userId)
    return res.status(401).json({ message: 'Non autorisé' });
  if (isNaN(grade) || grade < 0 || grade > 5)
    return res.status(400).json({ message: 'Note invalide' });

  Book.findById({ _id: req.params.id })
    .then(book => {
      if (!book) return res.status(404).json({ message: 'Livre introuvable' });
      if (book.userId === authUserId)
        return res.status(403).json({ message: 'Impossible de noter son propre livre' });
      if (book.ratings.some(r => r.userId === authUserId))
        return res.status(400).json({ message: 'Vous avez déjà noté ce livre' });

      book.ratings.push({ userId: authUserId, grade });
      book.averageRating = book.ratings.reduce((s, r) => s + r.grade, 0) / book.ratings.length;

      return book.save()
        .then(updated => res.status(200).json(updated));
    })
    .catch(err => res.status(400).json({ message: 'Erreur lors de la notation', error: err.message }));
}

function getAllBooks(req, res, next) {
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
}

function getOneBook(req, res, next) {
  Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(400).json({ error }));
}

function getBestRatingBooks(req, res, next) {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then(book => res.status(200).json(book))
    .catch(error => res.status(400).json({ error }));
}

function modifyBook(req, res, next) {
  const bookObject = req.file ? {
    ...JSON.parse(req.body.book),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete bookObject._userId;
  Book.findOne({_id: req.params.id})
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: 'Non-autorisé' })
      } else {
        Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Object modifié' }))
          .catch(error => res.status(401).json({ error }))
      }
    })
    .catch((error) => { res.status(400).json({ error })});
}

function deleteBook(req, res, next) {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) { 
        res.status(401).json({ message: 'Non-autorisé' })
      } else {
        const filename = book.imageUril.split('/images/')[1]
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({_id: req.params.id})
            .then(() => { res.status(200).json({ message: 'Object supprimé' })})
            .catch(error => res.status(401).json({ error }))
        });
      }
    })
    .catch((error) => { res.status(400).json({ error })});
}

export default { createBook, rateBook, getAllBooks, getOneBook, getBestRatingBooks, modifyBook, deleteBook };