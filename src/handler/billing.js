const { billing } = require("../services/billingService");

module.exports.handler = async (event, context) => {
    return billing(event);
};
