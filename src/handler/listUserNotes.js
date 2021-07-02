'use strict';

const { list } = require("../services/notesService");

module.exports.handler = async (event, context) => {
  list(event);
};
