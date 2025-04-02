import {
  Chat,
  pipeline,
  TextStreamer,
} from "@huggingface/transformers";

export const generate = async (message: string): Promise<string | Chat> => {
  // Create a text generation pipeline
  const generator = await pipeline(
    "text-generation",
    "onnx-community/Qwen2.5-Coder-0.5B-Instruct",
    { dtype: "q4" }
  );

  // Define the list of messages
  const messages = [
    { role: "user", content: message }
  ];

  // Create text streamer optionally
  // const streamer = new TextStreamer(generator.tokenizer, {
  //   skip_prompt: true,
  //   // Optionally, do something with the text (e.g., write to a textbox)
  //   // callback_function: (text) => { /* Do something with text */ },
  // });

  // Generate a response
  const result = await generator(messages, {
    max_new_tokens: 120,
    do_sample: false,
  });
  // Narrow the type to ensure 'generated_text' exists
  if ("generated_text" in result[0]) {
    return result[0].generated_text;
  } else {
    throw new Error("The result does not contain 'generated_text'.");
  }
};
