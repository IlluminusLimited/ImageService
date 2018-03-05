'use strict';


let expect = require('chai').expect;

let LambdaTester = require('lambda-tester');

let newImageUploaderLambda = require('../index');

describe('new-image-uploader lambda', function () {
    it('does tsuff', function () {
        return LambdaTester(newImageUploaderLambda.upload)
            .event({'data': {'image': 'base64stuff'}})
            .expectResult((result) => {
                return expect(result.valid).to.be.true;
            })
    })
});