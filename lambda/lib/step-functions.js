'use strict';

const stepfunctions = require('aws-sdk/clients/stepfunctions');
const _ = require('lodash');
const util = require('util');
const InternalServerError = require('./internal-server-error');
const Ok = require('./ok');

module.exports = class StepFunctions {
    constructor(stepFunc) {
        this.stepFunctions = _.isUndefined(stepFunc) ? new stepfunctions() : stepFunc;
    }

    startExecution(event, callback) {
        let s3Event = event.Records[0].s3.object;
        let s3BucketName = event.Records[0].s3.bucket.name;

        this.callStepFunction( {Bucket: s3BucketName, Key: s3Event.key}, (err) => {
            if (err) {
                console.log(util.inspect(err, {depth: 5}));
                new InternalServerError(err).build(callback);
            }
            else {
                new Ok('Step function is executing').build(callback);
            }
        });
    }

    callStepFunction(stepFunctionParams, callback) {
        let params = {
            stateMachineArn: process.env.STATEMACHINE_ARN,
            input: JSON.stringify(stepFunctionParams)
        };

        this.stepFunctions.startExecution(params, callback);
    }
};
