'use strict';

const expect = require('chai').expect;
const ImageUploader = require('../lib/image-uploader');
const util = require('util');
const Ok = require('../lib/ok');

const GoodPayload = {
    data: {
        image: 'base64 encoded image'
    }
};

const BadPayload = {
    data: {}
};

const MockFileBuilder = class MockFileBuilder {
    getFile() {
        return {
            Key: 'filename',
            Body: new Buffer([1, 2, 3, 4])
        };
    }
};

const MockFileWriter = class MockFileWriter {
    saveObject(imageFile, callback) {
        callback(undefined, new Ok('asdf'));
    }
};

const BadResponsePayload = {
    error: 'Bad Request. Required fields are missing.',
    example_body: {
        data: {
            metadata: {
                user_id: 'uuid',
                imageable_type: 'imageable_type',
                imageable_id: 'imageable_id'
            },
            image: 'base64 encoded image'
        }
    }
};


const MockTokenProvider = class MockTokenProvider {
    async authorize() {
        return {
            user_id: 'uuid',
            imageable_type: 'imageable_type',
            imageable_id: 'imageable_id'
        };
    }
};

describe('ImageUploader', function () {
    it('Correctly parses the event', function () {
        let eventFixture = class {
            constructor() {
                this.body = JSON.stringify(GoodPayload);
            }
        };
        return new ImageUploader({tokenProvider: new MockTokenProvider()})
            .parseRequest(new eventFixture())
            .then(result => {
                expect(result).to.deep.include(GoodPayload.data);
            }).catch(error => expect(error).to.equal(undefined));
    });

    it('Blows up on missing imageable', function () {
        let eventFixture = class {
            constructor() {
                this.body = JSON.stringify({data: BadPayload});
            }
        };

        let callback = (err) => {
            expect(err).to.deep.equal({
                statusCode: 400, headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,

                }, body: BadResponsePayload
            });
        };

        return new ImageUploader('bucket').parseRequest(new eventFixture(), callback);
    });

    it('Actually uploads the file', function () {
        let eventFixture = class {
            constructor() {
                this.body = JSON.stringify(GoodPayload);
            }
        };
        let callback = (err, data) => {
            if (err) {
                console.log(util.inspect(err, {depth: 5}));
            }

            expect(err).to.equal(undefined);
            expect(data).to.deep.equal({
                    statusCode: 200, body: JSON.stringify('asdf'), headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': true,
                    }
                }
            );
        };

        let imageUploader = new ImageUploader('bucket', new MockFileBuilder(), new MockFileWriter());

        return imageUploader.perform(new eventFixture(), callback);
    });
});