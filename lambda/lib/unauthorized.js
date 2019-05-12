'use strict';

const HttpResponseBuilder = require('./http-response-builder');

module.exports = class Unauthorized extends HttpResponseBuilder {
    constructor(body, headers) {
        super(401, body, headers);
    }

    build(callback) {
        callback(undefined, super.generateResponse());
    }
};
