'use strict';


let expect = require('chai').expect;

let LambdaTester = require('lambda-tester');

let newImageUploaderLambda = require('../index').handler;

describe('new-image-uploader lambda', function () {
    it('Lambda actually works', function () {
        return LambdaTester(newImageUploaderLambda)
            .event({body: JSON.stringify({data: {image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAECAYAAABY+sXzAAAABHNCSVQICAgIfAhkiAAAAFlJREFUCJl9yjEKwCAUBNERv43g/U+WKqVVsNRKxU0jJGnyYGGLcTln1VoBSCnRWsN7D0AIATOjlEKMEbQd16kxhuac6r1rrfWZJBmbAEn8eeKlT/z+zjkAbkDFRMbggmGwAAAAAElFTkSuQmCC'}})})
            .expectResult()
    });

    it('Blows up', function () {
        return LambdaTester(newImageUploaderLambda)
            .event({body: JSON.stringify({data: {'not_image': 'base64stuff'}})})
            .expectError();
    })
});