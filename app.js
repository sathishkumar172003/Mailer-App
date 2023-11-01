// imports
const oauth2Client = require("./config"); // responsible for authenticating with google server
const sendMail = require("./mail"); //  responsible for sending the mail

const { google } = require("googleapis");

// setting up connection and obtaining permission to use gmail api
const gmail = google.gmail({ version: "v1", auth: oauth2Client });

const start = async () => {
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
        to_send = false;
      }
    });

    // in case if we have not responded to the thread send the reply to them.
    if (to_send) {
      const headers = messages[0].payload.headers;
      const fromHeader = headers.find((header) => header.name === "From");
      const senderEmail = fromHeader.value;
      const sender = senderEmail.split("<")[1].split(">")[0]; // NAME <email> so we are extracting only email portion
      console.log(sender);
      sendMail("Testing", "Testing 123", sender).then((response) => {
        console.log(response);
      });
    }
  });
};

setInterval(start, 120000); // 120 seconds === 2 minutes
