const crypto = require('crypto');

const generateSecret = () => {
    return crypto.randomBytes(64).toString('hex');
};

console.log('JWT_SECRET:', generateSecret());
