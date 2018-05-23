'use strict';

module.exports = class HttpResponseBuilder {
    constructor(statusCode, body, headers = {}) {
        this.statusCode = statusCode;
        this.body = body;
        this.headers = {
            "Access-Control-Allow-Origin": "*", // Required for CORS support to work
            "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
        };
    }

    generateResponse() {
        return {
            statusCode: this.statusCode,
            headers: this.headers,
            body: JSON.stringify(this.body)
        };
    }
};
