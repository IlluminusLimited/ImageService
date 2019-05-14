'use strict';

let expect = require('chai').expect;
let md5 = require('md5');
let FileBuilder = require('../lib/file-builder');
let base64ImageMetadata = 'data:image/png;base64,';
let base64Image = 'iVBORw0KGgoAAAANSUhEUgAAAAsAAAAECAYAAABY+sXzAAAABHNCSVQICAgIfAhkiAAAAFlJREFUCJl9yjEKwCAUBNERv43g/U+WKqVVsNRKxU0jJGnyYGGLcTln1VoBSCnRWsN7D0AIATOjlEKMEbQd16kxhuac6r1rrfWZJBmbAEn8eeKlT/z+zjkAbkDFRMbggmGwAAAAAElFTkSuQmCC';
let imageMD5 = md5(Buffer.from(base64Image, 'base64'));

describe('fileBuilder', function () {
    it('Returns the correct file information', function () {
        let fileBuilder = new FileBuilder();

        let mockFile = {
            Key: 'raw/' + imageMD5,
            Body: Buffer.from(base64Image, 'base64'),
            ContentType: 'image/png',
            CacheControl: 'max-age=86400',
            Metadata: {
                'metadata': 'value',
                'base_file_name': '7f7af91e3a7e514a09b3ad0e364ba3ce'
            },
            Bucket: 'bucket'
        };

        let parsedPayload = {
            metadata: {'metadata': 'value'},
            image: base64ImageMetadata + base64Image,
            bucket: 'bucket'
        };

        return fileBuilder.getFile(parsedPayload).then(data => {
            expect(data).to.deep.equal(mockFile);
        });

    });
});
