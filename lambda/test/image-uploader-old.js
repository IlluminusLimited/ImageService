'use strict';

const LambdaTester = require('lambda-tester');

const imageUploaderLambda = require('../lib/image-uploader');

describe('newImageUploader lambda', function () {
    it.skip('Lambda actually works', function () {
        return LambdaTester(imageUploaderLambda)
            .event({
                body: JSON.stringify({
                    data: {
                        metadata: {
                            user_id: 'asdf',
                            year: '2018'
                        },
                        image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAECAYAAABY+sXzAAAABHNCSVQICAgIfAhkiAAAAFlJREFUCJl9yjEKwCAUBNERv43g/U+WKqVVsNRKxU0jJGnyYGGLcTln1VoBSCnRWsN7D0AIATOjlEKMEbQd16kxhuac6r1rrfWZJBmbAEn8eeKlT/z+zjkAbkDFRMbggmGwAAAAAElFTkSuQmCC'
                    }
                })
            })
            .expectResult();
    });
});