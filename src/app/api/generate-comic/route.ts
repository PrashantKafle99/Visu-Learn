import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const comicData = await request.json();
    
    console.log('🎨 Starting comic generation with data:', JSON.stringify(comicData, null, 2));

    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    // Get character pronouns for proper grammar - handle missing pronouns field
    const pronouns = comicData.pronouns || 'they';
    const subjectPronoun = pronouns === 'he' ? 'he' : pronouns === 'she' ? 'she' : pronouns === 'it' ? 'it' : 'they';
    const objectPronoun = pronouns === 'he' ? 'him' : pronouns === 'she' ? 'her' : pronouns === 'it' ? 'it' : 'them';
    const possessivePronoun = pronouns === 'he' ? 'his' : pronouns === 'she' ? 'her' : pronouns === 'it' ? 'its' : 'their';

    console.log('🎭 Character pronouns:', { pronouns, subjectPronoun, objectPronoun, possessivePronoun });

    // Construct the detailed one-shot prompt for comic generation
    const prompt = `You are a professional comic book artist and writer specializing in educational superhero comics for children.

YOUR TASK
Create a TRUE COMIC BOOK with EXACTLY ${comicData.panels} panels — no more, no less — formatted as STRICT, VALID JSON.

VARIABLES (provided to you):
- Character: ${comicData.childName} the ${comicData.childRole} (age ${comicData.age}, pronouns: ${subjectPronoun}/${objectPronoun}/${possessivePronoun})
- Comic Genre: ${comicData.comicType}
- Subject: ${comicData.subject}
- Learning Concept: ${comicData.learningConcept}
- Setting: ${comicData.comicSetting}
- EXACT Panel Count: ${comicData.panels}

OUTPUT FORMAT (STRICT JSON ONLY — NO EXTRA KEYS, NO COMMENTS OUTSIDE STRING VALUES):
{
  "title": "<string>",
  "description": "<string>",
  "panels": [
    {
      "panel_id": <integer 1..${comicData.panels}>,
      "panel_text": "<string dialogue/narration including speech/thought bubbles cues and SFX>",
      "image_generation_prompt": "<string detailed image prompt; MUST include: 'consistent character design' AND 'same ${comicData.childName} as previous panels'>"
    }
    // ...repeat until panel_id === ${comicData.panels}
  ]
}

ABSOLUTE RULES (DO NOT BREAK):
1) EXACT COUNT: Produce EXACTLY ${comicData.panels} panel objects. If ${comicData.panels}=6, there must be 6 panels in the array, with panel_id 1..6.
2) CONSISTENT HERO: ${comicData.childName} appears in EVERY panel; keep identical physical features and costume cues each time.
3) PRONOUNS: Use ${subjectPronoun}/${objectPronoun}/${possessivePronoun} correctly in ALL dialogue and narration.
4) IMAGE PROMPT PHRASE: Every single "image_generation_prompt" MUST explicitly include BOTH strings:
   - "consistent character design"
   - "same ${comicData.childName} as previous panels"
5) SETTING: All panels are clearly in ${comicData.comicSetting} (show it visually and/or mention it).
6) GENRE: Follow ${comicData.comicType} genre conventions (heroic poses, dynamic action, etc.).
7) AGE FIT: Make it age-appropriate for ${comicData.age}-year-olds (simple, positive, kind; no violence, fear, or complex jargon).
8) SUBJECT FOCUS: Each panel must advance the story AND teach "${comicData.learningConcept}" in kid-friendly steps.
9) TRUE COMIC STYLE VISUAL LANGUAGE:
   - Bold outlines, vibrant colors, dramatic shading
   - Speech bubbles with tails pointing to speakers; thought bubbles for inner thoughts
   - Onomatopoeia (POW! WHOOSH! ZAP!) as needed
   - Panel borders with clear gutters
   - Dynamic camera angles (close-ups, low/high angles), motion/speed lines, impact stars
   - Superhero costume design and heroic postures for ${comicData.childName}
10) JSON PURITY: No trailing commas; escape inner quotes; produce ONLY the JSON object (no headings, no explanations outside strings).

CHARACTER CONSISTENCY CHECKLIST (APPLY IN EVERY IMAGE PROMPT):
- Name: ${comicData.childName}
- Age: ${comicData.age}
- Role: ${comicData.childRole}
- Distinctive features: hair style/color, skin tone, signature costume colors, emblem, accessories
- Keep facial features, costume, and proportions identical each panel
- Include: "consistent character design" and "same ${comicData.childName} as previous panels"

DIALOGUE & LEARNING CUES (WORK THESE INTO "panel_text"):
- Use simple sentences; define terms with kid-friendly analogies
- Show curiosity → mini-experiment/observation → explanation → recap
- Include clear SFX where appropriate (e.g., "CLANG!", "WHOOSH!", "ZAP!")
- Use thought bubbles for inner questions; speech bubbles for teaching lines
- Sprinkle quick micro-checks: “What do we predict?” / “Let’s compare!” / “So we learned…”

COMIC WRITING GUARDRAILS:
- Positive, inclusive, encouraging tone
- No real-world brands, politics, scary peril, or unsafe behavior without explicit safety notes
- Keep humor gentle and supportive
- Respect attention span: one clear idea per panel that builds to the next

PANEL-BY-PANEL MICRO-STRUCTURE (GUIDE):
1) Hook/Question: ${comicData.childName} wonders about the concept in ${comicData.comicSetting}.
2) Predict/Plan: Make a guess or outline a simple step.
3..(n-2)) Explore: Perform steps, compare, visualize, or show examples.
(n-1)) Explain: Put results into a clear rule/definition.
n) Recap/Apply: Celebrate and restate the key idea with a memorable takeaway.

IMAGE PROMPT BLUEPRINT (USE & ADAPT EACH PANEL):
"True comic book art, bold outlines, vibrant primary colors, dramatic shading; ${comicData.childName} the ${comicData.childRole} (${comicData.age}, ${subjectPronoun}/${objectPronoun}/${possessivePronoun}) with [consistent physical features + costume cues], in ${comicData.comicSetting}; dynamic camera angle, clear gutters, speech/thought bubbles, onomatopoeia if used; speed lines/impact stars as needed; superhero-style pose; comic color palette; include phrases: consistent character design; same ${comicData.childName} as previous panels."

COMMON FAILURES TO AVOID:
- Wrong panel count (automatic failure)
- Missing required phrases in image prompts
- Swapping pronouns or changing character appearance
- Vague setting or off-genre visuals
- Non-JSON output or extra keys
- Teaching jumps straight to the answer without steps

FINAL SELF-CHECK (DO THIS BEFORE YOU OUTPUT):
- Count panels: is array length EXACTLY ${comicData.panels}?
- Are panel_id values 1..${comicData.panels} in order with no gaps?
- Is ${comicData.childName} present in EVERY "panel_text" and implicitly/visually present in EVERY "image_generation_prompt"?
- Do ALL image prompts include BOTH: "consistent character design" AND "same ${comicData.childName} as previous panels"?
- Does each panel clearly support "${comicData.learningConcept}" and occur in ${comicData.comicSetting}?
- JSON validates (no trailing commas; quotes escaped; only the specified keys)?

––––––––––––––––––––––––––––––––––––––––
FEW-SHOT EXAMPLES (FOR STYLE LEARNING ONLY — DO NOT COPY TO OUTPUT)
(These show tone, pacing, and visual specificity. Your final output MUST still follow the strict JSON spec above and match the provided variables.)

EXAMPLE A (4 panels): Gravity basics for an 8-year-old
{
  "title": "Luna's Gravity Adventure",
  "description": "Luna the Explorer discovers how gravity works through fun experiments",
  "panels": [
    {
      "panel_id": 1,
      "panel_text": "Luna: \"Why do things always fall down?\" (thought bubble) \"Does the Earth pull them?\"",
      "image_generation_prompt": "Comic book style: Luna (8, brown pigtails, blue vest, khaki shorts, playful backpack emblem), in a colorful school science lab; bold outlines, vibrant colors; close-up with question mark icons; speech and thought bubbles; dynamic angle; consistent character design; same Luna as previous panels."
    },
    {
      "panel_id": 2,
      "panel_text": "Luna: \"Prediction: the apple and ball will both drop!\" SFX: \"WHOOSH!\"",
      "image_generation_prompt": "Side view of the same Luna about to drop an apple and a rubber ball at the lab table; speed lines showing motion; clear gutters; bold outlines; consistent character design; same Luna as previous panels."
    },
    {
      "panel_id": 3,
      "panel_text": "Luna: \"They both fell! Gravity pulls objects toward Earth.\"",
      "image_generation_prompt": "Both objects mid-fall with motion lines; Luna points downward, simple arrow labeled 'gravity'; dynamic low angle; vibrant palette; consistent character design; same Luna as previous panels."
    },
    {
      "panel_id": 4,
      "panel_text": "Luna: \"Lesson: Gravity pulls things down. We feel it every day!\"",
      "image_generation_prompt": "Luna in hero pose, tiny Earth diagram behind her; bold comic shading; celebratory sparkles; consistent character design; same Luna as previous panels."
    }
  ]
}
Teaching notes: Panel 1 asks a hook question; Panel 2 makes a prediction; Panel 3 confirms with observation and labels; Panel 4 recaps the rule simply.

EXAMPLE B (4 panels): Fractions as equal parts (age 9)
{
  "title": "Captain Fraction Saves Snack Time",
  "description": "Captain Fraction shows how fractions are equal parts of a whole using pizza and shapes.",
  "panels": [
    {
      "panel_id": 1,
      "panel_text": "Captain Fraction: \"A fraction shows equal parts of a whole!\"",
      "image_generation_prompt": "Comic style: Captain Fraction (9, curly black hair, green cape with fraction symbol), school cafeteria; bold outlines, vibrant colors; speech bubble; consistent character design; same Captain Fraction as previous panels."
    },
    {
      "panel_id": 2,
      "panel_text": "Captain Fraction: \"If we cut a pizza into 4 equal slices, each slice is 1/4.\"",
      "image_generation_prompt": "Top-down pizza cut into four equal slices with labels; cafeteria table; arrows labeling '1/4'; dynamic diagram; consistent character design; same Captain Fraction as previous panels."
    },
    {
      "panel_id": 3,
      "panel_text": "Captain Fraction: \"Equal parts matter! Uneven slices are not 1/4.\"",
      "image_generation_prompt": "Side-by-side: equal pizza vs. messy uneven pizza; big checkmark and X icons; bold comic contrasts; consistent character design; same Captain Fraction as previous panels."
    },
    {
      "panel_id": 4,
      "panel_text": "Captain Fraction: \"Remember: denominator = total equal parts.\"",
      "image_generation_prompt": "Hero pose, cape flowing; large 'denominator = total equal parts' on a whiteboard bubble; consistent character design; same Captain Fraction as previous panels."
    }
  ]
}
Teaching notes: Concrete example → contrast → concise rule.

EXAMPLE C (4 panels): Photosynthesis (age 10)
{
  "title": "Solar Chef: How Plants Make Food",
  "description": "Hero ${comicData.childName} explains photosynthesis in a sunny school garden.",
  "panels": [
    {
      "panel_id": 1,
      "panel_text": "${comicData.childName}: \"Plants use sunlight, water, and air to make food!\"",
      "image_generation_prompt": "Comic style garden; ${comicData.childName} in leaf-emblem costume; arrows to sun, roots (water), leaves (air/CO2); vibrant greens; consistent character design; same ${comicData.childName} as previous panels."
    },
    {
      "panel_id": 2,
      "panel_text": "${comicData.childName}: \"Leaves are tiny kitchens. Sunlight is the power!\" SFX: \"SHINE!\"",
      "image_generation_prompt": "Close-up leaf with stylized 'kitchen' metaphor; glowing sun icons; bold outlines; consistent character design; same ${comicData.childName} as previous panels."
    },
    {
      "panel_id": 3,
      "panel_text": "${comicData.childName}: \"Result: plants make glucose (food) and release oxygen!\"",
      "image_generation_prompt": "Simple diagram: inputs → leaf → outputs (glucose, oxygen bubbles); labels; dynamic arrows; consistent character design; same ${comicData.childName} as previous panels."
    },
    {
      "panel_id": 4,
      "panel_text": "${comicData.childName}: \"Takeaway: Sun + water + CO2 → food + oxygen!\"",
      "image_generation_prompt": "Heroic stance; recap formula in comic text callout; vibrant palette; consistent character design; same ${comicData.childName} as previous panels."
    }
  ]
}
Teaching notes: Visual metaphor + labeled diagram + formula recap.

END OF EXAMPLES
––––––––––––––––––––––––––––––––––––––––

NOW CREATE YOUR COMIC:
- MUST have exactly ${comicData.panels} panels (count them carefully)
- Each panel must advance the story and teach about "${comicData.learningConcept}"
- Make it age-appropriate for ${comicData.age}-year-olds
- Include ${comicData.childName} as the main character in every panel
- Set all visuals in ${comicData.comicSetting}
- Follow ${comicData.comicType} genre conventions
- CRITICAL: Maintain character consistency in every image prompt
- Use comic book visual language (speech bubbles, thought bubbles, SFX)
- OUTPUT ONLY the JSON object in the exact schema specified above

DOUBLE-CHECK BEFORE YOU SUBMIT:
- The "panels" array length equals ${comicData.panels}
- panel_id values are 1..${comicData.panels} with no gaps/duplicates
- Every image prompt includes BOTH required strings:
  • "consistent character design"
  • "same ${comicData.childName} as previous panels"
- ${comicData.childName} and ${comicData.comicSetting} appear throughout
- JSON is valid and parseable with no extra keys or comments
`;

    console.log('📝 Generated prompt for Gemini API');

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=' + process.env.GEMINI_API_KEY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('🤖 Raw Gemini API Response:', JSON.stringify(data, null, 2));
    
    // Extract the generated text
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!generatedText) {
      throw new Error('No content generated by Gemini API');
    }

    console.log('📄 Generated text:', generatedText);

    // Parse the JSON response
    let comicContent;
    try {
      // Clean the response text (remove markdown code blocks if present)
      const cleanedText = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      comicContent = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('❌ JSON parsing error:', parseError);
      console.log('Raw text that failed to parse:', generatedText);
      throw new Error('Failed to parse comic content as JSON');
    }

    // Validate the comic structure
    if (!comicContent.panels || !Array.isArray(comicContent.panels)) {
      throw new Error('Invalid comic structure: missing panels array');
    }

    // CRITICAL: Enforce exact panel count - truncate or pad as needed
    const requestedPanelCount = parseInt(comicData.panels);
    if (comicContent.panels.length !== requestedPanelCount) {
      console.warn(`⚠️ Expected ${requestedPanelCount} panels, got ${comicContent.panels.length}. Fixing...`);
      
      if (comicContent.panels.length > requestedPanelCount) {
        // Truncate extra panels
        comicContent.panels = comicContent.panels.slice(0, requestedPanelCount);
        console.log(`✂️ Truncated to ${requestedPanelCount} panels`);
      } else if (comicContent.panels.length < requestedPanelCount) {
        // Pad with basic panels if needed
        const missingCount = requestedPanelCount - comicContent.panels.length;
        for (let i = 0; i < missingCount; i++) {
          const panelNum = comicContent.panels.length + i + 1;
          comicContent.panels.push({
            panel_id: panelNum,
            panel_text: `${comicData.childName}: "Let's continue our adventure!"`,
            image_generation_prompt: `Comic book style illustration of ${comicData.childName} the ${comicData.childRole}, consistent character design with previous panels, same clothing and appearance, set in ${comicData.comicSetting}, vibrant colors, bold comic outlines, speech bubble.`
          });
        }
        console.log(`➕ Added ${missingCount} panels to reach ${requestedPanelCount}`);
      }
    }

    // Ensure each panel has required fields with enhanced character consistency
    comicContent.panels = comicContent.panels.map((panel: any, index: number) => {
      let enhancedPrompt = panel.image_generation_prompt || panel.image_prompt || `Comic panel showing ${comicData.childName} the ${comicData.childRole}`;
      
      // Add character consistency instructions to every prompt
      if (!enhancedPrompt.includes('consistent character')) {
        enhancedPrompt = `${enhancedPrompt}. CRITICAL: Maintain consistent character design - same ${comicData.childName} with identical physical features, clothing, and appearance as all previous panels. Character consistency is essential.`;
      }
      
      // Add comic book style if not present
      if (!enhancedPrompt.includes('comic book style')) {
        enhancedPrompt = `Comic book style illustration: ${enhancedPrompt}`;
      }
      
      return {
        panel_id: panel.panel_id || index + 1,
        panel_text: panel.panel_text || panel.text || `${comicData.childName}: "Panel ${index + 1}"`,
        image_generation_prompt: enhancedPrompt
      };
    });

    console.log('✅ Comic generated successfully');
    console.log(`📊 Generated ${comicContent.panels.length} panels`);
    console.log('================================================================================');
    console.log('🎨 COMIC CONTENT:');
    console.log('================================================================================');
    console.log(`Title: ${comicContent.title}`);
    console.log(`Description: ${comicContent.description}`);
    console.log('Panels:');
    comicContent.panels.forEach((panel: any, index: number) => {
      console.log(`  Panel ${panel.panel_id}: ${panel.panel_text}`);
      console.log(`  Image: ${panel.image_generation_prompt}`);
      console.log('  ---');
    });
    console.log('================================================================================');
    console.log(`📏 Response length: ${JSON.stringify(comicContent).length} characters`);
    console.log('================================================================================');

    return NextResponse.json({
      success: true,
      ...comicContent
    });

  } catch (error) {
    console.error('❌ Error generating comic:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate comic', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
