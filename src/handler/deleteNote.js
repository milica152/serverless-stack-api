'use strict';
const { deleteNote } = require("../services/notesService");

module.exports.handler = async (event, context) => {
  deleteNote(event);
};
