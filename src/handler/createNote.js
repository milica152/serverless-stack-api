'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event, context) => {
  const timestamp = new Date().getTime();

  const data = JSON.parse(event.body);
  if (typeof data.text !== 'string' || typeof data.image !== 'string') {
    console.error('Validation Failed');
    return {
      statusCode: 400,
      headers: { 
        'Content-Type': 'text/plain',
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,  },
      body: 'Couldn\'t create the todo item.',
    };
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: uuid.v1(),
      text: data.text,
      image: data.image,
      userId: data.userId,
      checked: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };

  try{
    await dynamoDb.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(params.Item),
      headers: { 
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true, },
    };
  } catch (error){
    console.error(error);
    return {
      statusCode: error.statusCode || 501,
      headers: {
        'Content-Type': 'text/plain',
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
      },
      body: 'Couldn\'t create the todo item.',
    };
  }
};
