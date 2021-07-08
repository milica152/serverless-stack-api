module.exports.response = (statusCode, body) => {
    return {
        statusCode,
        body: (typeof body === 'object' && body !== null) ? JSON.stringify(body) : body,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
            'Content-Type': (typeof body === 'object' && body !== null) ? 'application/json' : 'text/plain',
        }
    };
}