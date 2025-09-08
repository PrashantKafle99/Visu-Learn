'use client';

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 relative overflow-hidden">
      {/* Floating stars background */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 text-3xl animate-float">⭐</div>
        <div className="absolute top-20 right-20 text-2xl animate-bounce-gentle">✨</div>
        <div className="absolute bottom-20 left-20 text-4xl animate-float">🌟</div>
        <div className="absolute bottom-10 right-10 text-2xl animate-bounce-gentle">⭐</div>
        <div className="absolute top-1/2 left-1/4 text-xl animate-float">✨</div>
        <div className="absolute top-1/3 right-1/3 text-3xl animate-bounce-gentle">🌟</div>
        <div className="absolute bottom-1/3 left-1/3 text-2xl animate-float">⭐</div>
        <div className="absolute top-2/3 right-1/4 text-xl animate-bounce-gentle">✨</div>
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="max-w-4xl mx-auto">
          
          {/* Main CTA heading */}
          <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6 font-[var(--font-fredoka)]">
            Ready to Start Your
            <br />
            <span className="text-yellow-300">Adventure?</span>
          </h2>
          
          <p className="text-xl lg:text-2xl text-purple-100 mb-12 leading-relaxed">
            Join the fun and discover a whole new way to learn! 
            Your comic book adventure is just one click away.
          </p>

          {/* Main CTA button */}
          <div className="mb-12">
            <a href="/loading">
              <button className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-purple-800 font-bold py-6 px-12 rounded-full text-2xl shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 animate-glow font-[var(--font-fredoka)] border-4 border-white">
                🚀 Get Started Now!
              </button>
            </a>
          </div>

          {/* Cute mascot character */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center text-6xl animate-bounce-gentle shadow-2xl border-4 border-white">
                🤖
              </div>
              
              {/* Speech bubble */}
              <div className="absolute -top-16 -right-8 bg-white rounded-2xl p-4 shadow-lg animate-float">
                <p className="text-purple-800 font-bold text-sm font-[var(--font-fredoka)] whitespace-nowrap">
                  Let's learn together!
                </p>
                <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white rotate-45"></div>
              </div>
              
              {/* Waving hand animation */}
              <div className="absolute -right-4 top-8 text-3xl animate-bounce-gentle">
                👋
              </div>
            </div>
          </div>

          {/* Additional encouragement */}
          <div className="bg-white bg-opacity-20 rounded-3xl p-8 backdrop-blur-sm border border-white border-opacity-30">
            <div className="grid md:grid-cols-3 gap-6 text-white">
              <div className="animate-float">
                <div className="text-3xl mb-2">🎯</div>
                <div className="font-bold font-[var(--font-fredoka)]">100% Free to Start</div>
                <div className="text-sm text-purple-100">No credit card needed</div>
              </div>
              <div className="animate-bounce-gentle">
                <div className="text-3xl mb-2">⚡</div>
                <div className="font-bold font-[var(--font-fredoka)]">Instant Access</div>
                <div className="text-sm text-purple-100">Start learning right away</div>
              </div>
              <div className="animate-float">
                <div className="text-3xl mb-2">🛡️</div>
                <div className="font-bold font-[var(--font-fredoka)]">Kid-Safe & Secure</div>
                <div className="text-sm text-purple-100">Designed for children</div>
              </div>
            </div>
          </div>

          {/* Final encouragement text */}
          <div className="mt-8">
            <p className="text-lg text-purple-100 font-medium">
              🌈 Your learning adventure starts here! 🌈
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}