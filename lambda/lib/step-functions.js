'use strict';

const stepfunctions = require('aws-sdk/clients/stepfunctions');
const _ = require('lodash');

module.exports = class StepFunctions {
    constructor(stepFunc) {
        this.stepFunctions = _.isUndefined(stepFunc) ? new stepfunctions() : stepFunc;
    }

    startExecution(event, callback) {
        console.log('startExecution');

        let s3Event = event.Records[0].s3.object;
        let s3BucketName = event.Records[0].s3.bucket.name;

        console.log(s3Event);
        // let desiredSizes = new Set();
        let height = 100;
        let width = 100;

        let resizeParams = {Bucket: s3BucketName, Key: s3Event.key, height: height, width: width};
        console.log(resizeParams);

        this.callStepFunction(resizeParams).then(result => {
            if (!result) {
                callback('Failed to execute step function');
            }

            const response = {
                statusCode: 200,
                body: JSON.stringify({message: 'Step function is executing'})
            };

            console.log(response);

            callback(null, response);
        });
    }

    callStepFunction(resizeParams) {
        console.log('callStepFunction');

        let params = {
            stateMachineArn: process.env.STATEMACHINE_ARN,
            input: JSON.stringify(resizeParams)
        };

        console.log('Start execution');
        return this.startExecution(params).promise().then(() => {
            return true;
        }).catch(error => {
            console.log(error);
            return false;
        });
    }
};
