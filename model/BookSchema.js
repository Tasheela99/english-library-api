const mongoose = require('mongoose');
const BookSchema = new mongoose.Schema({
    bookCode:{type:String, required:true},
    bookName:{type:String, required:true},
    bookCategory:{type:String, required:true},
    bookPreviewImage:{type:String, required:true},
    bookResource:{type:String, required:true},
    bookPages:{type:Number, required:true},
    bookEnteredDate:{type:String, required:true},
});

module.exports = mongoose.model('Book',BookSchema);
