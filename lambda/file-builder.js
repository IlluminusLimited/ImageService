const Base64Handler = require("./base64-handler");
const md5 = require('md5');

module.exports = class FileBuilder {
    getFile(image) {
        let buffer = Base64Handler.getBuffer(Base64Handler.pruneBase64String(image));
        let mimeType = Base64Handler.getMimeType(image);
        let fileName = 'raw/' + md5(buffer) + '.' + mimeType.subtype;
        return {
            Key: fileName,
            Body: buffer
        };
    }
};