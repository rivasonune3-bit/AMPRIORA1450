import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'mock_key' });

export async function POST(req: Request) {
  try {
    const { onboarding } = await req.json();
    
    // Fallback if no API key is provided
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'mock_key') {
      return NextResponse.json({
        data: {
          role: onboarding?.targetRole || 'Software Engineer',
          overallScore: 65,
          categories: [
            {
              name: 'Frontend',
              status: 'Strong',
              percentage: 80,
              missingSkills: ['Next.js App Router', 'Tailwind CSS']
            },
            {
              name: 'Backend',
              status: 'Intermediate',
              percentage: 50,
              missingSkills: ['Node.js', 'PostgreSQL']
            },
            {
              name: 'DevOps',
              status: 'Beginner',
              percentage: 20,
              missingSkills: ['Docker', 'CI/CD']
            }
          ],
          recommendation: 'Focus on building backend REST APIs and learn Docker basics.'
        }
      });
    }

    const prompt = `
You are an expert technical interviewer and career coach.
Analyze this user's current skills against their target role and dream company.
User Profile context: ${JSON.stringify(onboarding)}

Output ONLY a JSON object with this exact structure, no markdown formatting:
{
  "role": "The role they are targeting",
  "overallScore": 60, // integer 0-100 representing their readiness
  "categories": [
    {
      "name": "Category Name (e.g. Frontend, Backend, Data Structures)",
      "status": "Strong | Intermediate | Beginner",
      "percentage": 80, // integer 0-100
      "missingSkills": ["List", "of", "missing", "skills"]
    }
  ],
  "recommendation": "One sentence personalized recommendation."
}
Group their target role's required skills into 3-4 logical categories.
Assess their provided skills against these categories. Be realistic.
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
    console.error('Skill Gap AI Generation Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
