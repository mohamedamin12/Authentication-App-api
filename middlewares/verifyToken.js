const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(" ")[1];
    try {
      const decodedPayload = jwt.verify(token, process.env.ACCESS_SECRET_KEY);
      req.user = decodedPayload;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token, access denied' });
    }
  } else {
    return res.status(401).json({ message: 'No token provided, access denied' });
  }
}

module.exports = verifyToken;