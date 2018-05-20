'use strict';

const _ = require('lodash');
const util = require('util');
const request = require('request');

module.exports = class PinsterApiClient {
    constructor(baseUrl, authToken) {
        this.baseUrl = _.isUndefined(baseUrl) ? process.env.PINSTER_API_URL : baseUrl;
        this.authToken = _.isUndefined(authToken) ? process.env.AUTH_TOKEN : authToken;
    }

    createImage(imageParameters, callback) {
        if (_.isUndefined(this.authToken)) {
            callback('Secret fetching failed!');
        } else {
            request.post({
                url: `${this.baseUrl}/v1/images`,
                headers: {
                    'Authorization': this.authToken
                }
            }, imageParameters, (err, response, body) => {
                if (err) {
                    console.log(util.inspect(err, {depth: 5}));
                    callback(err);
                }
                else {
                    console.log(util.inspect(response, {depth: 5}));
                    console.log(util.inspect(body, {depth: 5}));
                    callback(undefined, response, body);
                }
            });
        }
    }

    createFailureNotification(notificationParameters, callback) {
        request.post({
            url: `${this.baseUrl}/v1/notifications/failure`,
            headers: {
                'Authorization': this.authToken
            }
        }, notificationParameters, (err, response, body) => {
            if (err) {
                console.log(util.inspect(err, {depth: 5}));
                callback(err);
            }
            else {
                console.log(util.inspect(response, {depth: 5}));
                console.log(util.inspect(body, {depth: 5}));
                callback(undefined, response, body);
            }
        });
    }
};
