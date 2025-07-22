const authenticateAdmin = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    // Verify token (this is just a placeholder - you should implement proper token verification)
    req.admin = { id: 1, role: 'admin' };
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export { authenticateAdmin };
