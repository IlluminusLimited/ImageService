'use strict';


let expect = require('chai').expect;

let LambdaTester = require('lambda-tester');

let newImageUploaderLambda = require('../index').upload;

let Base64Handler = require('../base64-handler');

describe('new-image-uploader lambda', function () {
    it('Lambda actually works', function () {
        return LambdaTester(newImageUploaderLambda)
            .event({body: JSON.stringify({data: {image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAECAYAAABY+sXzAAAABHNCSVQICAgIfAhkiAAAAFlJREFUCJl9yjEKwCAUBNERv43g/U+WKqVVsNRKxU0jJGnyYGGLcTln1VoBSCnRWsN7D0AIATOjlEKMEbQd16kxhuac6r1rrfWZJBmbAEn8eeKlT/z+zjkAbkDFRMbggmGwAAAAAElFTkSuQmCC'}})})
            .expectResult()
    });

    it('Blows up on invalid body', function () {
        return LambdaTester(newImageUploaderLambda)
            .event({body: JSON.stringify({data: {'not_image': 'base64stuff'}})})
            .expectError((err) => {
                expect(err.message).to.equal(Base64Handler.JSON_ERROR());
            });
    })
});