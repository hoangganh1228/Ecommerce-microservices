const express = require('express');
const app = express();

app.get('/users', (req, res) => {
  res.json([{ id: 1, name: 'Bao' }]);
});

app.listen(3001, () => {
  console.log('User service listening on port 3001');
});