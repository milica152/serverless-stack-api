const uuid = require('uuid');
const AWS = require('aws-sdk');
const { response } = require('../helper/response');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// notes table service

module.exports.create = async (event) => {
    const data = JSON.parse(event.body);
    const timestamp = new Date().getTime();
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Item: {
            id: uuid.v1(),
            text: data.text,
            image: data.image,
            userId: event.requestContext.authorizer.claims.sub,
            checked: false,
            createdAt: timestamp,
            updatedAt: timestamp,
        },
    };

    try {
        await dynamoDb.put(params).promise();
        return response(200, params.Item);
    } catch (error) {
        console.error(error);
        return response(error.statusCode, error.message);
    }
}

module.exports.deleteNote = async (event) => {
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            id: event.pathParameters.id,
            userId: event.requestContext.authorizer.claims.sub
        },
    }; 
    try {
        const note = await dynamoDb.delete(params).promise();
        return response(200, note);
    } catch (error) {
        console.error(error);
        return response(500, error.message);
    }
}

module.exports.get = async (event) => {
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        KeyConditionExpression: 'id = :id and userId = :userId',
        ExpressionAttributeValues: {
            ':id': event.pathParameters.id,
            ':userId': event.requestContext.authorizer.claims.sub
        }
    };
    try {
        const result = await dynamoDb.query(params).promise();
        return response(200, result.Items);
    } catch (error) {
        console.error(error);
        return response(500, error.message);
    }

}

module.exports.list = async (event) => {
    try {
        const userId = event.requestContext.authorizer.claims.sub;
        const params = {
            TableName: process.env.DYNAMODB_TABLE,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId,
            }
        };

        const result = await dynamoDb.query(params).promise();
        return response(200, result.Items);
    } catch (error) {
        return response(error.statusCode, error.message);
    }
}

module.exports.update = async (event) => {
    const data = JSON.parse(event.body);
    const timestamp = new Date().getTime();

    if (typeof data.text !== 'string' || typeof data.checked !== 'boolean') {
        console.error('Validation Failed');
        return response(400, 'Description or image are not the correct type!');
    }

    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            id: event.pathParameters.id,
            userId: event.requestContext.authorizer.claims.sub
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

    try {
        const result = await dynamoDb.update(params).promise();
        return response(200, result.Attributes);
    } catch (error) {
        return response(error.statusCode, error.message);
    }

}
