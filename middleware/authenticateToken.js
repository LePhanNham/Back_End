// middleware/authenticateToken.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Get the token part from "Bearer <token>"
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Forbidden" });
    }
    req.user_id = user._id; // Attach the decoded user ID to the request object
    req.user_name = user.user_name;
    console.log(user);
    next();
  });
};

module.exports = authenticateToken;
