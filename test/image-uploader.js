'use strict';


let expect = require('chai').expect;

let LambdaTester = require('lambda-tester');

let newImageUploaderLambda = require('../image-uploader').upload;

describe('newImageUploader lambda', function () {
    it('Lambda actually works', function () {
        return LambdaTester(newImageUploaderLambda)
            .event({
                body: JSON.stringify({
                    data: {
                        metadata: {
                            user_id: 'asdf',
                            year: "2018"
                        },
                        image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAECAYAAABY+sXzAAAABHNCSVQICAgIfAhkiAAAAFlJREFUCJl9yjEKwCAUBNERv43g/U+WKqVVsNRKxU0jJGnyYGGLcTln1VoBSCnRWsN7D0AIATOjlEKMEbQd16kxhuac6r1rrfWZJBmbAEn8eeKlT/z+zjkAbkDFRMbggmGwAAAAAElFTkSuQmCC'
                    }
                })
            })
            .expectResult()
    });
});