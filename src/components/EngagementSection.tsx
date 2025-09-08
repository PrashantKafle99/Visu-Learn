'use client';

export function EngagementSection() {
  const reasons = [
    {
      icon: "⭐",
      title: "Learn with your favorite characters",
      description: "Meet superheroes, animals, and magical friends who make learning fun!",
      bgColor: "from-yellow-400 to-orange-400"
    },
    {
      icon: "🎮", 
      title: "Turn your own world into a comic",
      description: "Upload your photo and become the main character in your learning adventure!",
      bgColor: "from-purple-400 to-pink-400"
    },
    {
      icon: "🎨",
      title: "Play games, win stars, and unlock fun badges", 
      description: "Complete challenges, earn rewards, and show off your achievements!",
      bgColor: "from-teal-400 to-blue-400"
    },
    {
      icon: "🦸",
      title: "Become a learning superhero",
      description: "Discover amazing facts about science, math, history, and so much more!",
      bgColor: "from-green-400 to-emerald-400"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-purple-50 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-10 left-1/4 w-20 h-20 bg-purple-200 rounded-full opacity-30 animate-float"></div>
        <div className="absolute bottom-20 right-1/4 w-16 h-16 bg-pink-200 rounded-full opacity-30 animate-bounce-gentle"></div>
        <div className="absolute top-1/2 left-10 w-12 h-12 bg-yellow-200 rounded-full opacity-40 animate-float"></div>
        <div className="absolute top-1/3 right-10 w-14 h-14 bg-teal-200 rounded-full opacity-35 animate-bounce-gentle"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-purple-800 mb-6 font-[var(--font-fredoka)]">
            Why Kids Love VisuLearn
          </h2>
          <p className="text-xl text-purple-600 max-w-3xl mx-auto leading-relaxed">
            Join thousands of kids who are already having amazing adventures while learning!
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {reasons.map((reason, index) => (
            <div key={index} className="group hover:scale-105 transition-all duration-300">
              <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-purple-100 hover:border-purple-300 text-center h-full">
                <div className={`w-16 h-16 bg-gradient-to-br ${reason.bgColor} rounded-2xl flex items-center justify-center text-3xl mb-4 mx-auto group-hover:animate-bounce-gentle shadow-lg`}>
                  {reason.icon}
                </div>
                <h3 className="text-lg font-bold text-purple-800 mb-3 font-[var(--font-fredoka)] leading-tight">
                  {reason.title}
                </h3>
                <p className="text-purple-600 text-sm leading-relaxed">
                  {reason.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-8 text-white text-center shadow-2xl">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="animate-bounce-gentle">
              <div className="text-4xl font-bold mb-2 font-[var(--font-fredoka)]">10,000+</div>
              <div className="text-lg">Happy Kids Learning</div>
            </div>
            <div className="animate-float">
              <div className="text-4xl font-bold mb-2 font-[var(--font-fredoka)]">500+</div>
              <div className="text-lg">Interactive Comics</div>
            </div>
            <div className="animate-bounce-gentle">
              <div className="text-4xl font-bold mb-2 font-[var(--font-fredoka)]">50+</div>
              <div className="text-lg">Learning Topics</div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white rounded-3xl p-8 shadow-xl max-w-2xl mx-auto border-4 border-purple-100">
            <div className="text-6xl mb-4 animate-bounce-gentle">😊</div>
            <p className="text-xl text-purple-700 font-medium mb-4 font-[var(--font-fredoka)]">
              &quot;My kids can&apos;t stop talking about their comic adventures!&quot;
            </p>
            <p className="text-purple-600">- Happy Parent</p>
            <div className="flex justify-center mt-4 space-x-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-2xl text-yellow-400 animate-bounce-gentle" style={{animationDelay: `${i * 0.1}s`}}>⭐</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}