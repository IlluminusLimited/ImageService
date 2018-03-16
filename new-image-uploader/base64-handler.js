const fileType = require('file-type');

class Base64Handler {


    static getBuffer(prunedBase64String) {
        return Buffer.from(prunedBase64String, 'base64');
    }

    static pruneBase64String(base64Image) {
        return base64Image.substr(base64Image.indexOf(',') + 1)
    }

    static getMimeType(buffer, callback) {
        let fileMime = fileType(buffer);

        if (fileMime === null) {
            return callback('The string supplied is not a file type');
        }

        return fileMime;
    }
}

module.exports = Base64Handler;