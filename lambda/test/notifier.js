'use strict';

const expect = require('chai').expect;
const util = require('util');
const Notifier = require('../lib/notifier');

const mockImageParams = {data: {bucket: 'bucket', key: 'key'}};

const MockApiClient = class MockApiClient {
    constructor(shouldExplode) {
        this.shouldExplode = shouldExplode;
    }

    async post(path, body) {
        if (this.shouldExplode) {
            throw new Error('Should explode');
        }
        return body;
    }
};

const mockSNSClient = async (params) => {return params;};

describe('Notifier', function () {
    it('can notify success', function () {
        let notifier = new Notifier({apiClient: new MockApiClient(false)});

        return notifier.notifySuccess(mockImageParams)
            .then((response) => {
                expect(response).to.deep.equal(mockImageParams);
            });
    });

    it('can explode', function () {
        let notifier = new Notifier({apiClient: new MockApiClient(false)});

        return notifier.notifySuccess(mockImageParams)
            .then((response) => {
                expect(response).to.deep.equal(mockImageParams);
            });
    });

    it('can notify failure', function () {
        let notifier = new Notifier({snsPublish:  mockSNSClient});

        return notifier.notifyFailure({error: 'idk'})
            .then((response) => {
                return expect(response).to.deep.equal({
                    Message: JSON.stringify({error: 'idk'}, null, 2),
                    Subject: 'Image Moderation Failure',
                    TopicArn: undefined
                });
            });
    });
});