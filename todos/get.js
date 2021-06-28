'use strict';

const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.get = async (event, context) => {
  console.log("getting data");
  console.log(event.pathParameters.id);
  console.log(event.queryStringParameters.userId);

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
    console.log(result.Items);
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
