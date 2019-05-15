'use strict';

const jwt = require('jsonwebtoken');
const Forbidden = require('./forbidden');
const Unauthorized = require('./unauthorized');
const Base64 = require('js-base64').Base64;

function parseBase64Keys(key) {
    if (key) {
        return Base64.decode(key);
    }
}

//Used for communicating with PinsterApi
class TokenProvider {


    constructor(params = {}) {
        // Pinster's generated JWT public key (not to be confused with auth0 stuff which has nothing to do with this)
        this.apiPublicKey = params.apiPublicKey || parseBase64Keys(process.env.API_PUBLIC_KEY);
        //We only receive tokens targeted at us (check aud on incoming tokens against this) and we only generate tokens for the api (use this for iss)
        this.imageServiceUrl = params.imageServiceUrl || process.env.IMAGE_SERVICE_URL;
        // We only generate tokens for PinsterApi to consume (use this as iss) and we only consume tokens from the api (check the aud against this value)
        this.pinsterApiUrl = params.pinsterApiUrl || process.env.PINSTER_API_URL;
        // The private key to encode JWTs with
        this.privateKey = params.privateKey || parseBase64Keys(process.env.PRIVATE_KEY);
        console.debug(`TokenProvider params: ${JSON.stringify(this)}`);
    }

    //Returns parsed payload of JWT
    async authorize(event) {
        const authHeader = event.headers.Authorization;
        let token = null;

        if (authHeader) {
            token = authHeader.replace('Bearer ', '');
        }

        if (!token) {
            throw new Unauthorized('Request missing valid Authorization header.');
        }

        return this.verify(token);
    }

    async verify(token) {
        try {
            return jwt.verify(token, this.apiPublicKey.trim(), {
                audience: this.imageServiceUrl,
                issuer: this.pinsterApiUrl,
                ignoreExpiration: false,
                ignoreNotBefore: false,
                clockTolerance: 10,
                algorithms: ['RS256']
            });
        } catch (err) {
            console.error('Raw JWT error: ', err);
            let stringifiedError = JSON.stringify(err);
            if (stringifiedError.length < 4) {
                stringifiedError = 'Something was wrong with the signature verification step.';
            }
            throw new Forbidden(`Token was invalid. Error: ${stringifiedError}`);
        }
    }

    //Returns parsed payload of JWT
    async generate(payload = {}) {
        const options = {
            issuer: this.imageServiceUrl,
            audience: this.pinsterApiUrl,
            expiresIn: '10 seconds',
            notBefore: '-1ms',
            algorithm: 'RS256'
        };

        return jwt.sign(payload, this.privateKey.trim(), options);
    }


}

module.exports = TokenProvider;