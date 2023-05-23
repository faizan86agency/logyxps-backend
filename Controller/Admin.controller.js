const jwt = require("jsonwebtoken");
const { AdminModel } = require("../Model/AdminModel");

const AdminAuth = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(404).send({ message: "Bad request" });
  }
  try {
    let admin = await AdminModel.findOne({ email, password }).select({
      password: 0,
    });

    if (!admin) {
      return res.status(404).send({ message: "Bad request" });
    }

    const token = jwt.sign({ _id: admin._id }, process.env.JWT_SECRET);

    res.send({ token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  }
};

module.exports = {
  AdminAuth,
};
