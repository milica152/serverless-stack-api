const stripePackage = require('stripe')(process.env.STRIPE_SECRET_KEY);
const billing = require('../helper/billing');
const { response } = require('../helper/response');

// 3rd party API service
module.exports.billing = async (event) => {
    const { storage, source } = JSON.parse(event.body);
    const amount = billing.calculateCost(storage);
    const description = "Scratch charge";

    await stripePackage.charges.create({
        source,
        amount,
        description,
        currency: "usd",
    });
    return response(200, 'Successfully charged!');
}