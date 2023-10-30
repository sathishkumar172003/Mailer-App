// configuring dotenv for accessing environment variables
require("dotenv").config();

// imports
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

// // constants
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

// // setting up oauth client
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// reading unread messages

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail() {
  try {
    let accessToken = await oauth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAUTH2",
        user: process.env.MAIL_ADDR,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: "SATHISH KUMAR <sthshkmr172003@gmail.com>",
      to: process.env.MAIL_ADDR,
      subject: "testing email ",
      text: "this is verify your emails ",
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.log(error);
  }
}

sendMail()
  .then((result) => {
    console.log(result);
  })
  .catch((err) => console.log(err));
