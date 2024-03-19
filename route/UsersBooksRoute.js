const express = require('express');
const UsersBooksController = require('../controller/UsersBooksController');
const router = express.Router();
const verifyToken = require('../middleware/AuthMiddleware')


router.post('/save-users-books', UsersBooksController.saveUsersBooks);
router.get('/get-users-books', UsersBooksController.getUsersBooks);

module.exports = router;