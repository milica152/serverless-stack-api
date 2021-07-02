const stripePackage = require('stripe')(process.env.STRIPE_SECRET_KEY);
const billing = require('../helper/billing')

const billing = (event) => {
    const { storage, source } = JSON.parse(event.body);
    const amount = billing.calculateCost(storage);
    const description = "Scratch charge";

    await stripePackage.charges.create({
        source,
        amount,
        description,
        currency: "usd",
    });
    return {
        statusCode: 200,
        body: "Successfully charged!",
        headers: { 
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true }
    };
}

export { billing };