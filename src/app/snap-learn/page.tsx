"use client";

import { useEffect, useState } from "react";

interface AnalysisResult {
  concept: {
    name: string;
    explanation: string;
  };
  visual_edits: {
    arrows: Array<{
      direction: string;
      position: string;
      color: string;
      purpose: string;
    }>;
    highlights: Array<{
      area: string;
      color: string;
      style: string;
      purpose: string;
    }>;
    labels: Array<{
      text: string;
      position: string;
      color: string;
      purpose: string;
    }>;
  };
}

export default function SnapLearn() {
  const [isLoading, setIsLoading] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [snapLearnData, setSnapLearnData] = useState<{
    image: string;
    subject: string;
  } | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [isEnhancingImage, setIsEnhancingImage] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null
  );
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [imageReady, setImageReady] = useState(false);

  useEffect(() => {
    // Get data from localStorage
    const data = localStorage.getItem("snapLearnData");
    if (data) {
      const parsedData = JSON.parse(data);
      setSnapLearnData(parsedData);

      // Call API to analyze image
      analyzeImage(parsedData.image, parsedData.subject);
    } else {
      setError("No image data found");
      setIsLoading(false);
    }
  }, []);

  // Effect to handle transition when both audio and image are ready
  useEffect(() => {
    if (audioReady && imageReady && isLoading) {
      // Both are ready, stop loading and play audio after 2 seconds
      setIsLoading(false);
      setTimeout(() => {
        if (audioElement) {
          audioElement.play();
        }
      }, 2000);
    }
  }, [audioReady, imageReady, isLoading, audioElement]);

  const analyzeImage = async (image: string, subject: string) => {
    try {
      const response = await fetch("/api/analyze-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image, subject }),
      });

      const data = await response.json();

      if (data.success) {
        setAnalysisResult(data.analysis);
        console.log("📊 Analysis Result:", data.analysis);

        // Run TTS and image enhancement in parallel for faster processing
        const startTime = performance.now();
        console.log("🚀 Starting parallel API calls: TTS + Image Enhancement");

        Promise.all([
          generateAudio(data.analysis.concept.explanation),
          enhanceImage(image, data.analysis.visual_edits),
        ])
          .then(() => {
            const endTime = performance.now();
            const totalTime = ((endTime - startTime) / 1000).toFixed(2);
            console.log(
              `✅ Both parallel API calls completed in ${totalTime} seconds`
            );
          })
          .catch((error) => {
            console.error("❌ Error in parallel API calls:", error);
          });
      } else {
        setError(data.error || "Failed to analyze image");
      }
    } catch (err) {
      setError("Network error occurred");
      setIsLoading(false);
    }
  };

  const generateAudio = async (text: string) => {
    const startTime = performance.now();
    setIsGeneratingAudio(true);
    console.log("🔊 Starting TTS API call...");
    try {
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);

        // Create audio element but don't play yet
        const audio = new Audio(audioUrl);
        audio.addEventListener("play", () => setIsAudioPlaying(true));
        audio.addEventListener("ended", () => setIsAudioPlaying(false));
        audio.addEventListener("pause", () => setIsAudioPlaying(false));

        setAudioElement(audio);
        setAudioReady(true);

        const endTime = performance.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);
        console.log(`🔊 Audio generated and ready in ${duration} seconds`);
      } else {
        console.error("Failed to generate audio");
        setAudioReady(true); // Still mark as ready even if failed
      }
    } catch (err) {
      console.error("Error generating audio:", err);
      setAudioReady(true); // Still mark as ready even if failed
    } finally {
      const endTime = performance.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      console.log(`🔊 TTS API call completed in ${duration} seconds`);
      setIsGeneratingAudio(false);
    }
  };

  const enhanceImage = async (image: string, visualEdits: any) => {
    const startTime = performance.now();
    setIsEnhancingImage(true);
    console.log("🎨 Starting Image Enhancement API call...");
    try {
      const response = await fetch("/api/enhance-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image, visualEdits }),
      });

      const data = await response.json();

      if (data.success) {
        setEnhancedImage(data.enhancedImage);
        setImageReady(true);

        const endTime = performance.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);
        console.log(`🎨 Image enhanced successfully in ${duration} seconds`);
      } else {
        console.error("Failed to enhance image:", data.error);
        setImageReady(true); // Still mark as ready even if failed
      }
    } catch (err) {
      console.error("Error enhancing image:", err);
      setImageReady(true); // Still mark as ready even if failed
    } finally {
      const endTime = performance.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      console.log(
        `🎨 Image Enhancement API call completed in ${duration} seconds`
      );
      setIsEnhancingImage(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-pink-100 flex items-center justify-center relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400 rounded-full opacity-20 animate-float"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-teal-400 rounded-full opacity-20 animate-bounce-gentle"></div>
          <div className="absolute bottom-40 left-20 w-24 h-24 bg-pink-400 rounded-full opacity-20 animate-float"></div>
        </div>

        <div className="text-center relative z-10 max-w-md mx-auto px-6">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6 animate-bounce-gentle shadow-2xl">
              ✨
            </div>
            <h1 className="text-3xl font-bold text-purple-800 mb-4 font-[var(--font-fredoka)]">
              Magic is Happening!
            </h1>
            <p className="text-xl text-purple-600 mb-8">
              We're analyzing your image for {snapLearnData?.subject}{" "}
              concepts...
            </p>
          </div>

          {snapLearnData?.image && (
            <div className="mb-8 relative">
              <img
                src={snapLearnData.image}
                alt="Analyzing"
                className="w-full h-64 object-cover rounded-3xl shadow-2xl"
              />
              {/* Scanning animation */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden">
                <div
                  className="absolute w-full h-2 bg-green-400 opacity-80"
                  style={{
                    animation: "scan 2s ease-in-out infinite",
                    boxShadow: "0 0 20px rgba(34, 197, 94, 0.8)",
                  }}
                ></div>
              </div>
            </div>
          )}

          <div className="text-center">
            <div className="text-lg text-purple-700 font-medium mb-4 font-[var(--font-fredoka)]">
              🔍 Discovering amazing {snapLearnData?.subject} concepts...
            </div>
            <div className="flex justify-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
              <div
                className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-pink-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-24 h-24 bg-gradient-to-br from-red-400 to-pink-500 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-2xl">
            ❌
          </div>
          <h1 className="text-3xl font-bold text-purple-800 mb-4 font-[var(--font-fredoka)]">
            Oops! Something went wrong
          </h1>
          <p className="text-xl text-purple-600 mb-8">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            ← Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-pink-100 py-8">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-800 mb-4 font-[var(--font-fredoka)]">
            🎉 Amazing Discovery!
          </h1>
          <p className="text-xl text-purple-600">
            Here's what we found in your {snapLearnData?.subject} image:
          </p>
        </div>

        {/* Results Display */}
        {analysisResult && (
          <div className="space-y-8">
            {/* Concept Explanation */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-purple-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center text-3xl animate-bounce-gentle">
                  🧠
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-purple-800 font-[var(--font-fredoka)]">
                    {analysisResult.concept.name}
                  </h2>
                  <p className="text-purple-600">Concept Discovered!</p>
                </div>
              </div>
              <p className="text-lg text-purple-700 leading-relaxed mb-6">
                {analysisResult.concept.explanation}
              </p>

              {/* Audio Visualization */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <button
                    onClick={() => {
                      if (audioElement) {
                        audioElement.currentTime = 0; // Reset to beginning
                        audioElement.play();
                      }
                    }}
                    className={`w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center text-2xl cursor-pointer hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl ${
                      isAudioPlaying ? "animate-audioPulse" : ""
                    }`}
                    disabled={!audioElement}
                  >
                    🔊
                  </button>
                  <div>
                    <h4 className="text-lg font-bold text-purple-800 font-[var(--font-fredoka)]">
                      Audio Explanation
                    </h4>
                    <p className="text-purple-600 text-sm">
                      {isGeneratingAudio
                        ? "Generating audio..."
                        : isAudioPlaying
                        ? "Playing explanation..."
                        : "Click speaker to replay audio"}
                    </p>
                  </div>
                </div>

                {/* Audio Visualization */}
                <div className="flex items-center justify-center gap-1 h-16 mb-4">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 bg-gradient-to-t from-purple-400 to-pink-400 rounded-full ${
                        isAudioPlaying ? "animate-audioWave" : "h-4"
                      }`}
                      style={{
                        height: isAudioPlaying
                          ? `${Math.random() * 40 + 20}px`
                          : "16px",
                        animationDelay: `${i * 0.1}s`,
                      }}
                    ></div>
                  ))}
                </div>

                {isGeneratingAudio && (
                  <div className="flex items-center gap-2 text-purple-600 justify-center">
                    <div className="w-4 h-4 bg-purple-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-4 h-4 bg-purple-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-4 h-4 bg-purple-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <span className="ml-2">Creating audio explanation...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Image Comparison */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-purple-100">
              <h3 className="text-2xl font-bold text-purple-800 mb-6 font-[var(--font-fredoka)] text-center">
                📸 Image Comparison
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Original Image */}
                <div>
                  <h4 className="text-lg font-bold text-purple-700 mb-3 font-[var(--font-fredoka)] text-center">
                    Original Image
                  </h4>
                  {snapLearnData?.image && (
                    <img
                      src={snapLearnData.image}
                      alt="Original Image"
                      className="w-full max-h-64 object-contain rounded-2xl shadow-lg mx-auto border-2 border-purple-200"
                    />
                  )}
                </div>

                {/* Enhanced Image */}
                <div>
                  <h4 className="text-lg font-bold text-purple-700 mb-3 font-[var(--font-fredoka)] text-center">
                    Enhanced Image
                  </h4>
                  {enhancedImage ? (
                    <img
                      src={enhancedImage}
                      alt="Enhanced Image"
                      className="w-full max-h-64 object-contain rounded-2xl shadow-lg mx-auto border-2 border-green-300"
                    />
                  ) : isEnhancingImage ? (
                    <div className="w-full h-64 bg-purple-50 rounded-2xl flex items-center justify-center border-2 border-purple-200">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center text-2xl mx-auto mb-4 animate-bounce-gentle">
                          🎨
                        </div>
                        <p className="text-purple-600 font-medium">
                          Enhancing image...
                        </p>
                        <div className="flex justify-center space-x-1 mt-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-64 bg-gray-100 rounded-2xl flex items-center justify-center border-2 border-gray-200">
                      <p className="text-gray-500">
                        Enhanced image will appear here
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Back Button */}
            <div className="text-center">
              <button
                onClick={() => window.history.back()}
                className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-[var(--font-fredoka)]"
              >
                ← Try Another Image
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
