'use strict';

let expect = require('chai').expect;
let RequestHandler = require('../request-handler');
let sinon = require('sinon');

let goodPayload = {
    data: {
        metadata: {
            user_id: "uuid",
            year: "integer year"
        },
        image: "base64 encoded image"
    }
};

let badYearPayload = {
    data: {
        metadata: {user_id: "uuid"},
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

    it("Blows up on missing year", function () {
        let eventFixture = class {
            constructor() {
                this.body = JSON.stringify(badYearPayload);
            }
        };
        let callback = sinon.spy();

        RequestHandler.parseRequest(new eventFixture(), callback);
        expect(callback.called).to.be.true;
    });
});