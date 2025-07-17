exports.protect = (req, res, next) => {
  if (req.session.userId) {
    return next();
  } else {
    res.status(401).json({ message: 'Not authorized, no session' });
  }
};

exports.admin = (req, res, next) => {
  if (req.session.userId && req.session.role === 'admin') {
    return next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};