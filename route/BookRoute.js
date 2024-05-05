const express = require('express');
const BookController = require('../controller/BookController');
const router = express.Router();
const verifyToken = require('../middleware/AuthMiddleware')
const verifyPost = require('../middleware/AdminMiddleware')
const {getBooksByCategory} = require("../controller/BookController");

router.post('/save-book', verifyPost, BookController.saveBook);
router.put('/update-book', verifyToken, BookController.updateBook);
router.delete('/delete-book', verifyToken, BookController.deleteBook);
router.get('/find-book', verifyToken, BookController.findBook);
router.get('/find-all-books', verifyToken, BookController.findAllBooks);
router.get('/books-count', verifyToken, BookController.getBookCount);
router.get('/get-books-by-category',verifyToken, BookController.getBooksByCategory);

module.exports = router;