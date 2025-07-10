require('dotenv').config();
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication failed' });
  }

  try {

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET  );
    req.user = decodedToken;
    next();
    
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed' });
  }
}

module.exports = authMiddleware;
