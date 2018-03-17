const Base64Handler = require('../new-image-uploader/base64-handler');

class RequestHandler {
    static parseRequest(event, callback) {
        let data = JSON.parse(event.body)['data'];
        let image = data["image"];
        let userId = data['user_id'];
        let metadata = data['metadata'];
        let year = null;
        if(metadata != null) {
            year = metadata['year'];
        }


        if (data == null || userId == null || metadata == null || year == null) {
            let response = {
                statusCode: 400,
                body: JSON.stringify({
                    error: "Bad Request. Required fields are missing.",
                    example_body: {
                        data: {
                            user_id: "uuid",
                            metadata: {
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
            user_id: userId,
            metadata: metadata,
            image: image
        }
    }

    static perform(event, context, callback, fileBuilder, fileWriter, bucket) {
        let parsedRequest = RequestHandler.parseRequest(event, callback);

        let buffer = Base64Handler.getBuffer(Base64Handler.pruneBase64String(parsedRequest['image']));
        let fileMime = Base64Handler.getMimeType(buffer, callback);

        let params = fileBuilder.getFile(fileMime, buffer, bucket);

        fileWriter.saveObject(callback, params);
    }
}

module.exports = RequestHandler;