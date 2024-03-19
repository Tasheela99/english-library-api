const mongoose = require('mongoose');
const BookSchema = new mongoose.Schema({
    usersBooksCode: {type: String, required: true},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true},
    bookId: {type: mongoose.Schema.Types.ObjectId, ref: 'Books', required: true},
    startDate: {type: Date},
    endDate: {type: Date},
});

module.exports = mongoose.model('UsersBooks', BookSchema);
