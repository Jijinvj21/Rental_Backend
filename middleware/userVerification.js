const jwt = require("jsonwebtoken");

const userCheckAuth = async (req, res, next) => {

  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).send({ message: "Authorization required" });
  }
  const token = authorization.split(" ")[1];
  try {

    const { _id } = jwt.verify(token, process.env.USER_JWT_SECRET);
    console.log(_id);
    
    next();
  } catch (error) {
    return res.status(401).send({ message: "Invalid Authorization" });
  }
};

module.exports = userCheckAuth;
