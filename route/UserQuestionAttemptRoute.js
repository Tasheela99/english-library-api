const express = require('express');
const router = express.Router();
const UserQuestionAttemptsController = require('../controller/UserQuestionAttemptController');
const verifyToken = require('../middleware/AuthMiddleware')


router.get('/available-questions', verifyToken, UserQuestionAttemptsController.getAvailableQuestions);
router.post('/attempt-question', verifyToken, UserQuestionAttemptsController.attemptQuestion);
router.get('/total-marks', verifyToken, UserQuestionAttemptsController.getTotalUserMarks);

module.exports = router;
