import { NextRequest, NextResponse } from 'next/server';

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Retry function with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      // If it's a rate limit error (429) and we have retries left
      if (error instanceof Error && error.message.includes('429') && attempt < maxRetries) {
        const delayTime = baseDelay * Math.pow(2, attempt); // Exponential backoff
        console.log(` Rate limited, retrying in ${delayTime}ms (attempt ${attempt + 1}/${maxRetries + 1})`);
        await delay(delayTime);
        continue;
      }
      
      // If it's not a rate limit error or we're out of retries, throw immediately
      throw error;
    }
  }
  
  throw lastError!;
}

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
    
    if (!text) {
      return NextResponse.json(
        { success: false, error: 'Text is required' },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.ELEVENLABS_API_KEY) {
      console.error('❌ ElevenLabs API key not configured');
      return NextResponse.json(
        { success: false, error: 'ElevenLabs API key not configured' },
        { status: 500 }
      );
    }

    const voiceId = "JBFqnCBsd6RMkjVDRZzb"; // Default voice from ElevenLabs
    console.log('🔊 Generating TTS for text:', text.substring(0, 50) + '...');
    
    // Wrap the API call in retry logic
    const audioBuffer = await retryWithBackoff(async () => {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY!,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          output_format: 'mp3_44100_128',
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ ElevenLabs API error ${response.status}:`, errorText);
        
        if (response.status === 401) {
          throw new Error(`ElevenLabs API authentication failed (401). Please check your API key.`);
        } else if (response.status === 429) {
          throw new Error(`ElevenLabs API rate limit exceeded (429)`);
        } else {
          throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
        }
      }

      return await response.arrayBuffer();
    }, 3, 2000); // 3 retries, starting with 2 second delay
    
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'attachment; filename="explanation.mp3"',
      },
    });

  } catch (error) {
    console.error('Error generating TTS:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate audio' },
      { status: 500 }
    );
  }
}