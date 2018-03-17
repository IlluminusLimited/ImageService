const uuid = require('uuid/v4');

class FileBuilder {
    getFile(fileMime, buffer, bucketName) {
        let fileExt = fileMime.ext;

        let fileName = uuid() + '.' + fileExt;


        return  {
            Bucket: bucketName,
            Key: fileName,
            Body: buffer
        };
    }
}

module.exports = FileBuilder;