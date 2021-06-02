const stripePackage = require('stripe')(process.env.STRIPE_SECRET_KEY);
const billing = require('../libs/billing-lib')

module.exports.billing = (event, context, callback) => {
    const { storage, source } = JSON.parse(event.body);
    const amount = billing.calculateCost(storage);
    const description = "Scratch charge";

    stripePackage.charges.create({
        source,
        amount,
        description,
        currency: "usd",
    });
    const response = {
        statusCode: 200,
        body: "Successfully charged!",
      };
      callback(null, response);
};
