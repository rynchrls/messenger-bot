import express, { Express } from "express";
import dotenv from "dotenv";
import { handleMessage } from "./handleMessages";

dotenv.config({ path: ".env.dev" });

const app: Express = express();

app.use(express.json());

const PORT: number = parseInt(process.env.PORT as string, 10) || 5000;

// Webhook Verification
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN: string = process.env.VERIFY_TOKEN as string;
  if (
    req.query["hub.mode"] === "subscribe" &&
    req.query["hub.verify_token"] === VERIFY_TOKEN
  ) {
    console.log("Webhook Verified");
    res.status(200).send(req.query["hub.challenge"]);
  } else {
    res.status(403).send("Verification failed");
  }
});

// Webhook for receiving messages
app.post("/webhook", (req, res) => {
  let body = req.body;
  console.log(JSON.stringify(body, null, 2)); // Debugging

  if (body.object === "page") {
    body.entry.forEach((entry: any) => {
      let event = entry.messaging[0];
      if (event.message) {
        handleMessage(event);
      }
    });
    res.status(200).send("EVENT_RECEIVED");
  } else {
    res.sendStatus(404);
  }
});

// function handleMessage(event: any) {
//   let senderId = event.sender.id;
//   let messageText = event.message.text;

//   console.log(`Received message: ${messageText} from ${senderId}`);
// }

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
