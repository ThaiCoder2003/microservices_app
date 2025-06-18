const express = require('express');
const app = express();
const port = 5002;

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

app.listen(port, () => {
  console.log(`Product service running on port ${port}`);
});
