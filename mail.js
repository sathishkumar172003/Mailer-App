require("dotenv").config();
const nodemail = require("nodemailer");

const transport = nodemail.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_ADDR,
    pass: process.env.PWD,
  },
});

const mailOptions = {
  from: process.env.MAIL_ADDR,
  to: process.env.MAIL_ADDR,
  subject: "I got an offer",
  text: "checking for an email confirmation",
};

transport.sendMail(mailOptions, (err, info) => {
  if (err) console.log(err);
  else console.log(info);
});
