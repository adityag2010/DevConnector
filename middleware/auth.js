const jwt = require('jsonwebtoken');
const config = require('config');

const auth = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    res.status(401).send({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, config.get('jwt.privateKey'));
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).send({ msg: 'Token is not valid' });
  }
};

module.exports = auth;
