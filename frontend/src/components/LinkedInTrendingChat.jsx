import { useState } from 'react'
import { MessageSquare, TrendingUp, Sparkles, Loader2 } from 'lucide-react'
import axios from 'axios'
import SoraVideoPlayer from './SoraVideoPlayer'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function LinkedInTrendingChat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I can help you create viral Sora videos based on trending LinkedIn topics. Tell me what industry or topic you're interested in, or ask me to find what's trending!"
    }
  ])
  const [userInput, setUserInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [generatedVideo, setGeneratedVideo] = useState(null)

  const handleSendMessage = async () => {
    if (!userInput.trim() || loading) return

    const userMessage = userInput.trim()
    setUserInput('')
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      // Call AI chat endpoint
      const response = await axios.post(`${API_URL}/api/linkedin/chat`, {
        message: userMessage,
        conversation_history: messages
      })

      const aiResponse = response.data

      // Add AI message
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: aiResponse.message,
        trends: aiResponse.trends,
        script: aiResponse.sora_script,
        videoJob: aiResponse.sora_video_job
      }])

      // If video was generated, store it
      if (aiResponse.sora_video_job) {
        setGeneratedVideo(aiResponse.sora_video_job)
      }

    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Error: ${error.response?.data?.detail || 'Failed to process request. Please try again.'}`
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="bg-[#111] border border-gray-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-800 p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">LinkedIn Trending Video Generator</h2>
            <p className="text-gray-400 text-sm">AI-powered videos from LinkedIn trends</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="h-[500px] overflow-y-auto p-6 space-y-4 bg-[#0a0a0a]">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                msg.role === 'user'
                  ? 'bg-white text-black'
                  : 'bg-[#1a1a1a] border border-gray-800 text-gray-300'
              }`}
            >
              {/* Message Content */}
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>

              {/* Trending Topics */}
              {msg.trends && msg.trends.length > 0 && (
                <div className="mt-4 space-y-3">
                  <p className="text-sm font-medium text-gray-400 mb-2">Trending Topics:</p>
                  {msg.trends.map((trend, i) => (
                    <div key={i} className="bg-[#111] border border-gray-800 rounded-lg p-4">
                      <h4 className="font-semibold text-sm text-white mb-2">
                        {i + 1}. {trend.topic}
                      </h4>
                      <p className="text-sm text-gray-400 mb-3">{trend.description}</p>
                      
                      {/* LinkedIn Profile Links */}
                      {trend.example_posts && trend.example_posts.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <p className="text-xs font-medium text-gray-500 mb-2">LinkedIn Posts:</p>
                          {trend.example_posts.map((post, j) => (
                            <a
                              key={j}
                              href={post.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 hover:border-gray-700 transition-all"
                            >
                              <p className="text-xs font-medium text-gray-300">{post.author}</p>
                              <p className="text-xs text-gray-500 mt-1">{post.snippet}</p>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Sora Script */}
              {msg.script && (
                <div className="mt-4 bg-[#111] border border-gray-800 rounded-lg p-4">
                  <p className="text-xs font-medium text-gray-400 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Generated Sora Script:
                  </p>
                  <p className="text-xs text-gray-300 whitespace-pre-wrap">{msg.script}</p>
                </div>
              )}

              {/* Sora Video Player */}
              {msg.videoJob && (
                <div className="mt-4">
                  <SoraVideoPlayer videoJob={msg.videoJob} />
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4 flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
              <span className="text-sm text-gray-400">AI is thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-[#111] border-t border-gray-800">
        <div className="flex gap-3">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me to find trending topics or create a video..."
            className="flex-1 px-4 py-3 bg-[#1a1a1a] border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-gray-700"
            disabled={loading}
          />
          <button
            onClick={handleSendMessage}
            disabled={loading || !userInput.trim()}
            className="px-6 py-3 bg-white hover:bg-gray-100 text-black font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing
              </>
            ) : (
              <>
                <MessageSquare className="w-5 h-5" />
                Send
              </>
            )}
          </button>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          Try: "What's trending in AI?", "Create a video about remote work", "Show me tech industry trends"
        </p>
      </div>
    </div>
  )
}

export default LinkedInTrendingChat
