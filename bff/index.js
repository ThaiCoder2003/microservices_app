require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');
const port = process.env.PORT || 5000;
const auth = require('./middleware/auth');

app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(expressLayouts);
app.set('layout', 'layouts/layout');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const USER_SERVICE = 'http://localhost:5001';
const PRODUCT_SERVICE = 'http://localhost:5002';

app.get('/', async (req, res) => {
  const response = await axios.get(`${PRODUCT_SERVICE}/products/category`);
  const [coffeeProducts, teaProducts, snackProducts, otherProducts] = response.data;
  res.render('homepage', { title: 'Home', coffee: coffeeProducts, tea: teaProducts, snack: snackProducts, other: otherProducts });
});

app.get('/login', (req, res) => {
  res.render('login', { title: 'Login' , message: null });
});

app.post('/login', async (req, res) => {
  try {
    const response = await axios.post(`${USER_SERVICE}/login`, req.body);
    const token = response.data.token;

    res.cookie('token', token, { httpOnly: true });
    res.redirect('/admin');
  } catch (err) {
    console.error(err);

    // If login fails, render the login page with an error message
    const message = err.response?.data?.error || 'Login failed';
    res.render('login', { title: 'Login', message });
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

app.put('/update', auth, async (req, res) => {
  try {
    const response = await axios.put(`${USER_SERVICE}/update`, req.body, {
      headers: { Authorization: `Bearer ${req.cookies.token}` }
    });
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    res.status(err.response?.status || 500).json(err.response?.data || { error: 'Internal error' });
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

app.get('/register', async (req, res) => {
  res.render('register', { title: 'Register', message: null}); 
}); 

app.post('/register', async (req, res) => {
  try {
    await axios.post(`${USER_SERVICE}/register`, req.body);
    
    return res.redirect('/login');
    
    // If not 201, treat it as failure
  } catch (err) {
    console.error(err);

    const message = err.response?.data?.error || 'Registration failed';
    res.render('register', { title: 'Register', message });
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
  try {
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
  } catch (err) {
    console.error(err);

    res.status(500).send('Error fetching data');
  }
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

app.get('/search', async (req, res) => {
  const query = req.query.q;
  try {
    const response = await axios.get(`${PRODUCT_SERVICE}/search`, { params: { query }
    });
    res.render('searchPage', { title: 'Search Results', products: response.data,
      query: query });
  } catch (err) {
    console.error(err);
    res.status(err.response?.status || 500).json(err.response?.data || { error: 'Failed to search products' });
  }
});

app.put('/products/:id', async (req, res) => {
  try {
    const response = await axios.put(`${PRODUCT_SERVICE}/products/${req.params.id}`, req.body);
    res.redirect('/admin');
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { error: 'Failed to update product' });
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const response = await axios.get(`${PRODUCT_SERVICE}/products/${req.params.id}`);
    res.render('productDetail', { title: 'Product Detail', product: response.data });
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { error: 'Failed to get product' });
  }
});

app.delete('/products/:id', async (req, res) => {
  try {
    const response = await axios.delete(`${PRODUCT_SERVICE}/products/${req.params.id}`);
    res.redirect('/admin');
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { error: 'Failed to delete product' });
  }
});

app.listen(port, () => {
  console.log(`BFF running on port ${port}`);
});
