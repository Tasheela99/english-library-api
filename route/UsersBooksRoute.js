const express = require('express');
const UsersBooksController = require('../controller/UsersBooksController');
const router = express.Router();
const verifyToken = require('../middleware/AuthMiddleware')
const verifyPost = require('../middleware/AdminMiddleware')


router.post('/add-permission', verifyPost, UsersBooksController.saveUsersBooks);
router.get('/get-users-books', verifyToken, UsersBooksController.getUsersBooks);
router.get('/get-all-users-books', verifyToken, UsersBooksController.getAllUsersBooks);
router.get('/get-all-users-books-with-data', UsersBooksController.getUsersBooksWithData);
router.delete('/remove-permission', verifyPost, UsersBooksController.deleteUsersBooks);
router.get('/users-books-count', verifyPost, UsersBooksController.getUsersBooksCount);

module.exports = router;