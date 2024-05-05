const express = require('express');
const router = express.Router();
const QuestionAnswerController = require('../controller/QuestionAnswerController')
const verifyAdmin = require('../middleware/AdminMiddleware')


router.post('/save-question-answer', verifyAdmin, QuestionAnswerController.saveQuestionAnswer);
router.put('/update-question-answer', verifyAdmin, QuestionAnswerController.updateQuestionAnswer);
router.put('/update-time-limit', verifyAdmin, QuestionAnswerController.updateTimeLimit);
router.delete('/delete-question-answer', verifyAdmin, QuestionAnswerController.deleteQuestionAnswer);
router.get('/find-question-answer', QuestionAnswerController.findQuestionAnswer);
router.get('/find-all-question-answers', QuestionAnswerController.findAllQuestionAnswers);
router.get('/get-question-answers-count', QuestionAnswerController.getQuestionAnswersCount);
router.get('/get-all-questions-from-question-answers', QuestionAnswerController.getAllQuestionsFromQuestionAnswers);


module.exports = router;