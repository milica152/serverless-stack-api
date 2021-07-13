const AWS = require('aws-sdk');
const { response } = require('../helper/response');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// users table service

module.exports.photo_upload = async (event) => {
    const user_id = event.requestContext.authorizer.claims.sub;
    const data = JSON.parse(event.body);
    const timestamp = new Date().getTime();



    try {
        // const result = await ;     // upload logged user's picture property in cognito with new picture
        return response(200, "");
    } catch (error) {
        return response(error.statusCode, error.message);
    }

}
