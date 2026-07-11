async function convertTextToSpeech(text) {
  const apiKey = process.env.ELEVENLABS_API_KEY
  const voiceId =
    process.env.ELEVENLABS_VOICE_ID || 'JBFqnCBsd6RMkjVDRZzb'

  if (!apiKey) {
    throw new Error('ELEVENLABS_API_KEY is not configured')
  }

  if (!text || typeof text !== 'string') {
    throw new Error('Text is required for speech generation')
  }

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_flash_v2_5',
      }),
    }
  )

  if (!response.ok) {
    const errorDetails = await response.text()
    throw new Error(
      `ElevenLabs request failed: ${response.status} ${errorDetails}`
    )
  }

  const audioArrayBuffer = await response.arrayBuffer()
  return Buffer.from(audioArrayBuffer)
}

module.exports = {
  convertTextToSpeech,
}