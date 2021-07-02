'use strict';
const { get } = require('../services/notesService');

module.exports.handler = async (event, context) => {
  get(event);
};
