// UserQuestionAttemptSchema.js
const mongoose = require('mongoose');

const userQuestionAttemptSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    question: {type: mongoose.Schema.Types.ObjectId, ref: 'QuestionAnswer', required: true},
    answer: {type: String, required: true},
    isCorrect: {type: Boolean, required: true},
    marksScored: {type: Number, required: true},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model('UserQuestionAttempt', userQuestionAttemptSchema);
