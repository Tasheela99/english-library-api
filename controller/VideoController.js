const Video = require('../model/VideoSchema');
const Generator = require('../util/CodeGenerator')
const Book = require("../model/BookSchema");


const saveVideo = (req, res) => {

    /*    http://localhost:3000/api/v1/videos/save-video

        {
            "videoTitle":"Grmmar Book Video",
            "videoPreviewImage":"http://localhost:3000/api/v1/videos/save-video.jpg",
            "videoResource":"http://localhost:3000/api/v1/videos/save-video.pdf"
        }
    */
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
    /*
        http://localhost:3000/api/v1/videos/find-video?videoId=651212sgyyta529@#
    */
    const videoId = req.query.videoId;

    Video.findById({_id: videoId}).then(result => {
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

    /*    http://localhost:3000/api/v1/videos/update-video?videoId=jhbdjbhjd545454wf#$

        {
            "videoTitle":"Grmmar Book Video",
            "videoPreviewImage":"http://localhost:3000/api/v1/videos/save-video.jpg",
            "videoResource":"http://localhost:3000/api/v1/videos/save-video.pdf"
        }
    */

    const videoId = req.query.videoId;

    Video.updateOne({_id: videoId}, {
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
    /*
        http://localhost:3000/api/v1/videos/delete-video?videoId=651212sgyyta529@#
    */

    const videoId = req.query.videoId;

    Video.deleteOne({_id: videoId}).then(result => {
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
    /*
        http://localhost:3000/api/v1/videos/find-all-videos
    */

    Video.find().then(result => {
        res.status(200).json({status: true, data: result})
    }).catch((error) => {
        res.status(500).json(error);
    })
}

const getVideoCount = (req, res) => {
    /*
        http://localhost:3000/api/v1/videos/video-count
    */
    Video.countDocuments()
        .then(count => {
            res.status(200).json({status: true, count: count});
        })
        .catch(error => {
            res.status(500).json({status: false, error: error.message});
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