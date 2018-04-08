'use strict';

const AWSS3 = require('aws-sdk/clients/s3');
const _ = require('lodash');

module.exports = class FileWriter {
    constructor(s3) {
        this.s3 = _.isUndefined(s3) ? new AWSS3() : s3;
    }

    saveObject(imageFile, callback) {
        this.s3.putObject(imageFile, (err, data) => {
            if (err) {
                console.log(err, err.stack);
                callback(err);
            }
            else {
                callback(undefined, data);
            }
        });
    }

};