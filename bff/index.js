const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');
const port = 4000;
const auth = require('./middleware/auth');

app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(expressLayouts);
app.set('layout', 'layouts/layout');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const USER_SERVICE = 'http://localhost:4001';
const PRODUCT_SERVICE = 'http://localhost:4002';

app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

app.get('/login', (req, res) => {
  res.render('login', { title: 'Login' , message: null });
});

app.post('/login', async (req, res) => {
  try {
    const response = await axios.post(`${USER_SERVICE}/login`, req.body);
    const token = response.data.token;

    res.cookie('token', token, { httpOnly: true });
    if (response.data.user.role === 'Admin') {
      req.user = response.data.user;
      return res.redirect('/admin');
    }
    else {
      req.user = response.data.user;
      return res.redirect('/profile');
    }
  } catch (err) {
    console.error(err);
    res.render('login', { title: 'Login', message: 'Invalid credentials' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const response = await axios.post(`${USER_SERVICE}/login`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { error: 'Internal error' });
  }
});

app.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});

app.get('/profile', auth, async (req, res) => {
  try {
    const response = await axios.get(`${USER_SERVICE}/profile`, {
      headers: { Authorization: `Bearer ${req.cookies.token}` }
    });
    res.render('profile', { title: 'Profile', user: response.data });
  } catch (err) {
    console.error(err);
    res.redirect('/login');
  }
});

app.post('/api/users', auth, async (req, res) => {
  try {
    const response = await axios.get(`${USER_SERVICE}/users`, {
      headers: { Authorization: `Bearer ${req.cookies.token}` }
    });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { error: 'Internal error' });
  }
});

app.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
}); 

app.post('/register', async (req, res) => {
  try {
    const response = await axios.post(`${USER_SERVICE}/register`, req.body);
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.render('register', { title: 'Register', message: 'Registration failed' });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const response = await axios.post(`${USER_SERVICE}/register`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { error: 'Internal error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const response = await axios.post(`${USER_SERVICE}/login`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { error: 'Internal error' });
  }
});

app.get('/admin', auth, async (req, res) => {

    const product_response = await axios.get(`${PRODUCT_SERVICE}/products`);
    let products = [];
    if (product_response) {
        products = product_response.data;
    }
    const user_response = await axios.get(`${USER_SERVICE}/users`);
    let users = [];
    if (user_response) {
        users = user_response.data;
    }

    let username = 'Admin';
    if (req.user && req.user.username) {
        username = req.user.username;
    }
    res.render('dashboardAdmin', { title: 'Products', products: products, users: users, username: username });  
});

app.get('/api/products', async (req, res) => {
  console.log("✅ Đã gọi BFF route /api/products");
  try {
    const response = await axios.get(`${PRODUCT_SERVICE}/products`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get products' });
  }
});

app.post('/api/products', async (req, res) => {
  console.log("✅ Đã gọi BFF route /api/products");
  try {
    const response = await axios.post(`${PRODUCT_SERVICE}/products`, req.body);
    
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { error: 'Failed to add product' });
  }
});

app.get('/api/users', async (req, res) => {
  console.log("✅ Đã gọi BFF route /api/users");
  try {
    const response = await axios.get(`${USER_SERVICE}/users`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get users' });
  }
});

app.post('/products', async (req, res) => {
  try {
    const response = await axios.post(`${PRODUCT_SERVICE}/products`, req.body);
    
    res.redirect('/admin');
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { error: 'Failed to add product' });
  }
});

app.listen(port, () => {
  console.log(`BFF running on port ${port}`);
});
