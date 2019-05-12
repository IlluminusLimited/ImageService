'use strict';

const Base64Handler = require('./base64-handler');
const _ = require('lodash');
const md5 = require('md5');
const BadRequest = require('./bad-request');

module.exports = class FileBuilder {
    constructor(base64Handler, cacheControl) {
        this.base64Handler = _.isUndefined(base64Handler) ? Base64Handler : base64Handler;
        this.cacheControl = _.isUndefined(cacheControl) ? 'max-age=86400' : cacheControl;
    }

    async getFile(parsedRequest) {
        return new this.base64Handler().processImage(parsedRequest.image)
            .then(processedImage => {
                const buffer = processedImage.buffer;
                const mimeType = processedImage.mimeType;
                const baseFileName = md5(buffer);
                const fileName = 'raw/' + baseFileName;
                const contentType = `${mimeType.type}/${mimeType.subtype}`;

                parsedRequest.metadata['base_file_name'] = baseFileName;

                if (mimeType.type === 'image') {
                    return {
                        Key: fileName,
                        Body: buffer,
                        ContentType: contentType,
                        CacheControl: this.cacheControl,
                        Metadata: parsedRequest.metadata,
                        Bucket: parsedRequest.bucket
                    };
                }

                throw new BadRequest(`Files of type: ${contentType} are not supported.`);
            });
    }
};
