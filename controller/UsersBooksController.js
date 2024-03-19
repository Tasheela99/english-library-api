const UsersBooks = require('../model/UsersBooksSchema');
const User = require('../model/UserSchema');
const Book = require('../model/BookSchema');
const Generator = require('../util/CodeGenerator');


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
        user[subscriptionType] = true;
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

const jwt = require('jsonwebtoken');

const getUsersBooks = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ status: false, message: 'Bearer token is required' });
        }
        const token = authHeader.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decodedToken.userId;
        const userBooks = await UsersBooks.find({ userId: userId });

        res.status(200).json({ status: true, data: userBooks });
    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }
};




module.exports = {
    saveUsersBooks,getUsersBooks
}