'use strict';

const FileWriter = require('./file-writer');
const FileBuilder = require('./file-builder');
const _ = require('lodash');
const InternalServerError = require('./internal-server-error');
const BadRequest = require('./bad-request');
const TokenProvider = require('./TokenProvider');

module.exports = class ImageUploader {
    constructor(params = {}) {
        this.FileBuilder = _.isUndefined(params.fileBuilder) ? new FileBuilder() : params.fileBuilder;
        this.FileWriter = _.isUndefined(params.fileWriter) ? new FileWriter() : params.fileWriter;
        this.bucket = _.isUndefined(params.bucketName) ? process.env.BUCKET_NAME : params.bucketName;
        if (this.bucket === null) {
            throw new InternalServerError('Bucket undefined');
        }
        this.tokenProvider = _.isUndefined(params.tokenProvider) ? new TokenProvider() : params.tokenProvider;
    }

    async parseRequest(event) {
        console.log('Event received', event);

        const decoded = await this.tokenProvider.authorize(event);

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
