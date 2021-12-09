const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const stripe = require('stripe')('sk_test_51JK6bxLLKx5TJk1FpEEGCrAO9EzJmZIFwsqUjuoyLWn52uIxDXPe850aJtFkhZY4fer6y9k8lnvgBdAjMHOa8SwB00fxK0v3yD');

exports.completePaymentWithStripe = functions.https.onRequest(
    (request, response => {
        stripe.charges
            .create({
                amount: request.body.amount,
                currency: request.body.currency,
                source: 'tok_mastercard',
            })
            //eslint-disable-next-line promise/always-return
            .then(charge => {
                response.send(charge);
            })
            .catch(error => {
                console.log(error);
            });
    }));
