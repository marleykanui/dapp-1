const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { save_user_information } = require('./models/serverdb.js');
const path = require('path');
const publicPath = path.join(__dirname, './public');
const paypal = require('paypal-rest-sdk');

// Handle Parsing
app.use(bodyParser.json());
app.use(express.static(publicPath));

// Paypal Config
paypal.configure({
  mode: 'sandbox', //sandbox or live
  client_id: process.env.CLIENT,
  client_secret: process.env.SECRET,
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
  let result = await save_user_information({ amount: amount, email: email });

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

app.get('/get_total_amount', async (req, res) => {
  let result = await get_total_amount();
  res.send(result);
});

app.listen(3000, () => console.log('Server is running on port 3000'));
