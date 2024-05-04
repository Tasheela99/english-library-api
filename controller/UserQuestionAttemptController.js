const jwt = require('jsonwebtoken');
const User = require('../model/UserSchema')


const QuestionAnswer = require('../model/QuestionAnswerSchema');
const UserQuestionAttempt = require('../model/UserQuestionAttemptSchema');
const lodash = require("lodash");
const {compareSync} = require("bcrypt");

// Get available questions for the authenticated user
// const getAvailableQuestions = async (req, res) => {
//     QuestionAnswer.find({}, 'question').then(result => {
//         const shuffledQuestions = lodash.shuffle(result);
//         res.status(200).json({status: true, message: "All Questions", data: shuffledQuestions});
//     }).catch((error) => {
//         res.status(500).json(error);
//     })
// }

const getAvailableQuestions = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userEmail = decoded.email;
        const user = await User.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({ status: false, message: 'USER NOT FOUND' });
        }

        const questions = await QuestionAnswer.find({ 'userAttempts.user': { $ne: user._id } });

        res.status(200).json({ status: true, data: questions });
    } catch (error) {
        res.status(500).json(error);
    }
};

// Attempt a question
const attemptQuestion = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const questionId = req.params.questionId;
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
        const isCorrect = question.answers.includes(userAnswer);
        let marksScored = 0;
        if (isCorrect) {
            marksScored = 2;
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


        res.status(200).json({
            status: true,
            data: {userAttempt: [question1.question, savedUserAttempt.answer, savedUserAttempt.isCorrect], marksScored}
        });
    } catch (error) {
        res.status(500).json(error);
    }
};

const getTotalUserMarks = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userEmail = decoded.email;
        const user = await User.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({ status: false, message: 'USER NOT FOUND' });
        }
        const userAttempts = await UserQuestionAttempt.find({ user: user._id });
        const totalMarks = userAttempts.reduce((total, attempt) => total + attempt.marksScored, 0);

        res.status(200).json({ status: true, data: { totalMarks } });
    } catch (error) {
        res.status(500).json(error);
    }
};


module.exports = {
    getAvailableQuestions,
    attemptQuestion,
    getTotalUserMarks
}
