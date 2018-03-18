class FileWriter {
    constructor(s3) {
        this.s3 = s3;
    }

    saveObject(callback, params) {
        this.s3.putObject(params, function (err, data) {
            if (err) {
                console.log(err, err.stack);
                return callback(err);
            }

            let response = {
                statusCode: 200,
                body: JSON.stringify({
                    bucket: params['Bucket'],
                    key: params['Key'],
                    message: data
                })
            };

            return callback(null, response);
        });
    }

}

module.exports = FileWriter;