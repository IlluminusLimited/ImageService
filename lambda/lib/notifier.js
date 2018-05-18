'use strict';

const _ = require('lodash');
const util = require('util');
const PinsterApiClient = require('./pinster-api-client');
const AWS = require('aws-sdk');

module.exports = class Notifier {
    constructor(pinsterApiClient,snsClient, snsArn ) {
        this.apiClient = _.isUndefined(pinsterApiClient) ? new PinsterApiClient : pinsterApiClient;
        this.snsClient = _.isUndefined(snsClient) ? new AWS.SNS() : snsClient;
        this.snsArn = _.isUndefined(snsArn) ?  process.env.SNS_ARN : snsArn;
    }

    notifySuccess(imageParams, callback) {
        console.log(util.inspect(imageParams, {depth: 5}));
        this.apiClient.createImage(imageParams, callback);
    }

    notifyFailure(notificationParams, callback) {
        console.log(util.inspect(notificationParams, {depth: 5}));

        let eventText = JSON.stringify(notificationParams, null, 2);
        let params = {
            Message: eventText,
            Subject: 'Image Moderation Failure',
            TopicArn: this.snsArn
        };
        this.snsClient.publish(params, callback);
    }
};
