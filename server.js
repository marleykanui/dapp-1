const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {
  save_user_information,
  get_list_of_participants,
} = require('./models/serverdb.js');
const path = require('path');
const publicPath = path.join(__dirname, './public');
const paypal = require('paypal-rest-sdk');
const session = require('express-session');

app.use(session({ secret: 'my web app', cookie: { maxAge: 60000 } }));
// Handle Parsing
app.use(bodyParser.json());
app.use(express.static(publicPath));

// Paypal Config
paypal.configure({
  mode: 'sandbox', //sandbox or live
  client_id:
    'ASu0ZtbdzaFJfIRErP2iOSU92ZQv75XzfZqi7Kz7lQAjk5dOZsPB9a0QSqm4SmjtytSEHlx-eN78yhyx',
  client_secret:
    'EAK3fTmhXz_OLCqWzsypVKxc-oSada8odOWZeJO6sngtWml9ObE-KOVhmf7FCM8BxxyMEu2iLzJpjXcZ',
});

app.post('/post_info', async (req, res) => {
  let email = req.body.email;
  let amount = req.body.amount;

  if (amount <= 1) {
    return_info = {};
    return_info.error = true;
    return_info.message = 'The amount should be greater than 1';
    return res.send(return_info);
  }
  let fee_amount = amount * 0.9;
  let result = await save_user_information({
    amount: fee_amount,
    email: email,
  });
  req.session.paypal_amount = amount;
  var create_payment_json = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal',
    },
    redirect_urls: {
      return_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: 'Lottery',
              sku: 'Funding',
              price: amount,
              currency: 'USD',
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: 'USD',
          total: amount,
        },
        payee: {
          email: 'sb-dzry65906043@business.example.com',
        },
        description: 'Lottery Purchase',
      },
    ],
  };

  paypal.payment.create(create_payment_json, (error, payment) => {
    if (error) {
      throw error;
    } else {
      console.log('Create Payment Response');
      console.log(payment);
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === 'approval_url') {
          return res.send(payment.links[i].href);
        }
      }
    }
  });
});

app.get('/success', (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;
  let execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: 'USD',
          total: req.session.paypal_amount,
        },
      },
    ],
  };
  paypal.payment.execute(paymentId, execute_payment_json, (err, payment) => {
    if (err) {
      console.log(err.response);
      throw error;
    } else {
      console.log(payment);
    }
  });
  res.redirect('http://localhost:3000');
});

app.get('/get_total_amount', async (req, res) => {
  let result = await get_total_amount();
  res.send(result);
});

app.get('/pick_winner', async (req, res) => {
  let result = await get_total_amount();
  let total_amount = result[0].total_amount;
  req.session.paypal_amount = total_amount;
  // Placeholder for picking the winner
  // 1. We need to write a query to get a list of all the participants
  // 2. We need to pick a winner
  let list_of_participants = await get_list_of_participants();
  list_of_participants = JSON.parse(JSON.stringify(list_of_participants));
  let email_array = [];
  list_of_participants.forEach((element) => {
    email_array.push(element.email);
  });
  let winner = email_array[Math.floor(Math.random() * email_array.length)];
  console.log(winner);
  return;
  // Create Paypal Payment
  var create_payment_json = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal',
    },
    redirect_urls: {
      return_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: 'Lottery',
              sku: 'Funding',
              price: req.session.paypal_amount,
              currency: 'USD',
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: 'USD',
          total: req.session.paypal_amount,
        },
        payee: {
          email: 'winner_email',
        },
        description: 'Paying the winner of the lottery application',
      },
    ],
  };

  paypal.payment.create(create_payment_json, (error, payment) => {
    if (error) {
      throw error;
    } else {
      console.log('Create Payment Response');
      console.log(payment);
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === 'approval_url') {
          return res.send(payment.links[i].href);
        }
      }
    }
  });
});

app.listen(3000, () => console.log('Server is running on port 3000'));
