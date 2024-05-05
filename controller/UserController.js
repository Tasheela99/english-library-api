const UserSchema = require('../model/UserSchema');
const bcrypt = require('bcrypt');
const Generator = require('../util/CodeGenerator');
const jwt = require('jsonwebtoken');
const User = require('../model/UserSchema')
const sendGridMail = require('@sendgrid/mail')
const crypto = require('crypto')

const initializeAdmin = async () => {
    try {
        const adminEmail = "tasheelajay1999@gmail.com";
        const adminPassword = "admin123";
        const existingAdmin = await UserSchema.findOne({email: adminEmail});
        if (existingAdmin) {
            return;
        }
        bcrypt.hash(adminPassword, 10, function (err, hash) {
            if (err) {
                console.log("SOMETHING WENT WRONG")
            }
            const userCode = Generator.generateCode("ADMIN");
            const otp = Generator.generateOTP();
            const adminUser = new UserSchema({
                code: userCode,
                fullName: "Tasheela Jayawickrama",
                email: "tasheelajay1999@gmail.com",
                mobile: "0766308272",
                password: hash,
                avatar: "",
                loginTime: "",
                shortTimeSubscriber: true,
                yearlySubscriber: true,
                lifeTimeSubscriber: true,
                isAdmin: true,
                isUser: false,
                activeState: true,
                isVerified: true,
                otp: otp,
            });
            adminUser.save().then(() => {
                sendAdminPassword(adminEmail, adminPassword);
            })
        });
    } catch (error) {
        console.error('Error initializing admin:', error);
    }
};

const sendAdminPassword = (email, password) => {
    return new Promise((resolve, reject) => {
        sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);
        const message = {
            to: email,
            from: process.env.SENDGRID_EMAIL,
            subject: 'ADMIN Password',
            text: `Your ADMIN Password is: ${password} \n\nPlease Change This Password After Logged In to Your Account`,
            html: `<p>Your ADMIN Password is: <strong>${password}</strong> <br>Please Change This Password After Logged In to Your Account</p>`
        };
        sendGridMail.send(message)
            .then(() => {
                resolve();
            })
            .catch((error) => {
                reject(error);
            });
    });
}

const signUp = async (req, res) => {

    /*http://localhost:3000/api/v1/users/sign-up
   {
        "fullName":"Tasheela Jayawickrama",
        "email":"tasheelajay1999@gmail.com",
        "mobile":"0766308272",
        "password":"admin123"
    }
    */

    UserSchema.findOne({email: req.body.email}).then(async result => {
        if (result == null) {
            const otp = Generator.generateOTP();
            bcrypt.hash(req.body.password, 10, function (err, hash) {
                if (err) {
                    return res.status(500).json({message: 'SOMETHING WENT WRONG'})
                }
                const userCode = Generator.generateCode("USER");
                const User = new UserSchema({
                    code: userCode,
                    fullName: req.body.fullName,
                    email: req.body.email,
                    mobile: req.body.mobile,
                    password: hash,
                    avatar: "",
                    loginTime: "",
                    shortTimeSubscriber: false,
                    yearlySubscriber: false,
                    lifeTimeSubscriber: false,
                    isAdmin: false,
                    isUser: true,
                    activeState: true,
                    otp: otp,
                    isVerified: false
                });
                User.save().then(() => {
                    sendOtp(req.body.email, otp).then(() => {
                        res.status(201).json({status: true, message: 'USER SAVED SUCCESSFULLY'});
                    }).catch((error) => {
                        res.status(500).json({status: false, message: 'FAILED TO SEND OTP'});
                    });
                }).catch((error) => {
                    res.status(500).json({message: 'FAILED TO SAVE USER'});
                });
            });
        } else {
            res.status(409).json({status: false, message: 'EMAIL ALREADY EXISTS'})
        }
    }).catch((error) => {
        res.status(500).json(error);
    })
}

const sendOtp = (email, otp) => {
    return new Promise((resolve, reject) => {
        sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);
        const message = {
            to: email,
            from: 'tasheelajay1999@gmail.com',
            subject: 'OTP Verification',
            text: `Your OTP for verification is: ${otp}`,
            html: `<p>Your OTP for verification is: <strong>${otp}</strong></p>`
        };

        sendGridMail.send(message)
            .then(() => {
                console.log("OTP email sent successfully");
                resolve();
            })
            .catch((error) => {
                console.error("Error sending OTP email:", error);
                reject(error);
            });
    });
}

