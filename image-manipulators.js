'use strict';

const AWS = require('aws-sdk');
const S3 = new AWS.S3({
    signatureVersion: 'v4',
});
const util = require('util');
const Sharp = require('sharp');

module.exports.generateThumbnail = (event, context, callback) => {
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

    S3.getObject({Bucket: bucket, Key: key}).promise()
        .then(data => Sharp(data.Body)
            .resize(width, height)
            .max()
            .toFormat(format)
            .toBuffer()
        )
        .then(buffer => S3.putObject({
                Body: buffer,
                Bucket: bucket,
                ContentType: 'image/'+ format,
                Key: newKey,
            }).promise()
        )
        .then(() => callback(null, {message: 'Resized to' + width + 'x' + height, Bucket: bucket, Key: newKey})
        )
        .catch(err => callback(err))
};