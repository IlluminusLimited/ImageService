'use strict';

const expect = require('chai').expect;
const util = require('util');

const ThumbnailGenerator = require('../lib/thumbnail-generator');

const MockEvent = {
    queryStringParameters: {
        key: 'bob/key_400x200'
    }
};

const MockEventTwo = {
    queryStringParameters: {
        key: 'key_400x200'
    }
};
const MockS3 = class MockS3 {
    getObject(s3Object, callback) {
        callback(undefined, {Body: new Buffer([1, 2, 3, 4])});
    }

    putObject(s3Object, callback) {
        callback();
    }
};


const MockImageTransformer = class MockImageTransformer {
    transformImage(parsedParameters, callback) {
        parsedParameters.buffer = new Buffer([1, 2, 3, 4]);

        callback(undefined, parsedParameters);
    }
};

const ExpectedResponse = {
    statusCode: 301,
    headers:
        {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
            location: 'http://image-service-prod.pinster.io/bob/key_400x200',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: '0'
        },
    body: JSON.stringify('')
};

const ExpectedResponseTwo = {
    statusCode: 301,
    headers:
        {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
            location: 'http://image-service-prod.pinster.io/key_400x200',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: '0'
        },
    body: JSON.stringify('')
};


describe('Thumbnail Generator', function () {
    it('Gets the correct mime type and image', function () {
        let thumbnailGenerator = new ThumbnailGenerator('bucket', 'http://image-service-prod.pinster.io',
            new MockS3(), new MockImageTransformer());
        thumbnailGenerator.generate(MockEvent, (err, data) => {
            console.log(util.inspect(err, {depth: 5}));

            expect(err).to.equal(undefined);
            console.log(util.inspect(data, {depth: 5}));

            expect(data).to.deep.equal(ExpectedResponse);
        });
    });

    it('Gets the correct mime type and image from non nested image', function () {
        let thumbnailGenerator = new ThumbnailGenerator('bucket', 'http://image-service-prod.pinster.io',
            new MockS3(), new MockImageTransformer());
        thumbnailGenerator.generate(MockEventTwo, (err, data) => {
            console.log(util.inspect(err, {depth: 5}));

            expect(err).to.equal(undefined);
            console.log(util.inspect(data, {depth: 5}));

            expect(data).to.deep.equal(ExpectedResponseTwo);
        });
    });
});
