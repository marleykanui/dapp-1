const express = require('express');
const app = express();

app.get('/', (req, res) => {
  let email = req.body.email;
  let amount = req.body.amount;

  res.send({ amount: amount, email: email });
});

app.listen(3000, () => console.log('Server is running on port 3000'));
