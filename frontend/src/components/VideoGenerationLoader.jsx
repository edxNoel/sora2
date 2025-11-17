import { motion } from 'framer-motion'
import { Loader2, Video, Sparkles } from 'lucide-react'
import { TextShimmer } from './ui/text-shimmer'

function VideoGenerationLoader({ message = 'Generating script...', inline = false }) {
  // Inline version for non-blocking display
  if (inline) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-8 w-full"
        style={{
          backgroundColor: '#111827',
          border: '1px solid #374151',
          borderRadius: '24px'
        }}
      >
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Animated Icons */}
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-12 h-12 text-white" />
            </motion.div>
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Video className="w-6 h-6 text-white/50" />
            </motion.div>
          </div>

          {/* Text with Shimmer Effect */}
          <div className="space-y-2">
            <TextShimmer
              as="h3"
              className="text-lg font-semibold [--base-color:#9ca3af] [--base-gradient-color:#ffffff]"
              duration={1.5}
              style={{ fontSize: '18px', fontWeight: 600 }}
            >
              {message}
            </TextShimmer>
            <p className="text-sm text-gray-400" style={{ fontSize: '14px', color: '#9ca3af' }}>
              This may take a few moments. You can review the context above while we generate.
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden max-w-md">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {/* Steps */}
          <div className="flex gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Creating script</span>
            </div>
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              <span>Generating video</span>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  // Full-screen overlay version (original)
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#111] border border-gray-800 rounded-3xl p-12 max-w-md w-full mx-6"
        style={{ borderRadius: '24px' }}
      >
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Animated Icons */}
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-16 h-16 text-white" />
            </motion.div>
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Video className="w-8 h-8 text-white/50" />
            </motion.div>
          </div>

          {/* Text with Shimmer Effect */}
          <div className="space-y-2">
            <TextShimmer
              as="h3"
              className="text-xl font-semibold [--base-color:#9ca3af] [--base-gradient-color:#ffffff]"
              duration={1.5}
              style={{ fontSize: '20px', fontWeight: 600 }}
            >
              {message}
            </TextShimmer>
            <p className="text-sm text-gray-400" style={{ fontSize: '14px', color: '#9ca3af' }}>
              This may take a few moments. Please don't close this window.
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {/* Steps */}
          <div className="flex gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Creating script</span>
            </div>
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              <span>Generating video</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default VideoGenerationLoader


