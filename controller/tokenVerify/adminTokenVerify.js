const jwt = require("jsonwebtoken");

const adminCheckAuth = async (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: "Authorization required" });
  }
  const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(201).json({ message: "Authorization Sucess" });
  } catch (error) {
    return res.status(401).json({ message: "Invalid Authorization" });
  }
};
module.exports = {
  adminCheckAuth,
};
