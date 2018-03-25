'use strict';

module.exports = class FileWriter {
    constructor(s3) {
        this.s3 = s3;
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