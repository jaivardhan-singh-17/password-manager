const crypto = require('crypto');

exports.handler = async (event, context) => {
    const challenge = crypto.randomBytes(32).toString('base64');
    return {
        statusCode: 200,
        body: JSON.stringify({ challenge }),
    };
};
