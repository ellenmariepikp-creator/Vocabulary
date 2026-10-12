import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API: Generate Kid-Friendly Vocabulary Mini Story
app.post('/api/gemini/story', async (req: Request, res: Response) => {
  try {
    const { words, petName, petType, gradeLevel } = req.body;
    const targetWords = Array.isArray(words) && words.length > 0 ? words : ['curious', 'glimmer', 'brave'];
    const companion = petName || 'Pip the Fox';

    if (!ai) {
      // High quality pre-crafted fallback story
      return res.json({
        title: `The Secret of Star Mountain`,
        story: `One morning, ${companion} discovered a shiny golden feather nestled by the path. Feeling extremely curious, the little adventurer took a brave step forward into the enchanted meadow where soft crystals began to glimmer like fallen stars! With a happy bounce, they knew today would be an unforgettable quest.`,
        highlightedWords: targetWords,
        question: `How did ${companion} feel before stepping into the meadow?`,
        options: ['Curious and brave', 'Sleepy and grumpy', 'Bored and tired'],
        correctAnswer: 'Curious and brave',
        moral: 'Curiosity and bravery lead to wonderful discoveries!'
      });
    }

    const prompt = `Write a short, thrilling, 3-sentence children's adventure story for a primary school student (grade level: ${gradeLevel || 'grade 3-4'}).
The story stars their pet companion: "${companion}" (${petType || 'companion'}).
MANDATORY: You MUST naturally incorporate these specific vocabulary words into the story: ${targetWords.join(', ')}.
Keep sentences engaging, exciting, and easy to read.

Return your response in valid JSON with this exact schema:
{
  "title": "A fun short story title (under 6 words)",
  "story": "The 3-4 sentence story featuring the words",
  "highlightedWords": ["list of the exact target words used"],
  "question": "One simple multiple-choice reading comprehension question about the story",
  "options": ["Option A", "Option B", "Option C"],
  "correctAnswer": "The exact string of the correct option",
  "moral": "A positive 1-line encouraging thought"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const jsonText = response.text?.trim() || '{}';
    const parsed = JSON.parse(jsonText);
    res.json(parsed);
  } catch (error: any) {
    console.error('Error generating story:', error);
    const pet = req.body.petName || 'Your Pet';
    const words = req.body.words || ['luminous', 'journey'];
    res.json({
      title: `${pet}'s Glowing Discovery`,
      story: `High up on the whispering ridge, ${pet} noticed a luminous crystal glowing amidst the silver ferns. Embarking on this daring journey, they solved the ancient puzzle with a bright smile.`,
      highlightedWords: words,
      question: `What was glowing among the silver ferns?`,
      options: ['A luminous crystal', 'A wooden spoon', 'A giant clock'],
      correctAnswer: 'A luminous crystal',
      moral: 'Every journey begins with noticing the wonder around you.'
    });
  }
});

// API: Sentence feedback
app.post('/api/gemini/sentence-check', async (req: Request, res: Response) => {
  try {
    const { word, sentence, studentGrade } = req.body;
    if (!word || !sentence) {
      return res.status(400).json({ error: 'Word and sentence are required' });
    }

    if (!ai) {
      const sentenceLower = sentence.toLowerCase();
      const wordLower = word.toLowerCase();
      const usesWord = sentenceLower.includes(wordLower);
      return res.json({
        usesWordCorrectly: usesWord,
        feedback: usesWord 
          ? `Super job! You used "${word}" brilliantly in your sentence! ⭐`
          : `Great effort! Try to include the exact word "${word}" in your sentence.`,
        starsAwarded: usesWord ? 3 : 1,
        bonusTip: `You are becoming a true word wizard!`
      });
    }

    const prompt = `A primary school student in ${studentGrade || 'grade 3-4'} wrote a sentence using the vocabulary word "${word}".
Student sentence: "${sentence}".

Evaluate whether the word is used appropriately and correctly for a primary school level.
Be very encouraging, enthusiastic, supportive, and kind!

Return JSON:
{
  "usesWordCorrectly": true or false,
  "feedback": "Warm, encouraging feedback (1-2 sentences) addressed directly to the child with positive emojis",
  "starsAwarded": 3 if used well, 2 if close, 1 for trying,
  "bonusTip": "A fun short tip or alternative synonym they might like"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.5,
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error checking sentence:', error);
    res.json({
      usesWordCorrectly: true,
      feedback: `Fantastic work putting your thoughts into words! High five! ⭐`,
      starsAwarded: 3,
      bonusTip: `Keep writing more sentences to grow your vocabulary kingdom!`
    });
  }
});

// Server-side Vite or Static handling
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, '../dist/index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`VocabQuest server listening on port ${PORT}`);
  });
}

startServer();
