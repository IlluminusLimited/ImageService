'use strict';

const AWS = require('aws-sdk');
const S3 = new AWS.S3({
    signatureVersion: 'v4',
});

const stepfunctions = new AWS.StepFunctions();

const Sharp = require('sharp');

const BUCKET = process.env.BUCKET;
const URL = process.env.URL;
const ALLOWED_DIMENSIONS = new Set();

if (process.env.ALLOWED_DIMENSIONS) {
    const dimensions = process.env.ALLOWED_DIMENSIONS.split(/\s*,\s*/);
    dimensions.forEach((dimension) => ALLOWED_DIMENSIONS.add(dimension));
}


module.exports.startExecution = (event, context, callback) => {
    console.log('startExecution');

    console.log(event);

    console.log(event.Records);

    console.log(event.Records[0]);

    console.log(event.Records[0]['s3']);

    console.log(event.Records[0]['s3']['object']);
    console.log(event.Records[0]['s3']['object']['key']);

    console.log(event.Records[0]['s3']['bucket']);
    console.log(event.Records[0]['s3']['bucket']['name']);

    let s3Event = event.Records[0]['s3']['object'];
    let s3Event2 = event.Records[0]['s3']['bucket'];

    console.log(s3Event);
    // let desiredSizes = new Set();
    let height = 100;
    let width = 100;

    let resizeParams = {Bucket: s3Event2.name, Key: s3Event.key, height: height, width: width};
    console.log(resizeParams);

    callStepFunction(resizeParams).then(result => {
        if (!result) {
            return callback("Failed to execute step function");
        }

        const response = {
            statusCode: 200,
            body: JSON.stringify({message: 'Step function is executing'})
        };

        console.log(response);

        callback(null, response);
    });
};


function callStepFunction(resizeParams) {
    console.log('callStepFunction');

    let params = {
        stateMachineArn: process.env['STATEMACHINE_ARN'],
        input: JSON.stringify(resizeParams)
    };

    console.log('Start execution');
    return stepfunctions.startExecution(params).promise().then(() => {
        return true;
    }).catch(error => {
        console.log(error);
        return false;
    });
}

module.exports.generateThumbnail = (event, context, callback) => {
    const format = 'jpeg';
    const key = event.Key;
    const bucket = event.Bucket;
    // const match = key.match(/((\d+)x(\d+))\/(.*)/);
    const width = parseInt(event.width, 10);
    const height = parseInt(event.height, 10);
    let newKey = key.replace(/(\.[\w\d_-]+)$/i, '_' + width + 'x' + height + '.' + format);
    newKey = newKey.replace(/raw\//i, '');

    console.log("New key is: " + newKey)

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