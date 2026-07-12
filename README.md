# SceneSpeak

An AI-powered visual accessibility assistant that turns images into clear text and spoken guidance for people who are blind or have low vision.

## Features

- **Describe Scene:** Describes important objects, locations, and potential obstacles.
- **Read Text:** Reads visible signs, labels, notices, and documents.
- **Find an Object:** Locates a requested object using concise natural-language directions.
- Upload an existing image or capture one with the device camera.
- Automatically generates spoken results using ElevenLabs.
- Displays text results with accessible loading and error messages.
- Responsive, keyboard-accessible, high-contrast interface.

## How It Works

1. The user selects an assistance mode.
2. They upload or capture an image.
3. The frontend converts the image to base64.
4. Gemini analyzes the image and returns a concise description.
5. ElevenLabs converts the description into spoken audio.
6. The result is displayed and played for the user.

```text
Image → Gemini analysis → Text result → ElevenLabs → Spoken result
```

## Technologies

- React
- Vite
- JavaScript
- Node.js
- Express
- Google Gemini API
- ElevenLabs API
- HTML and CSS
- MediaDevices Camera API
- Git and GitHub

## Accessibility

SceneSpeak was designed using WCAG accessibility principles, including:

- Semantic HTML and labelled controls
- Keyboard-accessible interactions
- Visible focus indicators
- High colour contrast
- Screen-reader status and error announcements
- Large responsive controls
- Text and audio results
- No instructions based only on colour

SceneSpeak is an accessibility prototype and is not a replacement for a cane, guide dog, mobility aid, or professional assistance.

## Project Structure

```text
SceneSpeak/
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── CameraCapture.jsx
│   │   └── main.jsx
│   └── vite.config.js
├── server/
│   ├── routes/
│   │   ├── analyze.js
│   │   └── speech.js
│   ├── services/
│   │   ├── gemini.js
│   │   └── elevenlabs.js
│   ├── .env.example
│   └── server.js
├── LICENSE
└── README.md
```

## Local Setup

### Requirements

- Node.js 20 or newer
- A Google Gemini API key
- An ElevenLabs API key

### 1. Clone the repository

```bash
git clone https://github.com/leen-naser/SceneSpeak.git
cd SceneSpeak
```

### 2. Install frontend dependencies

```bash
cd client
npm install
cd ..
```

### 3. Install backend dependencies

```bash
cd server
npm install
cd ..
```

### 4. Configure environment variables

Create `server/.env`:

```env
GEMINI_API_KEY=your_gemini_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_VOICE_ID=your_voice_id
```

Never commit the real `.env` file or expose API keys.

### 5. Start the backend

```bash
cd server
node --env-file=.env server.js
```

The backend runs at:

```text
http://localhost:3000
```

### 6. Start the frontend

Open another terminal:

```bash
cd client
npm run dev
```

Open the local URL displayed by Vite.

## API Endpoints

### Analyze an image

```http
POST /analyze
```

Example JSON body:

```json
{
  "image": "base64-image-data",
  "mimeType": "image/jpeg",
  "mode": "describe",
  "objectQuery": ""
}
```

### Generate speech

```http
POST /speech
```

Example JSON body:

```json
{
  "text": "The chair is in the centre, directly in front of the desk."
}
```

Returns MP3 audio.

## Testing

Frontend checks:

```bash
cd client
npm run lint
npm run build
```

Backend syntax checks:

```bash
node --check server/server.js
node --check server/routes/analyze.js
node --check server/routes/speech.js
node --check server/services/gemini.js
node --check server/services/elevenlabs.js
```

## Challenges

- Coordinating frontend and backend development across Git branches
- Designing the complete interaction for screen-reader and keyboard users
- Handling live camera permissions
- Protecting API keys
- Producing focused, concise AI responses
- Connecting image analysis to automatic speech generation

## What We Learned

We learned how to build and integrate a full-stack React and Express application, process images with a multimodal AI model, generate audio through a text-to-speech API, protect environment variables, collaborate through pull requests, and design with accessibility in mind from the beginning.

## Future Improvements

- Test with blind and low-vision users
- Add multilingual descriptions and speech
- Offer user-selectable voices
- Improve object-location guidance
- Add optional continuous camera assistance
- Conduct a formal WCAG accessibility audit

## Team

Built by a two-person team at cuHacking 7.

## License

This project is licensed under the MIT License.