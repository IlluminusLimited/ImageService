'use strict';

const AWS = require('aws-sdk');
const S3 = new AWS.S3({
    signatureVersion: 'v4',
});
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

    let s3Event = JSON.parse(event.body);
    console.log(s3Event);
    // let desiredSizes = new Set();
    let height = 100;
    let width = 100;

    let resizeParams = {Bucket: s3Event.Bucket, Key: s3Event.Key, height: height, width: width};
    console.log(resizeParams);

    callStepFunction(resizeParams).then(result => {
        let message = 'Step function is executing';
        if (!result) {
            message = 'Step function is not executing';
        }

        const response = {
            statusCode: 200,
            body: JSON.stringify({message})
        };

        console.log(response);

        callback(null, response);
    });
};


function callStepFunction(resizeParams) {
    console.log('callStepFunction');

    const stateMachineName = 'ThumbnailProcessor'; // The name of the step function we defined in the serverless.yml
    console.log('Fetching the list of available workflows');

    return stepfunctions
        .listStateMachines({})
        .promise()
        .then(listStateMachines => {
            console.log('Searching for the step function', listStateMachines);

            for (let i = 0; i < listStateMachines.stateMachines.length; i++) {
                const item = listStateMachines.stateMachines[i];

                if (item.name.indexOf(stateMachineName) >= 0) {
                    console.log('Found the step function', item);

                    let params = {
                        stateMachineArn: item.stateMachineArn,
                        input: JSON.stringify(resizeParams)
                    };

                    console.log('Start execution');
                    return stepfunctions.startExecution(params).promise().then(() => {
                        return true;
                    });
                }
            }
        })
        .catch(error => {
            return false;
        });
}

module.exports.generateThumbnail = (event, context, callback) => {
    const key = event.Key;
    const bucket = event.Bucket;
    // const match = key.match(/((\d+)x(\d+))\/(.*)/);
    const width = parseInt(event.width, 10);
    const height = parseInt(event.height, 10);
    let newKey = key.replace(/(\.[\w\d_-]+)$/i, '_' + width + 'x' + height + '$1');


    S3.getObject({Bucket: bucket, Key: key}).promise()
        .then(data => Sharp(data.Body)
            .resize(width, height)
            .toFormat('png')
            .toBuffer()
        )
        .then(buffer => S3.putObject({
                Body: buffer,
                Bucket: bucket,
                ContentType: 'image/png',
                Key: newKey,
            }).promise()
        )
        .then(() => callback(null, {message: 'Resized to' + width + 'x' + height, Bucket: bucket, Key: newKey})
        )
        .catch(err => callback(err))
};