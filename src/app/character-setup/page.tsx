'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface CharacterData {
  childName: string;
  childRole: string;
  characterImage: string | null;
  age: number;
  personality: string;
  favoriteColor: string;
  superpower: string;
  backstory: string;
  pronouns: string;
}

const characterRoles = [
  'Detective', 'Scientist', 'Explorer', 'Artist', 'Inventor', 'Hero', 'Teacher', 'Student', 
  'Adventurer', 'Leader', 'Wizard', 'Knight', 'Pilot', 'Doctor', 'Engineer', 'Chef'
];

const personalities = [
  'Brave and Bold', 'Curious and Smart', 'Kind and Caring', 'Funny and Cheerful', 
  'Creative and Artistic', 'Logical and Analytical', 'Adventurous and Daring', 'Calm and Wise',
  'Energetic and Enthusiastic', 'Thoughtful and Observant', 'Friendly and Helpful', 'Determined and Strong'
];

const colors = [
  'Red', 'Blue', 'Green', 'Purple', 'Orange', 'Yellow', 'Pink', 'Turquoise', 
  'Silver', 'Gold', 'Rainbow', 'Black', 'White', 'Crimson', 'Emerald', 'Sapphire'
];

const superpowers = [
  'Super Intelligence', 'Time Travel', 'Invisibility', 'Flying', 'Super Strength', 
  'Telepathy', 'Shape Shifting', 'Healing Powers', 'Elemental Control', 'Teleportation',
  'X-Ray Vision', 'Super Speed', 'Mind Reading', 'Magic Spells', 'Animal Communication', 'Photographic Memory'
];

const pronounOptions = [
  { id: 'he', label: 'He/Him', emoji: '👦' },
  { id: 'she', label: 'She/Her', emoji: '👧' },
  { id: 'they', label: 'They/Them', emoji: '🧒' },
  { id: 'it', label: 'It/Its', emoji: '🤖' }
];

const sampleNames = [
  'Alex', 'Sam', 'Jordan', 'Casey', 'Riley', 'Taylor', 'Morgan', 'Avery', 'Quinn', 'Sage',
  'Blake', 'Cameron', 'Drew', 'Emery', 'Finley', 'Harper', 'Indigo', 'Kai', 'Logan', 'Max'
];

const sampleBackstories = [
  'Grew up in a magical library where books came to life',
  'Found a mysterious crystal that gave them special abilities',
  'Trained by ancient masters in a hidden mountain temple',
  'Discovered they were the chosen one from an old prophecy',
  'Inherited powers from a long line of family guardians',
  'Was struck by lightning during a science experiment',
  'Found a magical artifact in their grandmother\'s attic',
  'Rescued by friendly aliens who taught them cosmic wisdom',
  'Born during a rare celestial alignment that granted powers',
  'Discovered a secret portal to other dimensions in their backyard'
];

