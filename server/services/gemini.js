const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function analyzeImage(imageBase64, mimeType, mode, objectQuery) {
  let prompt;

  switch (mode) {
    case "read":
    case "read-text":
      prompt = `Read the visible text in this image for a person who is blind or has low vision.

Return the text in a clear reading order. Add a short explanation only if necessary.

Keep the response concise. Do not use headings, Markdown, coordinates, or JSON.`;
      break;

    case "find":
    case "find-object":
      prompt = `Act only as an object-location assistant for a person who is blind or has low vision.

Target object: "${objectQuery}"

Respond only about the target object.

If found:
- Begin with "Found."
- Describe its location from the viewer's perspective using left, centre, right, foreground, middle, or background.
- Mention one nearby object as a reference.
- Keep the response under 50 words.

If not found, respond exactly: "I could not find ${objectQuery} in this image."

Do not describe the overall scene. Do not use headings, Markdown, coordinates, or JSON.`;
      break;

    case "describe":
    default:
      prompt = `Describe this scene clearly and concisely for a person who is blind or has low vision.

Mention the most important objects, their general locations, and any potential obstacles. Keep the response under 100 words.

Do not use headings, Markdown, coordinates, or JSON.`;
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