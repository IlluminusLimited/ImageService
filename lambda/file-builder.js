const md5 = require('md5');

module.exports = class FileBuilder {
    getFile(fileMime, buffer, bucketName, metadata) {
        let fileExt = fileMime.ext;

        let fileName = 'raw/' + md5(buffer) + '.' + fileExt;

        if (metadata == null) {
            metadata = {};
        }

        return  {
            Bucket: bucketName,
            Key: fileName,
            Body: buffer,
            Metadata: metadata
        };
    }
};