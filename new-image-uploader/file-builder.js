const md5 = require('md5');

class FileBuilder {
    getFile(fileMime, buffer, bucketName, metadata) {
        let fileExt = fileMime.ext;

        let fileName = md5(buffer) + '.' + fileExt;

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
}

module.exports = FileBuilder;