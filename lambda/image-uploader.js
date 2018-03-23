'use strict';

const AWSS3 = require('aws-sdk/clients/s3');

const FileWriter = require('./file-writer');
const FileBuilder = require('./file-builder');
const RequestHandler = require('./request-handler');

module.exports.upload = (event, context, callback) => {
    let bucket = process.env['BUCKET_NAME'];
    RequestHandler.perform(event, context, callback, new FileBuilder(), new FileWriter(new AWSS3()),bucket );
};
