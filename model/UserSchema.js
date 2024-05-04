const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    code:{type:String, required:true},
    fullName:{type:String, required:true},
    email:{type:String, required:true},
    mobile:{type:String, required:true},
    password:{type:String, required:true},
    avatar:{type:String},
    loginTime:{type:Date},
    shortTimeSubscriber:{type:Boolean, required:true},
    yearlySubscriber:{type:Boolean, required:true},
    lifeTimeSubscriber:{type:Boolean, required:true},
    isAdmin:{type:Boolean, required:true},
    isUser:{type:Boolean, required:true},
    activeState:{type:Boolean, required:true},
    verificationToken:{type:String}

});

module.exports = mongoose.model('Users',UserSchema);
