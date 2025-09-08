'use client';

import { useState, useEffect } from 'react';

interface ComicPanel {
  panel_id: number;
  panel_text: string;
  image_generation_prompt: string;
  generated_image?: string;
}

interface ComicData {
  comicType: string;
  subject: string;
  panels: number;
  age: number;
  childName: string;
  childRole: string;
  characterImage: string | null;
  learningConcept: string;
  comicSetting: string;
}

export default function ComicResultsPage() {
  const [comicData, setComicData] = useState<ComicData | null>(null);
  const [comicPanels, setComicPanels] = useState<ComicPanel[]>([]);
  const [currentPanel, setCurrentPanel] = useState(0);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [generationProgress, setGenerationProgress] = useState({ images: 0, total: 0 });
  const [, setAllAssetsReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showFullscreenControls, setShowFullscreenControls] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadComicData();
  }, []);

  const loadComicData = async () => {
    try {
      const savedData = localStorage.getItem('comicModeData');
      const savedImage = localStorage.getItem('comicModeImage');
      
      if (!savedData) {
        setError('No comic data found. Please create a comic first.');
        setIsLoading(false);
        return;
      }

      const parsedData = JSON.parse(savedData);
      if (savedImage) {
        parsedData.characterImage = savedImage;
      }
      
      setComicData(parsedData);
      
      // Generate the comic
      await generateComic(parsedData);
    } catch (error) {
      console.error('❌ Error loading comic data:', error);
      setError('Failed to load comic data. Please try again.');
      setIsLoading(false);
    }
  };

  const generateComic = async (data: ComicData) => {
    try {
      console.log('🎨 Starting comic generation...');
      
      console.log('📤 Sending comic data to API:', JSON.stringify(data, null, 2));
      
      const response = await fetch('/api/generate-comic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log('📥 API Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('📋 API Result:', JSON.stringify(result, null, 2));
      
      if (result.success) {
        console.log('✅ Comic generated successfully');
        setComicPanels(result.panels);
        setGenerationProgress({ images: 0, total: result.panels.length });
        
        // Generate images for all panels
        await generateAllImages(result.panels, data);
      } else {
        throw new Error(result.error || 'Comic generation failed');
      }
    } catch (error) {
      console.error('❌ Comic generation error:', error);
      setError('Failed to generate comic. Please try again.');
      setIsLoading(false);
    }
  };

  const generateAllImages = async (panels: ComicPanel[], comicData: ComicData) => {
    const startTime = performance.now();
    console.log('\n' + '='.repeat(60));
    console.log('🚀 STARTING SEQUENTIAL IMAGE GENERATION');
    console.log('='.repeat(60));
    console.log(`📊 Total panels to process: ${panels.length}`);
    console.log(`🖼️ Images to generate: ${panels.length}`);
    console.log('='.repeat(60));
    
    setIsGeneratingImages(true);
    
    const updatedPanels = [...panels];
    
    // Process each panel one by one
    for (let i = 0; i < panels.length; i++) {
      const panel = panels[i];
      console.log(`\n📖 Processing Panel ${panel.panel_id} (${i + 1}/${panels.length})`);
      console.log(`📝 Text: "${panel.panel_text.substring(0, 80)}..."`);
      console.log('─'.repeat(40));
      
      // Generate image for this panel
      const imageStartTime = performance.now();
      try {
        console.log(`🖼️ [${panel.panel_id}] Starting image generation...`);
        
        let imagePrompt = panel.image_generation_prompt;
        if (comicData.characterImage) {
          imagePrompt = panel.image_generation_prompt.replace('[CHARACTER]', `${comicData.childName} the ${comicData.childRole}`);
        }
        
        const imageResponse = await fetch('/api/enhance-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: comicData.characterImage || '',
            imagePrompt: imagePrompt,
            isStoryGeneration: true
          }),
        });

        if (imageResponse.ok) {
          const result = await imageResponse.json();
          if (result.success) {
            updatedPanels[i].generated_image = result.enhancedImage;
            
            const imageEndTime = performance.now();
            const imageDuration = ((imageEndTime - imageStartTime) / 1000).toFixed(2);
            console.log(`✅ [${panel.panel_id}] Image generated successfully in ${imageDuration}s`);
          }
        } else {
          throw new Error(`HTTP ${imageResponse.status}`);
        }
        
        // Always increment progress after each panel attempt (success or failure)
        setGenerationProgress(prev => ({ ...prev, images: prev.images + 1 }));
      } catch (error) {
        const imageEndTime = performance.now();
        const imageDuration = ((imageEndTime - imageStartTime) / 1000).toFixed(2);
        console.error(`❌ [${panel.panel_id}] Image generation failed after ${imageDuration}s:`, error);
      }
      
      // Update panels state after each panel completion
      setComicPanels([...updatedPanels]);
      
      console.log(`🎯 [${panel.panel_id}] Panel completed! Progress: ${i + 1}/${panels.length}`);
      console.log('─'.repeat(40));
    }

    setIsGeneratingImages(false);
    setAllAssetsReady(true);
    setIsLoading(false);

    const endTime = performance.now();
    const totalDuration = ((endTime - startTime) / 1000).toFixed(2);

    console.log('\n' + '='.repeat(60));
    console.log('🎉 ALL COMIC PANELS GENERATED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log(`⏱️ Total generation time: ${totalDuration} seconds`);
    console.log(`🖼️ Images generated: ${updatedPanels.filter(p => p.generated_image).length}/${panels.length}`);
    console.log(`📈 Average time per panel: ${(parseFloat(totalDuration) / panels.length).toFixed(2)}s`);
    console.log('='.repeat(60) + '\n');
  };

  const handlePanelClick = (index: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPanel(index);
      setIsTransitioning(false);
    }, 300);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleFullscreenClick = () => {
    if (isFullscreen) {
      setShowFullscreenControls(!showFullscreenControls);
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isFullscreen) {
      setIsFullscreen(false);
    }
    if (e.key === 'f' || e.key === 'F') {
      toggleFullscreen();
    }
    if (e.key === 'ArrowLeft' && currentPanel > 0) {
      handlePanelClick(currentPanel - 1);
    }
    if (e.key === 'ArrowRight' && currentPanel < comicPanels.length - 1) {
      handlePanelClick(currentPanel + 1);
    }
    if (e.key === ' ' && isFullscreen) {
      e.preventDefault();
      setShowFullscreenControls(!showFullscreenControls);
    }
  };

  // Auto-hide controls after 3 seconds
  useEffect(() => {
    if (showFullscreenControls && isFullscreen) {
      const timer = setTimeout(() => {
        setShowFullscreenControls(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showFullscreenControls, isFullscreen]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isFullscreen, currentPanel, comicPanels.length]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 animate-bounce">
            🎨
          </div>
          <h2 className="text-2xl font-bold text-blue-800 mb-4 font-[var(--font-fredoka)]">
            Creating Your Comic...
          </h2>
          
          {isGeneratingImages && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="text-blue-700 font-medium">
                    Generating Images: {generationProgress.images}/{generationProgress.total}
                  </span>
                </div>
                <div className="bg-blue-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full transition-all duration-500"
                    style={{ width: `${(generationProgress.images / generationProgress.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
            😞
          </div>
          <h1 className="text-3xl font-bold text-red-600 mb-4 font-[var(--font-fredoka)]">
            Oops! Something went wrong
          </h1>
          <p className="text-xl text-red-500 mb-8">{error}</p>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-100 relative overflow-hidden transition-all duration-500 ${
      isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''
    }`}>
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-teal-400 rounded-full opacity-20 animate-bounce-gentle"></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-pink-400 rounded-full opacity-20 animate-float"></div>
      </div>

      {/* Header - Hidden in fullscreen */}
      {!isFullscreen && (
        <header className="py-8 relative z-10">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => window.location.href = '/dashboard'}
                className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-blue-100 hover:border-blue-300"
              >
                <span className="text-2xl">←</span>
              </button>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-blue-800 font-[var(--font-fredoka)]">
                  🎨 {comicData?.childName}&apos;s Comic
                </h1>
                <p className="text-lg text-blue-600">
                  A {comicData?.comicType} comic about {comicData?.subject}
                </p>
              </div>
            </div>
          </div>
        </header>
      )}

      <main className="flex-1 py-8 relative z-10">
        <div className="container mx-auto px-6 max-w-6xl">
          
          {/* Comic Reader */}
          <div 
            className={`bg-white rounded-3xl p-8 shadow-2xl border-4 border-blue-100 mb-8 transition-all duration-500 ${
              isFullscreen ? 'fixed inset-0 z-50 bg-black text-white border-none flex flex-col justify-center overflow-y-auto cursor-pointer' : ''
            }`}
            onClick={handleFullscreenClick}
          >
            
            {/* Fullscreen Controls */}
            {isFullscreen && (
              <div className={`absolute top-4 right-4 z-60 flex gap-2 transition-all duration-300 ${
                showFullscreenControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFullscreen();
                  }}
                  className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full transition-all duration-300"
                  title="Exit Fullscreen (ESC)"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Current Panel Display */}
            <div className={`text-center transition-all duration-300 ${
              isTransitioning ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
            } ${isFullscreen ? 'p-4 h-full flex flex-col justify-center items-center' : 'mb-8'}`}>
              {!isFullscreen && (
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 animate-bounce-gentle">
                  🎨
                </div>
              )}
              <h2 className={`text-2xl font-bold mb-4 font-[var(--font-fredoka)] ${
                isFullscreen ? 'text-white text-4xl' : 'text-blue-800'
              }`}>
                Panel {currentPanel + 1} of {comicPanels.length}
              </h2>
              
              {comicPanels.length > 0 && (
                <div className="space-y-6">
                  {/* Generated Panel Image */}
                  {comicPanels[currentPanel]?.generated_image && (
                    <div className={`mb-6 transition-all duration-500 ${
                      isTransitioning ? 'opacity-0 transform translate-x-10' : 'opacity-100 transform translate-x-0'
                    }`}>
                      <img
                        src={comicPanels[currentPanel].generated_image}
                        alt={`Panel ${currentPanel + 1}`}
                        className={`object-contain rounded-3xl shadow-2xl mx-auto border-4 cursor-pointer transition-all duration-300 hover:scale-105 ${
                          isFullscreen 
                            ? 'max-w-[90vw] max-h-[70vh] border-gray-600 hover:border-gray-400' 
                            : 'w-full max-h-96 border-blue-200 hover:border-blue-400'
                        }`}
                        onClick={toggleFullscreen}
                        title={isFullscreen ? 'Click to exit fullscreen' : 'Click for fullscreen (F key)'}
                      />
                    </div>
                  )}
                  
                  {/* Panel Text */}
                  <div className={`rounded-2xl p-6 mb-6 transition-all duration-500 max-w-4xl mx-auto ${
                    isTransitioning ? 'opacity-0 transform translate-y-10' : 'opacity-100 transform translate-y-0'
                  } ${
                    isFullscreen 
                      ? 'bg-gray-900 bg-opacity-90 backdrop-blur-sm border border-gray-600' 
                      : 'bg-blue-50'
                  }`}>
                    <p className={`leading-relaxed font-medium ${
                      isFullscreen 
                        ? 'text-white text-xl md:text-2xl text-center' 
                        : 'text-blue-800 text-lg'
                    }`}>
                      {comicPanels[currentPanel]?.panel_text}
                    </p>
                  </div>

                  {/* Character Image (smaller, in corner) */}
                  {comicData?.characterImage && !isFullscreen && (
                    <div className="flex justify-center mb-4">
                      <div className="bg-white rounded-2xl p-4 shadow-lg">
                        <img
                          src={comicData.characterImage}
                          alt={`${comicData.childName} the ${comicData.childRole}`}
                          className="w-20 h-20 object-cover rounded-full border-2 border-blue-300"
                        />
                        <p className="text-blue-600 mt-2 font-bold text-sm text-center">
                          {comicData.childName}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Controls */}
            <div className={`flex justify-center gap-4 transition-all duration-300 ${
              isFullscreen 
                ? `fixed bottom-6 left-1/2 transform -translate-x-1/2 z-60 bg-black bg-opacity-90 p-4 rounded-2xl border border-gray-600 ${
                    showFullscreenControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }` 
                : 'mb-8'
            }`}>
              
              {/* Navigation buttons */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  currentPanel > 0 && handlePanelClick(currentPanel - 1);
                }}
                disabled={currentPanel === 0}
                className={`font-bold py-3 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isFullscreen 
                    ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-600' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                ← Previous
              </button>
              
              <div className={`px-4 py-3 rounded-2xl font-bold ${
                isFullscreen 
                  ? 'bg-blue-600 text-white border border-blue-500' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {currentPanel + 1} / {comicPanels.length}
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  currentPanel < comicPanels.length - 1 && handlePanelClick(currentPanel + 1);
                }}
                disabled={currentPanel === comicPanels.length - 1}
                className={`font-bold py-3 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isFullscreen 
                    ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-600' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Next →
              </button>
              
              {!isFullscreen && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFullscreen();
                  }}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                  title="Fullscreen (F key)"
                >
                  🔳 Fullscreen
                </button>
              )}
            </div>

            {/* Progress Bar - Hidden in fullscreen */}
            {!isFullscreen && (
              <div className="mb-6">
                <div className="bg-blue-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full transition-all duration-500"
                    style={{ width: `${((currentPanel + 1) / comicPanels.length) * 100}%` }}
                  ></div>
                </div>
                <p className="text-center text-blue-600 mt-2 text-sm">
                  {currentPanel + 1} / {comicPanels.length} panels
                </p>
              </div>
            )}
          </div>

          {/* Panel Navigation - Hidden in fullscreen */}
          {!isFullscreen && (
            <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-blue-100">
              <h3 className="text-xl font-bold text-blue-800 mb-6 text-center font-[var(--font-fredoka)]">
                📋 Comic Panels
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {comicPanels.map((panel, index) => (
                  <button
                    key={panel.panel_id}
                    onClick={() => handlePanelClick(index)}
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 text-left transform hover:scale-105 ${
                      currentPanel === index
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-transparent shadow-lg'
                        : 'bg-blue-50 text-blue-700 border-blue-200 hover:border-blue-400 hover:bg-blue-100'
                    }`}
                  >
                    <div className="font-bold mb-2">Panel {panel.panel_id}</div>
                    <div className="text-sm opacity-90 line-clamp-3">
                      {panel.panel_text.substring(0, 100)}...
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
