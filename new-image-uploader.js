'use strict';

const AWSS3 = require('aws-sdk/clients/s3');
const fileType = require('file-type');

const s3 = new AWSS3();

module.exports.upload = (event, context, callback) => {
    let request = event.body;

    let base64Image = JSON.parse(request)['data']['image'];

    let buffer = Buffer.from(base64Image.substr(base64Image.indexOf(',') + 1), 'base64');

    let fileMime = fileType(buffer);

    if (fileMime === null) {
        return callback('The string supplied is not a file type');
    }

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