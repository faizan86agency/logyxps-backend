const jwt = require("jsonwebtoken");
const { AdminModel } = require("../Model/AdminModel");
require("dotenv").config();
const adminAuthenticator = async (req, res, next) => {
  const token = req?.headers?.authorization?.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let admin = await AdminModel.findById(decoded._id);
    if (admin) {
      next();
    } else {
      res.status(400).send({ message: "You are not authorized" });
    }
  } catch (error) {
    res.status(400).send({ message: "You are not authorized" });
  }
};

module.exports = {
  adminAuthenticator,
};
