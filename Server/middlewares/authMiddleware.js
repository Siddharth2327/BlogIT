const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({ success: false, message: "No valid token provided" });
    }

    const token = authHeader.split(" ")[1]; // ✅ Extract token correctly
    const verifiedToken = jwt.verify(token, "BlogIT"); // ✅ Verify with secret key

    req.user = verifiedToken.userId; // ✅ Assign userId
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).send({ success: false, message: "Authentication failed", error: error.message });
  }
};
