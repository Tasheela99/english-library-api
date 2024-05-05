const UsersBooks = require('../model/UsersBooksSchema');
const User = require('../model/UserSchema');
const Book = require('../model/BookSchema');
const Generator = require('../util/CodeGenerator');
const jwt = require('jsonwebtoken');


const saveUsersBooks = async (req, res) => {

    /*    http://localhost:3000/api/v1/users-books/add-permission

        {
            "email":"tasheelajay1999@gmail.com",
            "bookName":"Grammar Book O2",
            "subscriptionType":"LifeTimeSubscriber",
            "startDate":"2024-05-01",
            "endDate":"2025-05-01"
        }*/

    try {
        const userEmail = req.body.email;
        const bookName = req.body.bookName;
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

    /*http://localhost:3000/api/v1/users-books/get-users-books*/

    const token = req.headers.authorization.split(' ')[1];
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

    /*http://localhost:3000/api/v1/users-books/get-users-books-by-category?category=GRAMMAR*/

    const token = req.headers.authorization.split(' ')[1];
    const category = req.query.category;
    try {
        const decodedData = jwt.verify(token, process.env.SECRET_KEY);
        const userEmail = decodedData.email;
        const user = await User.findOne({email: userEmail});
        const userId = user._id;

        const usersBooks = await UsersBooks.find({userId})
            .populate('userId')
            .populate({
                path: 'bookId',
                match: {bookCategory: category}
            })
            .exec();
        const filteredBooks = usersBooks.filter(userBook => userBook.bookId !== null);

        if (filteredBooks.length === 0) {
            return res.status(200).json({status: true, message: 'NO DATA FOUND FOR USER', data: []});
        } else {
            return res.status(200).json({status: true, message: 'DATA RETRIEVED SUCCESSFULLY', data: filteredBooks});
        }
    } catch (error) {
        return res.status(404).json({status: false, error: 'INVALID TOKEN'});
    }

};


const deleteUsersBooks = (req, res) => {

    /*http://localhost:3000/api/v1/users-books/remove-permission?userBookId=54123154sjhhgs*/

    const userBookId = req.query.userBookId;

    UsersBooks.deleteOne({_id: userBookId}).then(result => {
        if (result.deletedCount > 0) {
            res.status(204).json({status: true, message: 'USERS BOOK DELETED SUCCESSFULLY'})
        } else {
            res.status(400).json({status: false, message: 'TRY AGAIN'})
        }
    }).catch((error) => {
        res.status(500).json(error);
    })
}

const getUsersBookById = (req, res) => {

    /*http://localhost:3000/api/v1/users-books/get-all-users-book-by-id?userBookId=54123154sjhhgs*/

    const userBookId = req.params.userBookId;
    UsersBooks.findById(userBookId)
        .then(result => {
            if (!result) {
                return res.status(404).json({status: false, message: 'USER BOOK NOT FOUND'});
            }
            res.status(200).json({status: true, data: result});
        })
        .catch(error => {
            res.status(500).json(error);
        });
}

const getUsersBooksWithData = async (req, res) => {

    /*http://localhost:3000/api/v1/users-books/get-all-users-books-with-data*/

    try {
        const usersBooks = await UsersBooks.find()
            .populate('userId')
            .populate('bookId')
            .exec();
        res.status(200).json({status: true, message: 'DATA RETRIEVED SUCCESSFULLY', data: usersBooks});
    } catch (error) {
        res.status(500).json({status: false, message: 'INTERNAL SERVER ERROR'});
    }
};
const getUsersBooksCount = (req, res) => {

    /*http://localhost:3000/api/v1/users-books/users-books-count*/

    UsersBooks.countDocuments()
        .then(count => {
            res.status(200).json({status: true, count: count});
        })
        .catch(error => {
            res.status(500).json({status: false, error: error.message});
        });
};


module.exports = {
    saveUsersBooks,
    getUsersBooksByCategory,
    getUsersBooks,
    deleteUsersBooks,
    getUsersBookById,
    getUsersBooksWithData,
    getUsersBooksCount
}