const AWS = require('aws-sdk');
const Sharp = require('sharp');

const S3 = new AWS.S3({
    signatureVersion: 'v4',
});

const BUCKET = process.env.BUCKET;
const URL = process.env.URL;
const ALLOWED_DIMENSIONS = new Set();
const MAX_AGE = 14400; // seconds = 240 minutes = 4 hours
const MAX_SIZE = 5000; // 5 thousand pixels (wide or high)

if (process.env.ALLOWED_DIMENSIONS) {
    const dimensions = process.env.ALLOWED_DIMENSIONS.split(/\s*,\s*/);
    dimensions.forEach(dimension => ALLOWED_DIMENSIONS.add(dimension));
}

exports.generateThumbnail = function generateThumbnail(event, context, callback) {
    const key = event.queryStringParameters.key;
    const match = key.match(/(([\/a-zA-Z0-9]+)\/([a-zA-Z0-9]+))_((\d+|auto)x(\d+|auto))(\.jpeg|\.jpg|\.png)/);

    if (match === null) {
        callback(null, {
            statusCode: '400',
            headers: {},
            body: "Key: '" + key + "' is not a supported image file",
        });
        return;
    }

    const dimensions = match[4];
    const width = match[5] === 'auto' ? null : Math.min(parseInt(match[5], 10), MAX_SIZE);
    const height = match[6] === 'auto' ? null : Math.min(parseInt(match[6], 10), MAX_SIZE);
    const prefix = match[2];
    const dotExtension = match[7];
    const originalKey = match[1] + dotExtension;
    const newKey = match[1] + ".jpg";


    console.log("Dimensions " + dimensions);
    console.log("Width " + width);
    console.log("Height " + height);
    console.log("Prefix " + prefix);
    console.log("DotExtension " + dotExtension);
    console.log("OriginalKey " + originalKey);

    if (ALLOWED_DIMENSIONS.size > 0 && !ALLOWED_DIMENSIONS.has(dimensions)) {
        callback(null, {
            statusCode: '400',
            headers: {},
            body: '',
        });
        return;
    }

    S3.getObject({Bucket: BUCKET, Key: originalKey}).promise()
    // eslint-disable-next-line new-cap
        .then(data => Sharp(data.Body)
            .resize(width, height)
            .toFormat('jpeg')
            .toBuffer()
        )
        .then(buffer => S3.putObject({
                Body: buffer,
                Bucket: BUCKET,
                ContentType: 'image/jpeg',
                Key: newKey,
                CacheControl: `max-age=${MAX_AGE}`,
            }).promise()
        )
        .then(() => callback(null, {
                statusCode: '301',
                headers: {
                    location: `${URL}/${newKey}`,
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    Pragma: 'no-cache',
                    Expires: '0',
                },
                body: '',
            })
        )
        .catch(err => callback(err));
};