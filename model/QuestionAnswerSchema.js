const mongoose = require('mongoose');

const QuestionAnswerSchema = new mongoose.Schema({
    questionAnswerCode: { type: String, required: true },
    question: { type: String, required: true },
    answers: [{ type: String, required: true }],
    questionAnswerResource: { type: String, required: true },
    userAttempts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserQuestionAttempt' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('QuestionAnswer', QuestionAnswerSchema);
