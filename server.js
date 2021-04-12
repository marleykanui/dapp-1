const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Handle Parsing
app.use(bodyParser.json());

app.post('/', (req, res) => {
  let email = req.body.email;
  let amount = req.body.amount;

  if (amount <= 1) {
    return_info = {};
    return_info.error = true;
    return_info.message = 'The amount should be greater than 1';
    return res.send(return_info);
  }

  res.send({ amount: amount, email: email });
});

app.listen(3000, () => console.log('Server is running on port 3000'));
