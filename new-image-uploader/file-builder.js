const uuid = require('uuid/v4');

class FileBuilder {
    getFile(fileMime, buffer, bucketName, metadata) {
        let fileExt = fileMime.ext;

        let fileName = uuid() + '.' + fileExt;

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