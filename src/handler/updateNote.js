'use strict';

const { update } = require("../services/notesService");

module.exports.handler = async (event, context) => {
  update(event);
};
