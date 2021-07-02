const { billing } = require("../services/billingService");

module.exports.handler = async (event, context) => {
    billing(event);
};
