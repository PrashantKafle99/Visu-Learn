import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface StoryRequest {
  storyType: string;
  subject: string;
  duration: number;
  age: number;
  childName: string;
  childRole: string;
  characterImage?: string;
  learningConcept?: string;
  storySetting?: string;
}

export async function POST(request: NextRequest) {
  try {
    const startTime = Date.now();
    console.log('🎭 Starting story generation...');

    const body: StoryRequest = await request.json();
    const { 
      storyType, 
      subject, 
      duration, 
      age, 
      childName, 
      childRole,
      learningConcept,
      storySetting
    } = body;

    // Generate character description based on role and name
    const characterDescription = generateCharacterDescription(childName, childRole, age);
    
    // Generate learning concept if not provided
    const concept = learningConcept || generateLearningConcept(subject);
    
    // Generate story setting if not provided
    const setting = storySetting || generateStorySetting(storyType);

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `# ROLE AND GOAL
You are a creative and educational storyteller for children. Your primary goal is to generate a complete, engaging, and age-appropriate story script that seamlessly integrates a specific learning concept. The script will be used to create an animated story video, with each segment of the narrative corresponding to a new image.

# TASK
Generate a fictional story based on the provided user inputs. The story must be broken down into sequential segments. Each segment must contain two components: 
1) The narrative text to be read aloud, lasting approximately 15 seconds. 
2) A detailed prompt for an image generation model to create a corresponding visual scene. The character must remain visually consistent throughout the story.

# INPUTS
Here are the user's selections for the story:
- **story_subject**: "${subject}"
- **learning_concept**: "${concept}"
- **story_genre**: "${storyType}"
- **target_age**: ${age}
- **story_duration_minutes**: ${duration}
- **character_name**: "${childName}"
- **character_role**: "${childRole}"
- **character_description**: "${characterDescription}"
- **story_setting**: "${setting}"

# OUTPUT FORMAT SPECIFICATION
- The entire output MUST be a single JSON array.
- Each element in the array is a JSON object representing one story segment.
- Each segment object MUST have three keys:
1. "segment_id": An integer representing the order of the segment, starting from 1.
2. "narrative_text": A string containing the story's text for this segment. The language must be simple enough for the target_age. The reading time should be around 15 seconds.
3. "image_generation_prompt": A string containing a detailed, descriptive prompt for a text-to-image AI. This prompt must include:
   - The main action of the scene
   - The environment/background as described in the story_setting
   - The character's emotion and pose
   - A special placeholder, [CHARACTER], which refers to the character defined in the character_description input
   - A recommended art style, e.g., "Vibrant cartoon style", "Digital storybook illustration", "Whimsical watercolor"

# EXAMPLE
## EXAMPLE INPUTS:
- **story_subject**: "Photosynthesis"
- **learning_concept**: "How plants use sunlight for food."
- **story_genre**: "Fantasy"
- **target_age**: 6
- **story_duration_minutes**: 2
- **character_name**: "Lily"
- **character_role**: "Forest Explorer"
- **character_description**: "A young girl with curly brown hair tied in a ponytail, wearing green overalls over a yellow t-shirt, and carrying a small backpack. She has a cheerful and curious expression."
- **story_setting**: "An enchanted forest where the plants can talk."

## EXPECTED OUTPUT FOR EXAMPLE:
[
  {
    "segment_id": 1,
    "narrative_text": "Once upon a time, in a whispering, enchanted forest, a curious explorer named Lily was searching for the biggest, most beautiful flower she had ever seen.",
    "image_generation_prompt": "[CHARACTER] as a cheerful Forest Explorer, walking on a mossy path inside an enchanted forest. Sunlight streams through the tall, magical trees. Vibrant cartoon style."
  },
  {
    "segment_id": 2,
    "narrative_text": "Deep in the woods, she found a little sapling hiding in the dark shadow of a giant rock. It looked very tired and its leaves were pale and droopy.",
    "image_generation_prompt": "[CHARACTER] kneels down with a concerned expression, looking at a small, sad sapling in a dark shadow next to a large mossy rock. Enchanted forest background. Whimsical watercolor style."
  },
  {
    "segment_id": 3,
    "narrative_text": "'Why are you so sad, little plant?' Lily asked. The sapling whispered back, 'I'm so hungry, but I can't reach the golden light that all the other plants are eating!'",
    "image_generation_prompt": "A close-up of [CHARACTER] listening intently to the small, talking sapling. A single, golden sunbeam is visible far away from them, illuminating other happy plants. Digital storybook illustration."
  },
  {
    "segment_id": 4,
    "narrative_text": "Lily understood! Plants eat sunlight! With all her might, she carefully pushed a small opening in the leaves above, letting a bright sunbeam shine down right on the little sapling.",
    "image_generation_prompt": "[CHARACTER] is on her tiptoes, pushing aside large leaves to let a bright, golden sunbeam shine down directly onto the small sapling, which is starting to look happier. Vibrant cartoon style."
  },
  {
    "segment_id": 5,
    "narrative_text": "Instantly, the sapling's leaves turned a bright, happy green! It stood up tall and strong. 'Thank you, Lily!' it cheered. 'You gave me the most delicious breakfast!'",
    "image_generation_prompt": "The small sapling is now bright green and healthy, standing tall in the sunbeam. [CHARACTER] is sitting next to it, smiling proudly with her hands on her cheeks. Whimsical watercolor style."
  }
]

Now generate the story based on the provided inputs. Return ONLY the JSON array, no additional text or formatting.`;

    console.log('📝 Generating story with Gemini...');
    const result = await model.generateContent(prompt);
    const response = result.response;
    let storyText = response.text();

    // Print the entire raw LLM response to terminal
    console.log('\n' + '='.repeat(80));
    console.log('🤖 FULL LLM RESPONSE FROM GEMINI:');
    console.log('='.repeat(80));
    console.log(storyText);
    console.log('='.repeat(80));
    console.log('📏 Response length:', storyText.length, 'characters');
    console.log('='.repeat(80) + '\n');

    // Clean up the response to ensure it's valid JSON
    storyText = storyText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    let storySegments;
    try {
      storySegments = JSON.parse(storyText);
    } catch (parseError) {
      console.error('❌ JSON parsing failed:', parseError);
      throw new Error('Failed to parse story response');
    }

    const endTime = Date.now();
    console.log(`✅ Story generated successfully in ${endTime - startTime}ms`);
    console.log(`📊 Generated ${storySegments.length} story segments`);

    return NextResponse.json({
      success: true,
      story: storySegments,
      metadata: {
        storyType,
        subject,
        duration,
        age,
        childName,
        childRole,
        segmentCount: storySegments.length,
        generationTime: endTime - startTime
      }
    });

  } catch (error) {
    console.error('❌ Story generation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate story',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function generateCharacterDescription(name: string, role: string, age: number): string {
  const descriptions = {
    'Brave Explorer': `A ${age}-year-old child named ${name} with bright, adventurous eyes and a confident smile. Wearing a khaki explorer's vest with many pockets, sturdy boots, and carrying a small compass. Has an eager, determined expression and stands with hands on hips ready for adventure.`,
    'Curious Scientist': `A ${age}-year-old child named ${name} with inquisitive eyes behind round glasses. Wearing a white lab coat over colorful clothes, with messy hair from experiments. Carries a small notebook and magnifying glass, always with a thoughtful, wondering expression.`,
    'Magical Wizard': `A ${age}-year-old child named ${name} with sparkling, mystical eyes. Wearing a purple wizard robe with silver stars, a pointed hat, and carrying a small wooden wand. Has flowing hair and a wise, magical smile with an aura of wonder.`,
    'Space Astronaut': `A ${age}-year-old child named ${name} with bright, curious eyes full of wonder. Wearing a silver spacesuit with colorful patches and a clear helmet. Has an excited, adventurous expression and often points toward the stars with enthusiasm.`,
    'Detective': `A ${age}-year-old child named ${name} with sharp, observant eyes. Wearing a detective coat, carrying a magnifying glass and small notebook. Has neat hair and a serious but friendly expression, always ready to solve mysteries.`,
    'Nature Guardian': `A ${age}-year-old child named ${name} with kind, gentle eyes. Wearing earth-toned clothes with leaf patterns, flower crown, and carrying a small watering can. Has a caring, nurturing expression and seems to glow with natural energy.`,
    'Time Traveler': `A ${age}-year-old child named ${name} with wise, adventurous eyes. Wearing a mix of clothing from different eras - a steampunk vest, modern sneakers, and a vintage cap. Carries a glowing pocket watch and has an excited, curious expression.`,
    'Inventor': `A ${age}-year-old child named ${name} with creative, intelligent eyes. Wearing overalls covered in colorful paint and small gadgets. Has slightly messy hair from working and carries a toolbox full of imaginative inventions. Always has an innovative, excited expression.`
  };

  return descriptions[role as keyof typeof descriptions] || descriptions['Brave Explorer'];
}

function generateLearningConcept(subject: string): string {
  const concepts = {
    'physics': 'How forces and energy work in our world',
    'mathematics': 'How numbers and patterns help us solve problems',
    'chemistry': 'How different materials mix and change',
    'biology': 'How living things grow and survive',
    'geography': 'How our planet Earth works and changes',
    'history': 'How people lived and what we can learn from the past'
  };

  return concepts[subject as keyof typeof concepts] || 'How science helps us understand the world';
}

function generateStorySetting(storyType: string): string {
  const settings = {
    'adventure': 'A vast, colorful world with mountains, forests, and hidden treasures waiting to be discovered',
    'fantasy': 'A magical realm with talking animals, enchanted forests, and sparkling castles in the clouds',
    'sci-fi': 'A futuristic world with flying cars, robot friends, and amazing space stations among the stars',
    'mystery': 'A curious town with secret passages, hidden clues, and mysterious but friendly characters'
  };

  return settings[storyType as keyof typeof settings] || settings['adventure'];
}