const Base64Handler = require("./base64-handler");
const md5 = require('md5');

module.exports = class FileBuilder {
    getFile(image, callback) {
        let buffer = Base64Handler.getBuffer(Base64Handler.pruneBase64String(image));
        Base64Handler.getMimeType(buffer, (err, mimeType) => {
            if (err) {
                callback(err);
            }
            else {
                let fileName = 'raw/' + md5(buffer) + '.' + mimeType.ext;
                callback(undefined, {
                    Key: fileName,
                    Body: buffer
                });
            }
        });
    }
};