const uuid = require('uuid');
const AWS = require('aws-sdk');
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
        return {
            statusCode: 200,
            body: JSON.stringify(params.Item),
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
            },
        };
    } catch (error) {
        console.error(error);
        return {
            // create separate object for response
            statusCode: error.statusCode || 501,
            headers: {
                'Content-Type': 'text/plain',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            },
            body: 'Couldn\'t create the todo item.',
        };
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
        await dynamoDb.delete(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({}),
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
            },
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: error.statusCode || 501,
            headers: {
                'Content-Type': 'text/plain',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
            },
            body: 'Couldn\'t remove the todo item.',
        };
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
        return {
            statusCode: 200,
            body: JSON.stringify(result.Items),
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
            },
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: error.statusCode || 501,
            headers: {
                'Content-Type': 'text/plain',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
            },
            body: 'Couldn\'t fetch the todo item.',
        };
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
        return {
            statusCode: 200,
            body: JSON.stringify(result.Items),
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
            },
        };
    } catch (error) {
        return {
            statusCode: error.statusCode || 501,
            headers: {
                'Content-Type': 'text/plain',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
            },
            body: 'Couldn\'t fetch the todos.',
        }
    }
}

module.exports.update = async (event) => {
    const data = JSON.parse(event.body);
    const timestamp = new Date().getTime();

    if (typeof data.text !== 'string' || typeof data.checked !== 'boolean') {
        console.error('Validation Failed');
        return {
            statusCode: 400,
            headers: {
                'Content-Type': 'text/plain',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
            },
            body: 'Couldn\'t update the todo item.',
        };
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
        return {
            statusCode: 200,
            body: JSON.stringify(result.Attributes),
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
            },
        };
    } catch (error) {
        return {
            statusCode: error.statusCode || 501,
            headers: {
                'Content-Type': 'text/plain',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
            },
            body: 'Couldn\'t fetch the todo item.',
        };
    }

}
