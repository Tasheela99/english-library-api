const express = require('express');
const VideoController = require('../controller/VideoController');
const router = express.Router();
const verifyToken = require('../middleware/AuthMiddleware')


router.post('/save-video', verifyToken, VideoController.saveVideo);
router.get('/find-video', verifyToken, VideoController.findVideo);
router.put('/update-video', verifyToken, VideoController.updateVideo);
router.delete('/delete-video', verifyToken, VideoController.deleteVideo);
router.get('/find-all-videos', verifyToken, VideoController.findAllVideos);


module.exports = router;