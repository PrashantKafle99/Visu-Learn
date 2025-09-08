'use client';

export function FeaturesSection() {
  const features = [
    {
      icon: "📚",
      title: "Comic Mode",
      description: "Choose subjects, characters, and learn through interactive comics.",
      bgColor: "from-purple-400 to-purple-600",
      accentColor: "bg-yellow-400"
    },
    {
      icon: "🖼️",
      title: "Story Mode", 
      description: "Upload your photo and become the hero of your own learning adventure.",
      bgColor: "from-pink-400 to-purple-500",
      accentColor: "bg-teal-400"
    },
    {
      icon: "📸",
      title: "Snap & Learn",
      description: "Snap the world around you and watch concepts come alive.",
      bgColor: "from-teal-400 to-purple-500",
      accentColor: "bg-pink-400"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-purple-50 to-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-pink-200 rounded-full opacity-20 animate-bounce-gentle"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-purple-800 mb-4 font-[var(--font-fredoka)]">
            Three Amazing Ways to Learn!
          </h2>
          <p className="text-xl text-purple-600 max-w-2xl mx-auto">
            Pick your favorite way to explore and discover new things every day
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-4 border-purple-100 hover:border-purple-300">
                {/* Feature icon */}
                <div className={`w-20 h-20 bg-gradient-to-br ${feature.bgColor} rounded-2xl flex items-center justify-center text-4xl mb-6 mx-auto group-hover:animate-bounce-gentle`}>
                  {feature.icon}
                </div>
                
                {/* Feature title */}
                <h3 className="text-2xl font-bold text-purple-800 mb-4 text-center font-[var(--font-fredoka)]">
                  {feature.title}
                </h3>
                
                {/* Feature description */}
                <p className="text-purple-600 text-center leading-relaxed mb-6">
                  {feature.description}
                </p>
                
                {/* Decorative accent */}
                <div className={`w-12 h-2 ${feature.accentColor} rounded-full mx-auto`}></div>
              </div>
              
              {/* Floating elements around each card */}
              <div className="relative">
                <div className={`absolute -top-4 -right-4 w-8 h-8 ${feature.accentColor} rounded-full opacity-60 animate-float`}></div>
                <div className={`absolute -bottom-4 -left-4 w-6 h-6 ${feature.accentColor} rounded-full opacity-40 animate-bounce-gentle`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}