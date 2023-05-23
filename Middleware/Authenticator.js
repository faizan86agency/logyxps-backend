const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticator = async (req, res, next) => {
  const token = req?.headers?.authorization?.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.body.userID = decoded._id;
    next();
  } catch (error) {
    res.status(400).send({ message: "You are not authorized" });
  }
};

module.exports = {
  authenticator,
};
