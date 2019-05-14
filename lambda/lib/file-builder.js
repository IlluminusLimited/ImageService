'use strict';

const _ = require('lodash');
const md5 = require('md5');
const BadRequest = require('./bad-request');
const Base64Handler = require('./base64-handler');

module.exports = class FileBuilder {
    constructor(params = {}) {
        console.log('File builder params', params);
        this.base64Handler = _.isUndefined(params.base64Handler) ? new Base64Handler() : params.base64Handler;
        this.cacheControl = _.isUndefined(params.cacheControl) ? 'max-age=86400' : params.cacheControl;
    }

    async getFile(parsedRequest) {
        console.log('getFile parsedRequest: ', parsedRequest);
        console.log('FileBuilder is: ', this);
        return this.base64Handler.processImage(parsedRequest.image)
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
