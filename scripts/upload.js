const express = require('express');
const router = express.Router();
const uploadToYT = require('./youtube')


router.post('/', (req, res) => {
    const body = req.body;
    const ocr = body.ocr;
    const url = body.url;
    const isThumbnail = body.thumbnail;
    uploadToYT({ ocr, url }).then(uploadRes => {
        res.send(uploadRes)
    })
})


module.exports = router;