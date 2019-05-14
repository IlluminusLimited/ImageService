'use strict';

const expect = require('chai').expect;
const Base64Handler = require('../lib/base64-handler');
const BadRequest = require('../lib/bad-request');

describe('Base64 handler', function () {
    it('Gets the correct mime type and image', function () {
        let fakeImage = 'data:test/1234;base64,testing';

        return new Base64Handler().processImage(fakeImage)
            .then((base64Handler) => {
                expect(base64Handler.mimeType).to.deep.equal({type: 'test', subtype: '1234'});
                expect(base64Handler.base64Image).to.equal('testing');
            });
    });

    it('Throws a regex mismatch exception', function () {
        let fakeImage = 'blah';

        return new Base64Handler().processImage(fakeImage)
            .then(() => {
                throw new Error('Should not get here');
            })
            .catch(err => {
                expect(JSON.stringify(err)).to.equal(JSON.stringify(new BadRequest('Your image did not match the base64 regex')));
            });
    });
});
