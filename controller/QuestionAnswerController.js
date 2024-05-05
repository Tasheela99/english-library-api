const QuestionAnswer = require('../model/QuestionAnswerSchema');
const lodash = require('lodash')

const saveQuestionAnswer = async (req, res) => {

    /*http://localhost:3000/api/v1/question-answers/save-question-answer*/

    /* {
         "question": "What is the capital of SriLanka?",
         "questionInSinhala": "What is the capital of SriLanka? In Sinhala",
         "bookCategory": "FREE",
         "answers": ["Colombo", "Kandy", "Matale","Jaffna"],
         "questionAnswerResource": "https://example.com/resources/qa001"
     }*/

    const count = await QuestionAnswer.countDocuments();
    const questionAnswerCode = "QA-" + (count + 1);
    const tempQuestionAnswer = new QuestionAnswer({
        questionAnswerCode,
        question: req.body.question,
        questionInSinhala: req.body.questionInSinhala,
        bookCategory: req.body.bookCategory,
        answers: req.body.answers,
        questionAnswerResource: req.body.questionAnswerResource,
        timeLimit: 120
    });

    tempQuestionAnswer.save().then(result => {
        res.status(201).json({
            status: true,
            message: 'QUESTION AND ANSWERS SAVED SUCCESSFULLY',
            data: questionAnswerCode
        });
    }).catch((error) => {
        res.status(500).json(error);
    })
}

const findQuestionAnswer = (req, res) => {

    /*http://localhost:3000/api/v1/question-answers/find-question-answer?qaId=663709b61dad653406461df1*/

    const qaId = req.query.qaId;
    QuestionAnswer.findById({_id: qaId}).then(result => {
        if (result == null) {
            res.status(404).json({status: false, message: 'QUESTION NOT FOUND'})
        } else {
            res.status(200).json({status: true, data: result})
        }
    }).catch((error) => {
        res.status(500).json(error);
    })
}

const updateQuestionAnswer = (req, res) => {

    /*http://localhost:3000/api/v1/question-answers/update-question-answer?qaId=663709b61dad653406461df1*/

    const qaId = req.query.qaId;
    QuestionAnswer.updateOne({_id: qaId}, {
        $set: {
            question: req.body.question,
            questionInSinhala: req.body.questionInSinhala,
            answers: req.body.answers,
            questionAnswerResource: req.body.questionAnswerResource,
        }
    }).then(result => {
        if (result.modifiedCount > 0) {
            res.status(201).json({status: true, message: 'QUESTION AND ANSWER UPDATED SUCCESSFULLY'})
        } else {
            res.status(200).json({status: false, message: 'TRY AGAIN'})
        }
    }).catch((error) => {
        res.status(500).json(error);
    })
}

const deleteQuestionAnswer = (req, res) => {

    /*http://localhost:3000/api/v1/question-answers/delete-question-answer?qaId=663709b61dad653406461df1*/

    const qaId = req.query.qaId;
    QuestionAnswer.deleteOne({_id: qaId}).then(result => {
        if (result.deletedCount > 0) {
            res.status(204).json({status: true, message: 'QUESTION AND ANSWER DELETED SUCCESSFULLY'})
        } else {
            res.status(400).json({status: false, message: 'TRY AGAIN'})
        }
    }).catch((error) => {
        res.status(500).json(error);
    })
}

const findAllQuestionAnswers = (req, res) => {

    /*http://localhost:3000/api/v1/question-answers/find-all-question-answers*/

    QuestionAnswer.find().sort({question: 1}).then(result => {
        res.status(200).json({status: true, data: result})
    }).catch((error) => {
        res.status(500).json(error);
    })
}

const getQuestionAnswersCount = (req, res) => {

    /*http://localhost:3000/api/v1/question-answers/get-question-answers-count*/

    QuestionAnswer.countDocuments()
        .then(count => {
            res.status(200).json({status: true, count: count});
        })
        .catch(error => {
            res.status(500).json({status: false, error: error.message});
        });
};

const getAllQuestionsFromQuestionAnswers = (req, res) => {

    /*http://localhost:3000/api/v1/question-answers/get-all-questions-from-question-answers*/

    QuestionAnswer.find({}, ['question', 'questionInSinhala']).then(result => {
        const shuffledQuestions = lodash.shuffle(result);
        res.status(200).json({status: true, message: "All Questions", data: shuffledQuestions});
    }).catch((error) => {
        res.status(500).json(error);
    })
}

const updateTimeLimit = async (req, res) => {

    /*http://localhost:3000/api/v1/question-answers/update-time-limit
    {
        "timeLimit":120
    }
     */

    const updatedTimeLimit = req.body.timeLimit;
    try {
        const questions = await QuestionAnswer.find();
        await Promise.all(questions.map(async (question) => {
            question.timeLimit = updatedTimeLimit;
            await question.save();
        }));
        res.status(200).json({
            status: true,
            message: 'TIME LIMIT UPDATED FOR QUESTIONS SUCCESSFULLY',
            data: {updatedTimeLimit}
        });
    } catch (error) {
        res.status(500).json(error);
    }
}


module.exports = {
    saveQuestionAnswer,
    findQuestionAnswer,
    updateQuestionAnswer,
    deleteQuestionAnswer,
    findAllQuestionAnswers,
    getQuestionAnswersCount,
    getAllQuestionsFromQuestionAnswers,
    updateTimeLimit

}