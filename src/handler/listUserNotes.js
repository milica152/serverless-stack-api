'use strict';

const { list } = require("../services/notesService");

module.exports.handler = async (event, context) => {
  console.log(JSON.stringify(event.requestContext.authorizer.claims.sub));
  return list(event);
};
