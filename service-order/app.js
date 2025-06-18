const express = require('express');
const app = express();

app.get('/orders', (req, res) => {
  res.json([{ id: 100, item: 'Macbook Pro' }]);
});

app.listen(3002, () => {
  console.log('Order service listening on port 3002');
});
