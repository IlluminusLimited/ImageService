'use strict';

const jwt = require('jsonwebtoken');
const Forbidden = require('./forbidden');
const Unauthorized = require('./unauthorized');

class TokenProvider {
    constructor(params = {}) {
        this.pinsterPublicKey = params.pinsterPublicKey || process.env.PINSTER_API_PUBLIC_KEY;
        this.privateKey = params.privateKey || process.env.PRIVATE_KEY;
        this.pinsterApiAud = params.pinsterApiAud || process.env.PINSTER_API_AUD;
        this.pinsterApiIss = params.pinsterApiIss || process.env.PINSETER_API_ISS;
    }

    async authorize(event) {
        const authHeader = event.headers.Authorization;
        let token = null;

        if (authHeader) {
            token = authHeader.replace('Bearer ', '');
        }

        if (!token) {
            throw new Unauthorized('Request missing valid Authorization header.');
        }

        try {
            return jwt.verify(token, this.pinsterPublicKey, {audience: this.pinsterApiAud, issuer: this.pinsterApiIss, algorithms: ['RS256'] });
        } catch(err) {
            throw new Forbidden(`Token was invalid. Error: ${JSON.stringify(err)}`);
        }
    }
}

module.exports = TokenProvider;