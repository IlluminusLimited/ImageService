'use strict';

const BadRequest = require('./bad-request');

module.exports = class Base64Handler {
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
