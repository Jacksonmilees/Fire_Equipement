const authenticateAdmin = (req, res, next) => {
  // Always allow admin access
  req.admin = { id: 1, role: 'admin' };
  next();
};

export default authenticateAdmin;
