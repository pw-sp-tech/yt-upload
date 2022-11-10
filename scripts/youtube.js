// var _ = require('underscore');
// var fs = require('fs');
// var mime = require('mime');
// var config = require('../config/googleyoutube');
var youtube = require('../library/googleyoutube');
const https = require('https');
var youtube = new youtube();
// fs.readdir(config.video_dir_path, function(err, fileArr) {
//     if (err) {
//         console.log('Error while retrieving video directory', err);
//     } else {
//         _.each(fileArr, function(file, key) {
//             file = config.video_dir_path + file;
//             var mimeType = mime.lookup(file);
//             if (mimeType.indexOf("video/") === 0) {
//                 var options = {
//                     "title": "Script upload video",
//                     "description": "Script upload Video Description",
//                     "privacyStatus": "private",
//                     "videofile": file
//                 };
//                 youtube.uploadVideo(options, function(err, res) {
//                     if (err) {
//                         console.log('Error while uploading video', err);
//                     } else {
//                         console.log('\n Video has been successfully uploaded \n', res);
//                         console.log('\n Check your uploaded video using:\n https://www.youtube.com/watch?v=' + res.id);
//                     }
//                 });
//             }
//         });
//     }
// });


function uploadToYT(options) {
    let ocr = options.ocr;
    let fileURL = options.url;
    let { title, description } = ocrCleanup(ocr);
    return new Promise((resolve, reject) => {
        https.get(fileURL, (stream) => {
            youtube.uploadVideo({
                    "title": title,
                    "description": description,
                    "privacyStatus": "public",
                    "videofile": stream
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
                });
        });


    })
}
// function setThumbnail(options) {
//     let ocr = options.ocr;
//     let fileURL = options.url;
//     let { title, description } = ocrCleanup(ocr);
//     return new Promise((resolve, reject) => {
//         https.get(fileURL, (stream) => {
//             youtube.uploadVideo({
//                     "title": title,
//                     "description": description,
//                     "privacyStatus": "public",
//                     "videofile": stream
//                 },
//                 function(err, res) {
//                     if (err) {
//                         resolve({
//                             err: 1,
//                             err_text: err,
//                             youtube_id: null
//                         });
//                     } else {
//                         resolve({
//                             err: 0,
//                             err_text: null,
//                             youtube_id: res.id
//                         });
//                         // console.log('\n Video has been successfully uploaded \n', res);
//                         // console.log('\n Check your uploaded video using:\n https://www.youtube.com/watch?v=' + res.id);
//                     }
//                 });
//         });
//         // got(fileURL, { isStream: true }).then(gotRes => {

//         //     youtube.uploadVideo({
//         //             "title": title,
//         //             "description": description,
//         //             "privacyStatus": "public",
//         //             "videofile": gotRes.body
//         //         },
//         //         function(err, res) {
//         //             if (err) {
//         //                 resolve({
//         //                     err: 1,
//         //                     err_text: err,
//         //                     youtube_id: null
//         //                 });
//         //             } else {
//         //                 resolve({
//         //                     err: 0,
//         //                     err_text: null,
//         //                     youtube_id: res.id
//         //                 });
//         //                 // console.log('\n Video has been successfully uploaded \n', res);
//         //                 // console.log('\n Check your uploaded video using:\n https://www.youtube.com/watch?v=' + res.id);
//         //             }
//         //         });
//         // });

//     })
// }

function ocrCleanup(ocr) {
    let description = ocr.toString().replaceAll(">", "").replaceAll("<", "")
    let title = description.split("\n").join(" ");
    if (description.toString().length > 100) {
        title = description.slice(0, 96) + "..."
    }
    description = description + "\n" + `📲PW App Link - https://bit.ly/YTAI_PWAP \n🌐PW Website - https://www.pw.live`.toString();
    return { title, description };
}


module.exports = uploadToYT