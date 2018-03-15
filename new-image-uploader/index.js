'use strict';

const AWSS3 = require('aws-sdk/clients/s3');
const Base64Handler = require('../new-image-uploader/base64-handler');

const FileWriter = require('../new-image-uploader/file-writer');
const FileBuilder = require('../new-image-uploader/file-builder');

module.exports.upload = (event, context, callback) => {

    let base64Image = Base64Handler.getBase64Image(event, callback);
    let buffer = Base64Handler.getBuffer(Base64Handler.pruneBase64String(base64Image));
    let fileMime = Base64Handler.getMimeType(buffer, callback);

    let params = new FileBuilder().getFile(fileMime, buffer, 'test-image-service-new-bucket-test');

    new FileWriter(new AWSS3()).saveObject(callback, params)
};
