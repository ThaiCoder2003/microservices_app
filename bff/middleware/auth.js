const jwt = require('jsonwebtoken');
require('dotenv').config(); // Ensure you have dotenv to load environment variables

function auth(required = true) {
  return (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
      req.user = null;
      res.locals.user = null;
      if (required) {
        return res.status(401).render('login', { title: 'Login', message: 'Please log in to continue.' });
      }
      return next();
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      res.locals.user = decoded;
      next();
    } catch (err) {
      console.error('Invalid token:', err.message);
      res.clearCookie('token');
      req.user = null;
      res.locals.user = null;

      if (required) {
        return res.status(401).render('login', { title: 'Login', message: 'Session expired. Please log in again.' });
      }

      next(); // Proceed even if not required
    }
  };
}

module.exports = auth;