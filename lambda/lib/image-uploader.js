'use strict';

const FileWriter = require('./file-writer');
const FileBuilder = require('./file-builder');
const _ = require('lodash');
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

    async parseRequest(event) {
        console.log('Event received', event);

        const authHeader = event.headers.Authorization;
        let token = null;

        if (authHeader) {
            token = authHeader.replace('Bearer ', '');
        }

        if (!token) {
            throw new Unauthorized('Request missing valid Authorization header.');
        }

        const decoded = await this.tokenProvider.validate(token);

        const user_id = decoded.user_id;
        const imageable_type = decoded.imageable_type;
        const imageable_id = decoded.imageable_id;


        if (!event.body) {
            throw new BadRequest(
                {
                    error: 'Bad Request. Required fields are missing.',
                    example_body: {
                        data: {
                            image: 'base64 encoded image'
                        }
                    }
                });

        }
        const data = JSON.parse(event.body).data;
        if (!data) {
            throw new BadRequest(
                {
                    error: 'Bad Request. Required fields are missing.',
                    example_body: {
                        data: {
                            image: 'base64 encoded image'
                        }
                    }
                });
        }

        const response = {
            metadata: {user_id, imageable_type, imageable_id},
            image: data.image,
            bucket: this.bucket
        };
        console.log('Uploader output: ', response);

        return response;
    }

    async perform(event, callback) {
        return this.parseRequest(event)
            .then(this.FileBuilder.getFile)
            .then(this.FileWriter.saveObject)
            .then(saveObjectResponse => {
                console.debug('Successful response: ', saveObjectResponse);
                callback(undefined, saveObjectResponse);
            })
            .catch(err => {
                console.error('Error processing: ', err);
                callback(err);
            });
    }
};
