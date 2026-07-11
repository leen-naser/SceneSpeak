const express = require('express')
const {
  convertTextToSpeech,
} = require('../services/elevenlabs')

const router = express.Router()

router.post('/', async (request, response) => {
  try {
    const { text } = request.body

    if (!text || typeof text !== 'string' || !text.trim()) {
      return response.status(400).json({
        error: 'A non-empty text value is required',
      })
    }

    const audioBuffer = await convertTextToSpeech(text.trim())

    response.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length,
      'Cache-Control': 'no-store',
    })

    return response.send(audioBuffer)
  } catch (error) {
    console.error('Speech generation failed:', error.message)

    return response.status(500).json({
      error: 'Speech could not be generated',
    })
  }
})

module.exports = router