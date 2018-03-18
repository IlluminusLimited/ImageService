'use strict';

const util = require('util');
const request = require('request');

module.exports.notify = (event, context, callback) => {
    request.post('example.com')
        .on('response').promise()
        .then(response => {
            console.log("Response:\n", util.inspect(response, {depth: 5}));
            let message = JSON.parse(response);
            callback(null, message)
        })
        .on('error').promise()
        .then(err => callback(err));
};