var youtube = require('../library/googleyoutube');
const https = require('https');
var youtube = new youtube();
const fs = require('fs');
const { google } = require("googleapis2");
const auth2 = new google.auth.GoogleAuth({
    keyFile: "./keys-drive.json", //the key file
    scopes: "https://www.googleapis.com/auth/drive",
});
const authClientObject2 = auth2.getClient();
//Google sheets instance
const drive = google.drive({
    version: "v3",
    auth: auth2
});



function deleteYouTubeVideo(options) {
    let id = options.id;
    return new Promise((resolve, reject) => {
        youtube.deleteVideo({
                "id": id
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
                        message: "VIDEO_DELETED_SUCCESSFULLY"
                    });

                }
            })

    })
}

function uploadToYT(options) {
    let ocr = options.ocr;
    let fileURL = options.url;
    let { title, description } = ocrCleanup(ocr);
    return new Promise((resolve, reject) => {
        if (fileURL.includes('drive.google.com')) {
            let fileId = getIdFromUrl(fileURL);
            drive.files.get({
                fileId: fileId,
                alt: 'media',
            }, { responseType: 'stream' }).then(file => {
                //console.log(file)
                youtube.uploadVideo({
                        "title": title,
                        "description": description,
                        "privacyStatus": "public",
                        "videofile": file.data
                    },
                    function(err, res) {
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
            return;
        }
        https.get(fileURL, (stream) => {
            if (stream.headers['content-type'] != 'application/x-www-form-urlencoded' && stream.headers['content-type'] != 'application/binary') {
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


let writeStream = fs.createWriteStream('./video.mp4');
https.get('https://drive.google.com/u/0/uc?id=1nktyBRfEWH-uPh6X1ktPxkqnqG-xlCNT&export=download', stream => {
    console.log(stream.body)
})

function getIdFromUrl(url) { return url.match(/[-\w]{25,}/); }

module.exports = { uploadToYT, deleteYouTubeVideo };