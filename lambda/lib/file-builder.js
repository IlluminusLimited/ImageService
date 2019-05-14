'use strict';

const _ = require('lodash');
const md5 = require('md5');
const BadRequest = require('./bad-request');

module.exports = class FileBuilder {
    constructor(cacheControl) {
        this.cacheControl = _.isUndefined(cacheControl) ? 'max-age=86400' : cacheControl;
    }

    async getFile(parsedRequest) {
        return this.processImage(parsedRequest.image)
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

    async processImage(image) {
        const base64Regex = /data:([^/]+)\/([^;]+);base64,(.+)/;
        if (base64Regex.test(image)) {
            const matches = base64Regex.exec(image);
            const result = {};
            result.mimeType = {
                type: matches[1],
                subtype: matches[2]
            };
            result.base64Image = matches[3];
            result.buffer = Buffer.from(result.base64Image, 'base64');
            return result;
        }
        throw new BadRequest('Your image did not match the base64 regex');
    }
};
