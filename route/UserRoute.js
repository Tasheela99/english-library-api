const express = require('express');
const UserController = require('../controller/UserController');
const router = express.Router();
const verifyToken = require('../middleware/AuthMiddleware')
const verifyPost = require('../middleware/AdminMiddleware')


router.post('/sign-up', UserController.signUp);
router.post('/sign-in', UserController.signIn);
router.post('/sign-out', UserController.signOut);
router.get('/find-user', UserController.findUser);
router.put('/update-user', verifyToken, UserController.updateUser);
router.delete('/delete-user',verifyPost, UserController.deleteUser);
router.get('/get-all-users', UserController.getAllUsers);
router.get('/get-all-recent-logged-in-users', UserController.getAllRecentLoggedInUsers);
router.get('/get-user-count', UserController.getUserCount);
router.get('/get-user-id', UserController.getUserIdByEmail);
router.post('/initialize-admin', UserController.initializeAdmin);

module.exports = router;