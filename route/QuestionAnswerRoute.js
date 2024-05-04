const express = require('express');
const router = express.Router();
const QuestionAnswerController = require('../controller/QuestionAnswerController')
const verifyPost = require('../middleware/AdminMiddleware')


router.post('/save-question-answer', verifyPost, QuestionAnswerController.saveQuestionAnswer);
router.put('/update-question-answer', verifyPost, QuestionAnswerController.updateQuestionAnswer);
router.delete('/delete-question-answer', verifyPost, QuestionAnswerController.deleteQuestionAnswer);
router.get('/find-question-answer', QuestionAnswerController.findQuestionAnswer);
router.get('/find-all-question-answers', QuestionAnswerController.findAllQuestionAnswers);
router.get('/get-question-answers-count', QuestionAnswerController.getQuestionAnswersCount);
router.get('/get-all-questions-from-question-answers', QuestionAnswerController.getAllQuestionsFromQuestionAnswers);


module.exports = router;