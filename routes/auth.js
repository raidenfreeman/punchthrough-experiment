const jwt = require('express-jwt');
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    throw new Error('💣  jwt secret not found in environment variables.');
}

const getTokenFromHeaders = req => {
    const {
        headers: {
            authorization
        }
    } = req;
    if (!authorization) {
        return null;
    }
    const splittedAuthorization = authorization.split(' ');
    if (splittedAuthorization[0] === 'Token') {
        return splittedAuthorization[1];
    } else {
        return null;
    }
}

const auth = {
    required: jwt({
        secret: jwtSecret,
        userProperty: 'payload',
        getToken: getTokenFromHeaders
    }),
    optional: jwt({
        secret: jwtSecret,
        userProperty: 'payload',
        getToken: getTokenFromHeaders,
        credentialsRequired: false,
    })
};

module.exports = auth;