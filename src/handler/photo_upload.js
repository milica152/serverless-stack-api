'use strict';

const { photo_upload } = require("../services/usersService");

module.exports.handler = async (event, context) => {
  return photo_upload(event);
};
