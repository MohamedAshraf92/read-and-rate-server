const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Not authenticated.");
    res.status(400).json({ message: "Not authenticated" });
    throw error;
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "topsecrectreadandrate");
  } catch (err) {
    err.statusCode = 500;
    // res.status(400).json({ message: "Session expired, login again" });
    res.status(400).json({ message: err.name });
    throw err;
  }
  if (!decodedToken) {
    const error = new Error("Not authenticated.");
    res.status(400).json({ message: "Not authenticated" });
    throw error;
  }
  if (decodedToken.role !== "admin") {
    const error = new Error("Not authenticated.");
    res.status(400).json({ message: "Not authenticated" });
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};
