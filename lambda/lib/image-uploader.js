'use strict';

const FileWriter = require('./file-writer');
const FileBuilder = require('./file-builder');
const _ = require('lodash');
const async = require('async');
const util = require('util');
const InternalServerError = require('./internal-server-error');
const BadRequest = require('./bad-request');
const Unauthorized = require('./unauthorized');
const TokenProvider = require('./TokenProvider');

module.exports = class ImageUploader {
    constructor(bucketName, fileBuilder, fileWriter, tokenProvider) {
        this.FileBuilder = _.isUndefined(fileBuilder) ? new FileBuilder() : fileBuilder;
        this.FileWriter = _.isUndefined(fileWriter) ? new FileWriter() : fileWriter;
        this.bucket = _.isUndefined(bucketName) ? process.env.BUCKET_NAME : bucketName;
        if (this.bucket === null) {
            throw new InternalServerError('Bucket undefined');
        }
        this.tokenProvider = _.isUndefined(tokenProvider) ? new TokenProvider() : tokenProvider;
    }

    async parseRequest(event, callback) {
        console.log('Event received', event);

        const authHeader = event.headers.Authorization;
        let token = null;

        if (authHeader) {
            token = authHeader.replace('Bearer ', '');
        }

        if (!token) {
            return callback(new Unauthorized('Request missing valid Authorization header.'));
        }

        const decoded = await this.tokenProvider.validate(token).catch(error => {
            return callback(error);
        });




        if (!event.body) {
            let response = new BadRequest(
                {
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
                });
            callback(response);
        }
        const data = JSON.parse(event.body).data;
        if (!data) {
            let response = new BadRequest(
                {
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
                });
            callback(response);
        }
        // TODO - JSON Schema Validation

        let image = data.image;
        let metadata = data.metadata;
        let bucket = this.bucket;
        let userId = null;
        let imageable_id = null;
        let imageable_type = null;

        if (metadata !== null && metadata !== undefined) {
            userId = metadata.user_id;
            imageable_id = metadata.imageable_id;
            imageable_type = metadata.imageable_type;
        }

        if (data === null || userId === null || metadata === null || imageable_id === null || imageable_type === null) {
            let response = new BadRequest(
                {
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
                });
            callback(response);
        }
        else {
            callback(undefined, {
                metadata: metadata,
                image: image,
                bucket: bucket
            });
        }
    }

    perform(event, callback) {
        let tasks = [];

        tasks.push((callback) => {
            this.parseRequest(event, callback);
        });

        tasks.push((parsedRequest, callback) => {
            this.FileBuilder.getFile(parsedRequest, callback);
        });

        tasks.push((imageFile, callback) => {
            this.FileWriter.saveObject(imageFile, callback);
        });

        async.waterfall(tasks, (err, data) => {
            console.log('Finished. Resolving response body');
            if (err) {
                console.log(util.inspect(err, {depth: 5}));
            }
            else {
                console.log(util.inspect(data, {depth: 5}));
            }

            err ? err.build(callback) : data.build(callback);
        });
    }
};
