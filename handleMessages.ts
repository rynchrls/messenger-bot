import axios from "axios";
import { HfInference } from "@huggingface/inference";
import { generate } from "./generateResponse";
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
    const res = await generate(messageText);
    if (typeof res[1] === "object" && "content" in res[1]) {
      sendMessage(senderId, res[1].content as string);
    } else {
      console.log("No content available");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message); // Logs the error message
    } else {
      console.log("An unknown error occurred", error);
    }
  }
}
