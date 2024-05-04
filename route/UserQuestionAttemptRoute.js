const express = require('express');
const router = express.Router();
const UserQuestionAttemptsController = require('../controller/UserQuestionAttemptController');
const verifyToken = require('../middleware/AuthMiddleware')


router.get('/available-questions', UserQuestionAttemptsController.getAvailableQuestions);
router.post('/attempt-question/:questionId', verifyToken, UserQuestionAttemptsController.attemptQuestion);
router.get('/total-marks', UserQuestionAttemptsController.getTotalUserMarks);

module.exports = router;
