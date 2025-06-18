const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();
const port = 4001;

app.use(express.json());

let users = [];
let nextId = 1;

app.post('/register', (req, res) => {
  const { name, username, password } = req.body;
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  users.push({ id: nextId++, username: username, password: hashedPassword, name: name });
  res.status(201).json({ message: 'User registered successfully' });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username); // ✅ declare first

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isPasswordCorrect = password === user.password; // ✅ compare password with stored password
  if (!isPasswordCorrect) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });
  res.status(200).json({ id: user.id, user: user.username, token: token }); ;
});

app.get('/profile', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Missing token' });

  const token = authHeader.replace('Bearer ', '');
  jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });

    const user = users.find(u => u.id === decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ id: user.id, username: user.username });
  });
});

app.get('/users', (req, res) => {
  res.json(users);
});

app.listen(port, () => {
  console.log(`User Service running on port ${port}`);
});
