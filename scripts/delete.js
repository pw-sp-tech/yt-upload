const express = require('express');
const router = express.Router();
const deleteYouTubeVideo = require('./youtube').deleteYouTubeVideo;


router.post('/', (req, res) => {
    const body = req.body;
    const id = body.id;
    deleteYouTubeVideo({ id }).then(uploadRes => {
        res.send(uploadRes)
    })
})


module.exports = router;