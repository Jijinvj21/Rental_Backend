const jwt = require("jsonwebtoken");

const vendorCheckAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).send({ message: "Authorization required" });
  }
  const token = authorization.split(" ")[1];
  try {
    jwt.verify(token, process.env.VENDOR_JWT_SECRET);

    next();
  } catch (error) {
    return res.status(401).send({ message: "Invalid Authorization" });
  }
};

module.exports = vendorCheckAuth;
