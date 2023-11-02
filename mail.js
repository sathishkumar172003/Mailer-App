const oauth2Client = require("./config");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

async function sendMail(subject, content, to_email) {
  try {
    let accessToken = await oauth2Client.getAccessToken(); // getting access code

    const transport = nodemailer.createTransport({
      service: "gmail", // gmail smpt server
      auth: {
        type: "OAUTH2", // providing authenticatin details
        user: process.env.MAIL_ADDR,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: `SATHISH KUMAR ${process.env.MAIL_ADDR}`,
      to: to_email,
      subject: subject,
      text: content,
    };

    const result = await transport.sendMail(mailOptions);
    

    return result;
  } catch (error) {
    console.log(error);
  }
}

module.exports = sendMail;
