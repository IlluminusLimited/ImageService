'use strict';

const AWSS3 = require('aws-sdk/clients/s3');
const _ = require('lodash');
const util = require('util');
const Sharp = require('sharp');

module.exports = class ThumbnailGenerator {
    constructor(s3) {
        this.s3 = _.isUndefined(s3) ? new AWSS3() : s3;
    }

    generateThumbnail(event, callback) {
        console.log(util.inspect(event, {depth: 5}));

        const format = 'jpeg';
        const key = event.Key;
        const bucket = event.Bucket;
        // const match = key.match(/((\d+)x(\d+))\/(.*)/);
        const width = parseInt(event.width, 10);
        const height = parseInt(event.height, 10);
        let newKey = key.replace(/(\.[\w\d_-]+)$/i, '_' + width + 'x' + height + '.' + format);
        newKey = newKey.replace(/raw\//i, '');

        console.log("New key is: " + newKey);

        this.s3.getObject({Bucket: bucket, Key: key}).promise()
            .then(data => Sharp(data.Body)
                .resize(width, height)
                .max()
                .toFormat(format)
                .toBuffer()
            )
            .then(buffer => this.s3.putObject({
                    Body: buffer,
                    Bucket: bucket,
                    ContentType: 'image/'+ format,
                    Key: newKey,
                }).promise()
            )
            .then(() => callback(null, {message: 'Resized to' + width + 'x' + height, Bucket: bucket, Key: newKey})
            )
            .catch(err => callback(err));
    }
};