'use strict';

const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event, context) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    KeyConditionExpression: 'id = :id and userId = :userId',
    ExpressionAttributeValues: { 
      ':id': event.pathParameters.id,
      ':userId': event.queryStringParameters.userId
    }
  };
  try{
    const result = await dynamoDb.query(params).promise();
    return  {
      statusCode: 200,
      body: JSON.stringify(result.Items),
      headers: { 
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true, },
    };
  } catch(error){
    console.error(error);
    return {
      statusCode: error.statusCode || 501,
      headers: { 
        'Content-Type': 'text/plain', 
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true, },
      body: 'Couldn\'t fetch the todo item.',
    };
  }
};
