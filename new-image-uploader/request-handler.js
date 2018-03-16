class RequestHandler {
    static parseRequest(event, callback) {
        let data = JSON.parse(event.body)['data'];
        let image = data["image"];
        let userId = data['user_id'];
        let metadata = data['metadata'];
        let year = metadata['year'];

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
}

module.exports = RequestHandler;