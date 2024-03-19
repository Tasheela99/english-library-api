const express = require('express');
const UserController = require('../controller/UserController');
const router = express.Router();
const verifyToken = require('../middleware/AuthMiddleware')


router.post('/signup', UserController.signUp);
router.post('/signin', UserController.signIn);
router.get('/find-user', UserController.findUser);
router.put('/update-user', verifyToken, UserController.updateUser);
router.delete('/delete-user', UserController.deleteUser);
router.get('/get-all-users', UserController.getAllUsers);
router.get('/get-all-recent-logged-in-users', UserController.getAllRecentLoggedInUsers);
router.get('/get-user-count', UserController.getUserCount);
router.get('/get-user-id', UserController.getUserIdByEmail);

module.exports = router;