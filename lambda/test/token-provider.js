'use strict';

const expect = require('chai').expect;
const TokenProvider = require('../lib/TokenProvider');
const keypair = require('keypair');


const token = 'eyJhbGciOiJSUzI1NiJ9.eyJpbWFnZWFibGVfdHlwZSI6IkNvbGxlY3Rpb24iLCJpbWFnZWFibGVfaWQiOiIxMjM0IiwiaXNzIjoiaHR0cHM6Ly9hcGktZGV2LnBpbnN0ZXIuaW8iLCJhdWQiOiJodHRwczovL2ltYWdlcy5pbWFnZS1zZXJ2aWNlLWRldi5waW5zdGVyLmlvIiwibmJmIjoxNTU3Nzc4MjQ3LCJleHAiOjE4NzMzOTc0NDh9.kwXnw-PLrnjwLo66lt0SrRhvXIUEWB8OQOmLxN_eLIzzp6u5fSfEj8ILewWeIAWzBO6RDTA1_nG87fIQh_z9KYhwZzccaVLWJaYFW3ItW4jnujID8uHPRB3ONxPHm4Z_WECZZzHMtshl1MBKsDxT8zoyaJT_E0la-jpB3kW8xLXdld0TFi218GNmE3Hup-Bq_M1E6VOKsDyOZ_9msifLHRmSXan9aShVuzvRn_AMxdYIR3FnK-Lxk0BabhlbT3S_EAFDV18-pE-Iy--AY4brLSQdiDSx7ZFsE-A0QtgipkpLOa8JiuTMeXd-fgK5yr46OOyH22WNjb6mltA-p8F1DA';
const apiPublicKey = '-----BEGIN PUBLIC KEY-----\n' +
    'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAylG9Jn8rd2XwG9ciMKzt\n' +
    'x8Pa/rvzdnwjqTwa6By0YJGcU/qy1wc3acV+90A3ZcqrdLzjbMiOUlQhapsZi9S/\n' +
    'vtea76xmq2ZSHBdfduhPtR+8SIW5zBAQLhDqkZmBQnyyYb+9Js5Ii1z9x2JiGN9O\n' +
    'BFxQwsoQ99XLANIdZVW1mnODwU/jbDOK8ZUA4RBRhYLIWaEa6nKjBWSwNvJpCd6y\n' +
    'eyiGqJih3Aa7+25YDpkh+2I5CyxkER8eLpWEZ57W2kxi7CDCQM7sWh79JwyDB8Hl\n' +
    'uY8/M03G+ycBzZfdF0ne4tQyz5oTxhQPQPfstjRsqNiBeLWRG3uWCT/RWfpjzRN/\n' +
    'yQIDAQAB\n' +
    '-----END PUBLIC KEY-----\n';
const goodEvent = {
    headers: {
        Authorization: token
    }
};

const key = keypair();

describe('TokenProvider', function () {
    it('Accepts valid token', function () {
        return new TokenProvider({apiPublicKey: apiPublicKey})
            .authorize(goodEvent)
            .then(decoded => {
                expect(decoded).to.deep.equal({
                    'aud': 'https://images.image-service-dev.pinster.io',
                    'exp': 1873397448,
                    'imageable_id': '1234',
                    'imageable_type': 'Collection',
                    'iss': 'https://api-dev.pinster.io',
                    'nbf': 1557778247,
                });
            });

    });

    it('Generates token with values', function () {
        return new TokenProvider({privateKey: key.private, imageServiceUrl: 'image-service', pinsterApiUrl: 'pinster-api'})
            .generate({thingy: 'thangy'})
            .then(generatedToken => {
               return new TokenProvider({apiPublicKey: key.public,  pinsterApiUrl: 'image-service', imageServiceUrl: 'pinster-api'})
                    .verify(generatedToken)
                    .then(decoded => {
                        expect(decoded).to.deep.include({
                            'aud': 'pinster-api',
                            'iss': 'image-service',
                            'thingy': 'thangy'
                        });
                    });
            });

    });
});


