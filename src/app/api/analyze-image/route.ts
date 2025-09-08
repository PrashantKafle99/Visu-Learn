import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { image, subject, previousConcepts = [] } = await request.json();
    
    // Remove data URL prefix to get base64 string
    const base64Image = image.replace(/^data:image\/[a-z]+;base64,/, '');
    
    const prompt = `You are an expert ${subject} teacher specializing in visual learning for children aged 7-12. Your job is to analyze the uploaded image and create an engaging educational experience.

TASK: Analyze this image and identify ONE key ${subject} concept that can be clearly observed or demonstrated in the image.

RESPONSE FORMAT: Provide your response in the following JSON format:

{
  "concept": {
    "name": "Name of the concept (e.g., 'Light Reflection', 'Geometric Shapes', 'Plant Growth')",
    "explanation": "A fun, engaging explanation of this concept in 2-3 sentences that a child would understand and find exciting. Use simple language and relate it to things kids know."
  },
  "visual_edits": {
    "arrows": [
      {
        "direction": "Direction to draw arrow (e.g., 'from top-left to bottom-right', 'pointing upward')",
        "position": "Where to place arrow (e.g., 'near the light source', 'on the curved surface')",
        "color": "Arrow color (red, blue, green, yellow, purple)",
        "purpose": "What this arrow shows (e.g., 'shows light direction', 'indicates force')"
      }
    ],
    "highlights": [
      {
        "area": "What to highlight (e.g., 'the shadow area', 'the circular shape')",
        "color": "Highlight color (yellow, green, blue, pink)",
        "style": "circle, rectangle, or outline",
        "purpose": "Why highlight this (e.g., 'shows the main concept', 'draws attention to key feature')"
      }
    ],
    "labels": [
      {
        "text": "Label text (keep it short, 1-2 words)",
        "position": "Where to place label (e.g., 'above the object', 'to the right')",
        "color": "Text color",
        "purpose": "What this label explains"
      }
    ]
  }
}

EXAMPLES:

Example 1 - Physics (Light):
If image shows a lamp casting shadows:
{
  "concept": {
    "name": "Light and Shadows",
    "explanation": "Light travels in straight lines! When light hits an object, it can't bend around it, so it creates a dark area called a shadow on the other side. The bigger the object, the bigger the shadow!"
  },
  "visual_edits": {
    "arrows": [
      {
        "direction": "from light source toward object",
        "position": "between lamp and object",
        "color": "yellow",
        "purpose": "shows light direction"
      }
    ],
    "highlights": [
      {
        "area": "the shadow area",
        "color": "blue",
        "style": "outline",
        "purpose": "shows where light cannot reach"
      }
    ],
    "labels": [
      {
        "text": "Shadow",
        "position": "in the dark area",
        "color": "white",
        "purpose": "identifies the shadow"
      }
    ]
  }
}

Example 2 - Mathematics (Shapes):
If image shows circular objects:
{
  "concept": {
    "name": "Circles in Nature",
    "explanation": "A circle is a perfectly round shape where every point is the same distance from the center! We can find circles everywhere - in wheels, coins, and even tree rings!"
  },
  "visual_edits": {
    "arrows": [
      {
        "direction": "pointing to center",
        "position": "from edge to middle of circle",
        "color": "red",
        "purpose": "shows the center point"
      }
    ],
    "highlights": [
      {
        "area": "the circular objects",
        "color": "green",
        "style": "circle",
        "purpose": "identifies circular shapes"
      }
    ],
    "labels": [
      {
        "text": "Circle",
        "position": "next to highlighted shape",
        "color": "black",
        "purpose": "names the shape"
      }
    ]
  }
}

IMPORTANT GUIDELINES:
1. Focus on ONE clear concept that's actually visible in the image
2. Keep explanations simple and exciting for kids
3. Provide specific, actionable visual editing instructions
4. Use bright, kid-friendly colors
5. Make sure arrows and highlights help explain the concept clearly
6. If you can't find a clear ${subject} concept in the image, choose the closest related concept and explain the connection

${previousConcepts.length > 0 ? `
PREVIOUS CONCEPTS ALREADY EXPLAINED:
${previousConcepts.map((concept: string, index: number) => `${index + 1}. ${concept}`).join('\n')}

IMPORTANT: Do NOT repeat any of the above concepts. Find a DIFFERENT ${subject} concept in the same image. Look for other elements, patterns, or phenomena that haven't been explained yet.
` : ''}

Now analyze the provided image and respond in the exact JSON format above:`;

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=' + process.env.GEMINI_API_KEY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: base64Image
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('🧠 Gemini Analysis API Response:', JSON.stringify(data, null, 2));
    
    const generatedText = data.candidates[0].content.parts[0].text;
    console.log('📝 Generated Analysis Text:', generatedText);
    
    // Try to parse JSON from the response
    let analysisResult;
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        analysisResult = JSON.parse(generatedText);
      }
    } catch {
      // If JSON parsing fails, return the raw text
      analysisResult = {
        concept: {
          name: "Analysis Result",
          explanation: generatedText
        },
        visual_edits: {
          arrows: [],
          highlights: [],
          labels: []
        }
      };
    }

    console.log('✅ Final Analysis Result:', JSON.stringify(analysisResult, null, 2));
    
    return NextResponse.json({ 
      success: true, 
      analysis: analysisResult 
    });

  } catch (error) {
    console.error('Error analyzing image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to analyze image' },
      { status: 500 }
    );
  }
}