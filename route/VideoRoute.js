const express = require('express');
const VideoController = require('../controller/VideoController');
const router = express.Router();
const verifyToken = require('../middleware/AuthMiddleware')
const verifyPost = require('../middleware/AdminMiddleware')


router.post('/save-video', verifyPost, VideoController.saveVideo);
router.get('/find-video', verifyToken, VideoController.findVideo);
router.put('/update-video', verifyToken, VideoController.updateVideo);
router.delete('/delete-video', verifyPost, VideoController.deleteVideo);
router.get('/find-all-videos', verifyToken, VideoController.findAllVideos);
router.get('/video-count', verifyToken, VideoController.getVideoCount);


module.exports = router;