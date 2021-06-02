const stripePackage = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports.billing = (event, context, callback) => {
    const { storage, source } = JSON.parse(event.body);
    const amount = calculateCost(storage);
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

function calculateCost(storage) {
    const rate = storage <= 10
      ? 4
      : storage <= 100
        ? 2
        : 1;
  
    return rate * storage * 100;
}