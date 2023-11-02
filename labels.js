const oauth2Client = require("./config"); // responsible for authenticating with google server
const { google } = require("googleapis");

const gmail = google.gmail({ version: "v1", auth: oauth2Client });

// function to create the label
async function createLabel(lblName) {
  let newLabel = await gmail.users.labels.create({
    userId: "me",
    requestBody: {
      labelListVisibility: "labelShow",
      messageListVisibility: "show",
      name: lblName,
      type: "user",
    },
  });

  return newLabel.data.id; // after creating the label, return the label id
}

// getting the id of the label
async function getLabel(lblName) {
  const allLabels = await gmail.users.labels.list({
    userId: "me",
  });

  let lblId;
  allLabels.data.labels.forEach((label) => {
    if (label.name == lblName) {
      lblId = label.id;
    }
  });

  if (lblId) {
    return lblId; // if label exists, returns its id
  } else {
    return false; // if label do not exists, return false
  }
}

// function to add the label to the email specified by using email id
async function addLabel(lblId, emailId) {
  let addLabel = await gmail.users.messages.modify({
    userId: "me",
    id: emailId,
    requestBody: {
      addLabelIds: [lblId],
    },
  });
}

module.exports = {
  addLabel,
  createLabel,
  getLabel,
};
