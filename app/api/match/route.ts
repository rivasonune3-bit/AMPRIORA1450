import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'mock_key' });

export async function POST(req: Request) {
  try {
    const { profile, opportunity } = await req.json();
    
    // Fallback if no API key is provided
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'mock_key') {
      // Very basic mock heuristic for the fallback
      const hasSkills = profile?.skills?.length > 0;
      const score = hasSkills ? 78 : 45;
      
      return NextResponse.json({
        data: {
          score,
          verdict: hasSkills ? "Good Match" : "Low Match",
          pros: [
            "Matches your career objective",
            "Location aligns with your preference"
          ],
          cons: [
            "Missing specific framework experience",
            "Requires more years of experience"
          ],
          summary: "Based on your current profile, this opportunity is a decent fit but requires some upskilling."
        }
      });
    }

    const prompt = `
You are an expert technical recruiter and AI matching system.
Compare the candidate's profile against the job/internship opportunity.
Candidate Profile: ${JSON.stringify(profile)}
Opportunity Details: ${JSON.stringify(opportunity)}

Output ONLY a JSON object with this exact structure, no markdown formatting:
{
  "score": 85, // integer 0-100 match score
  "verdict": "Excellent Match | Good Match | Fair Match | Low Match",
  "pros": ["List 2-3 reasons why they are a strong fit based on their skills/goals"],
  "cons": ["List 1-2 missing skills or weak points"],
  "summary": "A one-sentence summary of the match."
}
Be realistic. Do not give a high score if their skills don't match the opportunity's required skills.
`;
    
    const interaction = await ai.interactions.create({
      model: 'gemini-3.6-flash',
      input: prompt
    });

    let rawText = interaction.output_text || '{}';
    if (rawText.startsWith('\`\`\`json')) {
      rawText = rawText.replace(/\`\`\`json/gi, '').replace(/\`\`\`/g, '').trim();
    } else if (rawText.startsWith('\`\`\`')) {
      rawText = rawText.replace(/\`\`\`/g, '').trim();
    }
    
    const parsed = JSON.parse(rawText);
    return NextResponse.json({ data: parsed });

  } catch (error: any) {
    console.error('AI Match Generation Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
