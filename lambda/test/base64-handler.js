'use strict';

const expect = require('chai').expect;
const Base64Handler = require('../lib/base64-handler');
const Base64RegexMismatch = require('../lib/base64-regex-mismatch');
const BadRequest = require('../lib/bad-request');

describe('Base64 handler', function () {
    it('Gets the correct mime type and image', function () {
        let fakeImage = 'data:test/1234;base64,testing';

        const verifier = (err, base64Handler) => {
            expect(err).to.equal(undefined);
            expect(base64Handler.mimeType).to.deep.equal({type: 'test', subtype: '1234'});
            expect(base64Handler.base64Image).to.equal('testing');
        };

        new Base64Handler(fakeImage, verifier);
    });

    it('Throws a regex mismatch exception', function () {
        let fakeImage = 'blah';

        const verifier = (err) => {
            expect(JSON.stringify(err)).to.equal(JSON.stringify(new BadRequest(
                new Base64RegexMismatch('Your image did not match the base64 regex'))));
        };

        new Base64Handler(fakeImage, verifier);
    });
});
