const express = require('express');
const UserController = require('../controller/UserController');
const router = express.Router();
const verifyToken = require('../middleware/AuthMiddleware')
const verifyAdmin = require('../middleware/AdminMiddleware')


router.post('/sign-up', UserController.signUp);
router.post('/sign-in', UserController.signIn);
router.post('/sign-out', UserController.signOut);
router.get('/find-user',verifyAdmin, UserController.findUser);
router.delete('/delete-user', verifyAdmin, UserController.deleteUser);
router.get('/get-all-users',verifyAdmin, UserController.getAllUsers);
router.get('/get-all-recent-logged-in-users', verifyAdmin, UserController.getAllRecentLoggedInUsers);
router.get('/get-user-count',verifyAdmin, UserController.getUserCount);
router.get('/get-user-id', UserController.getUserIdByEmail);
router.post('/initialize-admin', UserController.initializeAdmin);
router.post('/verify', UserController.verifyUser);
router.post('/resend-otp', UserController.resendOtp);
router.post('/forgot-password', UserController.forgotPassword);
router.put('/reset-password/:token', UserController.resetPassword);
router.put('/change-password',verifyToken, UserController.changePassword);
router.put('/update-profile',verifyToken, UserController.updateProfile);

module.exports = router;