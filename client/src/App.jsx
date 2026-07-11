import { useRef, useState } from 'react'
import CameraCapture from './CameraCapture'
import './App.css'

function App() {
  const [selectedMode, setSelectedMode] = useState('describe')
  const [selectedImage, setSelectedImage] = useState(null)
  const [objectQuery, setObjectQuery] = useState('')
  const [showCamera, setShowCamera] = useState(false)
  const imageInputRef = useRef(null)

  function removeImage() {
    setSelectedImage(null)

    if (imageInputRef.current) {
      imageInputRef.current.value = ''
    }
  }

  function handleCameraCapture(photo) {
    setSelectedImage(photo)
    setShowCamera(false)

    if (imageInputRef.current) {
      imageInputRef.current.value = ''
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
                setSelectedImage(event.target.files[0] || null)
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
            <p role="status">
              Selected image: {selectedImage.name}
            </p>

            <button
              type="button"
              onClick={removeImage}
            >
              Remove Image
            </button>
          </div>
        )}

        <button
          type="button"
          className="analyze-button"
          disabled={
            !selectedImage ||
            (selectedMode === 'find' && !objectQuery.trim())
          }
        >
          Analyze Image
        </button>
      </section>
    </main>
  )
}

export default App