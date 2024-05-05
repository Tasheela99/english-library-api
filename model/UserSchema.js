const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    code: {type: String, required: true},
    fullName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    mobile: {type: String, required: true},
    password: {type: String, required: true},
    avatar: {type: String},
    loginTime: {type: Date},
    shortTimeSubscriber: {type: Boolean, required: true},
    yearlySubscriber: {type: Boolean, required: true},
    lifeTimeSubscriber: {type: Boolean, required: true},
    isAdmin: {type: Boolean, required: true},
    isUser: {type: Boolean, required: true},
    activeState: {type: Boolean, required: true},
    verificationToken: {type: String},
    otp: {type: String, default: null},
    otpExpired: {type: Date, default: null},
    isVerified: {type: Boolean, required: true},
    passwordResetToken: {type: String},
    passwordResetTokenExpires: {type: Date, default: null}

});

module.exports = mongoose.model('Users', UserSchema);
