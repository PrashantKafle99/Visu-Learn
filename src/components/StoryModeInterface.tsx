'use client';

import { useState, useRef } from 'react';

interface StoryFormData {
  storyType: string;
  subject: string;
  duration: number;
  age: number;
  childName: string;
  childRole: string;
  characterImage: string | null;
  useCustomImage: boolean;
  learningConcept: string;
  storySetting: string;
}

export function StoryModeInterface() {
  const [currentStep, setCurrentStep] = useState<'form' | 'character'>('form');
  const [formData, setFormData] = useState<StoryFormData>({
    storyType: '',
    subject: '',
    duration: 3,
    age: 8,
    childName: '',
    childRole: '',
    characterImage: null,
    useCustomImage: false,
    learningConcept: '',
    storySetting: ''
  });
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Hardcoded sample data for random fill
  const sampleNames = ['Alex', 'Maya', 'Sam', 'Luna', 'Kai', 'Zoe', 'Leo', 'Aria', 'Max', 'Nova'];
  const sampleLearningConcepts = [
    'How gravity keeps us on Earth',
    'Why plants need sunlight to grow',
    'How rainbows are formed in the sky',
    'Why ice melts when it gets warm',
    'How birds can fly in the air',
    'Why the ocean has waves',
    'How magnets attract metal objects',
    'Why we see lightning before thunder',
    'How butterflies transform from caterpillars',
    'Why stars twinkle at night'
  ];
  const sampleStorySettings = [
    'A magical underwater kingdom with coral castles',
    'A floating city high up in the clouds',
    'An enchanted forest where trees can talk',
    'A colorful planet with purple grass and golden trees',
    'A secret laboratory hidden inside a volcano',
    'A time-traveling spaceship exploring different eras',
    'A mystical library with books that come alive',
    'An adventure park with gravity-defying rides',
    'A crystal cave filled with glowing gems',
    'A garden where flowers sing beautiful songs'
  ];

  const storyTypes = [
    { id: 'adventure', name: 'Adventure', icon: '🗺️', color: 'from-blue-500 to-purple-500' },
    { id: 'fantasy', name: 'Fantasy', icon: '🧙‍♂️', color: 'from-purple-500 to-pink-500' },
    { id: 'sci-fi', name: 'Sci-Fi', icon: '🚀', color: 'from-teal-500 to-blue-500' },
    { id: 'mystery', name: 'Mystery', icon: '🔍', color: 'from-pink-500 to-orange-500' }
  ];

  const subjects = [
    { id: 'physics', name: 'Physics', icon: '⚡' },
    { id: 'mathematics', name: 'Mathematics', icon: '🔢' },
    { id: 'chemistry', name: 'Chemistry', icon: '🧪' },
    { id: 'biology', name: 'Biology', icon: '🌱' },
    { id: 'geography', name: 'Geography', icon: '🌍' },
    { id: 'history', name: 'History', icon: '📜' }
  ];

  const characterRoles = [
    'Brave Explorer', 'Curious Scientist', 'Magical Wizard', 'Space Astronaut',
    'Detective', 'Nature Guardian', 'Time Traveler', 'Inventor'
  ];

  const handleInputChange = (field: keyof StoryFormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (formData.storyType && formData.subject && formData.childName) {
      setCurrentStep('character');
    }
  };

  const handleFileSelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          handleInputChange('characterImage', e.target?.result as string);
          handleInputChange('useCustomImage', true);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const startCamera = async () => {
    try {
      setIsCapturing(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setIsCapturing(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/png');
        handleInputChange('characterImage', imageData);
        handleInputChange('useCustomImage', true);
        
        // Stop camera stream
        const stream = video.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        setIsCapturing(false);
      }
    }
  };

  const handleCreateStory = () => {
    try {
      // Create a copy of formData without the large image data for localStorage
      const storyDataForStorage = {
        ...formData,
        characterImage: null // Don't store the image in localStorage
      };
      
      // Store the smaller data object
      localStorage.setItem('storyModeData', JSON.stringify(storyDataForStorage));
      
      // Store the image separately if it exists
      if (formData.characterImage) {
        try {
          localStorage.setItem('storyCharacterImage', formData.characterImage);
        } catch (imageError) {
          console.warn('Character image too large for localStorage, proceeding without it');
        }
      }
      
      console.log('✅ Story data stored successfully');
      
      // Navigate directly to story results page
      window.location.href = '/story-results';
    } catch (error) {
      console.error('❌ Error storing story data:', error);
      alert('Error saving story data. Please try again with a smaller image or without an image.');
    }
  };

  const fillRandomDetails = () => {
    const randomStoryType = storyTypes[Math.floor(Math.random() * storyTypes.length)].id;
    const randomSubject = subjects[Math.floor(Math.random() * subjects.length)].id;
    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    const randomRole = characterRoles[Math.floor(Math.random() * characterRoles.length)];
    const randomDuration = [2, 3, 5, 7][Math.floor(Math.random() * 4)];
    const randomAge = Math.floor(Math.random() * 8) + 5; // 5-12 years old
    const randomConcept = sampleLearningConcepts[Math.floor(Math.random() * sampleLearningConcepts.length)];
    const randomSetting = sampleStorySettings[Math.floor(Math.random() * sampleStorySettings.length)];

    setFormData({
      storyType: randomStoryType,
      subject: randomSubject,
      duration: randomDuration,
      age: randomAge,
      childName: randomName,
      childRole: randomRole,
      characterImage: null,
      useCustomImage: false,
      learningConcept: randomConcept,
      storySetting: randomSetting
    });

    console.log('🎲 Random details filled:', {
      storyType: randomStoryType,
      subject: randomSubject,
      name: randomName,
      role: randomRole,
      duration: randomDuration,
      age: randomAge,
      concept: randomConcept,
      setting: randomSetting
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-pink-100 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-teal-400 rounded-full opacity-20 animate-bounce-gentle"></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-pink-400 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-60 left-1/3 w-12 h-12 bg-purple-400 rounded-full opacity-30 animate-bounce-gentle"></div>
      </div>

      {/* Header */}
      <header className="py-8 relative z-10">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => window.history.back()}
              className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-purple-100 hover:border-purple-300"
            >
              <span className="text-2xl">←</span>
            </button>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-purple-800 font-[var(--font-fredoka)]">
                📖 Story Mode
              </h1>
              <p className="text-lg text-purple-600">
                Create your personalized learning adventure!
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 py-8 relative z-10">
        <div className="container mx-auto px-6 max-w-4xl">
          
          {currentStep === 'form' && (
            <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-purple-100">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 animate-bounce-gentle">
                  📝
                </div>
                <h2 className="text-2xl font-bold text-purple-800 mb-2 font-[var(--font-fredoka)]">
                  Let's Create Your Story!
                </h2>
                <p className="text-purple-600 mb-4">
                  Tell us about the adventure you want to experience
                </p>
                
                {/* Action Buttons */}
                <div className="flex gap-4 mb-4">
                  <button
                    onClick={fillRandomDetails}
                    className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-purple-800 font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-[var(--font-fredoka)]"
                  >
                    🎲 Fill Random Details
                  </button>
                  
                  <button
                    onClick={() => window.location.href = '/character-setup?mode=story'}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-[var(--font-fredoka)]"
                  >
                    🎭 Advanced Character Setup
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                
                {/* Story Type Selection */}
                <div>
                  <label className="block text-lg font-bold text-purple-800 mb-3 font-[var(--font-fredoka)]">
                    🎭 What type of story do you want?
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {storyTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => handleInputChange('storyType', type.id)}
                        className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                          formData.storyType === type.id
                            ? `bg-gradient-to-r ${type.color} text-white border-transparent shadow-lg`
                            : 'bg-white text-purple-700 border-purple-200 hover:border-purple-400 hover:bg-purple-50'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-1">{type.icon}</div>
                          <div className="text-sm font-bold">{type.name}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subject Selection */}
                <div>
                  <label className="block text-lg font-bold text-purple-800 mb-3 font-[var(--font-fredoka)]">
                    📚 What subject do you want to learn?
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {subjects.map((subject) => (
                      <button
                        key={subject.id}
                        onClick={() => handleInputChange('subject', subject.id)}
                        className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                          formData.subject === subject.id
                            ? 'bg-purple-500 text-white border-purple-500 shadow-lg'
                            : 'bg-white text-purple-700 border-purple-200 hover:border-purple-400 hover:bg-purple-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{subject.icon}</span>
                          <span className="font-bold text-sm">{subject.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration and Age */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-lg font-bold text-purple-800 mb-3 font-[var(--font-fredoka)]">
                      ⏰ Story Duration
                    </label>
                    <select
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                      className="w-full p-4 rounded-2xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none text-purple-800 font-medium"
                    >
                      <option value={2}>2 minutes</option>
                      <option value={3}>3 minutes</option>
                      <option value={5}>5 minutes</option>
                      <option value={7}>7 minutes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-lg font-bold text-purple-800 mb-3 font-[var(--font-fredoka)]">
                      🎂 Your Age
                    </label>
                    <select
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                      className="w-full p-4 rounded-2xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none text-purple-800 font-medium"
                    >
                      {[...Array(8)].map((_, i) => (
                        <option key={i} value={i + 5}>{i + 5} years old</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Name and Role */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-lg font-bold text-purple-800 mb-3 font-[var(--font-fredoka)]">
                      👤 Your Name
                    </label>
                    <input
                      type="text"
                      value={formData.childName}
                      onChange={(e) => handleInputChange('childName', e.target.value)}
                      placeholder="Enter your name..."
                      className="w-full p-4 rounded-2xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none text-purple-800 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-bold text-purple-800 mb-3 font-[var(--font-fredoka)]">
                      🦸 Your Role in the Story
                    </label>
                    <select
                      value={formData.childRole}
                      onChange={(e) => handleInputChange('childRole', e.target.value)}
                      className="w-full p-4 rounded-2xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none text-purple-800 font-medium"
                    >
                      <option value="">Choose your role...</option>
                      {characterRoles.map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Learning Concept */}
                <div>
                  <label className="block text-lg font-bold text-purple-800 mb-3 font-[var(--font-fredoka)]">
                    🎯 What do you want to learn? (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.learningConcept}
                    onChange={(e) => handleInputChange('learningConcept', e.target.value)}
                    placeholder="e.g., How gravity works, Why plants need sunlight..."
                    className="w-full p-4 rounded-2xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none text-purple-800 font-medium"
                  />
                  <p className="text-sm text-purple-600 mt-2">
                    Leave blank for a surprise learning adventure!
                  </p>
                </div>

                {/* Story Setting */}
                <div>
                  <label className="block text-lg font-bold text-purple-800 mb-3 font-[var(--font-fredoka)]">
                    🌍 Where should your adventure take place? (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.storySetting}
                    onChange={(e) => handleInputChange('storySetting', e.target.value)}
                    placeholder="e.g., A magical forest, A space station, An underwater city..."
                    className="w-full p-4 rounded-2xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none text-purple-800 font-medium"
                  />
                  <p className="text-sm text-purple-600 mt-2">
                    Leave blank for a surprise setting!
                  </p>
                </div>

                {/* Next Button */}
                <div className="text-center pt-6">
                  <button
                    onClick={handleNext}
                    disabled={!formData.storyType || !formData.subject || !formData.childName}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-[var(--font-fredoka)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next: Choose Character ➡️
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'character' && (
            <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-purple-100">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-purple-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 animate-bounce-gentle">
                  📸
                </div>
                <h2 className="text-2xl font-bold text-purple-800 mb-2 font-[var(--font-fredoka)]">
                  Choose Your Character
                </h2>
                <p className="text-purple-600">
                  Upload your photo or select a character
                </p>
              </div>

              <div className="space-y-6">
                
                {/* Character Options */}
                <div className="grid md:grid-cols-2 gap-6">
                  
                  {/* Upload Photo */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-purple-800 font-[var(--font-fredoka)] text-center">
                      📷 Use Your Photo
                    </h3>
                    
                    <button
                      onClick={handleFileSelect}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      <div className="text-center">
                        <div className="text-3xl mb-2">📁</div>
                        <div className="font-bold font-[var(--font-fredoka)]">Upload Photo</div>
                        <div className="text-sm opacity-90">Choose from device</div>
                      </div>
                    </button>

                    <button
                      onClick={startCamera}
                      className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      <div className="text-center">
                        <div className="text-3xl mb-2">📷</div>
                        <div className="font-bold font-[var(--font-fredoka)]">Take Selfie</div>
                        <div className="text-sm opacity-90">Use camera</div>
                      </div>
                    </button>

                    {/* Camera View */}
                    {isCapturing && (
                      <div className="mt-4">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className="w-full h-64 bg-gray-200 rounded-2xl object-cover"
                        />
                        <canvas ref={canvasRef} className="hidden" />
                        <button
                          onClick={captureImage}
                          className="w-full mt-4 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white p-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                        >
                          📸 Capture Photo
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Character Preview */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-purple-800 font-[var(--font-fredoka)] text-center">
                      👤 Character Preview
                    </h3>
                    
                    <div className="bg-purple-50 rounded-2xl p-6 text-center">
                      {formData.characterImage ? (
                        <div>
                          <img
                            src={formData.characterImage}
                            alt="Character"
                            className="w-32 h-32 object-cover rounded-full mx-auto mb-4 border-4 border-purple-300 shadow-lg"
                          />
                          <p className="text-purple-800 font-bold font-[var(--font-fredoka)]">
                            {formData.childName} the {formData.childRole}
                          </p>
                        </div>
                      ) : (
                        <div>
                          <div className="w-32 h-32 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
                            👤
                          </div>
                          <p className="text-purple-600">
                            Upload your photo to see character preview
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6">
                  <button
                    onClick={() => setCurrentStep('form')}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-4 px-6 rounded-2xl transition-all duration-300"
                  >
                    ← Back to Form
                  </button>
                  
                  <button
                    onClick={handleCreateStory}
                    disabled={!formData.characterImage}
                    className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-purple-800 font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-[var(--font-fredoka)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    🚀 Create My Story!
                  </button>
                </div>
              </div>
            </div>
          )}


        </div>
      </main>
    </div>
  );
}