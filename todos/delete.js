'use strict';

const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.delete = async (event, context) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id,
      userId: event.pathParameters.userId
    },
  };
  try{
    await dynamoDb.delete(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({}),
      headers: { 
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,  },
    };
  } catch(error){
    console.error(error);
    return {
      statusCode: error.statusCode || 501,
      headers: { 
        'Content-Type': 'text/plain',
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,  },
      body: 'Couldn\'t remove the todo item.',
    };
  }
};
