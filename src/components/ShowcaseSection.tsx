'use client';

export function ShowcaseSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-100 via-pink-50 to-purple-50 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-40 h-40 bg-yellow-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute bottom-20 left-20 w-32 h-32 bg-teal-200 rounded-full opacity-20 animate-bounce-gentle"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-purple-800 mb-4 font-[var(--font-fredoka)]">
            See VisuLearn in Action!
          </h2>
          <p className="text-xl text-purple-600 max-w-2xl mx-auto">
            Watch how learning comes alive through interactive comics and stories
          </p>
        </div>

        {/* Comic strip mockup */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-purple-200">
            <div className="grid md:grid-cols-3 gap-6">
              
              {/* Panel 1 */}
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl p-6 relative">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl animate-bounce-gentle">
                    🧑‍🚀
                  </div>
                  <div className="bg-white rounded-xl p-3 relative mb-4">
                    <p className="text-purple-800 font-bold text-sm font-[var(--font-fredoka)]">
                      &quot;What makes plants grow?&quot;
                    </p>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white rotate-45"></div>
                  </div>
                  <div className="text-xs text-purple-600 font-medium">Tap to ask questions!</div>
                </div>
                
                {/* Interactive arrow */}
                <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 text-2xl animate-bounce-gentle">
                  ➡️
                </div>
              </div>

              {/* Panel 2 */}
              <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-2xl p-6 relative">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl animate-float">
                    🌱
                  </div>
                  <div className="bg-white rounded-xl p-3 relative mb-4">
                    <p className="text-green-800 font-bold text-sm font-[var(--font-fredoka)]">
                      &quot;Plants need sunlight, water, and nutrients!&quot;
                    </p>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white rotate-45"></div>
                  </div>
                  <div className="text-xs text-green-600 font-medium">Learn with characters!</div>
                </div>
                
                <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 text-2xl animate-bounce-gentle">
                  ➡️
                </div>
              </div>

              {/* Panel 3 */}
              <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl p-6 relative">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl animate-bounce-gentle">
                    🏆
                  </div>
                  <div className="bg-white rounded-xl p-3 relative mb-4">
                    <p className="text-yellow-800 font-bold text-sm font-[var(--font-fredoka)]">
                      &quot;Great job! You earned a star!&quot;
                    </p>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white rotate-45"></div>
                  </div>
                  <div className="text-xs text-yellow-600 font-medium">Win rewards & badges!</div>
                </div>
              </div>
            </div>

            {/* Interactive elements showcase */}
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <div className="bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold animate-glow">
                💬 Talk to Characters
              </div>
              <div className="bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold animate-glow">
                🎮 Interactive Quizzes
              </div>
              <div className="bg-teal-500 text-white px-4 py-2 rounded-full text-sm font-bold animate-glow">
                📱 Snap & Discover
              </div>
            </div>
          </div>
        </div>

        {/* Call-to-action arrows and text */}
        <div className="text-center mt-12">
          <div className="text-6xl animate-bounce-gentle mb-4">⬇️</div>
          <p className="text-2xl font-bold text-purple-700 font-[var(--font-fredoka)]">
            Try it yourself!
          </p>
        </div>
      </div>
    </section>
  );
}