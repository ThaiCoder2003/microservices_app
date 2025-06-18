const express = require('express');
const app = express();
const port = 4002;

app.use(express.json());

let products = [];
let nextId = 1;

app.post('/products', (req, res) => {
  const { id, name, stock } = req.body;
  if (products.find(p => p.id === id)) {
    return res.status(400).json({ message: 'Product ID already exists' });
  }
  products.push({ id, name, stock });
  res.status(201).json({ message: 'Product added' });
});

app.get('/products', (req, res) => {
  res.json(products);
});

try {
  app.listen(port, () => {
    console.log(`roduct service running on port ${port}`);
  });
} catch (err) {
  console.error('❌ Server failed to start:', err);
}
