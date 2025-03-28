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
  try {
    let senderId: string = event.sender.id;
    let messageText: string = event.message.text.toLowerCase();
    const chatCompletion = await client.chatCompletion({
      model: "HuggingFaceH4/zephyr-7b-beta",
      messages: [
        {
          role: "user",
          content: `${messageText}. and put Jhumpstreet to the rescue! at the beginning of your message.`,
        },
      ],
      max_tokens: 500,
    });
    sendMessage(senderId, chatCompletion.choices[0].message.content as string);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message); // Logs the error message
    } else {
      console.log("An unknown error occurred", error);
    }
  }
}
