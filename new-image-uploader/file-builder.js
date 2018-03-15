const uuid = require('uuid/v4');

class FileBuilder {
    constructor(s3) {
        this.s3 = s3;
    }

    getFile(fileMime, buffer, bucketName) {
        let fileExt = fileMime.ext;

        let fileName = uuid() + '.' + fileExt;
        let fileFullName = fileName;
        let fileFullPath = bucketName + fileFullName;

        let params = {
            Bucket: bucketName,
            Key: fileFullName,
            Body: buffer
        };

        let uploadFile = {
            size: buffer.toString('ascii').length,
            type: fileMime.mime,
            name: fileName,
            full_path: fileFullPath
        };

        return params;
    }
}

module.exports = FileBuilder;