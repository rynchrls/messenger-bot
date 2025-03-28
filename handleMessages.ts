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
    let responseText: string = "";
    let senderId: string = event.sender.id;
    let messageText: string = event.message.text.toLowerCase();
    const chatCompletion = await client.chatCompletion({
      provider: "novita",
      model: "mistralai/Mistral-7B-Instruct-v0.3",
      messages: [
        {
          role: "user",
          content: `${messageText}. and put Hi, I'm Jhumpstreet AI! 👋 at the beginning of the message`,
        },
      ],
      max_tokens: 500,
    });
    let newText = chatCompletion.choices[0].message.content;

    if (newText) {
      // Remove unwanted symbols (e.g., /**, //, *, new lines)
      newText = newText
        .replace(/[/][*][*]?.*?[*][/]/g, "") // Removes /** some text */
        .replace(/[/]{2}.*/g, "") // Removes // comments
        .replace(/[*]/g, "") // Removes standalone *
        .replace(/\s+/g, " "); // Removes extra spaces/newlines
    } else {
      newText = ""; // Default to an empty string if undefined
    }

    responseText += newText.trim();
    sendMessage(senderId, responseText as string);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message); // Logs the error message
    } else {
      console.log("An unknown error occurred", error);
    }
  }
}
