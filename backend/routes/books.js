import express from 'express';
import booksCtrl from '../controllers/books.js';
import auth from '../middleware/auth.js';
import multer from '../middleware/multer-config.js'

const router = express.Router();

router.post('/', auth, multer, booksCtrl.createBook);
router.get('/', booksCtrl.getAllBooks );
router.get('/bestrating', booksCtrl.getBestRatingBooks);
router.post('/:id/rating', auth, booksCtrl.rateBook);
router.get('/:id', booksCtrl.getOneBook);
router.put('/:id', auth, multer, booksCtrl.modifyBook);
router.delete('/:id', auth, booksCtrl.deleteBook);


export default router;