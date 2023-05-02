const jwt = require("jsonwebtoken");

const userCheckAuth = async (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: "Authorization required" });
  }
  const token = authorization.split(" ")[1];

  try {
    jwt.verify(token, process.env.USER_JWT_SECRET);
    return res.status(201).json({ message: "Authorization Sucess" });
  } catch (error) {
    return res.status(401).json({ message: "Invalid Authorization" });
  }
};
module.exports = {
  userCheckAuth,
};
