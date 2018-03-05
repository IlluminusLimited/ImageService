let expect = require('chai').expect;
let Base64Handler = require('../base64-handler');

describe("Base64 handler", function () {
    it("Gets base64 image from event", function () {
        let eventFixture = class {
            constructor() {
                this.body = JSON.stringify({'data': {'image': 'base64stuff'}})
            }
        };

        expect(Base64Handler.getBase64Image(new eventFixture())).to.equal('base64stuff')
    })
});