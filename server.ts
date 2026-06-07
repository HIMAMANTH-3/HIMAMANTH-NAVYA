/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

let aiClient: GoogleGenAI | null = null;

// Lazy initialization of Gemini SDK
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      throw new Error('GEMINI_API_KEY is not defined or is set to placeholder.');
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API router for Gemini AI romantic contents
  app.post('/api/generate-romantic-content', async (req, res) => {
    try {
      const { 
        type, 
        girlfriendName, 
        traits, 
        tone = 'deeply emotional', 
        customInstructions = '' 
      } = req.body;

      if (!girlfriendName) {
        return res.status(400).json({ error: "Girlfriend's name is required." });
      }

      const client = getGeminiClient();
      
      let systemPrompt = "You are a world-class romantic writer, poet, and birthday specialist. You write beautiful, high-quality, touching messages that evoke genuine emotion. Avoid all artificial sounding, cheesy cliches or low-quality phrasing. Write with elegant, authentic, warm words.";
      let userPrompt = "";

      if (type === 'letter') {
        userPrompt = `Write a deep, beautiful, and highly personalized romantic birthday love letter for my girlfriend named ${girlfriendName}. 
Key traits/details about her/our relationship: "${traits || 'she is kind, has a sparkling smile, and makes my life beautiful'}".
The tone should be ${tone}.
${customInstructions ? `Additional guidance: ${customInstructions}` : ''}
Make it feel incredibly sincere, personal, and touching. Word count should be around 150-250 words. Do not include placeholders like [Your Name] or [Date] - keep it natural so it flows perfectly on a beautiful card.`;
      } else if (type === 'reasons') {
        userPrompt = `Generate a set of 3 beautiful, distinct "Reasons Why I Love You" cards for my girlfriend ${girlfriendName}.
Each reason must have:
1. A concise, endearing Title (e.g. "Your Magical Laughter", "How You Care for Others", "Being My Safe Harbor").
2. A warm, beautiful paragraph (30-50 words) elaborating on why.
Traits or details to inspire this: "${traits || 'how she listens, her gentle spirit, her spark in life'}".
The tone should be ${tone}.
Respond strictly in JSON format matching this schema:
[
  { "title": "string", "description": "string" },
  { "title": "string", "description": "string" },
  { "title": "string", "description": "string" }
]`;
      } else if (type === 'poem') {
        userPrompt = `Write a short, heart-melting birthday poem for ${girlfriendName}.
Details/traits to include: "${traits || 'her beautiful eyes, the warmth of her presence'}".
The tone should be ${tone}.
Make it 3-4 stanzas, structured beautifully, full of warmth, with sparkling imagery.`;
      } else if (type === 'timeline') {
        userPrompt = `Generate a set of 3 memorable milestones/timeline ideas for a relationship with ${girlfriendName}. 
For instance, "When We First Met", "Our First Cozy Cafe Date", "That Shared Rainy Evening Trip".
Each milestone should have:
1. A Title (e.g. "The Spark that Started It All", "A Coffee Filled with Laughter")
2. Date/Timeframe descriptor (e.g., "September 2024" or "A Cozy Winter Afternoon")
3. Description card paragraph (40-60 words detailing the atmosphere, sweetness, and memory)
Respond strictly in JSON format matching this schema:
[
  { "title": "string", "date": "string", "description": "string" },
  { "title": "string", "date": "string", "description": "string" },
  { "title": "string", "date": "string", "description": "string" }
]`;
      } else {
        return res.status(400).json({ error: "Invalid type specified. Must be 'letter', 'reasons', 'poem', or 'timeline'." });
      }

      const response = await client.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          ...(type === 'reasons' || type === 'timeline' ? {
            responseMimeType: 'application/json',
          } : {})
        }
      });

      const text = response.text;
      return res.json({ result: text });
    } catch (error: any) {
      console.error('Error in /api/generate-romantic-content:', error);
      return res.status(500).json({ 
        error: error.message || 'An error occurred while generating your romantic content.' 
      });
    }
  });

  // Vite dev server middle-ware integration
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Express custom server listening at http://0.0.0.0:${PORT}`);
  });
}

startServer();
