module.exports = class HttpResponse {
    constructor(statusCode, body, headers = {}) {
        this.statusCode = statusCode;
        this.body = body;
        this.headers = headers;
    }
};
