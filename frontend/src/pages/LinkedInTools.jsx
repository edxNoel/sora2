import { useState, useEffect } from 'react'
import { MessageSquare, TrendingUp, Sparkles, Loader2 } from 'lucide-react'
import axios from 'axios'
import SoraVideoPlayer from '../components/SoraVideoPlayer'
import VideoGenerationLoader from '../components/VideoGenerationLoader'
import { TextShimmer } from '../components/ui/text-shimmer'
import design from '../../design.json'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function LinkedInTools() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I can help you create viral Sora videos based on trending LinkedIn topics. Tell me what industry or topic you're interested in, or ask me to find what's trending!"
    }
  ])
  const [userInput, setUserInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [generatingVideo, setGeneratingVideo] = useState(false)
  const [generatedVideo, setGeneratedVideo] = useState(null)

  // Design tokens
  const { colors, typography, spacing, layout } = design
  const maxContentWidth = layout.page.maxContentWidth
  const pagePaddingX = spacing.page.paddingXDesktop
  const sectionGap = spacing.page.sectionGap

  // Check if video is being generated
  useEffect(() => {
    if (generatedVideo) {
      const isGenerating = generatedVideo.status === 'queued' || generatedVideo.status === 'in_progress'
      setGeneratingVideo(isGenerating)
    }
  }, [generatedVideo])

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
    <div 
      className="min-h-screen"
      style={{ 
        backgroundColor: colors.background.section,
        fontFamily: typography.fontFamilies.body,
        paddingTop: spacing.scale['3xl'],
        paddingBottom: sectionGap,
        maxWidth: `${maxContentWidth}px`,
        margin: '0 auto',
        paddingLeft: `${pagePaddingX}px`,
        paddingRight: `${pagePaddingX}px`
      }}
    >
      {generatingVideo && <VideoGenerationLoader message="Generating your video..." />}
      
      <div 
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: colors.background.card,
          border: `1px solid ${colors.borders.subtle}`,
          borderRadius: '24px',
          boxShadow: '0 18px 40px rgba(15,23,42,0.06)'
        }}
      >
        {/* Header */}
        <div 
          style={{
            borderBottom: `1px solid ${colors.borders.subtle}`,
            padding: spacing.scale['3xl']
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="rounded-lg flex items-center justify-center"
              style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(to bottom right, #3b82f6, #06b6d4)'
              }}
            >
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 style={{ 
                fontSize: typography.sizes.xl, 
                fontWeight: typography.weights.semibold,
                color: colors.text.primary
              }}>
                LinkedIn Trending Video Generator
              </h2>
              <p style={{ 
                color: colors.text.muted, 
                fontSize: typography.sizes.sm
              }}>
                AI-powered videos from LinkedIn trends
              </p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div 
          className="overflow-y-auto space-y-4"
          style={{
            height: '500px',
            padding: spacing.scale['3xl'],
            backgroundColor: colors.background.section
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className="max-w-[80%] rounded-lg p-4"
                style={{
                  backgroundColor: msg.role === 'user' 
                    ? colors.accent.primary 
                    : colors.background.card,
                  color: msg.role === 'user' 
                    ? colors.text.onDark 
                    : colors.text.primary,
                  border: msg.role === 'assistant' 
                    ? `1px solid ${colors.borders.subtle}` 
                    : 'none'
                }}
              >
                {/* Message Content */}
                <p style={{ 
                  whiteSpace: 'pre-wrap', 
                  fontSize: typography.sizes.sm,
                  lineHeight: typography.lineHeights.normal
                }}>
                  {msg.content}
                </p>

                {/* Trending Topics */}
                {msg.trends && msg.trends.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <p style={{ 
                      fontSize: typography.sizes.sm, 
                      fontWeight: typography.weights.medium,
                      color: msg.role === 'user' ? 'rgba(255,255,255,0.8)' : colors.text.muted,
                      marginBottom: spacing.scale.sm
                    }}>
                      Trending Topics:
                    </p>
                    {msg.trends.map((trend, i) => (
                      <div 
                        key={i} 
                        className="rounded-lg p-4"
                        style={{
                          backgroundColor: msg.role === 'user' 
                            ? 'rgba(255,255,255,0.1)' 
                            : colors.background.section,
                          border: `1px solid ${msg.role === 'user' ? 'rgba(255,255,255,0.2)' : colors.borders.subtle}`
                        }}
                      >
                        <h4 style={{ 
                          fontWeight: typography.weights.semibold, 
                          fontSize: typography.sizes.sm,
                          color: msg.role === 'user' ? colors.text.onDark : colors.text.primary,
                          marginBottom: spacing.scale.sm
                        }}>
                          {i + 1}. {trend.topic}
                        </h4>
                        <p style={{ 
                          fontSize: typography.sizes.sm,
                          color: msg.role === 'user' ? 'rgba(255,255,255,0.8)' : colors.text.muted,
                          marginBottom: spacing.scale.md
                        }}>
                          {trend.description}
                        </p>
                        
                        {/* LinkedIn Profile Links */}
                        {trend.example_posts && trend.example_posts.length > 0 && (
                          <div className="mt-3 space-y-2">
                            <p style={{ 
                              fontSize: typography.sizes.xs, 
                              fontWeight: typography.weights.medium,
                              color: msg.role === 'user' ? 'rgba(255,255,255,0.7)' : colors.text.lightMuted,
                              marginBottom: spacing.scale.sm
                            }}>
                              LinkedIn Posts:
                            </p>
                            {trend.example_posts.map((post, j) => (
                              <a
                                key={j}
                                href={post.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block rounded-lg p-3 transition-all"
                                style={{
                                  backgroundColor: msg.role === 'user' 
                                    ? 'rgba(255,255,255,0.1)' 
                                    : colors.background.card,
                                  border: `1px solid ${msg.role === 'user' ? 'rgba(255,255,255,0.2)' : colors.borders.subtle}`,
                                  textDecoration: 'none'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.borderColor = msg.role === 'user' 
                                    ? 'rgba(255,255,255,0.4)' 
                                    : colors.text.primary
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.borderColor = msg.role === 'user' 
                                    ? 'rgba(255,255,255,0.2)' 
                                    : colors.borders.subtle
                                }}
                              >
                                <p style={{ 
                                  fontSize: typography.sizes.xs, 
                                  fontWeight: typography.weights.medium,
                                  color: msg.role === 'user' ? colors.text.onDark : colors.text.primary
                                }}>
                                  {post.author}
                                </p>
                                <p style={{ 
                                  fontSize: typography.sizes.xs,
                                  color: msg.role === 'user' ? 'rgba(255,255,255,0.7)' : colors.text.lightMuted,
                                  marginTop: spacing.scale.xs
                                }}>
                                  {post.snippet}
                                </p>
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
                  <div 
                    className="mt-4 rounded-lg p-4"
                    style={{
                      backgroundColor: msg.role === 'user' 
                        ? 'rgba(255,255,255,0.1)' 
                        : colors.background.section,
                      border: `1px solid ${msg.role === 'user' ? 'rgba(255,255,255,0.2)' : colors.borders.subtle}`
                    }}
                  >
                    <p style={{ 
                      fontSize: typography.sizes.xs, 
                      fontWeight: typography.weights.medium,
                      color: msg.role === 'user' ? 'rgba(255,255,255,0.8)' : colors.text.muted,
                      marginBottom: spacing.scale.sm,
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing.scale.sm
                    }}>
                      <Sparkles className="w-4 h-4" />
                      Generated Sora Script:
                    </p>
                    <p style={{ 
                      fontSize: typography.sizes.xs,
                      color: msg.role === 'user' ? 'rgba(255,255,255,0.9)' : colors.text.primary,
                      whiteSpace: 'pre-wrap',
                      lineHeight: typography.lineHeights.normal
                    }}>
                      {msg.script}
                    </p>
                  </div>
                )}

                {/* Sora Video Player */}
                {msg.videoJob && (
                  <div className="mt-4">
                    <SoraVideoPlayer 
                      videoJob={msg.videoJob}
                      onStatusChange={(status) => {
                        setGeneratedVideo(prev => prev ? { ...prev, status } : null)
                        // Update in messages too
                        setMessages(prev => prev.map(m => {
                          if (m.videoJob && m.videoJob.job_id === msg.videoJob.job_id) {
                            return {
                              ...m,
                              videoJob: { ...m.videoJob, status }
                            }
                          }
                          return m
                        }))
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div 
                className="rounded-lg p-4 flex items-center gap-3"
                style={{
                  backgroundColor: colors.background.card,
                  border: `1px solid ${colors.borders.subtle}`
                }}
              >
                <Loader2 className="w-5 h-5 animate-spin" style={{ color: colors.text.muted }} />
                <TextShimmer
                  className="text-sm font-medium"
                  duration={1.5}
                  style={{ 
                    fontSize: typography.sizes.sm,
                    '--base-color': colors.text.muted,
                    '--base-gradient-color': colors.text.primary
                  }}
                >
                  Generating script...
                </TextShimmer>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div 
          style={{
            padding: spacing.scale['3xl'],
            backgroundColor: colors.background.card,
            borderTop: `1px solid ${colors.borders.subtle}`
          }}
        >
          <div className="flex gap-3">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me to find trending topics or create a video..."
              className="flex-1 px-4 py-3 rounded-lg focus:outline-none"
              style={{
                backgroundColor: colors.background.section,
                border: `1px solid ${colors.borders.subtle}`,
                color: colors.text.primary,
                fontSize: typography.sizes.md
              }}
              disabled={loading}
            />
            <button
              onClick={handleSendMessage}
              disabled={loading || !userInput.trim()}
              className="px-6 py-3 font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              style={{
                backgroundColor: colors.accent.primary,
                color: colors.text.onDark,
                fontSize: typography.sizes.md,
                fontWeight: typography.weights.medium
              }}
              onMouseEnter={(e) => {
                if (!loading && userInput.trim()) {
                  e.currentTarget.style.backgroundColor = colors.accent.primaryHover
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && userInput.trim()) {
                  e.currentTarget.style.backgroundColor = colors.accent.primary
                }
              }}
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
          <p style={{ 
            fontSize: typography.sizes.xs,
            color: colors.text.lightMuted,
            marginTop: spacing.scale.sm
          }}>
            Try: "What's trending in AI?", "Create a video about remote work", "Show me tech industry trends"
          </p>
        </div>
      </div>
    </div>
  )
}

export default LinkedInTools
