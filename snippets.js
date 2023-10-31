// gmail.users.threads.list(
//   { userId: "me", q: "is:unread newer_than:2d" },
//   (err, response) => {
//     // if (err) {

//     //   console.log(err);
//     // } else {
//     //   let messages = response.data.messages;
//     //   if (messages) {
//     //     messages.forEach(async (msg) => {
//     //       let allMsgs = await gmail.users.messages.get({
//     //         userId: "me",
//     //         id: msg.id,
//     //       });
//     //       console.log(allMsgs);
//     //     });
//     //   } else {
//     //     console.log("no unread messages in your inbox");
//     //   }
//     // }

//     // const msgList = [];
//     // response.data.messages.forEach(async (element) => {
//     //   let msg = await gmail.users.messages.get({
//     //     userId: "me",
//     //     id: element.id,
//     //   });
//     //   console.log(msg);
//     // });
//     const threads = response.data.threads;
//     if (!threads || threads.length == 0) {
//       console.log("no threads found");
//       return;
//     }

//     threads.forEach(async (thread) => {
//       // For each thread, check if any message in the thread was sent by you.
//       const threadId = thread.id;
//       let msg = await gmail.users.threads.get({
//         userId: "me",
//         id: thread.id,
//       });
//       console.log(msg);
//     });
//   }
// );
