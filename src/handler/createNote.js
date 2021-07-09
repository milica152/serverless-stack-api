'use strict';

const { response } = require("../helper/response");
const { create } = require("../services/notesService");

module.exports.handler = async (event, context) => {
  const tempData = JSON.parse(event.body);
  if (typeof tempData.text !== 'string' || typeof tempData.image !== 'string') {
    return response(400, 'Description or image are not the correct type!');
  }
  return create(event);
};
