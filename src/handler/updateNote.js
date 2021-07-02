'use strict';

const AWS = require('aws-sdk'); 

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event, context) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  if (typeof data.text !== 'string' || typeof data.checked !== 'boolean') {
    console.error('Validation Failed');
    return {
      statusCode: 400,
      headers: { 
        'Content-Type': 'text/plain',
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true, },
      body: 'Couldn\'t update the todo item.',
    };
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id,
      userId: data.userId
    },
    ExpressionAttributeNames: {
      '#todo_text': 'text',
    },
    ExpressionAttributeValues: {
      ':text': data.text,
      ':checked': data.checked,
      ':updatedAt': timestamp
    },
    UpdateExpression: 'SET #todo_text = :text, checked = :checked, updatedAt = :updatedAt',
    ReturnValues: 'ALL_NEW',
  };

  try{
    const result = await dynamoDb.update(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
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
      body: 'Couldn\'t fetch the todo item.',
    };
  }
};
