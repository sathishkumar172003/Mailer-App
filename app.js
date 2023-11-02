// imports
const oauth2Client = require("./config"); // responsible for authenticating with google server
const { google } = require("googleapis");
const sendMail = require("./mail"); //  responsible for sending the mail
const { addLabel, createLabel, getLabel } = require("./labels"); // responsible for managing the labels

// setting up connection and obtaining permission to use gmail api
const gmail = google.gmail({ version: "v1", auth: oauth2Client });

const start = async () => {
  try {
    let response = await gmail.users.threads.list({
      userId: "me",
      q: "in:inbox  newer_than:1d",
    }); // this will return thread list object
    const allThreads = response.data.threads; // getting the list of all threads

    console.log(allThreads.length);

    //for each thread in the list obtain their messages list
    allThreads.forEach(async (thread) => {
      let threadRes = await gmail.users.threads.get({
        userId: "me",
        id: thread.id,
      });
      const data = threadRes.data;
      const messages = data.messages; // getting all the messages in a single thread

      // flag variable  is used to determine whether we have responded to the thread or not
      let to_send = true;

      messages.forEach((message) => {
        if (message.labelIds.includes("SENT")) {
          // ignore if thread is already responded
          console.log(message.snippet);
          console.log(message.id);
          to_send = false;
        }
      });

      // in case if we have not responded to the thread send the reply to them.
      if (to_send) {
        const headers = messages[0].payload.headers;
        const From = headers.find((header) => header.name === "From");
        const senderEmail = From.value;
        const sender = senderEmail.split("<")[1].split(">")[0]; // NAME <email> so we are extracting only email portion
        console.log(sender);

        let res = await sendMail("Testing", "Testing  123", sender);
        console.log(res);

        // getting the last sent message so that we can apply label to it
        const lastMsg = await gmail.users.messages.list({
          userId: "me",
          labelIds: "SENT", // Fetch emails from the "Sent" label
          maxResults: 1, // Limit to one result to get the last sent email
          q: "in:sent", // Additional query to narrow down to sent emails
        });

        const emailId = lastMsg.data.messages[0].id;
        let lblId = await getLabel("friends");

        console.log(lblId);

        //if label exists, just add it
        if (lblId) {
          await addLabel(lblId, emailId); // specifying the label id and to which email that label should be applied
        } else {
          // if label do not exists, create and add
          lblId = await createLabel("friends");
          await addLabel(lblId, emailId);
        }

        console.log("email sent succesfully"); // displaying confirmation message
      }
    });
  } catch (error) {
    console.log(error);
  }
};

start();

// setInterval(start, 120000); // 120 seconds === 2 minutes
