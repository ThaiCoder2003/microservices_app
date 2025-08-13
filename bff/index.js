require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const port = process.env.PORT || 5000;

const auth = require('./middleware/auth');
const requireAdmin = require('./middleware/requireAdmin')

const multer = require('multer');

const productStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public/assets/images/products')); // Ensure it saves inside /public/images
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = new Date() + path.extname(file.originalname);
    cb(null, uniqueSuffix);
  }
});

const productUpload = multer({
  storage: productStorage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB
  }
});

const userStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public/assets/images/avatars')); // Ensure it saves inside /public/images
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = new Date() + path.extname(file.originalname);
    cb(null, uniqueSuffix);
  }
});

const userUpload = multer({
  userStorage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB
  }
});

app.use(bodyParser.json());
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(expressLayouts);
app.set('layout', 'layouts/layout');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Sửa lỗi ở đây: Thay localhost bằng tên service trong docker-compose.yml
const USER_SERVICE = 'http://user-service:5001';
const PRODUCT_SERVICE = 'http://product-service:5002';
const TRANSACTION_SERVICE = 'http://transaction-service:5003';

// Main Pages
// Homepage
app.get('/', auth(false), async (req, res) => {
  try {
    const response = await axios.get(`${PRODUCT_SERVICE}/category`);
    const { coffee = [], tea = [], juice = [], dessert = [] } = response.data || {};
    res.render('homepage', {
      title: 'Home',
      coffee: coffee || [],
      tea: tea || [],
      juice: juice || [],
      dessert: dessert || [],
    });
  } catch (err) {
    console.error('EJS render error:', err);
    res.status(500).send('Template render failed.');
  }
});

// Admin Page
app.get('/admin', auth(true), requireAdmin, async (req, res) => {
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
    res.render('dashboardAdmin', { title: 'Admin Dashboard', products: products, users: users, username: username });   
  } catch (err) {
    console.error(err);

    res.status(500).send('Error fetching data');
  }
});

// Login
app.get('/login', auth(false), (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  const registered = req.query.registered === 'success';
  let message = null;
  if (registered) message = 'Register Complete!'
  res.render('login', { title: 'Login' , message, error: null });
});

app.post('/login', auth(false), async (req, res) => {
  try {
    if (req.user) {
      return res.redirect('/');
    }
    const response = await axios.post(`${USER_SERVICE}/login`, req.body);
    const token = response.data.token;

    res.cookie('token', token, { httpOnly: true });
    res.redirect('/');
  } catch (err) {
    console.error(err);
    const error = err.response?.data?.error || 'Login failed';
    res.render('login', { title: 'Login', error, message: null });
  }
});

// Register
app.get('/register', async (req, res) => {
  res.render('register', { title: 'Register', message: null}); 
}); 

app.post('/register', async (req, res) => {
  try {
    const result = await axios.post(
      `${USER_SERVICE}/register`, 
      req.body, 
      {
        headers: {
          'Content-Type': 'application/json' // Explicitly set the Content-Type
        }
      }
    );
    const data = result.data;
    res.status(202).json(data);
  } catch (err) {
    console.error(err);
    const message = err.response?.data?.error || 'Registration failed';
    res.render('register', { title: 'Register', message: message });
  }
});

// Logout
app.post('/logout', auth(true), (req, res) => {
  if (!req.user) {
    return res.redirect('/');
  }
  res.clearCookie('token');
  res.redirect('/login');
});

app.get('/profile', auth(true), async (req, res) => {
  try {
    const response = await axios.get(`${USER_SERVICE}/profile`, {
      headers: { Authorization: `Bearer ${req.cookies.token}` }
    });
    res.render('userpage', { title: 'Profile', user: response.data });
  } catch (err) {
    console.error(err);
    res.redirect('/login');
  }
});

app.put('/update', auth(true), async (req, res) => {
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

app.delete('/delete/:id', auth(true), requireAdmin, async (req, res) => {
  try{
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: 'Missing token' });
    }
    const response = await axios.delete(`${USER_SERVICE}/users/${req.params.id}`, {
      headers: { Authorization: `Bearer ${req.cookies.token}` }
    })
    const data = response.data
    return res.status(202).json(data);
  }
  catch (err) {
    console.error(err);
    res.status(err.response?.status || 500).json(err.response?.data || { error: 'Internal error' });
  }
})

// Get user status
app.get('/status/user-service/:eventId', async (req, res) => {
  try{
    const { eventId } = req.params; 
    const result = await axios.get(`${USER_SERVICE}/status/${eventId}`);
    res.status(200).json(result.data);
  } catch (err) {
    console.error("Error fetching status from user service:", err.message);
    res.status(500).json({ error: "Failed to fetch status" });
  }
})

