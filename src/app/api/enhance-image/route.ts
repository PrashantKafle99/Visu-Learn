import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { image, visualEdits, imagePrompt, isStoryGeneration } = await request.json();
    
    let enhancementPrompt: string;
    let base64Image = '';
    
    // Handle story generation vs image enhancement
    if (isStoryGeneration) {
      // For story generation, use the imagePrompt directly
      enhancementPrompt = imagePrompt || "Generate a beautiful, whimsical illustration for a children's story.";
      
      // If there's a character image, use it as base
      if (image) {
        base64Image = image.replace(/^data:image\/[a-z]+;base64,/, '');
      }
    } else {
      // Original image enhancement logic
      if (!image) {
        throw new Error('Image is required for enhancement');
      }
      
      // Remove data URL prefix to get base64 string
      base64Image = image.replace(/^data:image\/[a-z]+;base64,/, '');
      
      // Create detailed prompt for image enhancement
      enhancementPrompt = "Enhance this educational image by adding the following visual elements to help explain the concept:\n\n";
      
      // Add arrows instructions
      if (visualEdits?.arrows && visualEdits.arrows.length > 0) {
        enhancementPrompt += "ARROWS TO ADD:\n";
        visualEdits.arrows.forEach((arrow: { color: string; direction: string; position: string; purpose: string }, index: number) => {
          enhancementPrompt += `${index + 1}. Draw a ${arrow.color} arrow ${arrow.direction} ${arrow.position} to ${arrow.purpose}\n`;
        });
        enhancementPrompt += "\n";
      }
      
      // Add highlights instructions
      if (visualEdits?.highlights && visualEdits.highlights.length > 0) {
        enhancementPrompt += "AREAS TO HIGHLIGHT:\n";
        visualEdits.highlights.forEach((highlight: { color: string; style: string; area: string; purpose: string }, index: number) => {
          enhancementPrompt += `${index + 1}. Add a ${highlight.color} ${highlight.style} highlight around ${highlight.area} to ${highlight.purpose}\n`;
        });
        enhancementPrompt += "\n";
      }
      
      // Add labels instructions
      if (visualEdits?.labels && visualEdits.labels.length > 0) {
        enhancementPrompt += "LABELS TO ADD:\n";
        visualEdits.labels.forEach((label: { color: string; text: string; position: string; purpose: string }, index: number) => {
          enhancementPrompt += `${index + 1}. Add ${label.color} text "${label.text}" ${label.position} to ${label.purpose}\n`;
        });
        enhancementPrompt += "\n";
      }
      
      enhancementPrompt += "Make sure all additions are clear, educational, and kid-friendly. Keep the original image intact while adding these visual enhancements.";
    }
    
    console.log('🎨 Image Enhancement/Generation Prompt:', enhancementPrompt);
    
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=' + process.env.GEMINI_API_KEY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [
            { text: enhancementPrompt },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 32,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini Image API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('🖼️ Gemini Image API Response:', JSON.stringify(data, null, 2));
    
    // Extract the enhanced image
    const candidate = data.candidates?.[0];
    if (!candidate) {
      throw new Error('No candidate returned from Gemini Image API');
    }
    
    const imagePart = candidate.content.parts.find((p: { inlineData?: { data: string } }) => p.inlineData?.data);
    if (!imagePart) {
      throw new Error('No enhanced image in response');
    }
    
    const enhancedImageBase64 = imagePart.inlineData.data;
    const enhancedImageUrl = `data:image/png;base64,${enhancedImageBase64}`;
    
    return NextResponse.json({ 
      success: true, 
      enhancedImage: enhancedImageUrl 
    });

  } catch (error) {
    console.error('❌ Error enhancing image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to enhance image' },
      { status: 500 }
    );
  }
}