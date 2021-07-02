'use strict';

const AWS = require('aws-sdk');


module.exports.handler = async (event, context) => {
  try{
    const userId = event.queryStringParameters.userId;
    const dynamoDb = new AWS.DynamoDB.DocumentClient();
    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: { 
        ':userId': userId,
      }
    };

    const result = await dynamoDb.query(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
      headers: { 
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true, },
    };
  } catch(error){
    return {
      statusCode: error.statusCode || 501,
      headers: { 
        'Content-Type': 'text/plain',
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true, },
      body: 'Couldn\'t fetch the todos.',
    }
  }
};
