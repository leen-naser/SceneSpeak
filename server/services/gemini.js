const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function analyzeImage(imageBase64, mimeType, mode, objectQuery) {
  let prompt;

  switch (mode) {
    case "read-text":
      prompt = "Read all visible text in this image. Provide only the text and a brief explanation if needed.";
      break;

    case "find-object":
      prompt = `You are assisting a person who is blind or has low vision. Look for the object "${objectQuery}" in this image. If it is present, describe its location using natural language (for example: left, right, in front, behind, near another object) and provide helpful details. Do not return coordinates or JSON.`;
      break;

    case "describe":
    default:
      prompt =
        "Describe this scene clearly and concisely for a person who is blind or has low vision. Mention important objects, their locations, and any relevant details.";
      break;
  }

  const response = await ai.interactions.create({
    model: "gemini-3.5-flash",
    input: [
      {
        type: "text",
        text: prompt,
      },
      {
        type: "image",
        data: imageBase64,
        mime_type: mimeType,
      },
    ],
  });

  return response.output_text;
}

module.exports = {
  analyzeImage,
};