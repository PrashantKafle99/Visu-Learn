"use client";

import { useState, useRef } from "react";

export function DashboardCards() {
  const [showSnapLearnPopup, setShowSnapLearnPopup] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    "choose" | "upload" | "camera" | "preview" | "subject" | "processing"
  >("choose");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handleUploadClick = () => {
    setCurrentStep("upload");
  };

  const handleFileSelect = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setSelectedImage(e.target?.result as string);
          setCurrentStep("preview");
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleCameraClick = () => {
    setCurrentStep("camera");
    startCamera();
  };

  const startCamera = async () => {
    try {
      setIsCapturing(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setIsCapturing(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL("image/png");
        setSelectedImage(imageData);

        // Stop camera stream
        const stream = video.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());

        setCurrentStep("preview");
        setIsCapturing(false);
      }
    }
  };

  const handleNext = () => {
    setCurrentStep('subject');
  };

  const handleSubjectSelect = (subject: string) => {
    setSelectedSubject(subject);
  };

  const handleGetStarted = async () => {
    setCurrentStep('processing');
    
    // Store data in localStorage to pass to next page
    localStorage.setItem('snapLearnData', JSON.stringify({
      image: selectedImage,
      subject: selectedSubject
    }));
    
    // Navigate to processing/loading screen
    window.location.href = '/snap-learn';
  };

  const closePopup = () => {
    setShowSnapLearnPopup(false);
    setCurrentStep("choose");
    setSelectedImage(null);
    setIsCapturing(false);
  };

  const features = [
    {
      icon: "📚",
      title: "Comic Mode",
      description: "Learn with interactive comics",
      longDescription:
        "Choose subjects, characters, and learn through interactive comics with voice-enabled conversations.",
      bgGradient: "from-purple-400 to-purple-600",
      accentColor: "bg-yellow-400",
      href: "/comic-mode",
    },
    {
      icon: "🖼️",
      title: "Story Mode",
      description: "Be the star of your own adventure",
      longDescription:
        "Upload your photo and become the main character in your personalized learning adventure.",
      bgGradient: "from-pink-400 to-purple-500",
      accentColor: "bg-teal-400",
      href: "/story-mode",
    },
    {
      icon: "📸",
      title: "Snap & Learn",
      description: "Snap your world and learn from it",
      longDescription:
        "Take photos of real objects and watch them come alive with interactive explanations.",
      bgGradient: "from-teal-400 to-purple-500",
      accentColor: "bg-pink-400",
      href: "/snap-learn",
    },
  ];

  return (
    <section className="py-12 relative">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-20 h-20 bg-purple-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute bottom-20 left-10 w-16 h-16 bg-pink-200 rounded-full opacity-20 animate-bounce-gentle"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
              onClick={() => {
                if (feature.href === "/snap-learn") {
                  setShowSnapLearnPopup(true);
                } else {
                  // Navigate to other feature pages
                  window.location.href = feature.href;
                }
              }}
            >
              <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-4 border-purple-100 hover:border-purple-300 h-full">
                {/* Feature icon with gradient background */}
                <div
                  className={`w-24 h-24 bg-gradient-to-br ${feature.bgGradient} rounded-3xl flex items-center justify-center text-4xl mb-6 mx-auto group-hover:animate-bounce-gentle shadow-lg`}
                >
                  {feature.icon}
                </div>

                {/* Feature title */}
                <h3 className="text-2xl font-bold text-purple-800 mb-4 text-center font-[var(--font-fredoka)]">
                  {feature.title}
                </h3>

                {/* Feature description */}
                <p className="text-purple-600 text-center leading-relaxed mb-6 font-medium">
                  {feature.description}
                </p>

                {/* Detailed description */}
                <p className="text-purple-500 text-sm text-center leading-relaxed mb-6">
                  {feature.longDescription}
                </p>

                {/* Action button */}
                <div className="text-center">
                  <button
                    className={`bg-gradient-to-r ${feature.bgGradient} text-white font-bold py-3 px-6 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-[var(--font-fredoka)]`}
                  >
                    Start Learning!
                  </button>
                </div>

                {/* Decorative accent */}
                <div
                  className={`w-16 h-2 ${feature.accentColor} rounded-full mx-auto mt-4`}
                ></div>
              </div>

              {/* Floating elements around each card */}
              <div className="relative">
                <div
                  className={`absolute -top-4 -right-4 w-8 h-8 ${feature.accentColor} rounded-full opacity-60 animate-float`}
                ></div>
                <div
                  className={`absolute -bottom-4 -left-4 w-6 h-6 ${feature.accentColor} rounded-full opacity-40 animate-bounce-gentle`}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Snap & Learn Popup - appears right on the dashboard */}
        {showSnapLearnPopup && (
          <div className="fixed inset-0 bg-purple-900 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border-4 border-purple-100 relative animate-slideIn">
              {/* Close button */}
              <button
                onClick={closePopup}
                className="absolute top-4 right-4 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 hover:bg-purple-200 transition-all duration-300"
              >
                ✕
              </button>

              {/* Dynamic content based on current step */}
              {currentStep === "choose" && (
                <>
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-purple-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 animate-bounce-gentle">
                      📸
                    </div>
                    <h2 className="text-2xl font-bold text-purple-800 mb-2 font-[var(--font-fredoka)]">
                      Choose Your Method
                    </h2>
                    <p className="text-purple-600">
                      How would you like to capture an image?
                    </p>
                  </div>

                  <div className="space-y-4">
                    <button
                      onClick={handleUploadClick}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-5 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center text-2xl group-hover:animate-bounce-gentle">
                          📁
                        </div>
                        <div className="text-left">
                          <h3 className="text-lg font-bold font-[var(--font-fredoka)]">
                            Upload Image
                          </h3>
                          <p className="text-sm opacity-90">
                            Choose a photo from your device
                          </p>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={handleCameraClick}
                      className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white p-5 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center text-2xl group-hover:animate-bounce-gentle">
                          📷
                        </div>
                        <div className="text-left">
                          <h3 className="text-lg font-bold font-[var(--font-fredoka)]">
                            Take Photo
                          </h3>
                          <p className="text-sm opacity-90">
                            Use your camera to capture live
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>
                </>
              )}

              {currentStep === "upload" && (
                <>
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 animate-bounce-gentle">
                      📁
                    </div>
                    <h2 className="text-2xl font-bold text-purple-800 mb-2 font-[var(--font-fredoka)]">
                      Upload Your Image
                    </h2>
                    <p className="text-purple-600 mb-6">
                      Select a photo from your device to start learning!
                    </p>
                  </div>

                  <div className="space-y-4">
                    <button
                      onClick={handleFileSelect}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-5 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      <div className="text-center">
                        <div className="text-3xl mb-2">📷</div>
                        <h3 className="text-lg font-bold font-[var(--font-fredoka)]">
                          Choose Image
                        </h3>
                      </div>
                    </button>

                    <button
                      onClick={() => setCurrentStep("choose")}
                      className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 p-4 rounded-2xl transition-all duration-300"
                    >
                      ← Back to Options
                    </button>
                  </div>
                </>
              )}

              {currentStep === "camera" && (
                <>
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-purple-800 mb-2 font-[var(--font-fredoka)]">
                      📷 Camera Capture
                    </h2>
                    <p className="text-purple-600">
                      Position your camera and click capture!
                    </p>
                  </div>

                  <div className="mb-6">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-64 bg-gray-200 rounded-2xl object-cover"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                  </div>

                  <div className="space-y-4">
                    <button
                      onClick={captureImage}
                      disabled={!isCapturing}
                      className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white p-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
                    >
                      📸 Capture Image
                    </button>

                    <button
                      onClick={() => setCurrentStep("choose")}
                      className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 p-4 rounded-2xl transition-all duration-300"
                    >
                      ← Back to Options
                    </button>
                  </div>
                </>
              )}

              {currentStep === "preview" && (
                <>
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-purple-800 mb-2 font-[var(--font-fredoka)]">
                      ✨ Perfect!
                    </h2>
                    <p className="text-purple-600">
                      Your image is ready for learning magic!
                    </p>
                  </div>

                  {selectedImage && (
                    <div className="mb-6">
                      <img
                        src={selectedImage}
                        alt="Selected"
                        className="w-full h-64 object-cover rounded-2xl shadow-lg"
                      />
                    </div>
                  )}

                  <div className="space-y-4">
                    <button
                      onClick={handleNext}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold p-5 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-2">➡️</div>
                        <h3 className="text-lg font-[var(--font-fredoka)]">
                          Next
                        </h3>
                      </div>
                    </button>

                    <button
                      onClick={() => setCurrentStep("choose")}
                      className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 p-4 rounded-2xl transition-all duration-300"
                    >
                      ← Choose Different Image
                    </button>
                  </div>
                </>
              )}

              {currentStep === "subject" && (
                <>
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 animate-bounce-gentle">
                      📚
                    </div>
                    <h2 className="text-2xl font-bold text-purple-800 mb-2 font-[var(--font-fredoka)]">
                      Choose Your Subject
                    </h2>
                    <p className="text-purple-600">
                      What would you like to learn about?
                    </p>
                  </div>

                  <div className="space-y-3 mb-6">
                    {['Physics', 'Mathematics', 'Chemistry', 'Biology', 'Geography', 'History'].map((subject) => (
                      <button
                        key={subject}
                        onClick={() => handleSubjectSelect(subject)}
                        className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 ${
                          selectedSubject === subject
                            ? 'bg-purple-500 text-white border-purple-500 shadow-lg'
                            : 'bg-white text-purple-700 border-purple-200 hover:border-purple-400 hover:bg-purple-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">
                            {subject === 'Physics' && '⚡'}
                            {subject === 'Mathematics' && '🔢'}
                            {subject === 'Chemistry' && '🧪'}
                            {subject === 'Biology' && '🌱'}
                            {subject === 'Geography' && '🌍'}
                            {subject === 'History' && '📜'}
                          </div>
                          <span className="font-bold font-[var(--font-fredoka)]">{subject}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <button
                      onClick={handleGetStarted}
                      disabled={!selectedSubject}
                      className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-purple-800 font-bold p-5 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-glow disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-2">🚀</div>
                        <h3 className="text-lg font-[var(--font-fredoka)]">Get Started!</h3>
                      </div>
                    </button>

                    <button
                      onClick={() => setCurrentStep('preview')}
                      className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 p-4 rounded-2xl transition-all duration-300"
                    >
                      ← Back to Image
                    </button>
                  </div>
                </>
              )}

              {currentStep === "processing" && (
                <>
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 animate-bounce-gentle">
                      ✨
                    </div>
                    <h2 className="text-2xl font-bold text-purple-800 mb-2 font-[var(--font-fredoka)]">
                      Magic is Happening!
                    </h2>
                    <p className="text-purple-600 mb-6">
                      Are you ready? We&apos;re analyzing your image...
                    </p>
                  </div>

                  {selectedImage && (
                    <div className="mb-6 relative">
                      <img
                        src={selectedImage}
                        alt="Processing"
                        className="w-full h-64 object-cover rounded-2xl shadow-lg"
                      />
                      {/* Scanning animation */}
                      <div className="absolute inset-0 rounded-2xl overflow-hidden">
                        <div className="absolute w-full h-1 bg-green-400 opacity-80 animate-pulse" 
                             style={{
                               animation: 'scan 3s ease-in-out infinite',
                               boxShadow: '0 0 20px rgba(34, 197, 94, 0.8)'
                             }}>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="text-center">
                    <div className="text-lg text-purple-700 font-medium mb-4">
                      🔍 Scanning for {selectedSubject} concepts...
                    </div>
                    <div className="flex justify-center space-x-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </>
              )}

              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-400 rounded-full opacity-60 animate-float"></div>
              <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-pink-400 rounded-full opacity-60 animate-bounce-gentle"></div>
              <div className="absolute top-1/2 -right-6 w-4 h-4 bg-teal-400 rounded-full opacity-50 animate-float"></div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
