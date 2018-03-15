
class FileWriter {
    constructor(s3) {
        this.s3 = s3;
    }

    saveObject(callback, params) {
        this.s3.putObject(params, function (err, data) {
            if (err) {
                return callback(err);
            }

            let response = {
                statusCode: 200,
                body: JSON.stringify({
                    params: params,
                    message: data
                })
            };

            return callback(null, response);
        });
    }

}

module.exports = FileWriter;