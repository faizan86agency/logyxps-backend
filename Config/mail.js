const nodemailer = require("nodemailer");

const email = "faizan.86agency@gmail.com";

const config = {
  service: "gmail",
  host: "smtp@gmail.com",
  port: "587",
  secure: false,
  auth: {
    user: email,
    pass: "wcgmbtjlzgylcxjl",
  },
};

const sendMail = (data) => {
  const transporter = nodemailer.createTransport(config);
  transporter.sendMail({ ...data, from: email }, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      return info.response;
    }
  });
};

module.exports = { sendMail };
