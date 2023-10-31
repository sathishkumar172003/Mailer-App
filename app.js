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

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// setting up connection and obtaining permission to use gmail api
const gmail = google.gmail({ version: "v1", auth: oauth2Client });

const now = new Date();
const oneDayAgo = new Date(now);
oneDayAgo.setDate(oneDayAgo.getDate() - 1);

const query = `newer_than:${oneDayAgo.getTime() / 1000}`;

gmail.users.threads
  .list({ userId: "me", q: "is:unread newer_than:1d" })
  .then((response) => {
    console.log(response.data.threads.length);
    const threadId = response.data.threads[0].id;

    //getting the messages belongs to particular thread
    gmail.users.threads.get({ userId: "me", id: threadId }).then((response) => {
      const thread = response.data;
      const messages = thread.messages;

      // checking weather the email has label 'sent'
      console.log(messages[0].labelIds.includes("INBOX"));
    });
  });

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

// sendMail()
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((err) => console.log(err));
