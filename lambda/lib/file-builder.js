'use strict';

const Base64Handler = require('./base64-handler');
const _ = require('lodash');
const md5 = require('md5');
const BadRequest = require('./bad-request');
const util = require('util');

module.exports = class FileBuilder {
    constructor(base64Handler, cacheControl) {
        this.base64Handler = _.isUndefined(base64Handler) ? Base64Handler : base64Handler;
        this.cacheControl = _.isUndefined(cacheControl) ? 'max-age=186400' : cacheControl;
    }

    getFile(parsedRequest, callback) {
        const base64Handler = new this.base64Handler(parsedRequest.image);
        const buffer = base64Handler.buffer;
        const mimeType = base64Handler.mimeType;
        const baseFileName =  md5(buffer);
        const fileName = 'raw/' + baseFileName;
        const contentType = `${mimeType.type}/${mimeType.subtype}`;

        parsedRequest.metadata['base_file_name'] = baseFileName;
        console.log(util.inspect(parsedRequest, {depth: 5}));

        if (mimeType.type === 'image') {
            callback(undefined, {
                Key: fileName,
                Body: buffer,
                ContentType: contentType,
                CacheControl: this.cacheControl,
                Metadata: parsedRequest.metadata,
                Bucket: parsedRequest.bucket
            });
        }
        else {
            callback(new BadRequest(`Files of type: ${contentType} are not supported.`));
        }
    }
};