export default function CharacterSetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'story'; // 'story' or 'comic'
  
  const [characterData, setCharacterData] = useState<CharacterData>({
    childName: '',
    childRole: '',
    characterImage: null,
    age: 8,
    personality: '',
    favoriteColor: '',
    superpower: '',
    backstory: '',
    pronouns: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  useEffect(() => {
    // Load existing data if available
    const savedData = localStorage.getItem(`${mode}ModeData`);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setCharacterData(prev => ({
        ...prev,
        childName: parsed.childName || '',
        childRole: parsed.childRole || '',
        age: parsed.age || 8
      }));
    }

    // Load character image if available
    const savedImage = localStorage.getItem(`${mode}ModeImage`);
    if (savedImage) {
      setCharacterData(prev => ({
        ...prev,
        characterImage: savedImage
      }));
    }
  }, [mode]);

  const fillRandomDetails = () => {
    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    const randomRole = characterRoles[Math.floor(Math.random() * characterRoles.length)];
    const randomPersonality = personalities[Math.floor(Math.random() * personalities.length)];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomSuperpower = superpowers[Math.floor(Math.random() * superpowers.length)];
    const randomBackstory = sampleBackstories[Math.floor(Math.random() * sampleBackstories.length)];
    const randomAge = Math.floor(Math.random() * 8) + 5; // 5-12 years old
    const randomPronouns = pronounOptions[Math.floor(Math.random() * pronounOptions.length)].id;

    setCharacterData({
      childName: randomName,
      childRole: randomRole,
      characterImage: null,
      age: randomAge,
      personality: randomPersonality,
      favoriteColor: randomColor,
      superpower: randomSuperpower,
      backstory: randomBackstory,
      pronouns: randomPronouns
    });
  };

  const handleInputChange = (field: keyof CharacterData, value: string | number | null) => {
    setCharacterData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCharacterData(prev => ({
          ...prev,
          characterImage: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Save character data
    const existingData = localStorage.getItem(`${mode}ModeData`);
    let updatedData = {};
    
    if (existingData) {
      updatedData = JSON.parse(existingData);
    }

    // Merge character data with existing data
    const finalData = {
      ...updatedData,
      childName: characterData.childName,
      childRole: characterData.childRole,
      age: characterData.age,
      personality: characterData.personality,
      favoriteColor: characterData.favoriteColor,
      superpower: characterData.superpower,
      backstory: characterData.backstory,
      timestamp: new Date().toISOString()
    };

    // Save without image to avoid quota issues
    localStorage.setItem(`${mode}ModeData`, JSON.stringify(finalData));
    
    // Save image separately if it exists
    if (characterData.characterImage) {
      localStorage.setItem(`${mode}ModeImage`, characterData.characterImage);
    }

    // Navigate to results page
    router.push(`/${mode}-results`);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return characterData.childName && characterData.childRole && characterData.pronouns;
      case 2:
        return characterData.personality && characterData.favoriteColor;
      case 3:
        return characterData.superpower && characterData.backstory;
      case 4:
        return true; // Photo is optional
      default:
        return false;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Basic Info';
      case 2: return 'Personality';
      case 3: return 'Powers & Story';
      case 4: return 'Character Photo';
      default: return 'Character Setup';
    }
  };

  const colorScheme = mode === 'story' ? {
    primary: 'from-purple-500 to-pink-500',
    primaryHover: 'from-purple-600 to-pink-600',
    bg: 'from-purple-50 via-purple-100 to-pink-100',
    text: 'text-purple-800',
    textLight: 'text-purple-600',
    border: 'border-purple-200',
    borderHover: 'border-purple-400',
    bgLight: 'bg-purple-50',
    bgSelected: 'from-purple-500 to-pink-500'
  } : {
    primary: 'from-blue-500 to-cyan-500',
    primaryHover: 'from-blue-600 to-cyan-600',
    bg: 'from-blue-50 via-blue-100 to-cyan-100',
    text: 'text-blue-800',
    textLight: 'text-blue-600',
    border: 'border-blue-200',
    borderHover: 'border-blue-400',
    bgLight: 'bg-blue-50',
    bgSelected: 'from-blue-500 to-cyan-500'
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colorScheme.bg} relative overflow-hidden`}>
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-teal-400 rounded-full opacity-20 animate-bounce-gentle"></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-pink-400 rounded-full opacity-20 animate-float"></div>
      </div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className={`w-20 h-20 bg-gradient-to-br ${colorScheme.primary} rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 animate-bounce-gentle`}>
              👤
            </div>
            <h1 className={`text-4xl lg:text-5xl font-bold ${colorScheme.text} mb-4 font-[var(--font-fredoka)]`}>
              🎭 Character Setup
            </h1>
            <p className={`text-xl ${colorScheme.textLight} max-w-2xl mx-auto`}>
              Create your perfect character for your {mode}! Step {currentStep} of {totalSteps}: {getStepTitle()}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className={`bg-gray-200 rounded-full h-3 overflow-hidden`}>
              <div 
                className={`bg-gradient-to-r ${colorScheme.primary} h-full transition-all duration-500`}
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className={currentStep >= 1 ? colorScheme.text : 'text-gray-400'}>Basic Info</span>
              <span className={currentStep >= 2 ? colorScheme.text : 'text-gray-400'}>Personality</span>
              <span className={currentStep >= 3 ? colorScheme.text : 'text-gray-400'}>Powers & Story</span>
              <span className={currentStep >= 4 ? colorScheme.text : 'text-gray-400'}>Photo</span>
            </div>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-purple-100">
            
            {/* Quick Fill Button */}
            <div className="mb-8 text-center">
              <button
                onClick={fillRandomDetails}
                className="bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white font-bold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                🎲 Fill Random Details
              </button>
              <p className={`${colorScheme.textLight} mt-2 text-sm`}>
                Click to auto-fill all steps with sample data for quick testing
              </p>
            </div>

            {/* Step Content */}
            <div className="min-h-[400px]">
              
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold ${colorScheme.text} mb-6 text-center`}>
                    👤 Basic Character Information
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label className={`block text-lg font-bold ${colorScheme.text} mb-3`}>
                        ✨ Character Name
                      </label>
                      <input
                        type="text"
                        value={characterData.childName}
                        onChange={(e) => handleInputChange('childName', e.target.value)}
                        placeholder="Enter character name"
                        className={`w-full p-4 rounded-2xl border-2 ${colorScheme.border} focus:${colorScheme.borderHover} focus:outline-none ${colorScheme.text} ${colorScheme.bgLight}`}
                      />
                    </div>

                    {/* Age */}
                    <div>
                      <label className={`block text-lg font-bold ${colorScheme.text} mb-3`}>
                        🎂 Age: {characterData.age} years old
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="12"
                        value={characterData.age}
                        onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                        className="w-full h-3 bg-purple-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className={`flex justify-between text-sm ${colorScheme.textLight} mt-1`}>
                        <span>5 years</span>
                        <span>12 years</span>
                      </div>
                    </div>
                  </div>

                  {/* Pronouns */}
                  <div>
                    <label className={`block text-lg font-bold ${colorScheme.text} mb-3`}>
                      👤 Character Pronouns
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {pronounOptions.map((option) => (
                        <label
                          key={option.id}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 text-center ${
                            characterData.pronouns === option.id
                              ? `bg-gradient-to-r ${colorScheme.bgSelected} text-white border-transparent shadow-lg`
                              : `${colorScheme.bgLight} ${colorScheme.text} ${colorScheme.border} hover:${colorScheme.borderHover}`
                          }`}
                        >
                          <input
                            type="radio"
                            name="pronouns"
                            value={option.id}
                            checked={characterData.pronouns === option.id}
                            onChange={(e) => handleInputChange('pronouns', e.target.value)}
                            className="hidden"
                          />
                          <div className="text-2xl mb-1">{option.emoji}</div>
                          <div className="font-bold text-sm">{option.label}</div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Role */}
                  <div>
                    <label className={`block text-lg font-bold ${colorScheme.text} mb-3`}>
                      🎭 Character Role
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {characterRoles.map((role) => (
                        <label
                          key={role}
                          className={`p-3 rounded-2xl border-2 cursor-pointer transition-all duration-300 text-center ${
                            characterData.childRole === role
                              ? `bg-gradient-to-r ${colorScheme.bgSelected} text-white border-transparent shadow-lg`
                              : `${colorScheme.bgLight} ${colorScheme.text} ${colorScheme.border} hover:${colorScheme.borderHover}`
                          }`}
                        >
                          <input
                            type="radio"
                            name="childRole"
                            value={role}
                            checked={characterData.childRole === role}
                            onChange={(e) => handleInputChange('childRole', e.target.value)}
                            className="hidden"
                          />
                          <div className="font-bold text-sm">{role}</div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Personality */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold ${colorScheme.text} mb-6 text-center`}>
                    🌟 Character Personality
                  </h2>
                  
                  {/* Personality */}
                  <div>
                    <label className={`block text-lg font-bold ${colorScheme.text} mb-3`}>
                      😊 Personality Type
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {personalities.map((personality) => (
                        <label
                          key={personality}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                            characterData.personality === personality
                              ? `bg-gradient-to-r ${colorScheme.bgSelected} text-white border-transparent shadow-lg`
                              : `${colorScheme.bgLight} ${colorScheme.text} ${colorScheme.border} hover:${colorScheme.borderHover}`
                          }`}
                        >
                          <input
                            type="radio"
                            name="personality"
                            value={personality}
                            checked={characterData.personality === personality}
                            onChange={(e) => handleInputChange('personality', e.target.value)}
                            className="hidden"
                          />
                          <div className="font-bold">{personality}</div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Favorite Color */}
                  <div>
                    <label className={`block text-lg font-bold ${colorScheme.text} mb-3`}>
                      🎨 Favorite Color
                    </label>
                    <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                      {colors.map((color) => (
                        <label
                          key={color}
                          className={`p-3 rounded-2xl border-2 cursor-pointer transition-all duration-300 text-center ${
                            characterData.favoriteColor === color
                              ? `bg-gradient-to-r ${colorScheme.bgSelected} text-white border-transparent shadow-lg`
                              : `${colorScheme.bgLight} ${colorScheme.text} ${colorScheme.border} hover:${colorScheme.borderHover}`
                          }`}
                        >
                          <input
                            type="radio"
                            name="favoriteColor"
                            value={color}
                            checked={characterData.favoriteColor === color}
                            onChange={(e) => handleInputChange('favoriteColor', e.target.value)}
                            className="hidden"
                          />
                          <div className="font-bold text-sm">{color}</div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Powers & Story */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold ${colorScheme.text} mb-6 text-center`}>
                    ⚡ Powers & Backstory
                  </h2>
                  
                  {/* Superpower */}
                  <div>
                    <label className={`block text-lg font-bold ${colorScheme.text} mb-3`}>
                      ⚡ Special Ability/Superpower
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {superpowers.map((power) => (
                        <label
                          key={power}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                            characterData.superpower === power
                              ? `bg-gradient-to-r ${colorScheme.bgSelected} text-white border-transparent shadow-lg`
                              : `${colorScheme.bgLight} ${colorScheme.text} ${colorScheme.border} hover:${colorScheme.borderHover}`
                          }`}
                        >
                          <input
                            type="radio"
                            name="superpower"
                            value={power}
                            checked={characterData.superpower === power}
                            onChange={(e) => handleInputChange('superpower', e.target.value)}
                            className="hidden"
                          />
                          <div className="font-bold">{power}</div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Backstory */}
                  <div>
                    <label className={`block text-lg font-bold ${colorScheme.text} mb-3`}>
                      📖 Character Backstory
                    </label>
                    <textarea
                      value={characterData.backstory}
                      onChange={(e) => handleInputChange('backstory', e.target.value)}
                      placeholder="Tell us about your character's origin story..."
                      rows={4}
                      className={`w-full p-4 rounded-2xl border-2 ${colorScheme.border} focus:${colorScheme.borderHover} focus:outline-none ${colorScheme.text} ${colorScheme.bgLight}`}
                    />
                    <p className={`text-sm ${colorScheme.textLight} mt-2`}>
                      Or choose from sample backstories above by clicking &quot;Fill Random Details&quot;
                    </p>
                  </div>
                </div>
              )}

              {/* Step 4: Photo */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold ${colorScheme.text} mb-6 text-center`}>
                    📸 Character Photo (Optional)
                  </h2>
                  
                  <div className="text-center">
                    <div className="mb-6">
                      {characterData.characterImage ? (
                        <div className="relative inline-block">
                          <img
                            src={characterData.characterImage}
                            alt="Character"
                            className="w-48 h-48 rounded-full object-cover border-4 border-purple-300 shadow-lg"
                          />
                          <button
                            onClick={() => handleInputChange('characterImage', null)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div className="w-48 h-48 bg-purple-100 rounded-full flex items-center justify-center mx-auto border-4 border-dashed border-purple-300">
                          <span className="text-6xl">📷</span>
                        </div>
                      )}
                    </div>

                    <label className={`bg-gradient-to-r ${colorScheme.primary} hover:${colorScheme.primaryHover} text-white font-bold py-3 px-6 rounded-2xl cursor-pointer inline-block transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl`}>
                      📸 Upload Character Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    
                    <p className={`${colorScheme.textLight} mt-4`}>
                      Optional: Upload a photo to personalize your character in the {mode}
                    </p>

                    {/* Character Summary */}
                    <div className={`mt-8 p-6 ${colorScheme.bgLight} rounded-2xl text-left`}>
                      <h3 className={`text-xl font-bold ${colorScheme.text} mb-4`}>
                        🎭 Character Summary
                      </h3>
                      <div className="space-y-2">
                        <p><strong>Name:</strong> {characterData.childName}</p>
                        <p><strong>Age:</strong> {characterData.age} years old</p>
                        <p><strong>Pronouns:</strong> {pronounOptions.find(p => p.id === characterData.pronouns)?.label || 'Not selected'}</p>
                        <p><strong>Role:</strong> {characterData.childRole}</p>
                        <p><strong>Personality:</strong> {characterData.personality}</p>
                        <p><strong>Favorite Color:</strong> {characterData.favoriteColor}</p>
                        <p><strong>Special Power:</strong> {characterData.superpower}</p>
                        <p><strong>Backstory:</strong> {characterData.backstory}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => router.push(`/${mode}-mode`)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-4 px-6 rounded-2xl transition-all duration-300"
              >
                ← Back to {mode === 'story' ? 'Story' : 'Comic'} Setup
              </button>
              
              {currentStep > 1 && (
                <button
                  onClick={handlePrevious}
                  className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300"
                >
                  ← Previous
                </button>
              )}
              
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className={`flex-1 bg-gradient-to-r ${colorScheme.primary} hover:${colorScheme.primaryHover} text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
              >
                {currentStep === totalSteps ? `🚀 Create ${mode === 'story' ? 'Story' : 'Comic'}` : 'Next →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
