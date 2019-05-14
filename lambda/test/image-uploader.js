'use strict';

const expect = require('chai').expect;
const ImageUploader = require('../lib/image-uploader');
const util = require('util');
const Ok = require('../lib/ok');

const goodPayload = {
    data: {
        image: 'base64 encoded image'
    }
};

const goodVerbosePayload = {
    data: {
        image: 'base64 encoded image',
        name: 'Awesome image',
        description: 'This image was taken by bobbert',
        featured: 1557762123
    }
};


const badVerbosePayload = {
    data: {
        image: 'base64 encoded image',
        name: 'a',
        description: 'This image was taken by bobbert who really likes to type a whole lot of things and is too verbose. No like really bobbert totally talks too much and needs to stop because reasons.',
        featured: '231'
    }
};

const badPayload = {
    data: {}
};

const badResponsePayload = {
    error: 'Bad Request. Required fields are missing.',
    example_body: {
        data: {
            image: 'base64 encoded image',
            name: 'Optional name of image',
            description: 'Optional description',
            featured: 'Optional unix epoch integer in ms'
        }
    }
};

const MockFileBuilder = class MockFileBuilder {
    async getFile() {
        return {
            Key: 'filename',
            Body: new Buffer([1, 2, 3, 4])
        };
    }
};

const MockFileWriter = class MockFileWriter {
    async saveObject() {
        return new Ok('asdf');
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
                this.body = JSON.stringify(goodPayload);
            }
        };
        return new ImageUploader({bucketName: 'bucket', tokenProvider: new MockTokenProvider()})
            .parseRequest(new eventFixture())
            .then(result => {
                expect(result).to.deep.include(goodPayload.data);
            }).catch(error => expect(error).to.equal(undefined));
    });

    it('Correctly parses the data', function () {
        let eventFixture = class {
            constructor() {
                this.body = JSON.stringify(goodVerbosePayload);
            }
        };

        const expected = {
            metadata: {
                user_id: 'uuid',
                imageable_type: 'imageable_type',
                imageable_id: 'imageable_id',
                name: goodVerbosePayload.data.name,
                description: goodVerbosePayload.data.description,
                featured: goodVerbosePayload.data.featured
            },
            image: goodVerbosePayload.data.image,
            bucket: 'bucket'
        };
        return new ImageUploader({bucketName: 'bucket', tokenProvider: new MockTokenProvider()})
            .parseRequest(new eventFixture())
            .then(result => {
                expect(result).to.deep.equal(expected);
            });
    });

    it('Blows up on missing imageable', function () {
        let eventFixture = class {
            constructor() {
                this.body = JSON.stringify({data: badPayload});
            }
        };


        return new ImageUploader({bucketName: 'bucket', tokenProvider: new MockTokenProvider(), bucket: 'bucket'})
            .parseRequest(new eventFixture())
            .catch((err) => {
                expect(err).to.deep.equal({
                    statusCode: 400, headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': true,

                    }, body: badResponsePayload
                });
            });
    });

    it('Actually uploads the file', function () {
        let eventFixture = class {
            constructor() {
                this.body = JSON.stringify(goodPayload);
            }
        };

        const imageUploader = new ImageUploader({
            tokenProvider: new MockTokenProvider(),
            bucketName: 'bucket',
            fileBuilder: new MockFileBuilder(),
            fileWriter: new MockFileWriter()
        });

        return imageUploader.perform(new eventFixture())
            .then(data => {
                return expect(data).to.deep.equal(
                    {
                        statusCode: 200, body: 'asdf', headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Credentials': true,
                        }
                    }
                );
            });
    });

    it('Correctly barfs on bad data', function () {
        let eventFixture = class {
            constructor() {
                this.body = JSON.stringify(badVerbosePayload);
            }
        };


        const imageUploader = new ImageUploader({
            tokenProvider: new MockTokenProvider(),
            bucketName: 'bucket',
            fileBuilder: new MockFileBuilder(),
            fileWriter: new MockFileWriter()
        });


        return imageUploader.perform(new eventFixture()).then(() => {
            throw new Error('Should not get here');
        }).catch(err => {
                return expect(err).to.deep.equal(
                    {
                        statusCode: 400, body: {
                            errors: {
                                data: {
                                    name: 'Must be between 3 and 140 characters A-z0-9. Omit or null the field otherwise.',
                                    description: 'Must be between 3 and 140 characters A-z0-9. Omit or null the field otherwise.',
                                    featured: 'Must be an integer. Omit or null the field otherwise.',
                                }
                            }
                        }, headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Credentials': true,
                        }
                    }
                );
            }
        );
    });
});