const resendOtp = async (req, res) => {
    try {
        const {email} = req.body;
        const user = await UserSchema.findOne({email});
        if (!user) {
            return res.status(404).json({status: false, message: 'USER NOT FOUND'});
        }
        const newOtp = Generator.generateOTP();
        user.otp = newOtp;
        user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes
        await user.save();
        await sendOtp(email, newOtp);
        return res.status(200).json({status: true, message: 'NEW OTP SENT SUCCESSFULLY'});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Internal server error'});
    }
};

const signIn = async (req, res) => {
    try {
        /*
        http://localhost:3000/api/v1/users/sign-in
        {
            "email":"tasheelajay1999@gmail.com",
            "password":"admin123"
        }
        */

        const selectedUser = await UserSchema.findOne({email: req.body.email});

        if (!selectedUser) {
            return res.status(404).json({status: false, message: 'USERNAME NOT FOUND'});
        }
        if (!selectedUser.isVerified) {
            return res.status(401).json({status: false, message: 'USER NOT VERIFIED'});
        }
        const isPasswordValid = await bcrypt.compare(req.body.password, selectedUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({status: false, message: "INCORRECT PASSWORD"});
        }
        selectedUser.loginTime = new Date().toISOString();
        await selectedUser.save();
        const token = jwt.sign({'email': selectedUser.email}, process.env.SECRET_KEY, {expiresIn: 3600});
        res.setHeader('Authorization', `Bearer ${token}`);
        return res.status(200).json({status: true, message: "USER LOGIN SUCCESSFULLY"});

    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Internal server error'});
    }
}

const verifyUser = async (req, res) => {

    /*    http://localhost:3000/api/v1/users/verify
        {
            "email":"tasheelajayawickrama1999@gmail.com",
            "otp":"816417"
        }*/

    try {
        const {email, otp} = req.body;
        const user = await UserSchema.findOne({email});
        if (!user) {
            return res.status(404).json({status: false, message: 'USER NOT FOUND'});
        }
        const isOtpValid = user.otp
        if (!isOtpValid) {
            return res.status(401).json({status: false, message: 'OTP EXPIRED OR NOT SET'});
        }
        if (otp !== user.otp) {
            return res.status(401).json({status: false, message: 'INCORRECT OTP'});
        }
        user.isVerified = true;
        user.otp = null;
        user.otpExpiry = null;
        await user.save();
        return res.status(200).json({status: true, message: 'USER VERIFICATION SUCCESSFUL'});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Internal server error'});
    }
};

const signOut = (req, res) => {
    res.status(200).json({status: true, message: "USER LOGOUT SUCCESSFULLY"})
}

const findUser = (req, res) => {
    User.findById({_id: req.headers._id}).then(result => {
        if (result == null) {
            res.status(404).json({status: false, message: 'USER NOT FOUND'})
        } else {
            res.status(200).json({status: true, data: result})
        }
    }).catch((error) => {
        res.status(500).json(error);
    })
}

const deleteUser = (req, res) => {
    User.deleteOne({_id: req.headers._id}).then(result => {
        if (result.deletedCount > 0) {
            res.status(204).json({status: true, message: 'USER DELETED SUCCESSFULLY'})
        } else {
            res.status(400).json({status: false, message: 'TRY AGAIN'})
        }
    }).catch((error) => {
        res.status(500).json(error);
    })
}

const getAllUsers = (req, res) => {
    User.find().then(result => {
        res.status(200).json({status: true, data: result})
    }).catch((error) => {
        res.status(500).json(error);
    })
}

const getAllRecentLoggedInUsers = (req, res) => {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    User.find({loginTime: {$gte: twoDaysAgo}})
        .then(result => {
            res.status(200).json({status: true, data: result});
        })
        .catch(error => {
            res.status(500).json(error);
        });
};

const getUserCount = (req, res) => {
    User.countDocuments()
        .then(count => {
            res.status(200).json({status: true, count: count});
        })
        .catch(error => {
            res.status(500).json({status: false, error: error.message});
        });
};

const getUserIdByEmail = (req, res) => {
    const userEmail = req.body.email;

    User.findOne({email: userEmail})
        .then(user => {
            if (!user) {
                return res.status(404).json({status: false, message: 'USER NOT FOUND'});
            }
            res.status(200).json({status: true, userId: user._id});
        })
        .catch(error => {
            res.status(500).json({status: false, error: error.message});
        });
};

