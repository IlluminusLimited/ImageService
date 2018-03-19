const Base64Handler = require('./base64-handler');

module.exports = class RequestHandler {
    static parseRequest(event, callback) {
        let data = JSON.parse(event.body)['data'];
        let image = data["image"];
        let metadata = data['metadata'];
        let year = null;
        let userId = null;
        if (metadata != null) {
            year = metadata['year'];
            userId = metadata['user_id'];
        }


        if (data == null || userId == null || metadata == null || year == null) {
            let response = {
                statusCode: 400,
                body: JSON.stringify({
                    error: "Bad Request. Required fields are missing.",
                    example_body: {
                        data: {
                            metadata: {
                                user_id: "uuid",
                                year: "integer year"
                            },
                            image: "base64 encoded image"
                        }
                    }
                })
            };
            return callback(response)
        }

        return {
            metadata: metadata,
            image: image
        }
    }

    static perform(event, context, callback, fileBuilder, fileWriter, bucket) {
        let parsedRequest = RequestHandler.parseRequest(event, callback);

        let buffer = Base64Handler.getBuffer(Base64Handler.pruneBase64String(parsedRequest['image']));
        let fileMime = Base64Handler.getMimeType(buffer, callback);

        let params = fileBuilder.getFile(fileMime, buffer, bucket, parsedRequest['metadata']);

        fileWriter.saveObject(callback, params);
    }
};