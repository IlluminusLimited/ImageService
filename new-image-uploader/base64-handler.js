const fileType = require('file-type');

class Base64Handler {
    static getBase64Image(event) {
        return JSON.parse(event.body)['data']['image'];
    }

    static getBuffer(base64Image) {
        return Buffer.from(base64Image.substr(base64Image.indexOf(',') + 1), 'base64');
    }

    static getMimeType(buffer) {
        let fileMime = fileType(buffer);

        if (fileMime === null) {
            return callback('The string supplied is not a file type');
        }

        return fileMime;
    }
}

module.exports = Base64Handler;