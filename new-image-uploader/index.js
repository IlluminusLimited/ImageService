'use strict';

const AWSS3 = require('aws-sdk/clients/s3');
const Base64Handler = require('new-image-uploader/base64-handler')
const s3 = new AWSS3();

module.exports.upload = (event, context, callback) => {

    let base64Image = Base64Handler.getBase64Image(event);
    let buffer = Base64Handler.getBuffer(base64Image);
    let fileMime = Base64Handler.getMimeType(buffer);


    let file = getFile(fileMime, buffer);
    let params = file.params;

    s3.putObject(params, function (err, data) {
        if (err) {
            return callback(err);
        }

        let response = {
            statusCode: 200,
            body: JSON.stringify({ "message": data })
        };

        return callback(null, response);
    });
};

let getFile = function (fileMime, buffer) {
    let fileExt = fileMime.ext;

    let fileName = 'someFile.' + fileExt;
    let fileFullName = fileName;
    let fileFullPath = 'test-image-service-new-bucket-test' + fileFullName;

    let params = {
        Bucket: 'test-image-service-new-bucket-test',
        Key: fileFullName,
        Body: buffer
    };

    let uploadFile = {
        size: buffer.toString('ascii').length,
        type: fileMime.mime,
        name: fileName,
        full_path: fileFullPath
    };

    return {
        'params': params,
        'uploadFile': uploadFile
    }
};