import { useState, useEffect, useRef } from 'react'
import { Download, Loader2, AlertCircle, CheckCircle2, Video } from 'lucide-react'
import axios from 'axios'
import VideoGenerationLoader from './VideoGenerationLoader'

// API URL - uses environment variable for production
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function SoraVideoPlayer({ videoJob, onStatusChange }) {
  const [status, setStatus] = useState(videoJob.status)
  const [progress, setProgress] = useState(videoJob.progress || 0)
  const [videoUrl, setVideoUrl] = useState(null)
  const [error, setError] = useState(null)
  const pollingIntervalRef = useRef(null)

  useEffect(() => {
    // Update status and progress from videoJob prop
    setStatus(videoJob.status)
    setProgress(videoJob.progress || 0)
    
    // Notify parent of initial status
    if (onStatusChange) {
      onStatusChange(videoJob.status)
    }

    // If video is already completed, set the URL
    if (videoJob.status === 'completed' && videoJob.video_url) {
      setVideoUrl(`${API_URL}${videoJob.video_url}`)
      // Clear any existing polling
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }
      return
    }

    // If video is queued or in progress, start polling (only if not already polling)
    if ((videoJob.status === 'queued' || videoJob.status === 'in_progress') && !pollingIntervalRef.current) {
      pollVideoStatus()
    }

    // Cleanup function
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }
    }
  }, [videoJob.job_id, videoJob.status, videoJob.progress])

  const pollVideoStatus = async () => {
    const maxAttempts = 120 // 10 minutes max (120 * 5 seconds)
    let attempts = 0

    pollingIntervalRef.current = setInterval(async () => {
      try {
        attempts++
        
        const response = await axios.get(
          `${API_URL}/api/sora/status/${videoJob.job_id}`
        )
        
        const data = response.data
        setStatus(data.status)
        setProgress(data.progress || 0)
        
        // Notify parent of status change
        if (onStatusChange) {
          onStatusChange(data.status)
        }

        if (data.status === 'completed') {
          setVideoUrl(`${API_URL}${data.video_url}`)
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current)
            pollingIntervalRef.current = null
          }
        } else if (data.status === 'failed') {
          setError('Video generation failed')
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current)
            pollingIntervalRef.current = null
          }
        } else if (attempts >= maxAttempts) {
          setError('Video generation timed out')
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current)
            pollingIntervalRef.current = null
          }
        }
      } catch (err) {
        console.error('Polling error:', err)
        setError('Failed to check video status')
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current)
          pollingIntervalRef.current = null
        }
      }
    }, 5000) // Poll every 5 seconds
  }

  const handleDownload = async () => {
    try {
      const response = await axios.get(videoUrl, {
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `sora_video_${videoJob.job_id}.mp4`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      console.error('Download error:', err)
      alert('Failed to download video')
    }
  }

  // Show loading screen for queued or in_progress videos
  if (status === 'queued' || status === 'in_progress') {
    return (
      <div className="mt-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Video className="w-5 h-5" />
          Sora Generated Video
          <span className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1 rounded-full border border-purple-200">
            AI Generated
          </span>
        </h4>
        <VideoGenerationLoader 
          message={status === 'queued' ? 'Video queued for generation...' : `Generating video with Sora AI... ${progress > 0 ? `(${progress}%)` : ''}`}
          inline={true}
        />
      </div>
    )
  }

  return (
    <div className="mt-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <Video className="w-5 h-5" />
        Sora Generated Video
        <span className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1 rounded-full border border-purple-200">
          AI Generated
        </span>
      </h4>

      <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-6">

        {status === 'failed' && (
          <div className="flex items-center gap-3 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <span>{error || 'Video generation failed'}</span>
          </div>
        )}

        {status === 'completed' && videoUrl && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-green-600 mb-4">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-semibold">Video generated successfully!</span>
            </div>

            {/* Video Player */}
            <div className="bg-black rounded-lg overflow-hidden shadow-lg">
              <video 
                controls 
                className="w-full max-h-[500px]"
                src={videoUrl}
                poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23000' width='100' height='100'/%3E%3C/svg%3E"
              >
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Video (MP4)
            </button>

            {/* Video Info */}
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 bg-white rounded-lg p-4">
              <div>
                <span className="font-semibold">Model:</span> {videoJob.model}
              </div>
              <div>
                <span className="font-semibold">Job ID:</span> {videoJob.job_id.slice(0, 20)}...
              </div>
            </div>
          </div>
        )}

        {error && status !== 'failed' && (
          <div className="flex items-center gap-3 text-red-600 mt-4">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default SoraVideoPlayer
