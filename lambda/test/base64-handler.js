'use strict';

let expect = require('chai').expect;
let Base64Handler = require('../base64-handler');
let base64Image = 'iVBORw0KGgoAAAANSUhEUgAAAAsAAAAECAYAAABY+sXzAAAABHNCSVQICAgIfAhkiAAAAFlJREFUCJl9yjEKwCAUBNERv43g/U+WKqVVsNRKxU0jJGnyYGGLcTln1VoBSCnRWsN7D0AIATOjlEKMEbQd16kxhuac6r1rrfWZJBmbAEn8eeKlT/z+zjkAbkDFRMbggmGwAAAAAElFTkSuQmCC'

describe("Base64 handler", function () {
    it("Gets the correct mime type", function (done) {
        Base64Handler.getMimeType(Base64Handler.getBuffer(base64Image), (err, mimeType) => {
        	if (err) {
        		done(err);
        	}
        	else {
        		expect(mimeType).to.deep.include({ ext: 'png', mime: 'image/png' } )
        		done();
        	}
        });
    });

    it("Removes everything in front of comma, inclusive", function () {
        let fixtureString = 'something,stuff';
        expect(Base64Handler.pruneBase64String(fixtureString)).to.equal('stuff')
    })
});