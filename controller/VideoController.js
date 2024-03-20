const Video = require('../model/VideoSchema');
const Generator = require('../util/CodeGenerator')
const Book = require("../model/BookSchema");


const saveVideo = (req, res) => {
    const videoCode = Generator.generateCode("VIDEO");
    const tempVideo = new Video({
        videoCode: videoCode,
        videoTitle: req.body.videoTitle,
        videoPreviewImage: req.body.videoPreviewImage,
        videoResource: req.body.videoResource,
    });

    tempVideo.save().then(result => {
        res.status(201).json({status: true, message: 'VIDEO SAVED SUCCESSFULLY'});
    }).catch((error) => {
        res.status(500).json(error);
    })
}
const findVideo = (req, res) => {
    Video.findById({_id: req.headers._id}).then(result => {
        if (result == null) {
            res.status(404).json({status: false, message: 'VIDEO NOT FOUND'})
        } else {
            res.status(200).json({status: true, data: result})
        }
    }).catch((error) => {
        res.status(500).json(error);
    })
}
const updateVideo = (req, res) => {
    Video.updateOne({_id: req.headers._id}, {
        $set: {
            videoTitle: req.body.videoTitle,
            videoPreviewImage: req.body.videoPreviewImage,
            videoResource: req.body.videoResource,
        }
    }).then(result => {
        if (result.modifiedCount > 0) {
            res.status(201).json({status: true, message: 'VIDEO UPDATED SUCCESSFULLY'})
        } else {
            res.status(200).json({status: false, message: 'TRY AGAIN'})
        }
    }).catch((error) => {
        res.status(500).json(error);
    })
}
const deleteVideo = (req, res) => {
    Video.deleteOne({_id: req.headers._id}).then(result => {
        if (result.deletedCount > 0) {
            res.status(204).json({status: true, message: 'VIDEO DELETED SUCCESSFULLY'})
        } else {
            res.status(400).json({status: false, message: 'TRY AGAIN'})
        }
    }).catch((error) => {
        res.status(500).json(error);
    })
}
const findAllVideos = (req, res) => {
    Video.find().then(result => {
        res.status(200).json({status: true, data: result})
    }).catch((error) => {
        res.status(500).json(error);
    })
}

const getVideoCount = (req, res) => {
    Video.countDocuments()
        .then(count => {
            res.status(200).json({ status: true, count: count });
        })
        .catch(error => {
            res.status(500).json({ status: false, error: error.message });
        });
};


module.exports = {
    saveVideo,
    findVideo,
    updateVideo,
    deleteVideo,
    findAllVideos,
    getVideoCount
}