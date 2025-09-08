'use client';

export function ProgressSection() {
  const badges = [
    { icon: "🌟", name: "First Comic", earned: true },
    { icon: "🎨", name: "Creative Explorer", earned: true },
    { icon: "📸", name: "Photo Detective", earned: true },
    { icon: "🦸", name: "Learning Hero", earned: false },
    { icon: "🚀", name: "Space Explorer", earned: false },
    { icon: "🔬", name: "Science Master", earned: false }
  ];

  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          
          {/* Progress Section */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-purple-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center text-2xl animate-bounce-gentle">
                ⭐
              </div>
              <h3 className="text-2xl font-bold text-purple-800 font-[var(--font-fredoka)]">
                Your Progress
              </h3>
            </div>
            
            {/* Progress bars */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-purple-700 font-medium">Comics Completed</span>
                  <span className="text-purple-600 text-sm">8/10</span>
                </div>
                <div className="w-full bg-purple-100 rounded-full h-3">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full" style={{width: '80%'}}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-purple-700 font-medium">Stories Created</span>
                  <span className="text-purple-600 text-sm">3/5</span>
                </div>
                <div className="w-full bg-purple-100 rounded-full h-3">
                  <div className="bg-gradient-to-r from-teal-400 to-blue-500 h-3 rounded-full" style={{width: '60%'}}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-purple-700 font-medium">Photos Snapped</span>
                  <span className="text-purple-600 text-sm">12/15</span>
                </div>
                <div className="w-full bg-purple-100 rounded-full h-3">
                  <div className="bg-gradient-to-r from-pink-400 to-purple-500 h-3 rounded-full" style={{width: '80%'}}></div>
                </div>
              </div>
            </div>
            
            {/* Overall level */}
            <div className="mt-6 text-center">
              <div className="text-4xl mb-2 animate-bounce-gentle">🏆</div>
              <div className="text-xl font-bold text-purple-800 font-[var(--font-fredoka)]">Level 5 Explorer</div>
              <div className="text-purple-600">Keep learning to reach Level 6!</div>
            </div>
          </div>

          {/* Rewards Section */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-purple-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center text-2xl animate-float">
                🎮
              </div>
              <h3 className="text-2xl font-bold text-purple-800 font-[var(--font-fredoka)]">
                Your Badges
              </h3>
            </div>
            
            {/* Badge grid */}
            <div className="grid grid-cols-3 gap-4">
              {badges.map((badge, index) => (
                <div 
                  key={index}
                  className={`relative p-4 rounded-2xl text-center transition-all duration-300 ${
                    badge.earned 
                      ? 'bg-gradient-to-br from-yellow-100 to-yellow-200 border-2 border-yellow-300 animate-bounce-gentle' 
                      : 'bg-gray-100 border-2 border-gray-200 opacity-50'
                  }`}
                >
                  <div className="text-3xl mb-2">{badge.icon}</div>
                  <div className={`text-xs font-medium ${badge.earned ? 'text-yellow-800' : 'text-gray-500'}`}>
                    {badge.name}
                  </div>
                  {badge.earned && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white">✓</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Next badge preview */}
            <div className="mt-6 p-4 bg-purple-50 rounded-2xl border-2 border-purple-200">
              <div className="text-center">
                <div className="text-2xl mb-2">🦸</div>
                <div className="text-sm font-bold text-purple-800 font-[var(--font-fredoka)]">Next Badge: Learning Hero</div>
                <div className="text-xs text-purple-600">Complete 2 more comics to unlock!</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}