'use client';

export function DashboardHeader() {
  return (
    <header className="py-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-4 left-10 w-12 h-12 bg-yellow-200 rounded-full opacity-30 animate-float"></div>
        <div className="absolute top-8 right-20 w-8 h-8 bg-teal-200 rounded-full opacity-40 animate-bounce-gentle"></div>
        <div className="absolute bottom-4 left-1/3 w-10 h-10 bg-pink-200 rounded-full opacity-35 animate-float"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex items-center justify-between">
          {/* Left side - Mascot and welcome */}
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center text-3xl animate-bounce-gentle shadow-lg">
              🤖
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-purple-800 font-[var(--font-fredoka)]">
                Welcome Back, Explorer!
              </h1>
              <p className="text-lg text-purple-600 mt-1">
                Choose your adventure below
              </p>
            </div>
          </div>

          {/* Right side - Quick stats */}
          <div className="hidden md:flex items-center gap-4">
            <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-purple-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⭐</span>
                <div>
                  <div className="text-sm text-purple-600">Stars Earned</div>
                  <div className="text-xl font-bold text-purple-800 font-[var(--font-fredoka)]">47</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-purple-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏆</span>
                <div>
                  <div className="text-sm text-purple-600">Badges</div>
                  <div className="text-xl font-bold text-purple-800 font-[var(--font-fredoka)]">12</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}