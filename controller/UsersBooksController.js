const UsersBooks = require('../model/UsersBooksSchema');
const User = require('../model/UserSchema');
const Book = require('../model/BookSchema');
const Generator = require('../util/CodeGenerator');
const jwt = require('jsonwebtoken');
const Video = require("../model/VideoSchema");


const saveUsersBooks = async (req, res) => {
    try {
        const userEmail = req.body.email.trim();
        const bookName = req.body.bookName.trim();
        const subscriptionType = req.body.subscriptionType;
        const user = await User.findOne({email: userEmail});
        const book = await Book.findOne({bookName: bookName});
        if (!user) {
            console.log('User not found');
            return res.status(404).json({status: false, message: 'USER NOT FOUND'});
        }
        if (!book) {
            console.log('Book not found');
            return res.status(404).json({status: false, message: 'BOOK NOT FOUND'});
        }
        const usersBooksCode = Generator.generateCode('USER-BOOK');
        const newUserBook = new UsersBooks({
            usersBooksCode: usersBooksCode,
            userId: user._id,
            bookId: book._id,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            subscriptionType: subscriptionType
        });
        const savedUserBook = await newUserBook.save();
        user[subscriptionType] = true
        await user.save();
        const endDate = new Date(req.body.endDate);
        const now = new Date();
        const timeUntilEnd = endDate - now;
        if (timeUntilEnd > 0) {
            setTimeout(() => {
                user[subscriptionType] = false;
                user.save();
            }, timeUntilEnd);
        }
        res.status(201).json({status: true, message: 'USER BOOK SAVED SUCCESSFULLY', data: savedUserBook});
    } catch (error) {
        res.status(500).json({status: false, error: error.message});
    }
};


const getUsersBooks = async (req, res) => {
    const authorizedHeader = req.headers.authorization;
    if (!authorizedHeader) {
        return res.status(401).json({status: false, error: 'NO TOKEN PROVIDED'})
    }
    if (!authorizedHeader.startsWith('Bearer ')) {
        return res.status(401).json({status: false, error: 'INVALID TOKEN FORMAT'});
    }
    const token = authorizedHeader.slice(7);
    if (!token) {
        return res.status(401).json({status: false, error: 'INVALID TOKEN'});
    }
    try {
        const decodedData = jwt.verify(token, process.env.SECRET_KEY);
        const userEmail = decodedData.email;
        const user = await User.findOne({email: userEmail})
        const userId = user._id;
        const usersBooks = await UsersBooks.find({userId})
            .populate('userId')
            .populate('bookId')
            .exec();
        if (usersBooks.length === 0) {
            return res.status(200).json({status: true, message: 'NO DATA FOUND FOR USER', data: []});
        } else {
            return res.status(200).json({status: true, message: 'DATA RETRIEVED SUCCESSFULLY', data: usersBooks});
        }
    } catch (error) {
        return res.status(404).json({status: false, error: 'INVALID TOKEN'});
    }
};

const getUsersBooksByCategory = async (req, res) => {
    const authorizedHeader = req.headers.authorization;
    if (!authorizedHeader) {
        return res.status(401).json({status: false, error: 'NO TOKEN PROVIDED'})
    }
    if (!authorizedHeader.startsWith('Bearer ')) {
        return res.status(401).json({status: false, error: 'INVALID TOKEN FORMAT'});
    }
    const token = authorizedHeader.slice(7);
    if (!token) {
        return res.status(401).json({status: false, error: 'INVALID TOKEN'});
    }

    const { category } = req.body;

    try {
        const decodedData = jwt.verify(token, process.env.SECRET_KEY);
        const userEmail = decodedData.email;
        const user = await User.findOne({email: userEmail});
        const userId = user._id;

        let query = { userId };
        if (category) {
            query['bookId.bookCategory'] = category.toUpperCase();
        }
        const usersBooks = await UsersBooks.find(query)
            .populate('bookId')
            .exec();

        if (usersBooks.length === 0) {
            return res.status(200).json({status: true, message: 'NO DATA FOUND FOR USER', data: []});
        } else {
            return res.status(200).json({status: true, message: 'DATA RETRIEVED SUCCESSFULLY', data: usersBooks});
        }
    } catch (error) {
        return res.status(404).json({status: false, error: 'INVALID TOKEN'});
    }
};


const deleteUsersBooks = (req, res) => {
    UsersBooks.deleteOne({_id: req.headers._id}).then(result => {
        if (result.deletedCount > 0) {
            res.status(204).json({status: true, message: 'USERS BOOK DELETED SUCCESSFULLY'})
        } else {
            res.status(400).json({status: false, message: 'TRY AGAIN'})
        }
    }).catch((error) => {
        res.status(500).json(error);
    })
}

const getAllUsersBooks = (req, res) => {
    UsersBooks.find().then(result => {
        res.status(200).json({status: true, data: result})
    }).catch((error) => {
        res.status(500).json(error);
    })
}
const getUsersBooksWithData = async (req, res) => {
    try {
        const usersBooks = await UsersBooks.find()
            .populate('userId')
            .populate('bookId')
            .exec();
        res.status(200).json({ status: true, message: 'DATA RETRIEVED SUCCESSFULLY', data: usersBooks });
    } catch (error) {
        res.status(500).json({ status: false, message: 'INTERNAL SERVER ERROR' });
    }
};
const getUsersBooksCount = (req, res) => {
    UsersBooks.countDocuments()
        .then(count => {
            res.status(200).json({ status: true, count: count });
        })
        .catch(error => {
            res.status(500).json({ status: false, error: error.message });
        });
};



module.exports = {
    saveUsersBooks,
    getUsersBooks,
    deleteUsersBooks,
    getAllUsersBooks,
    getUsersBooksWithData,
    getUsersBooksCount
}