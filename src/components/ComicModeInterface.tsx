'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ComicFormData {
  comicType: string;
  subject: string;
  panels: number;
  age: number;
  childName: string;
  childRole: string;
  characterImage: string | null;
  useCustomImage: boolean;
  learningConcept: string;
  comicSetting: string;
}

// Sample data arrays for random filling
const comicTypes = [
  { id: 'superhero', name: '🦸‍♂️ Superhero Adventure', description: 'Action-packed comic with superpowers' },
  { id: 'mystery', name: '🔍 Mystery Detective', description: 'Solve puzzles and uncover secrets' },
  { id: 'fantasy', name: '🧙‍♂️ Fantasy Quest', description: 'Magical worlds and mythical creatures' },
  { id: 'science', name: '🔬 Science Explorer', description: 'Discover scientific concepts through adventure' },
  { id: 'friendship', name: '👫 Friendship Tale', description: 'Stories about friendship and teamwork' },
  { id: 'animal', name: '🐾 Animal Adventure', description: 'Fun adventures with animal characters' }
];

const subjects = [
  { id: 'math', name: '🔢 Mathematics', description: 'Numbers, shapes, and problem-solving' },
  { id: 'science', name: '🧪 Science', description: 'Physics, chemistry, and biology' },
  { id: 'history', name: '🏛️ History', description: 'Past events and historical figures' },
  { id: 'geography', name: '🌍 Geography', description: 'Countries, maps, and cultures' },
  { id: 'language', name: '📚 Language Arts', description: 'Reading, writing, and vocabulary' },
  { id: 'art', name: '🎨 Art & Creativity', description: 'Drawing, colors, and artistic expression' }
];

const characterRoles = [
  'Detective', 'Scientist', 'Explorer', 'Artist', 'Inventor', 'Hero', 'Teacher', 'Student', 'Adventurer', 'Leader'
];

const sampleNames = [
  'Alex', 'Sam', 'Jordan', 'Casey', 'Riley', 'Taylor', 'Morgan', 'Avery', 'Quinn', 'Sage'
];

const sampleLearningConcepts = [
  'Addition and subtraction', 'The water cycle', 'Ancient civilizations', 'Solar system planets',
  'Reading comprehension', 'Color theory', 'Fractions and decimals', 'Animal habitats',
  'Grammar and punctuation', 'Famous inventors', 'Geometric shapes', 'Weather patterns'
];

const sampleComicSettings = [
  'A futuristic city', 'An enchanted forest', 'A space station', 'An underwater kingdom',
  'A magical school', 'A secret laboratory', 'A mysterious island', 'A time-traveling adventure',
  'A superhero headquarters', 'An ancient temple', 'A robot factory', 'A fairy tale castle'
];

