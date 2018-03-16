'use strict';

const AWSS3 = require('aws-sdk/clients/s3');
const Base64Handler = require('../new-image-uploader/base64-handler');

const FileWriter = require('../new-image-uploader/file-writer');
const FileBuilder = require('../new-image-uploader/file-builder');
const RequestHandler = require('../new-image-uploader/request-handler');

module.exports.upload = (event, context, callback) => {

    let parsedRequest = RequestHandler.parseRequest(event, callback);

    let base64Image = Base64Handler.pruneBase64String(parsedRequest['image']);
    let buffer = Base64Handler.getBuffer(base64Image);
    let fileMime = Base64Handler.getMimeType(buffer, callback);

    let params = new FileBuilder().getFile(fileMime, buffer, 'test-image-service-new-bucket-test');

    new FileWriter(new AWSS3()).saveObject(callback, params)
};
