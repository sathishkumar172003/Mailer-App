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

gmail.users.threads
  .list({ userId: "me", q: "in:inbox  newer_than:1d" })
  .then((response) => {
    console.log(response.data.threads.length);
    // const threadId = response.data.threads[0].id;

    const allThreads = response.data.threads;
    allThreads.forEach(async (thread) => {
      let response = await gmail.users.threads.get({
        userId: "me",
        id: thread.id,
      });
      const data = response.data;
      const messages = data.messages;
      // console.log(messages);

      let to_send = true;

      messages.forEach((message) => {
        if (message.labelIds.includes("SENT")) {
          // if the message in thread contains the thread 'sent' that means i have already sent them msg so i dont know need to send them
          // console.log(message.snippet);
          to_send = false;
        }
      });

      // in case if to_send remains 'true'
      if (to_send) {
        const headers = messages[0].payload.headers;
        // console.log(headers);
        const fromHeader = headers.find((header) => header.name === "From");
        const senderEmail = fromHeader.value;
        const sender = senderEmail.split("<")[1].split(">")[0]; // NAME <email> so we are extracting only email portion
        console.log(sender);
        // sendMail("Testing", "Testing 123", sender).then((response) => {
        //   console.log(response);
        // });
      }
    });
  });

async function sendMail(subject, content, to_email) {
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
