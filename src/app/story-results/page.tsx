'use client';

import { useState, useEffect, useRef } from 'react';

interface StorySegment {
  segment_id: number;
  narrative_text: string;
  image_generation_prompt: string;
  generated_image?: string;
  audio_url?: string;
}

interface StoryData {
  storyType: string;
  subject: string;
  duration: number;
  age: number;
  childName: string;
  childRole: string;
  characterImage: string | null;
}

export default function StoryResultsPage() {
  const [storyData, setStoryData] = useState<StoryData | null>(null);
  const [storySegments, setStorySegments] = useState<StorySegment[]>([]);
  const [currentSegment, setCurrentSegment] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [generationProgress, setGenerationProgress] = useState({ images: 0, audio: 0, total: 0 });
  const [allAssetsReady, setAllAssetsReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showFullscreenControls, setShowFullscreenControls] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const segmentTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadStoryData();
  }, []);

  const loadStoryData = async () => {
    try {
      const savedData = localStorage.getItem('storyModeData');
      if (!savedData) {
        setError('No story data found');
        return;
      }

      const data: StoryData = JSON.parse(savedData);
      
      // Try to get the character image from separate storage
      const characterImage = localStorage.getItem('storyCharacterImage');
      if (characterImage) {
        data.characterImage = characterImage;
      }
      
      setStoryData(data);

      // Generate the story
      await generateStory(data);
    } catch (error) {
      console.error('Error loading story data:', error);
      setError('Failed to load story data');
    } finally {
      setIsLoading(false);
    }
  };

  const generateStory = async (data: StoryData) => {
    try {
      console.log('🎭 Generating story...');
      
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to generate story');
      }

      const result = await response.json();
      
      if (result.success) {
        setStorySegments(result.story);
        setGenerationProgress({ images: 0, audio: 0, total: result.story.length });
        console.log(`✅ Story generated with ${result.story.length} segments`);
        console.log('📖 Full Story API Response:', result);
        console.log('📚 Story Segments:', result.story);
        console.log('📊 Story Metadata:', result.metadata);
        
        // Start generating images and audio for all segments
        await generateAllAssets(result.story, data);
      } else {
        throw new Error(result.error || 'Story generation failed');
      }
    } catch (error) {
      console.error('❌ Story generation error:', error);
      setError('Failed to generate story. Please try again.');
    }
  };

  const generateAllAssets = async (segments: StorySegment[], storyData: StoryData) => {
    const startTime = performance.now();
    console.log('\n' + '='.repeat(60));
    console.log('🚀 STARTING SEQUENTIAL GENERATION (ONE BY ONE)');
    console.log('='.repeat(60));
    console.log(`📊 Total segments to process: ${segments.length}`);
    console.log(`🖼️ Images to generate: ${segments.length}`);
    console.log(`🔊 Audio files to generate: ${segments.length}`);
    console.log('='.repeat(60));
    
    setIsGeneratingImages(true);
    setIsGeneratingAudio(true);
    
    const updatedSegments = [...segments];
    
    // Process each segment one by one
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      console.log(`\n📖 Processing Segment ${segment.segment_id} (${i + 1}/${segments.length})`);
      console.log(`📝 Text: "${segment.narrative_text.substring(0, 80)}..."`);
      console.log('─'.repeat(40));
      
      // Generate image for this segment
      const imageStartTime = performance.now();
      try {
        console.log(`🖼️ [${segment.segment_id}] Starting image generation...`);
        
        let imagePrompt = segment.image_generation_prompt;
        if (storyData.characterImage) {
          imagePrompt = segment.image_generation_prompt.replace('[CHARACTER]', `${storyData.childName} the ${storyData.childRole}`);
        }
        
        const imageResponse = await fetch('/api/enhance-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: storyData.characterImage || '',
            imagePrompt: imagePrompt,
            isStoryGeneration: true
          }),
        });

        if (imageResponse.ok) {
          const result = await imageResponse.json();
          if (result.success) {
            updatedSegments[i].generated_image = result.enhancedImage;
            setGenerationProgress(prev => ({ ...prev, images: prev.images + 1 }));
            
            const imageEndTime = performance.now();
            const imageDuration = ((imageEndTime - imageStartTime) / 1000).toFixed(2);
            console.log(`✅ [${segment.segment_id}] Image generated successfully in ${imageDuration}s`);
          }
        } else {
          throw new Error(`HTTP ${imageResponse.status}`);
        }
      } catch (error) {
        const imageEndTime = performance.now();
        const imageDuration = ((imageEndTime - imageStartTime) / 1000).toFixed(2);
        console.error(`❌ [${segment.segment_id}] Image generation failed after ${imageDuration}s:`, error);
        // Still increment progress even on failure to maintain correct count
        setGenerationProgress(prev => ({ ...prev, images: prev.images + 1 }));
      }
      
      // Generate audio for this segment
      const audioStartTime = performance.now();
      try {
        console.log(`🔊 [${segment.segment_id}] Starting audio generation...`);
        
        const audioResponse = await fetch('/api/text-to-speech', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: segment.narrative_text }),
        });

        if (audioResponse.ok) {
          const audioBlob = await audioResponse.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          updatedSegments[i].audio_url = audioUrl;
          setGenerationProgress(prev => ({ ...prev, audio: prev.audio + 1 }));
          
          const audioEndTime = performance.now();
          const audioDuration = ((audioEndTime - audioStartTime) / 1000).toFixed(2);
          console.log(`✅ [${segment.segment_id}] Audio generated successfully in ${audioDuration}s`);
        } else {
          throw new Error(`HTTP ${audioResponse.status}`);
        }
      } catch (error) {
        const audioEndTime = performance.now();
        const audioDuration = ((audioEndTime - audioStartTime) / 1000).toFixed(2);
        console.error(`❌ [${segment.segment_id}] Audio generation failed after ${audioDuration}s:`, error);
        // Still increment progress even on failure to maintain correct count
        setGenerationProgress(prev => ({ ...prev, audio: prev.audio + 1 }));
      }
      
      // Update segments state after each segment completion
      setStorySegments([...updatedSegments]);
      
      const segmentEndTime = performance.now();
      const segmentTotalDuration = ((segmentEndTime - (i === 0 ? startTime : performance.now() - 1000)) / 1000).toFixed(2);
      console.log(`🎯 [${segment.segment_id}] Segment completed! Progress: ${i + 1}/${segments.length}`);
      console.log('─'.repeat(40));
    }

    setIsGeneratingImages(false);
    setIsGeneratingAudio(false);
    setAllAssetsReady(true);
    setIsLoading(false);

    const endTime = performance.now();
    const totalDuration = ((endTime - startTime) / 1000).toFixed(2);

    console.log('\n' + '='.repeat(60));
    console.log('🎉 ALL STORY ASSETS GENERATED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log(`⏱️ Total generation time: ${totalDuration} seconds`);
    console.log(`🖼️ Images generated: ${updatedSegments.filter(s => s.generated_image).length}/${segments.length}`);
    console.log(`🔊 Audio files generated: ${updatedSegments.filter(s => s.audio_url).length}/${segments.length}`);
    console.log(`📈 Average time per segment: ${(parseFloat(totalDuration) / segments.length).toFixed(2)}s`);
    console.log('='.repeat(60) + '\n');
  };

  const generateAudio = async (text: string) => {
    try {
      setIsGeneratingAudio(true);
      
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate audio');
      }

      const result = await response.json();
      
      if (result.success) {
        setAudioUrl(result.audioUrl);
        return result.audioUrl;
      } else {
        throw new Error(result.error || 'Audio generation failed');
      }
    } catch (error) {
      console.error('❌ Audio generation error:', error);
      return null;
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const playSegment = async (segmentIndex: number) => {
    if (segmentIndex >= storySegments.length) {
      setIsPlaying(false);
      console.log('🎬 Story playback completed!');
      return;
    }

    // Add transition effect when changing segments
    if (segmentIndex !== currentSegment) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSegment(segmentIndex);
        setIsTransitioning(false);
      }, 300); // 300ms fade transition
    } else {
      setCurrentSegment(segmentIndex);
    }

    const segment = storySegments[segmentIndex];
    console.log(`🎭 Playing segment ${segment.segment_id}: ${segment.narrative_text.substring(0, 50)}...`);

    // Use pre-generated audio if available
    if (segment.audio_url && audioRef.current) {
      audioRef.current.src = segment.audio_url;
      
      // Set up event listeners for audio completion
      const handleAudioEnd = () => {
        console.log(`✅ Audio completed for segment ${segment.segment_id}`);
        // Auto-advance to next segment when audio ends with transition
        setTimeout(() => {
          playSegment(segmentIndex + 1);
        }, 1000); // Small delay before next segment
      };

      audioRef.current.onended = handleAudioEnd;
      audioRef.current.play();
    } else {
      // Fallback: auto-advance after 15 seconds if no audio
      segmentTimerRef.current = setTimeout(() => {
        playSegment(segmentIndex + 1);
      }, 15000);
    }
  };

  const handlePlay = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      playSegment(0);
    } else {
      setIsPlaying(false);
      if (segmentTimerRef.current) {
        clearTimeout(segmentTimerRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  };

  const handleSegmentClick = (index: number) => {
    if (segmentTimerRef.current) {
      clearTimeout(segmentTimerRef.current);
    }
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSegment(index);
      setIsTransitioning(false);
      if (isPlaying) {
        playSegment(index);
      }
    }, 300);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isFullscreen) {
      setIsFullscreen(false);
    }
    if (e.key === 'f' || e.key === 'F') {
      toggleFullscreen();
    }
    if (e.key === 'ArrowLeft' && currentSegment > 0) {
      handleSegmentClick(currentSegment - 1);
    }
    if (e.key === 'ArrowRight' && currentSegment < storySegments.length - 1) {
      handleSegmentClick(currentSegment + 1);
    }
    if (e.key === ' ' && isFullscreen) {
      e.preventDefault();
      setShowFullscreenControls(!showFullscreenControls);
    }
  };

  const handleFullscreenClick = () => {
    if (isFullscreen) {
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
  }, [isFullscreen, currentSegment, storySegments.length]);

  const handleRestart = () => {
    setCurrentSegment(0);
    setIsPlaying(false);
    if (segmentTimerRef.current) {
      clearTimeout(segmentTimerRef.current);
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  if (isLoading || !allAssetsReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-pink-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-500 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6 animate-bounce-gentle shadow-2xl">
            ✨
          </div>
          <h1 className="text-3xl font-bold text-purple-800 mb-4 font-[var(--font-fredoka)]">
            Creating Your Story!
          </h1>
          <p className="text-xl text-purple-600 mb-8">
            {isLoading ? 'Generating story segments...' : 'Creating images and audio for your adventure...'}
          </p>
          
          {generationProgress.total > 0 && (
            <div className="mb-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-purple-700 font-bold">🖼️ Images</span>
                    <span className="text-purple-600">{generationProgress.images}/{generationProgress.total}</span>
                  </div>
                  <div className="bg-purple-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(generationProgress.images / generationProgress.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-purple-700 font-bold">🔊 Audio</span>
                    <span className="text-purple-600">{generationProgress.audio}/{generationProgress.total}</span>
                  </div>
                  <div className="bg-purple-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-teal-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(generationProgress.audio / generationProgress.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <p className="text-sm text-purple-600">
                  {isGeneratingImages && isGeneratingAudio ? 'Generating images and audio...' :
                   isGeneratingImages ? 'Generating images...' :
                   isGeneratingAudio ? 'Generating audio...' :
                   'Almost ready!'}
                </p>
              </div>
            </div>
          )}
          
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-400 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6">
            ❌
          </div>
          <h1 className="text-3xl font-bold text-red-600 mb-4 font-[var(--font-fredoka)]">
            Oops! Something went wrong
          </h1>
          <p className="text-xl text-red-500 mb-8">{error}</p>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-pink-100 relative overflow-hidden transition-all duration-500 ${
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
                className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-purple-100 hover:border-purple-300"
              >
                <span className="text-2xl">←</span>
              </button>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-purple-800 font-[var(--font-fredoka)]">
                  📖 {storyData?.childName}'s Adventure
                </h1>
                <p className="text-lg text-purple-600">
                  A {storyData?.storyType} story about {storyData?.subject}
                </p>
              </div>
            </div>
          </div>
        </header>
      )}

      <main className="flex-1 py-8 relative z-10">
        <div className="container mx-auto px-6 max-w-6xl">
          
          {/* Story Player */}
          <div 
            className={`bg-white rounded-3xl p-8 shadow-2xl border-4 border-purple-100 mb-8 transition-all duration-500 ${
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

            {/* Current Segment Display */}
            <div className={`text-center transition-all duration-300 ${
              isTransitioning ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
            } ${isFullscreen ? 'p-4 h-full flex flex-col justify-start pt-20' : 'mb-8'}`}>
              {!isFullscreen && (
                <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 animate-bounce-gentle">
                  📚
                </div>
              )}
              <h2 className={`text-2xl font-bold mb-4 font-[var(--font-fredoka)] ${
                isFullscreen ? 'text-white text-4xl' : 'text-purple-800'
              }`}>
                Chapter {currentSegment + 1} of {storySegments.length}
              </h2>
              
              {storySegments.length > 0 && (
                <div className="space-y-6">
                  {/* Generated Scene Image */}
                  {storySegments[currentSegment]?.generated_image && (
                    <div className={`mb-6 transition-all duration-500 ${
                      isTransitioning ? 'opacity-0 transform translate-x-10' : 'opacity-100 transform translate-x-0'
                    }`}>
                      <img
                        src={storySegments[currentSegment].generated_image}
                        alt={`Scene ${currentSegment + 1}`}
                        className={`w-full object-contain rounded-3xl shadow-2xl mx-auto border-4 cursor-pointer transition-all duration-300 hover:scale-105 ${
                          isFullscreen 
                            ? 'max-h-[60vh] border-gray-600 hover:border-gray-400' 
                            : 'max-h-96 border-purple-200 hover:border-purple-400'
                        }`}
                        onClick={toggleFullscreen}
                        title={isFullscreen ? 'Click to exit fullscreen' : 'Click for fullscreen (F key)'}
                      />
                    </div>
                  )}
                  
                  {/* Narrative Text */}
                  <div className={`rounded-2xl p-6 mb-6 transition-all duration-500 ${
                    isTransitioning ? 'opacity-0 transform translate-y-10' : 'opacity-100 transform translate-y-0'
                  } ${
                    isFullscreen 
                      ? 'bg-gray-900 bg-opacity-80 backdrop-blur-sm' 
                      : 'bg-purple-50'
                  }`}>
                    <p className={`text-lg leading-relaxed ${
                      isFullscreen 
                        ? 'text-white text-xl md:text-2xl text-center' 
                        : 'text-purple-800'
                    }`}>
                      {storySegments[currentSegment]?.narrative_text}
                    </p>
                  </div>

                  {/* Character Image (smaller, in corner) */}
                  {storyData?.characterImage && (
                    <div className="flex justify-center mb-4">
                      <div className="bg-white rounded-2xl p-4 shadow-lg">
                        <img
                          src={storyData.characterImage}
                          alt={`${storyData.childName} the ${storyData.childRole}`}
                          className="w-20 h-20 object-cover rounded-full border-2 border-purple-300"
                        />
                        <p className="text-purple-600 mt-2 font-bold text-sm text-center">
                          {storyData.childName}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Controls */}
            <div className={`flex justify-center gap-4 mb-8 transition-all duration-300 ${
              isFullscreen 
                ? `fixed bottom-4 left-1/2 transform -translate-x-1/2 z-60 bg-black bg-opacity-80 p-4 rounded-2xl ${
                    showFullscreenControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }` 
                : ''
            }`}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRestart();
                }}
                className={`font-bold py-3 px-6 rounded-2xl transition-all duration-300 ${
                  isFullscreen 
                    ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                ⏮️ Restart
              </button>
              
              {/* Navigation buttons in fullscreen */}
              {isFullscreen && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      currentSegment > 0 && handleSegmentClick(currentSegment - 1);
                    }}
                    disabled={currentSegment === 0}
                    className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50"
                  >
                    ⏪ Previous
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      currentSegment < storySegments.length - 1 && handleSegmentClick(currentSegment + 1);
                    }}
                    disabled={currentSegment === storySegments.length - 1}
                    className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50"
                  >
                    Next ⏩
                  </button>
                </>
              )}
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlay();
                }}
                disabled={isGeneratingAudio}
                className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-3 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
              >
                {isGeneratingAudio ? '🔄 Loading...' : isPlaying ? '⏸️ Pause' : '▶️ Play'}
              </button>
              
              {!isFullscreen && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFullscreen();
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300"
                  title="Fullscreen (F key)"
                >
                  🔳 Fullscreen
                </button>
              )}
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="bg-purple-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500"
                  style={{ width: `${((currentSegment + 1) / storySegments.length) * 100}%` }}
                ></div>
              </div>
              <p className="text-center text-purple-600 mt-2 text-sm">
                {currentSegment + 1} / {storySegments.length} segments
              </p>
            </div>
          </div>

          {/* Segment Navigation - Hidden in fullscreen */}
          {!isFullscreen && (
            <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-purple-100">
              <h3 className="text-xl font-bold text-purple-800 mb-6 text-center font-[var(--font-fredoka)]">
                📋 Story Chapters
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {storySegments.map((segment, index) => (
                  <button
                    key={segment.segment_id}
                    onClick={() => handleSegmentClick(index)}
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 text-left transform hover:scale-105 ${
                      currentSegment === index
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent shadow-lg'
                        : 'bg-purple-50 text-purple-700 border-purple-200 hover:border-purple-400 hover:bg-purple-100'
                    }`}
                  >
                    <div className="font-bold mb-2">Chapter {segment.segment_id}</div>
                    <div className="text-sm opacity-90 line-clamp-3">
                      {segment.narrative_text.substring(0, 100)}...
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Hidden audio element */}
      <audio ref={audioRef} className="hidden" />
    </div>
  );
}