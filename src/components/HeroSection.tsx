"use client";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-50 via-purple-100 to-pink-100">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-teal-400 rounded-full opacity-20 animate-bounce-gentle"></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-pink-400 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-60 left-1/3 w-12 h-12 bg-purple-400 rounded-full opacity-30 animate-bounce-gentle"></div>
        <div className="absolute bottom-60 right-1/3 w-18 h-18 bg-yellow-400 rounded-full opacity-25 animate-float"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left side - Text content */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 font-[var(--font-fredoka)]">
              <span className="gradient-text">Learn Through</span>
              <br />
              <span className="text-purple-700">Comics, Stories</span>
              <br />
              <span className="text-purple-600">& Fun!</span>
            </h1>

            <p className="text-xl lg:text-2xl text-purple-700 mb-8 font-medium leading-relaxed">
              Discover, play, and explore your world with interactive comics,
              fun quizzes, and Snap & Learn magic.
            </p>

            <a href="/loading">
              <button className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-glow font-[var(--font-fredoka)]">
                🚀 Get Started
              </button>
            </a>
          </div>

          {/* Right side - Hero illustration */}
          <div className="flex-1 relative">
            <div className="relative w-full max-w-lg mx-auto">
              {/* Main hero image */}
              <div className="relative animate-float">
                <img
                  src="/heromain.png"
                  alt="VisuLearn Hero - Kids learning through comics and interactive stories"
                  className="w-full h-auto rounded-3xl shadow-2xl"
                />

                {/* Interactive elements around the image */}
                <div className="absolute -top-4 -right-4 bg-yellow-400 rounded-full p-3 animate-bounce-gentle shadow-lg">
                  <span className="text-2xl">⭐</span>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-teal-400 rounded-full p-3 animate-float shadow-lg">
                  <span className="text-2xl">📚</span>
                </div>
                <div className="absolute top-1/2 -left-6 bg-pink-400 rounded-full p-2 animate-bounce-gentle shadow-lg">
                  <span className="text-xl">🎨</span>
                </div>
                <div className="absolute top-1/4 -right-6 bg-purple-400 rounded-full p-2 animate-float shadow-lg">
                  <span className="text-xl">🚀</span>
                </div>
              </div>

              {/* Floating learning elements */}
              <div className="absolute top-10 -left-8 bg-white rounded-xl p-3 shadow-lg animate-float">
                <span className="text-2xl">🧮</span>
              </div>
              <div className="absolute bottom-20 -right-8 bg-white rounded-xl p-3 shadow-lg animate-bounce-gentle">
                <span className="text-2xl">🌍</span>
              </div>
              <div className="absolute top-16 right-4 bg-white rounded-xl p-2 shadow-lg animate-float">
                <span className="text-xl">✨</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
