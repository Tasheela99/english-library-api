const jwt = require('jsonwebtoken');
const User = require('../model/UserSchema')
const QuestionAnswer = require('../model/QuestionAnswerSchema');
const UserQuestionAttempt = require('../model/UserQuestionAttemptSchema');
const lodash = require("lodash");

const getAvailableQuestions = async (req, res) => {

    /*http://localhost:3000/api/v1/question-attempts/available-questions?category=SENT*/

    const token = req.headers.authorization.split(' ')[1];
    const requestedCategory = req.query.category;
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userEmail = decoded.email;
        const user = await User.findOne({email: userEmail});
        if (!user) {
            return res.status(404).json({status: false, message: 'USER NOT FOUND'});
        }
        const matchCondition = {
            'userAttempts.user': {$ne: user._id}
        };
        if (requestedCategory) {
            matchCondition.bookCategory = requestedCategory;
        }
        const categorizedQuestions = await QuestionAnswer.aggregate([
            {$match: matchCondition},
            {$group: {_id: '$bookCategory', questions: {$push: '$$ROOT'}, count: {$sum: 1}}}
        ]);

        categorizedQuestions.forEach(category => {
            category.questions = lodash.shuffle(category.questions);
        });
        res.status(200).json({status: true, data: categorizedQuestions});
    } catch (error) {
        res.status(500).json(error);
    }
};

const attemptQuestion = async (req, res) => {

    /*
        http://localhost:3000/api/v1/question-attempts/attempt-question?questionId=663709d31dad653406461dfd

        {
            "answer":"Kandy"
        }
    */

    const token = req.headers.authorization.split(' ')[1];
    const questionId = req.query.questionId;
    const userAnswer = req.body.answer;

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userEmail = decoded.email;
        const user = await User.findOne({email: userEmail});
        if (!user) {
            return res.status(404).json({status: false, message: 'USER NOT FOUND'});
        }
        const question = await QuestionAnswer.findById(questionId);
        if (!question) {
            return res.status(404).json({status: false, message: 'QUESTION NOT FOUND'});
        }
        const timeLimitInSeconds = question.timeLimit;
        let isCorrect = false;
        let marksScored = 0;
        let timerExpired = false;
        setTimeout(() => {
            timerExpired = true;
        }, timeLimitInSeconds * 1000);

        while (!isCorrect && !timerExpired) {
            isCorrect = question.answers.includes(userAnswer);

            if (isCorrect) {
                marksScored = 2;
            } else {
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        if (timerExpired && !isCorrect) {
            marksScored = 0;
        }
        user.score += marksScored;
        await user.save();

        const newUserAttempt = new UserQuestionAttempt({
            user: user._id,
            question: questionId,
            answer: userAnswer,
            isCorrect,
            marksScored,
        });
        const savedUserAttempt = await newUserAttempt.save();
        question.userAttempts.push(savedUserAttempt._id);
        await question.save();
        const question1 = await QuestionAnswer.findById(savedUserAttempt.question);
        console.log(question1)
        res.status(200).json({
            status: true,
            data: {
                userAttempt: [question1],
                marksScored
            }
        });
    } catch (error) {
        res.status(500).json(error);
    }
};

const getTotalUserMarks = async (req, res) => {

    /*http://localhost:3000/api/v1/question-attempts/total-marks*/


    const token = req.headers.authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userEmail = decoded.email;
        const user = await User.findOne({email: userEmail});

        if (!user) {
            return res.status(404).json({status: false, message: 'USER NOT FOUND'});
        }
        const userAttempts = await UserQuestionAttempt.find({user: user._id});
        const totalMarks = userAttempts.reduce((total, attempt) => total + attempt.marksScored, 0);

        res.status(200).json({status: true, data: {totalMarks}});
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = {
    getAvailableQuestions,
    attemptQuestion,
    getTotalUserMarks
}
