'use strict';

let expect = require('chai').expect;
let Base64Handler = require('../base64-handler');

describe("Base64 handler", function () {
    it("Gets base64 string from event", function () {
        let eventFixture = class {
            constructor() {
                this.body = JSON.stringify({'data': {'image': 'base64stuff'}})
            }
        };

        expect(Base64Handler.getBase64Image(new eventFixture())).to.equal('base64stuff')
    });

    it("Blows up when json is malformed", function () {
        let eventFixture = class {
            constructor() {
                this.body = JSON.stringify({'data': 'base64stuff'})
            }
        };
        expect(Base64Handler.getBase64Image(new eventFixture())).to.equal('base64stuff')
    });

    it("Removes everything in front of comma, inclusive", function () {
        let fixtureString = 'something,stuff';
        expect(Base64Handler.pruneBase64String(fixtureString)).to.equal('stuff')
    })
});