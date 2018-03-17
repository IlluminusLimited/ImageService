'use strict';


let expect = require('chai').expect;

let LambdaTester = require('lambda-tester');

let newImageUploaderLambda = require('../index').upload;

describe('new-image-uploader lambda', function () {
    // it('Lambda actually works', function () {
    //     return LambdaTester(newImageUploaderLambda)
    //         .event({
    //             body: JSON.stringify({
    //                 data: {
    //                     user_id: 'asdf',
    //                     metadata: {year: 2018},
    //                     image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAECAYAAABY+sXzAAAABHNCSVQICAgIfAhkiAAAAFlJREFUCJl9yjEKwCAUBNERv43g/U+WKqVVsNRKxU0jJGnyYGGLcTln1VoBSCnRWsN7D0AIATOjlEKMEbQd16kxhuac6r1rrfWZJBmbAEn8eeKlT/z+zjkAbkDFRMbggmGwAAAAAElFTkSuQmCC'
    //                 }
    //             })
    //         })
    //         .expectResult()
    // });
});