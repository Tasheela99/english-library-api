const Book = require('../model/BookSchema');
const Generator = require('../util/CodeGenerator')

const saveBook = (req, res) => {

    /*   http://localhost:3000/api/v1/books/save-book

       {
           "bookName":"Grammar Book 3",
           "bookCategory":"GRAM",
           "bookPreviewImage":"http://localhost:3000/api/v1/books/save-book.jpg",
           "bookResource":"http://localhost:3000/api/v1/books/save-book.pdf",
           "bookPages":65
       }*/

    const bookCategory = req.body.bookCategory;
    const bookCode = Generator.generateCode(bookCategory);

    const tempBook = new Book({
        bookCode: bookCode,
        bookName: req.body.bookName,
        bookCategory: req.body.bookCategory,
        bookPreviewImage: req.body.bookPreviewImage,
        bookResource: req.body.bookResource,
        bookPages: req.body.bookPages
    });

    tempBook.save().then(result => {
        res.status(201).json({status: true, message: 'BOOK SAVED SUCCESSFULLY'});
    }).catch((error) => {
        res.status(500).json(error);
    })
}
const findBook = (req, res) => {
    /*
        http://localhost:3000/api/v1/books/find-book?bookId=6634dbf8985ba5aec44dab7b
    */

    const bookId = req.query.bookId;
    Book.findById({_id: bookId}).then(result => {
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

    /*    http://localhost:3000/api/v1/books/update-book?bookId=6634dbf8985ba5aec44dab7b

        {
            "bookName":"Grammar Book 4",
            "bookCategory":"GRAM",
            "bookPreviewImage":"http://localhost:3000/api/v1/books/save-book.jpg",
            "bookResource":"http://localhost:3000/api/v1/books/save-book.pdf",
            "bookPages":100
        }*/

    const bookId = req.query.bookId;
    Book.updateOne({_id: bookId}, {
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

    /*
        http://localhost:3000/api/v1/books/delete-book?bookId=6634dbf8985ba5aec44dab7b
    */

    const bookId = req.query.bookId;

    Book.deleteOne({_id: bookId}).then(result => {
        if (result.deletedCount > 0) {
            res.status(204).json({status: true, message: 'BOOK DELETED SUCCESSFULLY'});
        } else {
            res.status(400).json({status: false, message: 'TRY AGAIN'});
        }
    }).catch((error) => {
        res.status(500).json(error);
    });
};
const findAllBooks = (req, res) => {

    /*
        http://localhost:3000/api/v1/books/find-all-books
    */

    Book.find().sort({bookName: 1}).then(result => {
        res.status(200).json({status: true, data: result})
    }).catch((error) => {
        res.status(500).json(error);
    })
}

const getBookCount = (req, res) => {

/*
    http://localhost:3000/api/v1/books/books-count
*/

    Book.countDocuments()
        .then(count => {
            res.status(200).json({status: true, count: count});
        })
        .catch(error => {
            res.status(500).json({status: false, error: error.message});
        });
};

const getBooksByCategory = (req, res) => {

/*
    http://localhost:3000/api/v1/books/get-books-by-category?category=GRAMMAR
*/

    let category = req.query.category;

    Book.find({bookCategory: category})
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
    getBooksByCategory
}