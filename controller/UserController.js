const UserSchema = require('../model/UserSchema');
const bcrypt = require('bcrypt');
const Generator = require('../util/CodeGenerator');
const jwt = require('jsonwebtoken');
const User = require('../model/UserSchema')
const nodemailer = require('nodemailer')
const crypto = require('crypto');


const initializeAdmin = async () => {
    try {
        const existingAdmin = await UserSchema.findOne({ email: 'tasheelajay1999@gmail.com' });
        if (existingAdmin) {
            return;
        }
        bcrypt.hash('admin123', 10, function (err, hash) {
            if (err) {
                console.log("SOMETHING WENT WRONG")
            }
            const userCode = Generator.generateCode("ADMIN");
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
                activeState: true
            });
            adminUser.save()
        });
    } catch (error) {
        console.error('Error initializing admin:', error);
    }
};




const signUp = async (req, res) => {

    /*http://localhost:3000/api/v1/users/sign-in
   {
        "fullName":"Tasheela Jayawickrama",
        "email":"tasheelajay1999@gmail.com",
        "mobile":"0766308272",
        "password":"admin123"
    }
    */

    UserSchema.findOne({email: req.body.email}).then(async result => {

        if (result == null) {
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
                    activeState: true
                });
                User.save().then(() => {
                    res.status(201).json({status: true, message: 'USER SAVED SUCCESSFULLY'})
                }).catch((error) => {
                    res.status(500).json(error)
                });
            });
        } else {
            res.status(409).json({status: false, message: 'EMAIL ALREADY EXISTS'})
        }
    }).catch((error) => {
        res.status(500).json(error);
    })
}


const signIn = async (req, res) => {

   /*http://localhost:3000/api/v1/users/sign-in
   {
        "email":"tasheelajay1999@gmail.com",
        "password":"admin123"
    }
    */

    UserSchema.findOne({email: req.body.email}).then(selectedUser => {
        if (selectedUser == null) {
            return res.status(404).json({status: false, message: 'USERNAME NOT FOUND'})
        } else {
            bcrypt.compare(req.body.password, selectedUser.password, function (err, result) {
                if (err) {
                    return res.status(500).json(err);
                }
                if (result) {

                    selectedUser.loginTime = new Date().toISOString();
                    selectedUser.save().then(() => {
                        const token = jwt.sign({'email': selectedUser.email}, process.env.SECRET_KEY, {expiresIn: 3600});
                        res.setHeader('Authorization', `Bearer ${token}`);
                        return res.status(200).json({status: true, message: "USER LOGIN SUCCESSFULLY"});
                    }).catch((error) => {
                        return res.status(500).json(error);
                    });
                } else {
                    return res.status(401).json({status: false, message: "INCORRECT PASSWORD"});
                }
            })
        }
    }).catch((error) => {
        res.status(500).json(error);
    })
}

const signOut=(req,res)=>{
    res.status(200).json({status:true,message:"USER LOGOUT SUCCESSFULLY"})
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
const updateUser = (req, res) => {
    User.updateOne({_id: req.headers._id}, {
        $set: {
            email: req.body.email,
            fullName: req.body.fullName,
            mobile: req.body.mobile,
            avatar: req.body.avatar,
        }
    }).then(result => {
        if (result.modifiedCount > 0) {
            res.status(201).json({status: true, message: 'USER UPDATED SUCCESSFULLY'})
        } else {
            res.status(200).json({status: false, message: 'TRY AGAIN'})
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


module.exports = {
    initializeAdmin,
    signUp,
    signIn,
    signOut,
    findUser,
    updateUser,
    deleteUser,
    getAllUsers,
    getAllRecentLoggedInUsers,
    getUserCount,
    getUserIdByEmail
}