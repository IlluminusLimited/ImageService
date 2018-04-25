'use strict';

const AWSS3 = require('aws-sdk/clients/s3');
const Sharp = require('sharp');
const util = require('util');
const _ = require('lodash');
const async = require('async');

const BUCKET = process.env.BUCKET;
const URL = process.env.URL;
const ALLOWED_DIMENSIONS = new Set();
const MAX_AGE = 14400; // seconds = 240 minutes = 4 hours
const MAX_SIZE = 5000; // 5 thousand pixels (wide or high)
const IMAGE_KEY_PATTERN_REGEX = /(([\/a-zA-Z0-9]+)\/([a-zA-Z0-9]+))_((\d+|auto)x(\d+|auto))(\.jpeg|\.jpg|\.png)/;

if (process.env.ALLOWED_DIMENSIONS) {
    const dimensions = process.env.ALLOWED_DIMENSIONS.split(/\s*,\s*/);
    dimensions.forEach(dimension => ALLOWED_DIMENSIONS.add(dimension));
}

module.exports = class ThumbnailGenerator {
    constructor(s3) {
        this.s3 = _.isUndefined(s3) ? new AWSS3() : s3;
    }

    static parseRequestedImage(requestedImageKey, callback) {
        const match = requestedImageKey.match(IMAGE_KEY_PATTERN_REGEX);

        if (match === null) {
            callback({
                statusCode: '400',
                headers: {},
                body: `Key: '${requestedImageKey}' is not a supported image file!`
            });
        }

        const dimensions = match[4]; //400xauto, for example.
        const width = match[5] === 'auto' ? null : Math.min(parseInt(match[5], 10), MAX_SIZE);
        const height = match[6] === 'auto' ? null : Math.min(parseInt(match[6], 10), MAX_SIZE);
        const dotExtension = match[7];
        const originalKey = match[1] + dotExtension;
        const newKey = match[0]; //whatever they requested is what we'll make

        console.log("Dimensions " + dimensions);
        console.log("Width " + width);
        console.log("Height " + height);
        console.log("DotExtension " + dotExtension);
        console.log("OriginalKey " + originalKey);
        console.log("NewKey " + newKey);

        callback(undefined, {
            dimensions: dimensions,
            width: width,
            height: height,
            originaKey: originalKey,
            newKey: newKey
        });
    }

    static validateDimensions(parsedParameters, callback) {
        if (ALLOWED_DIMENSIONS.size > 0 && !ALLOWED_DIMENSIONS.has(parsedParameters.dimensions)) {
            callback({
                statusCode: '400',
                headers: {},
                body: `Invalid dimensions specified: ${parsedParameters.dimensions}. ` +
                `Valid dimensions are: ${ALLOWED_DIMENSIONS}`
            });
        } else {
            callback(null, parsedParameters)
        }
    }

    manipulate(parsedParameters, callback) {
        S3.getObject({Bucket: BUCKET, Key: parsedParameters.originaKey}).promise()
        // eslint-disable-next-line new-cap
            .then(data => Sharp(data.Body)
                .resize(parsedParameters.width, parsedParameters.height)
                .max()
                .toFormat('jpeg')
                .toBuffer()
            )
            .then(buffer => this.s3.putObject({
                    Body: buffer,
                    Bucket: BUCKET,
                    ContentType: 'image/jpeg',
                    Key: parsedParameters.newKey,
                    CacheControl: `max-age=${MAX_AGE}`,
                }).promise()
            )
            .then(() => callback(null, {
                    statusCode: '301',
                    headers: {
                        location: `${URL}/${parsedParameters.newKey}`,
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        Pragma: 'no-cache',
                        Expires: '0',
                    },
                    body: ''
                })
            )
            .catch(err => callback(err));
    }

    generateThumbnail(event, callback) {
        console.log(util.inspect(event, {depth: 5}));

        let tasks = [];

        tasks.push((callback) => {
            ImageManipulator.parseRequestedImage(event.queryStringParameters.key, callback);
        });

        tasks.push((parsedParameters, callback) => {
            ImageManipulator.validateDimensions(parsedParameters, callback);
        });

        tasks.push((parsedParameters, callback) => {
            this.manipulate(parsedParameters, callback)
        });

        async.waterfall(tasks, (err, data) => {
            if (err) {
                callback(err);
            }
            else {
                let response = {
                    statusCode: 200,
                    body: JSON.stringify({
                        bucket: data[0].Bucket,
                        key: data[0].Key,
                        message: data[1]
                    })
                };
                callback(undefined, response);
            }
        });
    }
};