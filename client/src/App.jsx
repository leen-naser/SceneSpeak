import { useEffect, useRef, useState } from 'react'
import CameraCapture from './CameraCapture'
import './App.css'

function App() {
  const [selectedMode, setSelectedMode] = useState('describe')
  const [selectedImage, setSelectedImage] = useState(null)
  const [objectQuery, setObjectQuery] = useState('')
  const [showCamera, setShowCamera] = useState(false)
  const [description, setDescription] = useState('')
  const [audioUrl, setAudioUrl] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const imageInputRef = useRef(null)

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl])

  function clearResults() {
    setDescription('')
    setStatus('')
    setError('')

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
      setAudioUrl('')
    }
  }

  function removeImage() {
    setSelectedImage(null)
    clearResults()

    if (imageInputRef.current) {
      imageInputRef.current.value = ''
    }
  }

  function handleCameraCapture(photo) {
    setSelectedImage(photo)
    setShowCamera(false)
    clearResults()
    setStatus('Photo captured and ready for analysis.')

    if (imageInputRef.current) {
      imageInputRef.current.value = ''
    }
  }

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = () => {
        const base64 = reader.result.split(',')[1]
        resolve(base64)
      }

      reader.onerror = () => {
        reject(new Error('The image could not be read.'))
      }

      reader.readAsDataURL(file)
    })
  }

  async function handleAnalyze() {
    if (!selectedImage) {
      return
    }

    setIsLoading(true)
    clearResults()
    setStatus('Analyzing image. Please wait.')

    try {
      const imageBase64 = await fileToBase64(selectedImage)

      const analyzeResponse = await fetch('/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageBase64,
          mimeType: selectedImage.type,
          mode: selectedMode,
          objectQuery:
            selectedMode === 'find' ? objectQuery.trim() : '',
        }),
      })

      const analyzeData = await analyzeResponse.json()

      if (!analyzeResponse.ok) {
        throw new Error(
          analyzeData.error || 'The image could not be analyzed.'
        )
      }

      setDescription(analyzeData.description)
      setStatus('Analysis complete. Generating spoken result.')

      const speechResponse = await fetch('/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: analyzeData.description,
        }),
      })

      if (!speechResponse.ok) {
        throw new Error(
          'The description was created, but speech could not be generated.'
        )
      }

      const audioBlob = await speechResponse.blob()
      const newAudioUrl = URL.createObjectURL(audioBlob)

      setAudioUrl(newAudioUrl)
      setStatus('Analysis and spoken result are ready.')
    } catch (requestError) {
      setError(requestError.message)
      setStatus('')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main>
      <header>
        <p>Visual assistance, spoken clearly</p>
        <h1>SceneSpeak</h1>
        <p>
          Take or upload a picture and receive an accessible description.
        </p>
      </header>

      <section aria-labelledby="mode-heading">
        <h2 id="mode-heading">What would you like help with?</h2>

        <button
          type="button"
          className={selectedMode === 'describe' ? 'selected' : ''}
          aria-pressed={selectedMode === 'describe'}
          onClick={() => setSelectedMode('describe')}
        >
          Describe Scene
        </button>

        <button
          type="button"
          className={selectedMode === 'read' ? 'selected' : ''}
          aria-pressed={selectedMode === 'read'}
          onClick={() => setSelectedMode('read')}
        >
          Read Text
        </button>

        <button
          type="button"
          className={selectedMode === 'find' ? 'selected' : ''}
          aria-pressed={selectedMode === 'find'}
          onClick={() => setSelectedMode('find')}
        >
          Find an Object
        </button>

        {selectedMode === 'find' && (
          <div className="object-search">
            <label htmlFor="object-query">
              What object would you like to find?
            </label>

            <input
              id="object-query"
              type="text"
              value={objectQuery}
              onChange={(event) => setObjectQuery(event.target.value)}
              placeholder="For example: exit, chair, or backpack"
            />
          </div>
        )}
      </section>

      <section aria-labelledby="image-heading">
        <h2 id="image-heading">Choose a picture</h2>

        <div className="image-options">
          <div>
            <label htmlFor="image-upload">
              Upload an existing picture
            </label>

            <input
              ref={imageInputRef}
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={(event) => {
                const image = event.target.files[0] || null
                setSelectedImage(image)
                clearResults()

                if (image) {
                  setStatus('Picture selected and ready for analysis.')
                }
              }}
            />
          </div>

          <p className="option-divider">or</p>

          <button
            type="button"
            onClick={() => setShowCamera(true)}
          >
            Open Camera
          </button>
        </div>

        {showCamera && (
          <CameraCapture
            onCapture={handleCameraCapture}
            onClose={() => setShowCamera(false)}
          />
        )}

        {selectedImage && (
          <div>
            <p>
              Selected image: {selectedImage.name}
            </p>

            <button type="button" onClick={removeImage}>
              Remove Image
            </button>
          </div>
        )}

        <button
          type="button"
          className="analyze-button"
          onClick={handleAnalyze}
          disabled={
            isLoading ||
            !selectedImage ||
            (selectedMode === 'find' && !objectQuery.trim())
          }
        >
          {isLoading ? 'Analyzing…' : 'Analyze Image'}
        </button>
      </section>

      <div aria-live="polite" aria-atomic="true">
        {status && <p className="status-message">{status}</p>}
      </div>

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      {description && (
        <section aria-labelledby="result-heading">
          <h2 id="result-heading">Result</h2>
          <p>{description}</p>

          {audioUrl && (
            <audio
              src={audioUrl}
              controls
              autoPlay
              aria-label="Spoken SceneSpeak result"
            >
              Your browser does not support audio playback.
            </audio>
          )}
        </section>
      )}
    </main>
  )
}

export default App