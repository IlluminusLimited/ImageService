'use strict';

let expect = require('chai').expect;
let FileBuilder = require('../file-builder');
let base64ImageMetadata = 'data:image/png;base64,';
let base64Image = 'iVBORw0KGgoAAAANSUhEUgAAAAsAAAAECAYAAABY+sXzAAAABHNCSVQICAgIfAhkiAAAAFlJREFUCJl9yjEKwCAUBNERv43g/U+WKqVVsNRKxU0jJGnyYGGLcTln1VoBSCnRWsN7D0AIATOjlEKMEbQd16kxhuac6r1rrfWZJBmbAEn8eeKlT/z+zjkAbkDFRMbggmGwAAAAAElFTkSuQmCC';
let base64ImageMD5 = 'C8B79648C60D9489F68DC5F25A1D7A9E';

describe('FileBuilder', function() {
    it('Returns the correct file information', function() {
        let fileBuilder = new FileBuilder();
        let file = fileBuilder.getFile(base64ImageMetdata + base64Image)
        let mockFile = {
            Key: 'raw/' + base64ImageMD5 + '.png',
            Body: Buffer.from(base64Image, 'base64')
        };
        expect(file).to.deep.equal(mockFile);
    });
});