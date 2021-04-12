const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Handle Parsing
app.use(bodyParser.json());

app.post('/', (req, res) => {
  let email = req.body.email;
  let amount = req.body.amount;

  res.send({ amount: amount, email: email });
});

app.listen(3000, () => console.log('Server is running on port 3000'));
