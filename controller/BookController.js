const Book = require('../model/BookSchema');
const Generator = require('../util/CodeGenerator')
const User = require("../model/UserSchema");
const {param} = require("express/lib/router");

const saveBook = (req, res) => {

    const bookCategory = req.body.bookCategory;
    const bookCode = Generator.generateCode(bookCategory);

    const tempBook = new Book({
        bookCode: bookCode,
        bookName: req.body.bookName,
        bookCategory: req.body.bookCategory,
        bookPreviewImage: req.body.bookPreviewImage,
        bookResource: req.body.bookResource,
        bookPages: req.body.bookPages,
        bookEnteredDate: req.body.bookEnteredDate
    });

    tempBook.save().then(result => {
        res.status(201).json({status: true, message: 'BOOK SAVED SUCCESSFULLY'});
    }).catch((error) => {
        res.status(500).json(error);
    })
}
const findBook = (req, res) => {
    Book.findById({_id: req.headers._id}).then(result => {
        if (result == null) {
            res.status(404).json({status: false, message: 'BOOK NOT FOUND'})
        } else {
            res.status(200).json({status: true, data: result})
        }
    }).catch((error) => {
        res.status(500).json(error);
    })
}
const updateBook = (req, res) => {
    Book.updateOne({_id: req.headers._id}, {
        $set: {
            bookName: req.body.bookName,
            bookCategory: req.body.bookCategory,
            bookPreviewImage: req.body.bookPreviewImage,
            bookResource: req.body.bookResource,
            bookPages: req.body.bookPages,
        }
    }).then(result => {
        if (result.modifiedCount > 0) {
            res.status(201).json({status: true, message: 'BOOK UPDATED SUCCESSFULLY'})
        } else {
            res.status(200).json({status: false, message: 'TRY AGAIN'})
        }
    }).catch((error) => {
        res.status(500).json(error);
    })
}
const deleteBook = (req, res) => {
    Book.deleteOne({_id: req.headers._id}).then(result => {
        if (result.deletedCount > 0) {
            res.status(204).json({status: true, message: 'BOOK DELETED SUCCESSFULLY'})
        } else {
            res.status(400).json({status: false, message: 'TRY AGAIN'})
        }
    }).catch((error) => {
        res.status(500).json(error);
    })
}
const findAllBooks = (req, res) => {
    Book.find().sort({bookName:1}).then(result => {
        res.status(200).json({status: true, data: result})
    }).catch((error) => {
        res.status(500).json(error);
    })
}

const getBookCount = (req, res) => {
    Book.countDocuments()
        .then(count => {
            res.status(200).json({status: true, count: count});
        })
        .catch(error => {
            res.status(500).json({status: false, error: error.message});
        });
};

const getAllFreeBooks = (req, res) => {
    Book.find({bookCategory: "FREE"})
        .sort({bookName: 1})
        .then(result => {
            res.status(200).json({status: true, data: result})
        }).catch((error) => {
        res.status(500).json(error);
    })
}
const getAllGrammarBooks = (req, res) => {
    Book.find({bookCategory: "GRAMMAR"})
        .sort({bookName: 1})
        .then(result => {
            res.status(200).json({status: true, data: result})
        }).catch((error) => {
        res.status(500).json(error);
    })
}
const getAllSentencePatternBooks = (req, res) => {
    Book.find({bookCategory: "SENTENCE_PATTERN"})
        .sort({bookName: 1})
        .then(result => {
            res.status(200).json({status: true, data: result})
        }).catch((error) => {
        res.status(500).json(error);
    })
}
const getAllDialogueBooks = (req, res) => {
    Book.find({bookCategory: "DIALOGUE"})
        .sort({bookName: 1})
        .then(result => {
            res.status(200).json({status: true, data: result})
        }).catch((error) => {
        res.status(500).json(error);
    })
}


module.exports = {
    saveBook,
    findBook,
    updateBook,
    deleteBook,
    findAllBooks,
    getBookCount,
    getAllFreeBooks,
    getAllGrammarBooks,
    getAllSentencePatternBooks,
    getAllDialogueBooks
}