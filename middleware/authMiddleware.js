const authenticateAdmin = (req, res, next) => {
  req.admin = { id: 1, role: 'admin' }; // Dummy admin data
  next();
};

export { authenticateAdmin };
