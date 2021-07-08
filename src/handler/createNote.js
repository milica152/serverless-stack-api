'use strict';

const { create } = require("../services/notesService");

module.exports.handler = async (event, context) => {
  const tempData = JSON.parse(event.body);
  if (typeof tempData.text !== 'string' || typeof tempData.image !== 'string') {
    console.error('Validation Failed');
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'text/plain',
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: 'Couldn\'t create the todo item.',
    };
  }
  return create(event);
};
