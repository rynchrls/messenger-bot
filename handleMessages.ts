import axios from "axios";
import { HfInference } from "@huggingface/inference";
import dotenv from "dotenv";
dotenv.config({ path: ".env.dev" });
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
      provider: "fireworks-ai",
      model: "deepseek-ai/DeepSeek-V3-0324",
      messages: [
        {
          role: "user",
          content: `${messageText}. and put Hi, I'm Jhumpstreet AI! 👋 at the beginning of the message`,
        },
      ],
      max_tokens: 500,
    });

    console.log(chatCompletion.choices[0].message);
    sendMessage(senderId, chatCompletion.choices[0].message.content as string);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message); // Logs the error message
    } else {
      console.log("An unknown error occurred", error);
    }
  }
}
