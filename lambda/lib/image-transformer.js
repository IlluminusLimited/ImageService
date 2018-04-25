const Sharp = require('sharp');

module.exports = class ImageTransformer {
   static transformImage(body, width, height, format = 'jpeg') {
        return Sharp(body)
            .resize(width, height)
            .max()
            .toFormat(format)
            .toBuffer()
    }
};