export function ComicModeInterface() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<'form' | 'character'>('form');
  const [formData, setFormData] = useState<ComicFormData>({
    comicType: '',
    subject: '',
    panels: 6,
    age: 8,
    childName: '',
    childRole: '',
    characterImage: null,
    useCustomImage: false,
    learningConcept: '',
    comicSetting: ''
  });

  const fillRandomDetails = () => {
    const randomComicType = comicTypes[Math.floor(Math.random() * comicTypes.length)].id;
    const randomSubject = subjects[Math.floor(Math.random() * subjects.length)].id;
    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    const randomRole = characterRoles[Math.floor(Math.random() * characterRoles.length)];
    const randomPanels = [4, 6, 8, 10][Math.floor(Math.random() * 4)];
    const randomAge = Math.floor(Math.random() * 8) + 5; // 5-12 years old
    const randomConcept = sampleLearningConcepts[Math.floor(Math.random() * sampleLearningConcepts.length)];
    const randomSetting = sampleComicSettings[Math.floor(Math.random() * sampleComicSettings.length)];

    setFormData({
      comicType: randomComicType,
      subject: randomSubject,
      panels: randomPanels,
      age: randomAge,
      childName: randomName,
      childRole: randomRole,
      characterImage: null,
      useCustomImage: false,
      learningConcept: randomConcept,
      comicSetting: randomSetting
    });
  };

  const handleInputChange = (field: keyof ComicFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          characterImage: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    // Save form data to localStorage
    const comicData = {
      ...formData,
      timestamp: new Date().toISOString()
    };
    
    // Store main data without image to avoid quota issues
    const { characterImage, ...dataWithoutImage } = comicData;
    localStorage.setItem('comicModeData', JSON.stringify(dataWithoutImage));
    
    // Store image separately if it exists
    if (characterImage) {
      localStorage.setItem('comicModeImage', characterImage);
    }
    
    // Navigate to comic results
    router.push('/comic-results');
  };

  const isFormValid = () => {
    return formData.comicType && 
           formData.subject && 
           formData.childName && 
           formData.childRole && 
           formData.learningConcept && 
           formData.comicSetting;
  };

  if (currentStep === 'character') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-100 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400 rounded-full opacity-20 animate-float"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-teal-400 rounded-full opacity-20 animate-bounce-gentle"></div>
          <div className="absolute bottom-40 left-20 w-24 h-24 bg-pink-400 rounded-full opacity-20 animate-float"></div>
        </div>

        <div className="container mx-auto px-6 py-12 relative z-10">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 animate-bounce-gentle">
                📚
              </div>
              <h1 className="text-4xl font-bold text-blue-800 mb-4 font-[var(--font-fredoka)]">
                Create Your Character
              </h1>
              <p className="text-xl text-blue-600">
                Upload a photo or continue without one
              </p>
            </div>

            {/* Character Creation Card */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-blue-100">
              <div className="space-y-6">
                {/* Photo Upload */}
                <div className="text-center">
                  <div className="mb-6">
                    {formData.characterImage ? (
                      <div className="relative inline-block">
                        <img
                          src={formData.characterImage}
                          alt="Character"
                          className="w-32 h-32 rounded-full object-cover border-4 border-blue-300 shadow-lg"
                        />
                        <button
                          onClick={() => handleInputChange('characterImage', null)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mx-auto border-4 border-dashed border-blue-300">
                        <span className="text-4xl">📷</span>
                      </div>
                    )}
                  </div>

                  <label className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 px-6 rounded-2xl cursor-pointer inline-block transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                    📸 Upload Character Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  
                  <p className="text-blue-600 mt-4 text-sm">
                    Optional: Upload a photo to personalize your comic character
                  </p>
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
                    onClick={handleSubmit}
                    disabled={!isFormValid()}
                    className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    🚀 Create Comic
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-100 relative overflow-hidden">
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
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 animate-bounce-gentle">
              📚
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-blue-800 mb-4 font-[var(--font-fredoka)]">
              🎨 Create Your Comic
            </h1>
            <p className="text-xl text-blue-600 max-w-2xl mx-auto">
              Design an educational comic adventure tailored just for you! Fill in the details below to create your personalized learning comic.
            </p>
          </div>

          {/* Main Form Card */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-blue-100">
            
            {/* Action Buttons */}
            <div className="mb-8 text-center">
              <div className="flex gap-4 justify-center mb-4">
                <button
                  onClick={fillRandomDetails}
                  className="bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white font-bold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  🎲 Fill Random Details
                </button>
                
                <button
                  onClick={() => window.location.href = '/character-setup?mode=comic'}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  🎭 Advanced Character Setup
                </button>
              </div>
              <p className="text-blue-600 text-sm">
                Use quick fill for testing or advanced setup for detailed character creation
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Comic Type */}
                <div>
                  <label className="block text-lg font-bold text-blue-800 mb-3">
                    🎭 Comic Type
                  </label>
                  <div className="grid gap-3">
                    {comicTypes.map((type) => (
                      <label
                        key={type.id}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                          formData.comicType === type.id
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-transparent shadow-lg'
                            : 'bg-blue-50 text-blue-700 border-blue-200 hover:border-blue-400 hover:bg-blue-100'
                        }`}
                      >
                        <input
                          type="radio"
                          name="comicType"
                          value={type.id}
                          checked={formData.comicType === type.id}
                          onChange={(e) => handleInputChange('comicType', e.target.value)}
                          className="hidden"
                        />
                        <div className="font-bold">{type.name}</div>
                        <div className="text-sm opacity-90">{type.description}</div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-lg font-bold text-blue-800 mb-3">
                    📖 Subject
                  </label>
                  <div className="grid gap-3">
                    {subjects.map((subject) => (
                      <label
                        key={subject.id}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                          formData.subject === subject.id
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-transparent shadow-lg'
                            : 'bg-blue-50 text-blue-700 border-blue-200 hover:border-blue-400 hover:bg-blue-100'
                        }`}
                      >
                        <input
                          type="radio"
                          name="subject"
                          value={subject.id}
                          checked={formData.subject === subject.id}
                          onChange={(e) => handleInputChange('subject', e.target.value)}
                          className="hidden"
                        />
                        <div className="font-bold">{subject.name}</div>
                        <div className="text-sm opacity-90">{subject.description}</div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Number of Panels */}
                <div>
                  <label className="block text-lg font-bold text-blue-800 mb-3">
                    📋 Number of Panels
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {[4, 6, 8, 10].map((panels) => (
                      <label
                        key={panels}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 text-center ${
                          formData.panels === panels
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-transparent shadow-lg'
                            : 'bg-blue-50 text-blue-700 border-blue-200 hover:border-blue-400 hover:bg-blue-100'
                        }`}
                      >
                        <input
                          type="radio"
                          name="panels"
                          value={panels}
                          checked={formData.panels === panels}
                          onChange={(e) => handleInputChange('panels', parseInt(e.target.value))}
                          className="hidden"
                        />
                        <div className="font-bold text-xl">{panels}</div>
                        <div className="text-sm">panels</div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Age */}
                <div>
                  <label className="block text-lg font-bold text-blue-800 mb-3">
                    🎂 Age: {formData.age} years old
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="12"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                    className="w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-blue-600 mt-1">
                    <span>5 years</span>
                    <span>12 years</span>
                  </div>
                </div>

                {/* Child's Name */}
                <div>
                  <label className="block text-lg font-bold text-blue-800 mb-3">
                    👤 Child&apos;s Name
                  </label>
                  <input
                    type="text"
                    value={formData.childName}
                    onChange={(e) => handleInputChange('childName', e.target.value)}
                    placeholder="Enter the child's name"
                    className="w-full p-4 rounded-2xl border-2 border-blue-200 focus:border-blue-500 focus:outline-none text-blue-800 bg-blue-50"
                  />
                </div>

                {/* Child's Role */}
                <div>
                  <label className="block text-lg font-bold text-blue-800 mb-3">
                    🎭 Character Role
                  </label>
                  <select
                    value={formData.childRole}
                    onChange={(e) => handleInputChange('childRole', e.target.value)}
                    className="w-full p-4 rounded-2xl border-2 border-blue-200 focus:border-blue-500 focus:outline-none text-blue-800 bg-blue-50"
                  >
                    <option value="">Select a role...</option>
                    {characterRoles.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                {/* Learning Concept */}
                <div>
                  <label className="block text-lg font-bold text-blue-800 mb-3">
                    🧠 Learning Concept
                  </label>
                  <input
                    type="text"
                    value={formData.learningConcept}
                    onChange={(e) => handleInputChange('learningConcept', e.target.value)}
                    placeholder="What should this comic teach?"
                    className="w-full p-4 rounded-2xl border-2 border-blue-200 focus:border-blue-500 focus:outline-none text-blue-800 bg-blue-50"
                  />
                </div>

                {/* Comic Setting */}
                <div>
                  <label className="block text-lg font-bold text-blue-800 mb-3">
                    🌍 Comic Setting
                  </label>
                  <input
                    type="text"
                    value={formData.comicSetting}
                    onChange={(e) => handleInputChange('comicSetting', e.target.value)}
                    placeholder="Where does the comic take place?"
                    className="w-full p-4 rounded-2xl border-2 border-blue-200 focus:border-blue-500 focus:outline-none text-blue-800 bg-blue-50"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8 pt-6 border-t border-blue-100">
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-4 px-6 rounded-2xl transition-all duration-300"
              >
                ← Back to Dashboard
              </button>
              
              <button
                onClick={() => setCurrentStep('character')}
                disabled={!isFormValid()}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Next: Character Setup →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
