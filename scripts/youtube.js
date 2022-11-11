var youtube = require('../library/googleyoutube');
const https = require('https');
var youtube = new youtube();

function uploadToYT(options) {
    let ocr = options.ocr;
    let fileURL = options.url;
    let { title, description } = ocrCleanup(ocr);
    return new Promise((resolve, reject) => {
        https.get(fileURL, (stream) => {
            if (stream.headers['content-type'] != 'application/x-www-form-urlencoded') {
                resolve({
                    err: 1,
                    err_text: 'INVALID_URL',
                    youtube_id: null
                });
                return;
            }
            youtube.uploadVideo({
                    "title": title,
                    "description": description,
                    "privacyStatus": "public",
                    "videofile": stream
                },
                function(err, res) {
                    console.log(res)
                    if (err) {
                        resolve({
                            err: 1,
                            err_text: err,
                            youtube_id: null
                        });
                    } else {
                        resolve({
                            err: 0,
                            err_text: null,
                            youtube_id: res.id
                        });

                    }
                })
        });
    })
}


function ocrCleanup(ocr) {
    let description = ocr.toString().replaceAll(">", "").replaceAll("<", "")
    let title = description.split("\n").join(" ");
    if (description.toString().length > 100) {
        title = description.slice(0, 96) + "..."
    }
    description = description + "\n" + `📲PW App Link - https://bit.ly/YTAI_PWAP \n🌐PW Website - https://www.pw.live`.toString();
    return { title, description };
}


module.exports = uploadToYT;