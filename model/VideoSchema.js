const mongoose = require('mongoose');
const VideoSchema = new mongoose.Schema({
    videoCode:{type:String, required:true},
    videoTitle:{type:String, required:true},
    videoPreviewImage:{type:String, required:true},
    videoResource:{type:String, required:true},
});

module.exports = mongoose.model('Video',VideoSchema);