const functions = require("firebase-functions");
const stripe = require("stripe")
    ("sk_test_51JK6bxLLKx5TJk1FpEEGCrAO9EzJmZIFwsqUjuoyLWn52uIxDXPe850aJtFkhZY4fer6y9k8lnvgBdAjMHOa8SwB00fxK0v3yD");

exports.completePaymentWithStripe = functions.https.onRequest(
    (request, response) => {
        stripe.charges.create({
            amount: request.body.amount,
            currency: request.body.currency,
            source: 'tok_mastercard',
        }).then((charge) => {
            // asynchronously called
            response.send(charge);
        })
            .catch(err => {
                console.log(err);
            });

    });