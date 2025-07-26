module.exports = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).render('403', { title: 'Access Denied', message: 'Admins only' });
  }
  next();
};