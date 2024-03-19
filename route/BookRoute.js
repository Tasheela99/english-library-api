const express = require('express');
const BookController = require('../controller/BookController');
const router = express.Router();
const verifyToken = require('../middleware/AuthMiddleware')

router.post('/save-book', verifyToken, BookController.saveBook);
router.get('/find-book', verifyToken, BookController.findBook);
router.put('/update-book', verifyToken, BookController.updateBook);
router.delete('/delete-book', verifyToken, BookController.deleteBook);
router.get('/find-all-books', verifyToken, BookController.findAllBooks);


module.exports = router;