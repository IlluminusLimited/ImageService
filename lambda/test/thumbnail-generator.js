'use strict';

let expect = require('chai').expect;
let Base64Handler = require('../lib/thumbnail-generator');

describe("Thumbnail Generator", function () {
    it("Gets the correct mime type and image", function () {
        let fakeImage = "data:test/1234;base64,testing";
        let base64Handler = new Base64Handler(fakeImage);
        expect(base64Handler.mimeType).to.deep.equal({type: "test", subtype: "1234"});
        expect(base64Handler.base64Image).to.equal("testing");
    });

    it("Throws a regex mismatch exception", function() {
        let fakeImage = "blah";
        let throwTest = function() {
            new Base64Handler(fakeImage);
        };
        expect(throwTest).to.throw(Base64RegexMismatch);
    });
});
