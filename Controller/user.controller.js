const { UserModel } = require("../Model/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../Config/mail");

const registerUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 5);
    let mail = {
      to: email,
      subject: "LogyXps: Verify your email to proceed further.",
      text: `http://localhost:8080/signup/verify-email/?token=${jwt.sign(
        { email, hashedPassword },
        process.env.JWT_SECRET
      )}`,
    };

    const user = new UserModel({ ...req.body, password: hashedPassword });
    sendMail(mail);
    await user.save();

    res.send({ message: "User is successfully registered" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error });
  }
};

const checkExistingEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res.status(200).send({ message: "User is Already Register" });
    } else {
      res.status(400).send({ message: "User is not registered" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "User is not Registered" });
    }

    if (!user.verified) {
      return res.status(500).send({ message: "Email is not verified" });
    }

    let flag = await bcrypt.compare(password, user.password);

    if (flag) {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      res.send({ token, user });
    } else {
      res.status(400).send({ message: "Password doesn't matched" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error, data: "error" });
  }
};

const getUserDetails = async (req, res) => {
  let { userId } = req.params;
  try {
    const user = await UserModel.findById(userId).select({ password: 0 });
    res.send({ user });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const allusers = await UserModel.find().select({ password: 0 });
    res.send({ allusers });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error });
  }
};

const verifyUser = async (req, res) => {
  const { token } = req.body;
  try {
    const { email, hashedPassword } = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(email, password);
    if (!email || !hashedPassword) {
      return res.status(400).send({ message: "Verfication failed" });
    }

    let user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).send({ message: "User not Found" });
    }
    // console.log(hashedPassword, user);
    console.log(user);
    if (hashedPassword === user.password) {
      await UserModel.findByIdAndUpdate(user._id, { verified: true });
      res.send({ message: "Verification successfull" });
    } else {
      return res.status(400).send({ message: "Invalid Token" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  }
};

const requestForgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "Email is not Registered" });
    }

    let mail = {
      to: email,
      subject: "LogyXps: Reset your password",
      text: `http://localhost:8080/auth/confirm-password/?token=${jwt.sign(
        { email },
        process.env.JWT_SECRET
      )}`,
    };

    sendMail(mail);

    res.send({ message: "Password reset mail sent Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  }
};

const confirmPasswordData = async (req, res) => {
  const { token, password } = req.body;
  try {
    const { email } = jwt.verify(token, process.env.JWT_SECRET);
    if (!email) {
      return res.status(400).send({ message: "Invalid Token" });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).send({ message: "User not Found!" });
    }

    const hashedPassword = await bcrypt.hash(password, 5);

    await UserModel.findByIdAndUpdate(user._id, { password: hashedPassword });

    let mail = {
      to: email,
      subject: "LogyXps: Password Successfuly Reset",
      text: `Congratulations! your passowrd has been successfully reset.`,
    };

    sendMail(mail);

    res.send({ message: "Password Reset successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  }
};

const updateUserDetails = async (req, res) => {
  let { userID } = req.body;
  const data = req.body;
  try {
    let user = await UserModel.findByIdAndUpdate(userID, data);
    user = await UserModel.findById(userID);
    res.send({ user });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error });
  }
};

module.exports = {
  registerUser,
  checkExistingEmail,
  loginUser,
  getUserDetails,
  getAllUsers,
  verifyUser,
  requestForgotPassword,
  confirmPasswordData,
  updateUserDetails,
};
