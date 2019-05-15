'use strict';

const ApiClient = require('./ApiClient');
const _ = require('lodash');
const util = require('util');
const AWS = require('aws-sdk');
const Ok = require('./ok');

module.exports = class Notifier {
    constructor(params = {}) {
        this.apiClient = _.isUndefined(params.apiClient) ? new ApiClient() : params.apiClient;
        this.snsPublish = _.isUndefined(params.snsPublish) ? (params) => {
            return new AWS.SNS().publish(params).promise();
        } : params.snsPublish;
        this.snsArn = _.isUndefined(params.snsArn) ? process.env.SNS_ARN : params.snsArn;
    }

    async notifySuccess(imageParams) {
        console.log('Notify Success params: ', util.inspect(imageParams, {depth: 5}));
        return this.createImage(imageParams);
    }

    async notifyFailure(notificationParams) {
        console.log('Notify Failure params', util.inspect(notificationParams, {depth: 5}));

        let eventText = JSON.stringify(notificationParams, null, 2);
        let params = {
            Message: eventText,
            Subject: 'Image Moderation Failure',
            TopicArn: this.snsArn
        };
        return this.snsPublish(params);
    }


    async createImage(imageParams) {
        const tokenParams = {
            imageable_type: imageParams.data.imageable_type,
            imageable_id: imageParams.data.imageable_id
        };
        return new Ok(await this.apiClient.post('/v1/images/', imageParams, tokenParams));
    }
};

