const QuestionAnswer = require('../model/QuestionAnswerSchema');
const lodash = require('lodash')

const saveQuestionAnswer = async (req, res) => {

    /* {
         "question": "What is the capital of SriLanka?",
         "answers": ["Colombo", "Kandy", "Matale","Jaffna"],
         "questionAnswerResource": "https://example.com/resources/qa001"
     }*/

    const count = await QuestionAnswer.countDocuments();
    const questionAnswerCode = "QA-" + (count + 1);

    const tempQuestionAnswer = new QuestionAnswer({
        questionAnswerCode,
        question: req.body.question,
        answers: req.body.answers,
        questionAnswerResource: req.body.questionAnswerResource,
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
    QuestionAnswer.findById({_id: req.headers._id}).then(result => {
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
    QuestionAnswer.updateOne({_id: req.headers._id}, {
        $set: {
            question: req.body.question,
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
    QuestionAnswer.deleteOne({_id: req.headers._id}).then(result => {
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
    QuestionAnswer.find().sort({question: 1}).then(result => {
        res.status(200).json({status: true, data: result})
    }).catch((error) => {
        res.status(500).json(error);
    })
}

const getQuestionAnswersCount = (req, res) => {
    QuestionAnswer.countDocuments()
        .then(count => {
            res.status(200).json({status: true, count: count});
        })
        .catch(error => {
            res.status(500).json({status: false, error: error.message});
        });
};

const getAllQuestionsFromQuestionAnswers = (req, res) => {
    QuestionAnswer.find({}, 'question').then(result => {
        const questions = result.map(item => item.question);
        const shuffledQuestions = lodash.shuffle(questions);
        res.status(200).json({ status: true, message: "All Questions", data: shuffledQuestions });
    }).catch((error) => {
        res.status(500).json(error);
    })
}



module.exports = {
    saveQuestionAnswer,
    findQuestionAnswer,
    updateQuestionAnswer,
    deleteQuestionAnswer,
    findAllQuestionAnswers,
    getQuestionAnswersCount,
    getAllQuestionsFromQuestionAnswers

}