const forgotPassword = async (req, res) => {
    /* http://localhost:3000/api/v1/users/forgot-password
     {
         "email":"tasheelajayawickrama1999@gmail.com"
     }*/

    try {
        const email = req.body.email;
        const user = await UserSchema.findOne({email: email});

        if (!user) {
            return res.status(404).json({status: false, message: 'USER NOT FOUND'});
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.passwordResetToken = resetToken;
        user.passwordResetTokenExpires = Date.now() + 3600000;

        await user.save();
        await sendResetPasswordEmail(email, resetToken);
        return res.status(200).json({status: true, message: 'RESET PASSWORD EMAIL SENT SUCCESSFULLY'});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Internal server error', error: error.message});
    }
};

const resetPassword = async (req, res) => {

    /* http://localhost:3000/api/v1/users/reset-password/11e2dc0bcec416a91fdd0ce0feda0cb52321c084
     {
         "newPassword":"123456"
     }*/

    try {
        const {token} = req.params;
        const {newPassword} = req.body;

        const user = await UserSchema.findOne({
            passwordResetToken: token,
            passwordResetTokenExpires: {$gt: Date.now()}
        });

        if (!user) {
            return res.status(400).json({status: false, message: 'INVALID OR EXPIRED TOKEN'});
        }

        const newHashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = newHashedPassword;
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpires = undefined;

        await user.save();
        return res.status(200).json({status: true, message: 'PASSWORD RESET SUCCESSFUL'});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Internal server error', error: error.message});
    }
};

const sendResetPasswordEmail = (email, resetToken) => {
    return new Promise((resolve, reject) => {
        sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);
        const message = {
            to: email,
            from: process.env.SENDGRID_EMAIL,
            subject: 'Reset Password',
            text: `To reset your password, please click the following link: ${process.env.CLIENT_URL}/users/reset-password/${resetToken}`,
            html: `<p>To reset your password, please click the following link: <a href="${process.env.CLIENT_URL}/users/reset-password/${resetToken}">Reset Password</a></p>`
        };

        sendGridMail.send(message)
            .then(() => {
                console.log("Reset password email sent successfully");
                resolve();
            })
            .catch((error) => {
                console.error("Error sending reset password email:", error);
                reject(error);
            });
    });
};

const changePassword = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userEmail = decoded.email;
        const user = await User.findOne({email: userEmail});
        const userId = user._id;
        if (!user) {
            return res.status(404).json({status: false, message: 'USER NOT FOUND'});
        }
        User.updateOne({_id: userId}, {
            $set: {
                password: await bcrypt.hash(req.body.password)
            }
        }).then(result => {
            if (result.modifiedCount > 0) {
                res.status(201).json({status: true, message: 'PASSWORD UPDATED SUCCESSFULLY'})
            } else {
                res.status(200).json({status: false, message: 'TRY AGAIN'})
            }
        }).catch((error) => {
            res.status(500).json(error);
        })
    } catch (e) {
        res.status(500).json(error);
    }
}

const updateProfile = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userEmail = decoded.email;
        const user = await User.findOne({email: userEmail});
        const userId = user._id;
        if (!user) {
            return res.status(404).json({status: false, message: 'USER NOT FOUND'});
        }
        User.updateOne({_id: userId}, {
            $set: {
                fullName: req.body.fullName,
                password: await bcrypt.hash(req.body.password),
                avatar: req.body.avatar,
                mobile: req.body.mobile
            }
        }).then(result => {
            if (result.modifiedCount > 0) {
                res.status(201).json({status: true, message: 'PROFILE UPDATED SUCCESSFULLY'})
            } else {
                res.status(200).json({status: false, message: 'TRY AGAIN'})
            }
        }).catch((error) => {
            res.status(500).json(error);
        })
    } catch (e) {
        res.status(500).json(error);
    }
}

module.exports = {
    initializeAdmin,
    signUp,
    signIn,
    signOut,
    findUser,
    deleteUser,
    getAllUsers,
    getAllRecentLoggedInUsers,
    getUserCount,
    getUserIdByEmail,
    verifyUser,
    resendOtp,
    forgotPassword,
    resetPassword,
    changePassword,
    updateProfile
}