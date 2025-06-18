// user-service/index.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();
const port = 4001;

app.use(express.json());

let users = [];
let nextId = 1;

// Đăng ký
app.post('/register', async (req, res) => {
  try {
    const { name, username, password } = req.body;

    if (users.find(u => u.username === username)) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    users.push({ id: nextId++, username, password: hashedPassword, name });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Đăng nhập
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      'your_jwt_secret',
      { expiresIn: '1h' }
    );
    res.status(200).json({ id: user.id, user: user.username, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed' });
  }
});

// Lấy profile
app.get('/profile', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Missing token' });

  const token = authHeader.replace('Bearer ', '');
  jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });

    const user = users.find(u => u.id === decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ id: user.id, username: user.username, name: user.name });
  });
});

// Lấy danh sách user
app.get('/users', (req, res) => {
  res.json(users);
});

app.listen(port, () => {
  console.log(`User Service running on port ${port}`);
});
