const jwt = require('jsonwebtoken');
require('dotenv').config(); // Ensure you have dotenv to load environment variables

module.exports = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res.locals.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Make sure JWT_SECRET is in your .env
    req.user = decoded;
    res.locals.user = decoded; // This makes `user` available in EJS
    next();
  } catch (err) {
    console.error('Invalid token:', err);
    res.clearCookie('token');
    res.locals.user = null;
    next();
  }
};