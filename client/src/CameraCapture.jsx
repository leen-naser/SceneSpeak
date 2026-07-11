import { useEffect, useRef, useState } from 'react'

function CameraCapture({ onCapture, onClose }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [cameraError, setCameraError] = useState('')

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' },
          },
          audio: false,
        })

        streamRef.current = stream
        videoRef.current.srcObject = stream
      } catch {
        setCameraError(
          'Camera access was unavailable. Check your browser permissions or upload a picture instead.'
        )
      }
    }

    startCamera()

    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop())
  }

  function capturePhoto() {
    const video = videoRef.current
    const canvas = document.createElement('canvas')

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const context = canvas.getContext('2d')
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setCameraError('The photo could not be captured. Please try again.')
          return
        }

        const photo = new File([blob], `camera-photo-${Date.now()}.jpg`, {
          type: 'image/jpeg',
        })

        onCapture(photo)
        stopCamera()
      },
      'image/jpeg',
      0.9
    )
  }

  function closeCamera() {
    stopCamera()
    onClose()
  }

  return (
    <div className="camera-panel" aria-labelledby="camera-heading">
      <h3 id="camera-heading">Camera</h3>

      {cameraError ? (
        <p role="alert">{cameraError}</p>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            aria-label="Live camera preview"
          />

          <div>
            <button type="button" onClick={capturePhoto}>
              Capture Photo
            </button>

            <button type="button" onClick={closeCamera}>
              Close Camera
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default CameraCapture