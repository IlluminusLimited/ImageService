'use strict';

let expect = require('chai').expect;
let RequestHandler = require('../request-handler');

let goodPayload = {
    data: {
        user_id: "uuid",
        metadata: {
            year: "integer year"
        },
        image: "base64 encoded image"
    }
};

let badYearPayload = {
    data: {
        user_id: "uuid",
        metadata: {
        },
        image: "base64 encoded image"
    }
};

describe("RequestHandler", function () {
    it("Correctly parses the event", function () {
        let eventFixture = class {
            constructor() {
                this.body = JSON.stringify(goodPayload);
            }
        };

        expect(RequestHandler.parseRequest(new eventFixture())).to.deep.include(goodPayload['data'])
    });

    it("BLows up on missing year", function () {
        let eventFixture = class {
            constructor() {
                this.body = JSON.stringify(badYearPayload);
            }
        };

        expect(RequestHandler.parseRequest(new eventFixture(), function())).to.deep.include(goodPayload['data'])
    });
});