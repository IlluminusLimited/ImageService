'use strict';

const HttpResponseBuilder = require('./http-response-builder');

module.exports = class Forbidden extends HttpResponseBuilder {
    constructor(body, headers) {
        super(403, body, headers);
    }

    build(callback) {
        callback(undefined, super.generateResponse());
    }
};
