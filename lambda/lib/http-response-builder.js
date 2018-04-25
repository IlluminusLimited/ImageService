module.exports = class HttpResponseBuilder {
    constructor(statusCode, body, headers = {}) {
        this.statusCode = statusCode;
        this.body = body;
        this.headers = headers;
    }

    generateResponse() {
        return {
            statusCode: status,
            headers: headers,
            body: body
        }
    }

};
