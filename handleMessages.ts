const axios = require("axios");
import { HfInference } from "@huggingface/inference";
const client: HfInference = new HfInference(`${process.env.HUGGING_FACE_KEY}`);

function sendMessage(senderId: string, messageText: string) {
  let requestBody = {
    recipient: { id: senderId },
    message: { text: messageText },
  };

  axios
    .post(
      `https://graph.facebook.com/v17.0/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`,
      requestBody
    )
    .then(() => console.log("Message sent!"))
    .catch((err: { response: { data: any } }) =>
      console.error("Error sending message:", err.response.data)
    );
}

export async function handleMessage(event: any) {
  let senderId = event.sender.id;
  let messageText = event.message.text.toLowerCase();

  if (messageText.includes("@jsai")) {
    sendMessage(senderId, "Hello! How can I help?");
  } else if (messageText.includes("help")) {
    sendMessage(senderId, "Here are some commands: hello, joke, help");
  } else {
    sendMessage(senderId, "Sorry, I didn't understand that.");
  }
}

// let senderId = event.sender.id;
// let messageText = event.message.text.toLowerCase();

// if (messageText.includes("@jsai")) {
//   sendMessage(senderId, "Hello! How can I help?");
// } else if (messageText.includes("help")) {
//   sendMessage(senderId, "Here are some commands: hello, joke, help");
// } else {
//   sendMessage(senderId, "Sorry, I didn't understand that.");
// }
// const chatCompletion = await client.chatCompletion({
//     model: "HuggingFaceH4/zephyr-7b-beta",
//     messages: [
//       {
//         role: "user",
//         content: message,
//       },
//     ],
//     max_tokens: 1000,
//   });