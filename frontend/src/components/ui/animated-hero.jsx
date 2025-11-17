import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { FlipWords } from "@/components/ui/flip-words"

function AnimatedHero({ onGetStarted }) {
  const words = useMemo(
    () => ["social", "viral", "engaging", "powerful", "smart"],
    []
  )

  return (
    <div className="w-full relative z-10">
      <div className="max-w-[1120px] mx-auto px-6" style={{ paddingLeft: '80px', paddingRight: '80px', paddingTop: '56px' }}>
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-semibold" style={{ lineHeight: 1.05 }}>
              <span className="text-[#111827] inline-block">We build your </span>
              <FlipWords 
                words={words} 
                duration={2000}
                className="font-semibold text-[#111827] inline-block"
              />
              <span className="text-[#111827] inline-block"> content pipeline</span>
            </h1>
            <p className="text-lg md:text-xl leading-relaxed tracking-tight max-w-2xl text-center" style={{ 
              fontSize: '18px', 
              color: '#111827',
              lineHeight: 1.4
            }}>
              Transform Instagram videos and LinkedIn trends into high-performing content. 
              AI-powered analysis, generation, and distribution in one platform.
            </p>
          </div>
          <div className="flex flex-row gap-4">
            <Button 
              size="lg" 
              className="gap-4 bg-white text-black hover:bg-gray-100" 
              style={{ fontSize: '16px', fontWeight: 500 }}
              onClick={() => window.location.href = '/signup'}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              Start Creating
            </Button>
            <Button 
              size="lg" 
              className="gap-4 border border-[#111827] text-[#111827] bg-transparent hover:bg-[#111827] hover:text-white" 
              style={{ fontSize: '16px', fontWeight: 500 }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.backgroundColor = '#111827'
                e.currentTarget.style.color = 'white'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = '#111827'
              }}
            >
              View Demo
            </Button>
          </div>
          
          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-[#111827]/20 max-w-3xl mx-auto text-center">
            <div>
              <div className="text-3xl font-bold mb-1" style={{ color: '#111827' }}>5-16s</div>
              <div className="text-sm" style={{ color: '#4b5563' }}>Video Duration</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1" style={{ color: '#111827' }}>OpenAI</div>
              <div className="text-sm" style={{ color: '#4b5563' }}>Powered by GPT-4 & Sora</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1" style={{ color: '#111827' }}>Real-time</div>
              <div className="text-sm" style={{ color: '#4b5563' }}>Generation</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { AnimatedHero }

