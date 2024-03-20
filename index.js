const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

require('dotenv').config();
const PORT = process.env.SERVET_PORT || 3000;

const BookRoute = require('./route/BookRoute')
const VideoRoute = require('./route/VideoRoute')
const UserRoute = require('./route/UserRoute')
const UsersBooksRoute = require('./route/UsersBooksRoute')
const {initializeAdmin} = require("./controller/UserController");
const UserController = require('./controller/UserController')

const app = express();
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/library_api').then(async () => {
    await UserController.initializeAdmin(null, null);
    app.listen(3000, () => {
        console.log(`api started and running on port ${PORT}`)
    });
});

app.use('/api/v1/books', BookRoute);
app.use('/api/v1/videos', VideoRoute);
app.use('/api/v1/users', UserRoute);
app.use('/api/v1/users-books', UsersBooksRoute);
