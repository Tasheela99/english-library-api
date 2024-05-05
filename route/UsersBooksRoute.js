const express = require('express');
const UsersBooksController = require('../controller/UsersBooksController');
const router = express.Router();
const verifyToken = require('../middleware/AuthMiddleware');
const verifyPost = require('../middleware/AdminMiddleware');

router.post('/add-permission', verifyPost, UsersBooksController.saveUsersBooks);
router.get('/get-users-books', verifyToken, UsersBooksController.getUsersBooks);
router.get('/get-users-books-by-category', verifyToken, UsersBooksController.getUsersBooksByCategory);
router.get('/get-all-users-book-by-id', verifyToken, UsersBooksController.getUsersBookById);
router.get('/get-all-users-books-with-data', UsersBooksController.getUsersBooksWithData);
router.delete('/remove-permission', verifyPost, UsersBooksController.deleteUsersBooks);
router.get('/users-books-count', verifyPost, UsersBooksController.getUsersBooksCount);

module.exports = router;