// Products
// All Products
app.get('/products', auth(false), async(req, res) => {
  try {
    const response = await axios.get(`${PRODUCT_SERVICE}/products`);
    const products = response.data || [];
    res.render('productpage', { title: 'Products', products })
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { error: 'Failed to get product' });
  }
})

app.get('/products/json', auth(false), async(req, res) => {
  try {
    const { category, price, sort } = req.query;
    console.log(category)
    const response = await axios.get(`${PRODUCT_SERVICE}/products`, {
      params: { category, price, sort }
    });
    
    const products = response.data || [];
    res.json(products); // 👈 return JSON
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { error: 'Failed to get product' });
  }
})

// Search
app.get('/search', auth(false), async (req, res) => {
  const query = req.query.q;
  try {
    const response = await axios.get(`${PRODUCT_SERVICE}/search`, { params: { query }
    });
    res.render('searchdetail', { title: 'Search Results', products: response.data, query });
  } catch (err) {
    console.error(err);
    res.status(err.response?.status || 500).json(err.response?.data || { error: 'Failed to search products' });
  }
});

// Individual Product
app.get('/products/:id', auth(false), async (req, res) => {
  try {
    const response = await axios.get(`${PRODUCT_SERVICE}/products/${req.params.id}`);
    res.render('productdetail', { title: 'Product Detail', product: response.data });
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { error: 'Failed to get product' });
  }
});

// Admin side here
// Add Product
app.post('/products', auth(true), requireAdmin, productUpload.single('product'), async (req, res) => {
  try {
    const { id, name, price, description, origin, category } = req.body;
    const image = req.file.filename; 
    const response = await axios.post(`${PRODUCT_SERVICE}/products`, {
      id: id,
      name: name,
      price: price,
      origin: origin,
      description: description,
      category: category,
      image: image
    });
    
    const data = response.data;
    res.status(202).json(data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { error: 'Failed to add product' });
  }
});

// Update Product
app.put('/products/:id', auth(true), requireAdmin, productUpload.single('product'), async (req, res) => {
  try {
    const response = await axios.put(`${PRODUCT_SERVICE}/products/${req.params.id}`, req.body);
    const data = response.data;
    res.status(202).json(data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { error: 'Failed to update product' });
  }
});

// Delete Product
app.delete('/products/:id', auth(true), requireAdmin, async (req, res) => {
  try {
    const response = await axios.delete(`${PRODUCT_SERVICE}/products/${req.params.id}`);
    const data = response.data;
    res.status(202).json(data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { error: 'Failed to delete product' });
  }
});

// Get product status
app.get('/status/product-service/:eventId', async (req, res) => {
  try{
    const { eventId } = req.params; 
    const result = await axios.get(`${PRODUCT_SERVICE}/status/${eventId}`);
    res.json(result.data);
  } catch (err) {
    console.error("Error fetching status from user service:", err.message);
    res.status(500).json({ error: "Failed to fetch status" });
  }
})

app.get('/cart', auth(true), async (req, res) => {
  try {
    const { added } = req.query;
    let message = null;
    if (added == 'success') {
      message = 'Added new Item!'
    }
    const response = await axios.get(`${TRANSACTION_SERVICE}/cart`, {
      headers: { Authorization: `Bearer ${req.cookies.token}` }
    });

    const { items, totalPrice } = response.data;
    return res.render('cartpage', { title: 'Cart', items, totalPrice, message, error: null })
  }
  catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { error: 'Failed to get cart' });
  }
})

app.post('/cart/add', auth(true), async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const response = await axios.post(`${TRANSACTION_SERVICE}/cart/add`, 
    { productId, quantity }, 
    {
      headers: { 
        Authorization: `Bearer ${req.cookies.token}`
      }
    });

    const data = response.data;

    res.status(202).json(data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { error: 'Failed to add to cart' });
  }
})

app.delete('/cart/delete/:productId', auth(true), async (req, res) => {
  try {
    const productId = req.params.productId;
    const response = await axios.delete(`${TRANSACTION_SERVICE}/cart/delete/${productId}`, {
      headers: { Authorization: `Bearer ${req.cookies.token}` },
    })
    const data = response.data;

    res.status(202).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete product from cart' });
  }
})

app.post('/purchase', auth(true), async (req, res) => {
  try {
    const response = await axios.post(`${TRANSACTION_SERVICE}/receipt`, {
      headers: { Authorization: `Bearer ${req.cookies.token}` },
    })
    const data = response.data;

    res.status(202).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to purchase' });
  }
})

app.get('/status/cart/:eventId', async (req, res) => {
  try{
    const { eventId } = req.params; 
    const result = await axios.get(`${TRANSACTION_SERVICE}/cart/status/${eventId}`);
    res.status(200).json(result.data);
  } catch (err) {
    console.error("Error fetching status from user service:", err.message);
    res.status(500).json({ error: "Failed to fetch status" });
  }
})


app.listen(port, () => {
  console.log(`BFF running on port ${port}`);
});
