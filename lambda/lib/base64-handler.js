module.exports = class Base64Handler {
    constructor(image) {
        let base64Regex = /data:([^/]+)\/([^;]+);base64,(.+)/;
        let matches = base64Regex.exec(image);
        this.mimeType = {
            type: matches[1],
            subtype: matches[2]
        };
        this.base64Image = matches[3];
        this.buffer = Buffer.from(this.base64Image, 'base64');
    }
};
