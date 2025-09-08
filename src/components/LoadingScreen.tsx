"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from "next/navigation";

export function LoadingScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const loadingTexts = [
    "Drawing your comic world...",
    "Getting characters ready...",
    "Adding some magic sparkle...",
    "Almost there, adventure awaits!",
  ];

  useEffect(() => {
    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          // Navigate to dashboard after loading completes
          setTimeout(() => {
            router.push("/dashboard");
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    // Text rotation animation
    const textInterval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 2500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
    };
  }, [router, loadingTexts.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-200 to-pink-200 flex items-center justify-center relative overflow-hidden">
      {/* Floating background doodles */}
      <div className="absolute inset-0">
        {/* Comic bubbles */}
        <div className="absolute top-20 left-10 w-16 h-12 bg-white rounded-full opacity-30 animate-float">
          <div className="absolute bottom-0 left-4 w-3 h-3 bg-white rounded-full"></div>
        </div>
        <div className="absolute top-40 right-20 w-12 h-8 bg-white rounded-full opacity-25 animate-bounce-gentle">
          <div className="absolute bottom-0 right-2 w-2 h-2 bg-white rounded-full"></div>
        </div>

        {/* Floating pencils */}
        <div className="absolute top-60 left-1/4 text-3xl opacity-40 animate-float">
          ✏️
        </div>
        <div className="absolute bottom-40 right-1/3 text-2xl opacity-35 animate-bounce-gentle">
          🖍️
        </div>

        {/* Stars */}
        <div className="absolute top-32 right-1/4 text-2xl opacity-50 animate-float">
          ⭐
        </div>
        <div className="absolute bottom-60 left-1/3 text-xl opacity-45 animate-bounce-gentle">
          ✨
        </div>
        <div className="absolute top-2/3 left-20 text-lg opacity-40 animate-float">
          🌟
        </div>

        {/* Mini robots */}
        <div className="absolute bottom-32 right-20 text-2xl opacity-40 animate-bounce-gentle">
          🤖
        </div>
        <div className="absolute top-1/2 left-16 text-xl opacity-35 animate-float">
          🦾
        </div>

        {/* Additional doodles */}
        <div className="absolute top-80 right-40 text-xl opacity-30 animate-bounce-gentle">
          📚
        </div>
        <div className="absolute bottom-20 left-40 text-lg opacity-35 animate-float">
          🎨
        </div>
      </div>

      {/* Main loading content */}
      <div className="text-center relative z-10 max-w-md mx-auto px-6">
        {/* Central loading image */}
        <div className="mb-8 relative">
          <div className="w-48 h-48 mx-auto relative">
            {/* Glowing aura */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-3xl blur-xl opacity-30 animate-glow"></div>

            {/* Main image container */}
            <div className="relative w-full h-full rounded-3xl shadow-2xl overflow-hidden">
              <img
                src="/loading.png"
                alt="VisuLearn Loading"
                className="w-full h-full object-cover rounded-3xl"
                onError={(e) => {
                  // Fallback if image doesn't exist
                  e.currentTarget.style.display = "none";
                  const fallback = e.currentTarget
                    .nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = "flex";
                }}
              />
              {/* Fallback content */}
              <div className="w-full h-full bg-gradient-to-br from-yellow-300 to-orange-400 rounded-3xl hidden items-center justify-center text-6xl">
                📚
              </div>
            </div>
          </div>
        </div>

        {/* Main caption */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold gradient-text mb-2 font-[var(--font-fredoka)]">
            ✨ VisuLearn is preparing your adventure...
          </h1>
        </div>

        {/* Loading progress bar */}
        <div className="mb-8">
          <div className="w-full bg-white bg-opacity-50 rounded-full h-4 shadow-inner">
            <div
              className="bg-gradient-to-r from-purple-400 to-pink-400 h-4 rounded-full transition-all duration-300 ease-out shadow-lg animate-glow"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Loading label */}
        <div className="mb-8">
          <p className="text-xl font-bold gradient-text animate-bounce-gentle font-[var(--font-fredoka)]">
            Loading...
          </p>
        </div>

        {/* Rotating gradient texts */}
        <div className="mb-20 h-8">
          <p
            key={currentTextIndex}
            className="text-lg font-medium gradient-text animate-bounce-gentle font-[var(--font-fredoka)] transition-all duration-500"
          >
            {loadingTexts[currentTextIndex]}
          </p>
        </div>

        {/* Footer accent */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full">
          <p className="text-sm gradient-text font-medium animate-float">
            ✨ Powered by fun, imagination, and AI magic.
          </p>
        </div>
      </div>
    </div>
  );
}
