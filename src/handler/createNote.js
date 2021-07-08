'use strict';

const { response } = require("../helper/response");
const { create } = require("../services/notesService");

module.exports.handler = async (event, context) => {
  const tempData = JSON.parse(event.body);
  if (typeof tempData.text !== 'string' || typeof tempData.image !== 'string') {
    console.error('Validation Failed');
    return response(400, 'Couldn\'t create the todo item');
  }
  return create(event);
};
